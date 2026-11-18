// Behavioral probes for avoid-ai-writing tip a5d6bae (post-v3.39.0):
//  #140 - "out of the box" slogans/hyphenation match ASCII, U+2010, U+2011, U+2013;
//         em dash, U+2015 figure dash and the "works out" idiom stay clean.
//  U+2028/U+2029 - the em-dash separator carve-out keeps the same matches and
//         the leading indent no longer rescans a line-terminator run quadratically.
const AIDetector = require('./patterns.js');

let failed = 0;
function check(name, cond) {
  if (cond) { console.log(`  ok  ${name}`); }
  else { failed++; console.error(`  FAIL ${name}`); }
}
const issues = (t, type) => AIDetector.analyzeText(t).issues.filter((i) => i.type === type);

// #140: Unicode hyphens and the en dash fire with exact spans + suggestions.
for (const [name, sep] of [['U+2010', '\u2010'], ['U+2011', '\u2011'], ['U+2013', '\u2013']]) {
  const text = `The framework claims it just works out${sep}of${sep}the${sep}box for every developer who follows the documented installation steps today.`;
  const b = issues(text, 'dev-blog-boilerplate');
  check(`${name} boilerplate span`, b.length === 1 && b[0].index === 21);
  const h = issues(text, 'unnecessary-hyphenation');
  check(`${name} hyphenation suggestion`, h.length === 1 &&
        h[0].text === `works out${sep}of${sep}the${sep}box` &&
        h[0].suggestion === 'works out of the box');
}

// Negative: em dash, U+2015, U+2012 figure dash and the bare idiom stay clean.
const clean = [
  'The budget looked tight, but it just works out\u2014of the box office take, half goes to the crew this year.',
  'The budget looked tight, but it just works out\u2015of the box office take, half goes to the crew this year.',
  'The budget looked tight, but it just works out\u2012of\u2012the\u2012box according to the spreadsheet this year.',
  'The numbers looked tight, but it just works out to two queries after the optimizer merges identical branches.',
];
for (const text of clean) {
  const hits = AIDetector.analyzeText(text).issues
    .filter((i) => i.type === 'dev-blog-boilerplate' || i.type === 'unnecessary-hyphenation');
  check('stays clean: ' + text.slice(30, 55), hits.length === 0);
}

// U+2028/U+2029 separators keep the same em-dash matches.
const items = [
  '- **Detect mode** — flag patterns without rewriting anything in the file.',
  '\u00a0 - **Edit mode** — rewrite the file in place and report what changed.',
  '\f1. [agentskills.io](https://agentskills.io) — the SKILL.md format this repo follows.',
];
const em = (t) => issues(t, 'em-dash').map((i) => i.text);
for (const sep of ['\n', '\u2028', '\u2029', '\u2028 \u2029\t\u2028']) {
  const tail = 'The catalog lives in one file and a CI check keeps the README count honest.';
  check('separator dashes stay excluded ' + JSON.stringify(sep),
        em(`${items.join(sep)}${sep}${tail}`).length === 0);
  check('prose dash still counts ' + JSON.stringify(sep),
        em(`${items.join(sep)}${sep}The catalog lives in one file — a CI check keeps the README count honest.`)[0] === '1 em dashes in 49 words');
}

// Quadratic guard: U+2028/U+2029 runs must not blow up analyzeText.
const ordinary = 'A normal sentence about the pipeline and its output.';
for (const [name, ch] of [['U+2028', '\u2028'], ['U+2029', '\u2029']]) {
  const build = (n) => `${'w '.repeat(10)}${ch.repeat(n)}`;
  const t0 = Date.now();
  AIDetector.analyzeText(build(8000));
  const ms = Date.now() - t0;
  check(`${name} run bounded (${ms}ms)`, ms < 3000);
}

if (failed) { console.error(`${failed} probe(s) failed`); process.exit(1); }
console.log('All tip a5d6bae engine probes passed.');
