"use strict";

/**
 * Production report layer for ai-writing-detector.
 * Wraps the vendored engine so default output cannot be mistaken for authorship.
 */

const MIN_WORDS_RELIABLE = 40;
const MIN_WORDS_ENGINE = 5;

const SEVERITY_RANK = { high: 3, medium: 2, low: 1, unknown: 0 };

function wordCount(text) {
  const t = String(text || "").trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

function countBy(issues, keyFn) {
  const m = {};
  for (const issue of issues || []) {
    const k = keyFn(issue);
    m[k] = (m[k] || 0) + 1;
  }
  return m;
}

function isClarityType(t) {
  return t === "tier1-clarity" || t === "tier1_clarity";
}

function severityRank(s) {
  return SEVERITY_RANK[String(s || "unknown").toLowerCase()] || 0;
}

function filterIssues(issues, opts = {}) {
  let list = Array.isArray(issues) ? issues.slice() : [];
  if (opts.minSeverity) {
    const floor = severityRank(opts.minSeverity);
    list = list.filter((i) => severityRank(i.severity) >= floor);
  }
  return list;
}

/**
 * Build a safe report from engine analyzeText result + source text.
 * @param {object} engineResult raw AIDetector.analyzeText output
 * @param {object} opts
 * @param {string} opts.text source text
 * @param {string} [opts.contextMode]
 * @param {boolean} [opts.raw] include full engine payload under engine_raw
 * @param {string} [opts.source] path or stdin label
 * @param {string} [opts.minSeverity] high|medium|low
 * @param {number} [opts.sampleLimit]
 */
function buildAnalyzeReport(engineResult, opts = {}) {
  const text = opts.text || "";
  const contextMode = opts.contextMode || "general";
  const sampleLimit =
    opts.sampleLimit != null && Number.isFinite(opts.sampleLimit)
      ? Math.max(0, opts.sampleLimit)
      : 20;

  const allIssues = Array.isArray(engineResult.issues) ? engineResult.issues : [];
  const issues = filterIssues(allIssues, { minSeverity: opts.minSeverity });
  const words =
    (engineResult.stats && engineResult.stats.wordCount) || wordCount(text);

  const byType = countBy(issues, (i) => i.type || "unknown");
  const bySeverity = countBy(issues, (i) => i.severity || "unknown");

  let tier1Markers = 0;
  let tier1Clarity = 0;
  let other = 0;
  for (const issue of issues) {
    const t = issue.type || "";
    if (isClarityType(t)) tier1Clarity += 1;
    else if (t === "tier1") tier1Markers += 1;
    else other += 1;
  }

  const tooShort = words < MIN_WORDS_RELIABLE;
  const engineTooShort =
    /too short/i.test(String(engineResult.label || "")) || words < MIN_WORDS_ENGINE;

  const samples = issues.slice(0, sampleLimit).map((i) => ({
    type: i.type,
    severity: i.severity || null,
    text: String(i.text || i.match || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120),
    suggestion: i.suggestion || null,
  }));

  const warnings = [];
  if (engineTooShort || tooShort) {
    warnings.push(
      "Input is short; low or zero scores are unreliable (not proof the text is clean)."
    );
  }
  if (tier1Clarity > 0 && tier1Markers === 0 && issues.length === tier1Clarity) {
    warnings.push(
      "Only Tier 1B clarity/wordiness hits — writing suggestions, not machine-authorship evidence."
    );
  }
  if (tier1Clarity > 0 && tier1Markers > 0) {
    warnings.push(
      "Separate Tier 1A markers from Tier 1B clarity when reporting; do not merge into one AI claim."
    );
  }
  if (opts.minSeverity && allIssues.length !== issues.length) {
    warnings.push(
      `Filtered issues by --min-severity=${opts.minSeverity}: showing ${issues.length} of ${allIssues.length}.`
    );
  }

  // Score/label stay from full engine run (threshold tools expect full score).
  // Filtered views affect issue lists/bands only.
  const report = {
    schema: "ai-writing-detector.analyze.v1",
    interpretation: "signals_only",
    disclaimer:
      "Mechanical AI-writing signals only. Not authorship proof. Not a commercial-detector match. Do not score-chase rewrites.",
    source: opts.source || null,
    context_mode: contextMode,
    word_count: words,
    score: engineResult.score,
    label: engineResult.label,
    issue_count: issues.length,
    issue_count_unfiltered: allIssues.length,
    min_severity: opts.minSeverity || null,
    by_type: byType,
    by_severity: bySeverity,
    bands: {
      tier1_markers: tier1Markers,
      tier1_clarity: tier1Clarity,
      other_signals: other,
    },
    samples,
    warnings,
    reliability: {
      too_short: tooShort,
      min_words_recommended: MIN_WORDS_RELIABLE,
      engine_too_short: Boolean(engineTooShort),
    },
    handoff: {
      rewrite_quality: "humanizer",
      ste_docs: "simple-english",
      note: "Load humanizer for natural rewrites. Do not optimize text only to lower this score.",
    },
  };

  if (opts.raw) {
    report.engine_raw = engineResult;
  }

  return report;
}

function formatAnalyzeText(report, opts = {}) {
  if (opts.quiet) {
    const src = report.source ? ` source=${report.source}` : "";
    const warn = report.reliability && report.reliability.too_short ? " too_short=1" : "";
    return (
      `score=${report.score} label=${JSON.stringify(String(report.label || ""))}` +
      ` issues=${report.issue_count} words=${report.word_count}` +
      ` t1m=${report.bands.tier1_markers} t1c=${report.bands.tier1_clarity}` +
      ` other=${report.bands.other_signals}${warn}${src}\n`
    );
  }

  const lines = [];
  // Warnings first so short-input trap is visible before a low score
  if (report.warnings && report.warnings.length) {
    lines.push("warnings:");
    for (const w of report.warnings) lines.push(`  ! ${w}`);
    lines.push("");
  }

  if (report.source) lines.push(`source: ${report.source}`);
  lines.push(`schema: ${report.schema}`);
  lines.push(`interpretation: ${report.interpretation}`);
  lines.push(`score: ${report.score}`);
  lines.push(`label: ${report.label}`);
  lines.push(`issues: ${report.issue_count}` +
    (report.issue_count_unfiltered != null &&
    report.issue_count_unfiltered !== report.issue_count
      ? ` (unfiltered ${report.issue_count_unfiltered})`
      : ""));
  lines.push(`words: ${report.word_count}`);
  lines.push(`context: ${report.context_mode}`);
  if (report.reliability && report.reliability.too_short) {
    lines.push(
      `reliability: TOO_SHORT (need ~${report.reliability.min_words_recommended}+ words for a stable read)`
    );
  }
  lines.push(
    `bands: tier1_markers(1A)=${report.bands.tier1_markers} tier1_clarity(1B)=${report.bands.tier1_clarity} other=${report.bands.other_signals}`
  );

  const typeEntries = Object.entries(report.by_type || {}).sort((a, b) => b[1] - a[1]);
  if (typeEntries.length) {
    lines.push("by type:");
    for (const [t, n] of typeEntries) {
      const tag = t === "tier1" ? "  # 1A markers" : t === "tier1-clarity" ? "  # 1B clarity" : "";
      lines.push(`  ${t}: ${n}${tag}`);
    }
  } else {
    lines.push("by type: (none)");
  }

  const sevEntries = Object.entries(report.by_severity || {}).sort((a, b) => b[1] - a[1]);
  if (sevEntries.length) {
    lines.push("by severity:");
    for (const [s, n] of sevEntries) lines.push(`  ${s}: ${n}`);
  }

  if (report.samples && report.samples.length) {
    lines.push("sample:");
    for (const s of report.samples.slice(0, 12)) {
      const sev = s.severity ? `/${s.severity}` : "";
      const sug = s.suggestion ? ` → ${s.suggestion}` : "";
      lines.push(`  - [${s.type}${sev}] ${s.text}${sug}`);
    }
  }

  lines.push("");
  lines.push(report.disclaimer);
  lines.push(
    `handoff: ${report.handoff.rewrite_quality} (rewrite) | ${report.handoff.ste_docs} (STE docs)`
  );
  lines.push("");
  return lines.join("\n");
}

function buildBatchReport(results) {
  const list = Array.isArray(results) ? results : [];
  let maxScore = null;
  let minScore = null;
  let sumScore = 0;
  let scoreN = 0;
  let totalIssues = 0;
  let filesTooShort = 0;
  let filesWithIssues = 0;
  let totalT1m = 0;
  let totalT1c = 0;
  let totalOther = 0;
  const bySource = [];

  for (const r of list) {
    if (typeof r.score === "number" && Number.isFinite(r.score)) {
      sumScore += r.score;
      scoreN += 1;
      if (maxScore == null || r.score > maxScore) maxScore = r.score;
      if (minScore == null || r.score < minScore) minScore = r.score;
    }
    totalIssues += r.issue_count || 0;
    if (r.reliability && r.reliability.too_short) filesTooShort += 1;
    if ((r.issue_count || 0) > 0) filesWithIssues += 1;
    if (r.bands) {
      totalT1m += r.bands.tier1_markers || 0;
      totalT1c += r.bands.tier1_clarity || 0;
      totalOther += r.bands.other_signals || 0;
    }
    bySource.push({
      source: r.source || null,
      score: r.score,
      issues: r.issue_count,
      too_short: Boolean(r.reliability && r.reliability.too_short),
    });
  }

  return {
    schema: "ai-writing-detector.analyze.batch.v1",
    interpretation: "signals_only",
    count: list.length,
    summary: {
      files: list.length,
      max_score: maxScore,
      min_score: minScore,
      mean_score: scoreN ? Math.round((sumScore / scoreN) * 10) / 10 : null,
      total_issues: totalIssues,
      files_with_issues: filesWithIssues,
      files_too_short: filesTooShort,
      tier1_markers: totalT1m,
      tier1_clarity: totalT1c,
      other_signals: totalOther,
      by_source: bySource,
    },
    results: list,
    disclaimer:
      "Mechanical AI-writing signals only. Not authorship proof. Do not score-chase rewrites.",
  };
}

function formatBatchSummary(batch, opts = {}) {
  const s = batch.summary || {};
  if (opts.quiet) {
    return (
      `batch_files=${s.files || 0} max_score=${s.max_score}` +
      ` mean_score=${s.mean_score} total_issues=${s.total_issues}` +
      ` files_with_issues=${s.files_with_issues}` +
      ` too_short=${s.files_too_short}` +
      ` t1m=${s.tier1_markers} t1c=${s.tier1_clarity} other=${s.other_signals}\n`
    );
  }
  const lines = [
    "batch summary:",
    `  files: ${s.files || 0}`,
    `  max_score: ${s.max_score}`,
    `  min_score: ${s.min_score}`,
    `  mean_score: ${s.mean_score}`,
    `  total_issues: ${s.total_issues}`,
    `  files_with_issues: ${s.files_with_issues}`,
    `  files_too_short: ${s.files_too_short}`,
    `  bands_sum: t1m=${s.tier1_markers} t1c=${s.tier1_clarity} other=${s.other_signals}`,
  ];
  if (s.by_source && s.by_source.length) {
    lines.push("  by source:");
    for (const row of s.by_source) {
      const ts = row.too_short ? " too_short" : "";
      lines.push(
        `    - score=${row.score} issues=${row.issues}${ts} ${row.source || ""}`.trimEnd()
      );
    }
  }
  return lines.join("\n") + "\n";
}

function formatBatchText(batch, opts = {}) {
  if (opts.summaryOnly) {
    return formatBatchSummary(batch, opts);
  }
  if (opts.quiet) {
    const lines = batch.results.map((r) => formatAnalyzeText(r, { quiet: true }));
    lines.push(formatBatchSummary(batch, { quiet: true }));
    return lines.join("");
  }
  const parts = [`batch: ${batch.count} file(s)`, ""];
  batch.results.forEach((r, i) => {
    parts.push(`--- file ${i + 1}/${batch.count} ---`);
    parts.push(formatAnalyzeText(r, opts).trimEnd());
    parts.push("");
  });
  parts.push(formatBatchSummary(batch).trimEnd());
  parts.push("");
  parts.push(batch.disclaimer);
  parts.push("");
  return parts.join("\n");
}

function exitCodeForAnalyze(report, opts = {}) {
  if (opts.failAbove != null && Number.isFinite(opts.failAbove)) {
    if (typeof report.score === "number" && report.score >= opts.failAbove) return 3;
  }
  if (opts.strictShort && report.reliability && report.reliability.too_short) return 2;
  return 0;
}

function exitCodeForBatch(batch, opts = {}) {
  let code = 0;
  for (const r of batch.results || []) {
    const c = exitCodeForAnalyze(r, opts);
    if (c > code) code = c;
  }
  return code;
}

module.exports = {
  buildAnalyzeReport,
  buildBatchReport,
  formatAnalyzeText,
  formatBatchText,
  formatBatchSummary,
  exitCodeForAnalyze,
  exitCodeForBatch,
  filterIssues,
  MIN_WORDS_RELIABLE,
  wordCount,
  SEVERITY_RANK,
};
