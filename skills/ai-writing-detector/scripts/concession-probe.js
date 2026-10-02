'use strict';

// Behavioral probes for the v3.36.0+tip 9b8d030 absorb:
//   #211/#359 false-concession narrowing (patterns.js)
//   #204  preservation vs residual quality split (validate.js)
//   #234  analyzeText input contract (TypeError on non-string, full empty stats)
//
// Run: node scripts/concession-probe.js

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const { analyzeText } = require(path.join(ROOT, 'scripts', 'patterns.js'));
const validator = require(path.join(ROOT, 'scripts', 'validate.js'));
const { validate } = validator;
const { formatResult } = validator;

// ─── #211/#359 false-concession ────────────────────────────────────────────
const base = [
  'The team kept the old scheduler for a quarter while nobody owned the queue depth.',
  'The migration plan lists each service, the cutover order, and the rollback window.',
  'The runbook records the exact commands used on the day of the switch.',
].join(' ');

// HIT: both halves vague, close follows a clause separator, same sentence.
const vague =
  'While the delivery pipeline is impressive, deployment remains a challenge for most teams, and this report explains why.';
const vagueResult = analyzeText(vague, { contextMode: 'general' });
assert(
  vagueResult.issues.some((i) => i.type === 'false-concession'),
  'vague opener + vague close after a clause separator should flag'
);

// FP quiet: opener concedes nothing but the continuation is concrete (#359).
const concrete =
  'While the write pattern is impressive at this scale, our queue is append-only, so we moved the hot table to a log-structured store instead.';
const concreteResult = analyzeText(concrete, { contextMode: 'general' });
assert(
  !concreteResult.issues.some((i) => i.type === 'false-concession'),
  'concrete continuation after the opener should stay quiet'
);

// FP quiet: no clause separator between opener and close (#359).
const noSeparator =
  'While the model is impressive and remains a challenge to maintain, we plan to replace it next month.';
const noSeparatorResult = analyzeText(noSeparator, { contextMode: 'general' });
assert(
  !noSeparatorResult.issues.some((i) => i.type === 'false-concession'),
  'close without a clause separator should stay quiet'
);

// FP quiet: "Despite X challenges" is dropped entirely.
const despite =
  'Despite budget challenges the team shipped the migration on time and under the approved spend envelope.';
const despiteResult = analyzeText(despite, { contextMode: 'general' });
assert(
  !despiteResult.issues.some((i) => i.type === 'false-concession'),
  'bare "despite X challenges" should stay quiet'
);

// FP quiet: a vague close in a later sentence is not the empty two-half frame.
const nextSentence =
  'Although the profiler helped, the numbers shifted once the cache was cold. Support load remains a challenge.';
const nextSentenceResult = analyzeText(nextSentence, { contextMode: 'general' });
assert(
  !nextSentenceResult.issues.some((i) => i.type === 'false-concession'),
  'vague close in the next sentence should stay quiet'
);

// Control: the same frame shape inside prose that has no tell at all stays clean.
const plain = analyzeText(base, { contextMode: 'general' });
assert(
  !plain.issues.some((i) => i.type === 'false-concession'),
  'plain technical prose should stay quiet'
);

// ─── #204 preservation vs residual quality split ───────────────────────────
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aiwd-probe-'));
const before = path.join(tmp, 'before.md');
const after = path.join(tmp, 'after.md');
const afterBad = path.join(tmp, 'after-bad.md');

const originalText = [
  'The scheduler retries failed jobs with exponential backoff up to five attempts.',
  '',
  '```python',
  'def retry(job):',
  '    return job.attempt()',
  '```',
  '',
  '| Service | Timeout |',
  '| --- | --- |',
  '| api | 30s |',
  '',
  '## Notes',
  '',
  'See https://example.com/queue for the runbook.',
].join('\n');

const residualText = [
  'The scheduler retries failed jobs with exponential backoff up to five attempts.',
  '',
  '```python',
  'def retry(job):',
  '    return job.attempt()',
  '```',
  '',
  '| Service | Timeout |',
  '| --- | --- |',
  '| api | 30s |',
  '',
  '## Notes',
  '',
  'See https://example.com/queue for the runbook. It is a robust, seamless',
  'ecosystem that showcases the team ability to leverage a multifaceted',
  'toolkit, and this comprehensive journey is truly transformative.',
].join('\n');

const damagedText = residualText.replace('return job.attempt()', 'return job.try()');

fs.writeFileSync(before, originalText);
fs.writeFileSync(after, residualText);
fs.writeFileSync(afterBad, damagedText);

// Default policy: residual growth still blocks (compatibility).
const strict = validate(originalText, residualText);
assert.strictEqual(strict.ok, false, 'default policy should still block residual growth');
assert(
  strict.errors.some((e) => e.code === 'residual-grew'),
  'default policy reports residual-grew as an error'
);
assert.strictEqual(strict.preservation.ok, true, 'mechanical preservation should be clean here');
assert.strictEqual(strict.quality.policy, 'error', 'default residual policy is error');
assert(
  strict.quality.findings.some((f) => f.code === 'residual-grew'),
  'quality findings carry the residual diagnostic'
);

// Advisory policy: mechanical errors still block, residual growth warns.
const advisory = validate(originalText, residualText, { residualPolicy: 'warn' });
assert.strictEqual(advisory.ok, true, 'warn policy should pass on residual growth alone');
assert.strictEqual(advisory.preservation.ok, true, 'preservation stays independent');
assert.strictEqual(advisory.quality.policy, 'warn', 'warn policy is recorded');
assert(
  advisory.warnings.some((w) => w.code === 'residual-grew'),
  'warn policy reports residual-grew as a warning'
);

// Mechanical damage still fails under the advisory policy.
const damaged = validate(originalText, damagedText, { residualPolicy: 'warn' });
assert.strictEqual(damaged.ok, false, 'mechanical damage blocks even with warn policy');
assert.strictEqual(damaged.preservation.ok, false, 'preservation captures the code change');
assert(
  damaged.preservation.errors.some((e) => /code|block/i.test(e.message)),
  'code-block change reported as a preservation error'
);

// New number-added warning (#204 follow-on): digitizing a figure is visible.
// NUMBER only matches a digit literal, so spell the unit out ("45s" has no
// trailing word boundary after the digits).
const numbered = originalText.replace(
  'See https://example.com/queue for the runbook.',
  'See https://example.com/queue for the runbook. We also raised the timeout to 45 seconds.'
);
const addedNumber = validate(originalText, numbered);
assert(
  addedNumber.warnings.some((w) => w.code === 'number-added'),
  'new numeric literal should warn'
);
assert(
  !addedNumber.warnings.some((w) => w.code === 'number-missing'),
  'no spurious missing-number warning when numbers are added'
);

// Format output separates mechanical from residual (#204).
const formatted = formatResult(advisory);
assert(
  /no mechanical preservation errors found/.test(formatted),
  'formatResult reports mechanical clearance explicitly'
);
assert(/residual checked \(policy: warn\)/.test(formatted), 'formatResult names the residual policy');

// Bad policy value is a programming error, not silent leniency.
assert.throws(
  () => validate(originalText, residualText, { residualPolicy: 'ignore' }),
  /residualPolicy/,
  'invalid residualPolicy should throw'
);

// ─── #234 input contract ───────────────────────────────────────────────────
assert.throws(
  () => analyzeText(undefined, { contextMode: 'general' }),
  /must be a string/,
  'analyzeText should reject non-string input'
);
const emptyStats = analyzeText('   ', { contextMode: 'technical' }).stats;
assert.strictEqual(emptyStats.wordCount, 0, 'empty input reports zero words');
assert.strictEqual(emptyStats.contextMode, 'technical', 'empty input reports the selected context');
assert.strictEqual(emptyStats.sourceMode, 'plain', 'empty input reports the source mode');

// CLI exits 2 on a bad policy value instead of a stack trace.
const cli = path.join(ROOT, 'scripts', 'validate-cli.js');
const { spawnSync } = require('node:child_process');
const bad = spawnSync(process.execPath, [cli, '--residual-policy', 'nope', before, after], {
  encoding: 'utf8',
});
assert.strictEqual(bad.status, 2, 'bad policy value exits 2');

fs.rmSync(tmp, { recursive: true, force: true });

console.log('PASS  false concession flags only on a vague opener plus vague close (#211/#359)');
console.log('PASS  residual growth is advisory under warn policy while mechanical errors block (#204)');
console.log('PASS  added numbers warn and a bad policy value exits 2 (#234)');
console.log('PASS  non-string input throws; empty input reports full stats (#234)');
