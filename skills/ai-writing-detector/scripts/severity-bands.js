/**
 * Measure the severity bands and authorship weights off the VENDORED engine.
 *
 * The severity/P-tier map in references/scoring-and-limits.md must describe the
 * engine we actually ship, not a table copied from upstream prose. Run this
 * after any engine absorb and update the doc with what it prints.
 *
 * Usage:
 *   node scripts/severity-bands.js            # bands + weights
 *   node scripts/severity-bands.js --types    # per-type detail
 *
 * Extraction is static (no engine import) so it also covers rules that only
 * fire behind a mode gate:
 *   - `issues.push({ type: 'x', severity: 'y' })` object literals, brace-matched
 *     so a neighbouring literal cannot donate its severity
 *   - `matchPatterns(text, RULES, 'x', 'y')` call sites, where the type arrives
 *     as an argument
 *   - `const ISSUE_WEIGHTS = { 'x': n }` for authorship weights (0 = style-only)
 */
const fs = require('node:fs');
const path = require('node:path');

const SRC = fs.readFileSync(path.join(__dirname, 'patterns.js'), 'utf8');

// ── weights ────────────────────────────────────────────────────────────────
const weights = {};
const wBlock = SRC.match(/const ISSUE_WEIGHTS = \{([\s\S]*?)\n  \};/);
if (!wBlock) throw new Error('ISSUE_WEIGHTS block not found');
for (const m of wBlock[1].matchAll(/'([a-z0-9-]+)':\s*(\d+)/g)) {
  weights[m[1]] = Number(m[2]);
}

const sev = {};
const add = (type, expr) => {
  const set = (sev[type] = sev[type] || new Set());
  for (const s of expr.matchAll(/'(critical|high|medium|low)'/g)) set.add(s[1]);
};

// ── walk object literals with brace matching ───────────────────────────────
// Strings, template literals and comments are skipped so a brace inside them
// cannot shift the match depth. Regex literals do not appear inside issue
// objects in this engine; a stray one would only mis-scope a single literal.
function objectAt(start) {
  let depth = 0;
  for (let i = start; i < SRC.length; i += 1) {
    const c = SRC[i];
    const two = SRC.slice(i, i + 2);
    if (two === '//') { i = SRC.indexOf('\n', i); if (i < 0) return null; continue; }
    if (two === '/*') { i = SRC.indexOf('*/', i) + 1; if (i < 1) return null; continue; }
    if (c === "'" || c === '"' || c === '`') {
      for (i += 1; i < SRC.length; i += 1) {
        if (SRC[i] === '\\') { i += 1; continue; }
        if (SRC[i] === c) break;
      }
      continue;
    }
    if (c === '{') depth += 1;
    else if (c === '}') {
      depth -= 1;
      if (depth === 0) return SRC.slice(start, i + 1);
    }
  }
  return null;
}

let literals = 0;
for (let i = SRC.indexOf('issues.push({'); i >= 0; i = SRC.indexOf('issues.push({', i + 1)) {
  const open = SRC.indexOf('{', i);
  const body = objectAt(open);
  if (!body) continue;
  const type = body.match(/\btype:\s*([\s\S]*?),\n/);
  const severity = body.match(/\bseverity:\s*([\s\S]*?),\n/);
  if (!type || !severity) continue;
  literals += 1;
  const names = [...type[1].matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);
  const bands = [...severity[1].matchAll(/'(critical|high|medium|low)'/g)].map((m) => m[1]);
  if (names.length === 0) continue; // dynamic type resolved elsewhere
  if (names.length > 1 && names.length === bands.length) {
    // Paired ternary: `type: c ? 'tier1-clarity' : 'tier1'` fed by
    // `severity: c ? 'medium' : 'high'`. Pair positionally so the bands are
    // not cross-producted onto both types.
    names.forEach((n, k) => add(n, `'${bands[k]}'`));
    continue;
  }
  for (const n of names) add(n, severity[1]);
}

// ── matchPatterns call sites (type passed as an argument) ──────────────────
let calls = 0;
for (const m of SRC.matchAll(/matchPatterns\(\s*[^(),]+,\s*[^(),]+,\s*'([a-z0-9-]+)',\s*([^)]+)\)/g)) {
  if (!/'(critical|high|medium|low)'/.test(m[2])) continue;
  calls += 1;
  add(m[1], m[2]);
}

const bands = { critical: [], high: [], medium: [], low: [] };
for (const [type, set] of Object.entries(sev)) {
  for (const s of set) bands[s].push(type);
}
for (const s of Object.keys(bands)) bands[s].sort();

const detail = process.argv.includes('--types');
console.log(
  `measured from scripts/patterns.js (${literals} object literals, ${calls} matchPatterns call sites)`
);
for (const s of ['critical', 'high', 'medium', 'low']) {
  console.log(`\n${s} (${bands[s].length}):`);
  console.log('  ' + bands[s].join(', '));
}
const multi = Object.entries(sev)
  .filter(([, set]) => set.size > 1)
  .map(([type, set]) => `${type}: ${[...set].sort().join('/')}`)
  .sort();
console.log(`\ntypes emitting more than one severity (${multi.length}):`);
multi.forEach((m) => console.log('  ' + m));

const zero = Object.entries(weights).filter(([, w]) => w === 0).map(([t]) => t).sort();
console.log(`\nzero authorship weight (${zero.length}): ${zero.join(', ')}`);
const unweighted = Object.keys(sev).filter((t) => !(t in weights)).sort();
if (unweighted.length) {
  console.log(`types with no ISSUE_WEIGHTS entry (default 2): ${unweighted.join(', ')}`);
}
if (detail) {
  console.log('\nper type:');
  Object.keys(sev).sort().forEach((t) =>
    console.log(`  ${t}  severity=${[...sev[t]].sort().join('/')}  weight=${weights[t] ?? '(default 2)'}`)
  );
}
