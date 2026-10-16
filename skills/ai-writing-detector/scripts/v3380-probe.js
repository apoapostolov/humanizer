/**
 * Behavioral probes for the v3.38.0 + post-release tip absorb (0a4f1ad):
 *
 *  1. #351a - the "X is dead; long live Y" performed-insight regex is gone;
 *     other performed-insight phrases still detect.
 *  2. #351b - smart-punct-signature is a plain-mode, low-severity style check
 *     with zero authorship weight: rendered-markdown omits it, and its presence
 *     changes no score, label, or confidence.
 *
 * Run: node scripts/v3380-probe.js
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
const types = (r) => r.issues.map((i) => i.type);

// Long enough to clear the engine's own length gates.
const FILLER = 'The release notes cover the migration path for existing users. '
  + 'We shipped the schema change behind a flag and rolled it out over two weeks. '
  + 'Support tickets stayed flat through the transition. '
  + 'The next milestone is the storage rewrite, which the team has not scoped yet. '
  + 'Documentation lands with the release instead of after it this time. ';
const typography = '\u201CThis one is quoted\u201D and it has an Oxford comma: red, green, and blue. '
  + 'The prose also carries an em dash \u2014 like this \u2014 which is typical of finished copy. ';

// ── probe 1: performed-insight X-is-dead carve-out ──────────────────────────
probe('#351: "X is dead; long live Y" no longer emits performed-insight', () => {
  const text = `The old build system is dead; long live the new one. ${FILLER}${FILLER}`;
  const t = types(AIDetector.analyzeText(text));
  check(!t.includes('performed-insight'), `performed-insight still fired: ${t.join(',')}`);
});

probe('#351: other performed-insight phrases still detect', () => {
  const text = `That\u2019s the whole point of the rewrite. ${FILLER}${FILLER}`;
  const t = types(AIDetector.analyzeText(text));
  check(t.includes('performed-insight'), `performed-insight went quiet: ${t.join(',')}`);
});

// ── probe 2: typography stays out of authorship classification ──────────────
probe('#351: rendered-markdown mode omits smart-punct-signature', () => {
  const r = AIDetector.analyzeText(typography + FILLER + FILLER, { sourceMode: 'rendered-markdown' });
  check(!types(r).includes('smart-punct-signature'), 'smart-punct fired in rendered mode');
});

probe('#351: plain mode emits it as a low-severity style finding', () => {
  const r = AIDetector.analyzeText(typography + FILLER + FILLER, { sourceMode: 'plain' });
  const hit = r.issues.find((i) => i.type === 'smart-punct-signature');
  check(!!hit, 'smart-punct did not fire in plain mode');
  check(hit.severity === 'low', `expected severity low, got ${hit.severity}`);
});

probe('#351: typography changes no score, label, or confidence', () => {
  const plainText = typography + FILLER + FILLER;
  const straight = plainText
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u2014/g, ',');
  const curly = AIDetector.analyzeText(plainText, { sourceMode: 'plain' });
  const straightR = AIDetector.analyzeText(straight, { sourceMode: 'plain' });
  check(true, 'noop');
  // The style finding may add to the plain-mode finding total; it must not move
  // the authorship outputs.
  check(
    curly.score === straightR.score,
    `score moved: ${straightR.score} -> ${curly.score}`
  );
  check(
    JSON.stringify(curly.classification) === JSON.stringify(straightR.classification),
    `classification moved: ${JSON.stringify(straightR.classification)} -> ${JSON.stringify(curly.classification)}`
  );
  check(
    JSON.stringify(curly.confidence ?? null) === JSON.stringify(straightR.confidence ?? null),
    'confidence moved'
  );
  const topLevel = ['score', 'classification', 'confidence'];
  for (const k of topLevel) {
    check(JSON.stringify(curly[k]) === JSON.stringify(straightR[k]), `${k} moved`);
  }
});

if (failed > 0) {
  console.error(`\n${failed} probe(s) failed`);
  process.exit(1);
}
console.log('\nAll v3.38.0 engine probes passed.');
