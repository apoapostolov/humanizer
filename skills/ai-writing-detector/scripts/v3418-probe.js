/**
 * Behavioral probes for the untagged tip absorb (013d1db..209815c):
 *
 *  1. #418 - a long tab run after a Markdown table delimiter (`-|-`) or a
 *     thematic break (`***`) no longer scans quadratically. Same matching,
 *     bounded time.
 *  2. #413/#414 - the engine exports the frozen CONTEXT_MODES and SOURCE_MODES
 *     lists it accepts, and still accepts every entry.
 *
 * Run: node scripts/v3418-probe.js
 */
const AIDetector = require('./patterns.js');

let failed = 0;
function probe(name, fn) {
  try {
    fn();
    console.log(`  ok  ${name}`);
  } catch (err) {
    failed++;
    console.error(`  FAIL ${name}`);
    console.error(`       ${err.message}`);
  }
}
const check = (cond, msg) => { if (!cond) throw new Error(msg); };

// Long enough to clear the engine's own length gates.
const FILLER = 'The release notes cover the migration path for existing users. '
  + 'We shipped the schema change behind a flag and rolled it out over two weeks. '
  + 'Support tickets stayed flat through the transition. '
  + 'The next milestone is the storage rewrite, which the team has not scoped yet.';

// Generous next to a ~25 ms measurement, small next to the 6 s quadratic path.
const TIME_BUDGET_MS = 1500;

function timedScan(text) {
  const t0 = process.hrtime.bigint();
  const result = AIDetector.analyzeText(text);
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  return { result, ms };
}

// ── probe 1: bounded time on the two adversarial shapes ─────────────────────
probe('#418: 64k tab run after a table delimiter scans in bounded time', () => {
  const text = `${FILLER}\n-|-${'\t'.repeat(64000)}x`;
  const { ms } = timedScan(text);
  check(ms < TIME_BUDGET_MS, `table-delimiter tab run took ${ms.toFixed(0)}ms, budget ${TIME_BUDGET_MS}ms`);
});

probe('#418: 64k tab run after a thematic break scans in bounded time', () => {
  const text = `${FILLER}\n***${'\t'.repeat(64000)}x`;
  const { ms } = timedScan(text);
  check(ms < TIME_BUDGET_MS, `thematic-break tab run took ${ms.toFixed(0)}ms, budget ${TIME_BUDGET_MS}ms`);
});

probe('#418: ordinary prose stays quiet and fast (matching unchanged)', () => {
  const { result, ms } = timedScan(`${FILLER} ${FILLER}`);
  check(ms < 500, `plain prose took ${ms.toFixed(0)}ms`);
  check(result.issues.length === 0, `plain prose emitted ${result.issues.length} issues`);
});

// ── probe 2: exported mode lists ────────────────────────────────────────────
probe('#413/#414: CONTEXT_MODES and SOURCE_MODES are exported and frozen', () => {
  check(Array.isArray(AIDetector.CONTEXT_MODES), 'CONTEXT_MODES is not an array');
  check(Array.isArray(AIDetector.SOURCE_MODES), 'SOURCE_MODES is not an array');
  check(AIDetector.CONTEXT_MODES.join(',') === 'general,technical,marketing,personal',
    `CONTEXT_MODES = ${AIDetector.CONTEXT_MODES.join(',')}`);
  check(AIDetector.SOURCE_MODES.join(',') === 'plain,rendered-markdown',
    `SOURCE_MODES = ${AIDetector.SOURCE_MODES.join(',')}`);
  check(Object.isFrozen(AIDetector.CONTEXT_MODES) && Object.isFrozen(AIDetector.SOURCE_MODES),
    'mode lists are not frozen');
});

probe('#414: every exported mode is still accepted by analyzeText', () => {
  for (const contextMode of AIDetector.CONTEXT_MODES) {
    const r = AIDetector.analyzeText(`${FILLER} ${FILLER}`, { contextMode });
    check(r.stats.contextMode === contextMode,
      `contextMode ${contextMode} fell back to ${r.stats.contextMode}`);
    check(!r.stats.contextModeFallback, `contextMode ${contextMode} reported a fallback`);
  }
  for (const sourceMode of AIDetector.SOURCE_MODES) {
    const r = AIDetector.analyzeText(`${FILLER} ${FILLER}`, { sourceMode });
    check(r.stats.sourceMode === sourceMode,
      `sourceMode ${sourceMode} fell back to ${r.stats.sourceMode}`);
    check(!r.stats.sourceModeFallback, `sourceMode ${sourceMode} reported a fallback`);
  }
});

if (failed) {
  console.error(`\n${failed} probe(s) failed`);
  process.exit(1);
}
console.log('\nall probes passed');
