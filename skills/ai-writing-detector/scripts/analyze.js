#!/usr/bin/env node
"use strict";

/**
 * Production CLI for ai-writing-detector analyze mode.
 *
 * Default output is a sanitized signals-only report (no authorship labels).
 * Use --raw to attach the full vendored engine payload under engine_raw.
 */

const fs = require("fs");
const path = require("path");

function requireNode() {
  const major = Number(String(process.versions.node || "0").split(".")[0]);
  if (!Number.isFinite(major) || major < 18) {
    process.stderr.write(
      `ai-writing-detector requires Node.js >= 18 (found ${process.versions.node})\n`
    );
    process.exit(1);
  }
}

requireNode();

const AIDetector = require("./patterns.js");
const {
  buildAnalyzeReport,
  buildBatchReport,
  formatAnalyzeText,
  formatBatchText,
  exitCodeForAnalyze,
  exitCodeForBatch,
} = require("./report.js");

function usage(code) {
  process.stderr.write(`Usage: node analyze.js [options] [file ...]

Read file(s) or stdin. Print a signals-only analyze report.

Options:
  --json                 JSON report (sanitized by default)
  --raw                  Include full engine payload under engine_raw
  --json-engine          Print only raw engine JSON (unsafe for authorship claims)
  --context MODE         general | technical (default: general)
  --stdin                Read stdin even if files are also listed (files win if both)
  --quiet                One-line summary per file (cron-friendly)
  --summary-only         Batch: print only aggregate summary (implies multi-file or still works on 1)
  --min-severity LEVEL   high | medium | low (filter listed issues; score unchanged)
  --sample-limit N       Max samples in report (default 20; 0 = none)
  --no-samples           Same as --sample-limit 0
  --fail-above N         Exit 3 if any file score >= N
  --strict-short         Exit 2 if any file is below recommended word count
  -h, --help             Show help

Notes:
  Default report sets interpretation=signals_only and omits document_classification.
  Multi-file → batch schema ai-writing-detector.analyze.batch.v1 (+ summary totals)
  Do not treat scores as authorship proof. For rewrites use humanizer.
`);
  process.exit(code);
}

function parseArgs(argv) {
  let json = false;
  let raw = false;
  let jsonEngine = false;
  let contextMode = "general";
  let failAbove = null;
  let strictShort = false;
  let quiet = false;
  let summaryOnly = false;
  let forceStdin = false;
  let minSeverity = null;
  let sampleLimit = null;
  const files = [];

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") usage(0);
    else if (a === "--json") json = true;
    else if (a === "--raw") raw = true;
    else if (a === "--json-engine") jsonEngine = true;
    else if (a === "--strict-short") strictShort = true;
    else if (a === "--quiet" || a === "-q") quiet = true;
    else if (a === "--summary-only") summaryOnly = true;
    else if (a === "--stdin") forceStdin = true;
    else if (a === "--no-samples") sampleLimit = 0;
    else if (a === "--context") contextMode = argv[++i] || "general";
    else if (a.startsWith("--context=")) contextMode = a.slice("--context=".length);
    else if (a === "--min-severity") minSeverity = String(argv[++i] || "").toLowerCase();
    else if (a.startsWith("--min-severity="))
      minSeverity = a.slice("--min-severity=".length).toLowerCase();
    else if (a === "--sample-limit") {
      sampleLimit = Number(argv[++i]);
      if (!Number.isFinite(sampleLimit)) {
        process.stderr.write("--sample-limit needs a number\n");
        usage(2);
      }
    } else if (a.startsWith("--sample-limit=")) {
      sampleLimit = Number(a.slice("--sample-limit=".length));
      if (!Number.isFinite(sampleLimit)) {
        process.stderr.write("--sample-limit needs a number\n");
        usage(2);
      }
    } else if (a === "--fail-above") {
      failAbove = Number(argv[++i]);
      if (!Number.isFinite(failAbove)) {
        process.stderr.write("--fail-above needs a number\n");
        usage(2);
      }
    } else if (a.startsWith("--fail-above=")) {
      failAbove = Number(a.slice("--fail-above=".length));
      if (!Number.isFinite(failAbove)) {
        process.stderr.write("--fail-above needs a number\n");
        usage(2);
      }
    } else if (a.startsWith("-")) {
      process.stderr.write(`Unknown flag: ${a}\n`);
      usage(2);
    } else files.push(a);
  }

  if (contextMode !== "general" && contextMode !== "technical") {
    process.stderr.write(`Invalid --context ${contextMode} (use general|technical)\n`);
    process.exit(2);
  }
  if (minSeverity && !["high", "medium", "low"].includes(minSeverity)) {
    process.stderr.write(`Invalid --min-severity ${minSeverity} (use high|medium|low)\n`);
    process.exit(2);
  }

  return {
    json,
    raw,
    jsonEngine,
    contextMode,
    failAbove,
    strictShort,
    quiet,
    summaryOnly,
    forceStdin,
    minSeverity,
    sampleLimit,
    files,
  };
}

function analyzeOne(text, source, opts) {
  const engineResult = AIDetector.analyzeText(text, {
    contextMode: opts.contextMode,
  });
  if (opts.jsonEngine) return { engineOnly: engineResult };

  return buildAnalyzeReport(engineResult, {
    text,
    contextMode: opts.contextMode,
    raw: opts.raw,
    source,
    minSeverity: opts.minSeverity,
    sampleLimit: opts.sampleLimit,
  });
}

function main(argv) {
  const opts = parseArgs(argv);
  const { files } = opts;

  /** @type {{text:string,source:string}[]} */
  const jobs = [];

  if (files.length === 0 || opts.forceStdin) {
    if (files.length === 0) {
      const text = fs.readFileSync(0, "utf8");
      jobs.push({ text, source: "stdin" });
    } else if (opts.forceStdin && files.length) {
      // files take precedence; --stdin alone without files already handled
      for (const f of files) {
        jobs.push({
          text: fs.readFileSync(path.resolve(f), "utf8"),
          source: path.resolve(f),
        });
      }
    }
  } else {
    for (const f of files) {
      jobs.push({
        text: fs.readFileSync(path.resolve(f), "utf8"),
        source: path.resolve(f),
      });
    }
  }

  if (opts.jsonEngine) {
    if (jobs.length !== 1) {
      process.stderr.write("--json-engine supports exactly one input\n");
      process.exit(2);
    }
    const engineResult = AIDetector.analyzeText(jobs[0].text, {
      contextMode: opts.contextMode,
    });
    process.stdout.write(JSON.stringify(engineResult, null, 2) + "\n");
    process.stderr.write(
      "warning: --json-engine emits authorship-shaped fields; do not use as proof\n"
    );
    process.exit(0);
  }

  const reports = jobs.map((j) => analyzeOne(j.text, j.source, opts));

  // --summary-only always goes through batch summary shape (even for 1 file)
  if (opts.summaryOnly || reports.length > 1) {
    const batch = buildBatchReport(reports);
    if (opts.json) {
      if (opts.summaryOnly) {
        process.stdout.write(
          JSON.stringify(
            {
              schema: "ai-writing-detector.analyze.batch.v1",
              interpretation: "signals_only",
              count: batch.count,
              summary: batch.summary,
              disclaimer: batch.disclaimer,
            },
            null,
            2
          ) + "\n"
        );
      } else {
        process.stdout.write(JSON.stringify(batch, null, 2) + "\n");
      }
    } else {
      process.stdout.write(
        formatBatchText(batch, {
          quiet: opts.quiet,
          summaryOnly: opts.summaryOnly,
        })
      );
    }
    process.exit(exitCodeForBatch(batch, opts));
  }

  const report = reports[0];
  if (opts.json) {
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  } else {
    process.stdout.write(formatAnalyzeText(report, { quiet: opts.quiet }));
  }
  process.exit(exitCodeForAnalyze(report, opts));
}

main(process.argv);
