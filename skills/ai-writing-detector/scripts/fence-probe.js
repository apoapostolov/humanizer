'use strict';
// Behavioral probes for engine fence fixes (avoid-ai-writing upstream):
// 1. Pin b504e20 (PR #127, fixes #77): a closing Markdown fence may only be
//    followed by spaces/tabs, per CommonMark. An info string (e.g. "```js")
//    must NOT close an outer fence, so headings inside a fenced block stay
//    masked instead of reaching title-case-header.
// 2. Fence info-string fix: a backtick line whose info string contains a
//    backtick (e.g. ```npm test```) must NOT open a fence in the preservation
//    validator, or every later prose edit reports code-block-modified.
// Mirrors upstream detector tests through the packaged API.
const { analyzeText } = require('./patterns.js');
const v = require('./validate.js');

const HEADING_BODY =
  '\n\nThe team closed three deals this quarter. Each agreement included ' +
  'revenue-share terms and dispute-resolution clauses. The legal review took ' +
  'two weeks per contract on average.';

const titleCaseHits = (text) =>
  analyzeText(text, { contextMode: 'general' }).issues.filter(
    (i) => i.type === 'title-case-header',
  ).length;

const intro = 'Documentation about writing Markdown, long enough to clear the word gate.';
const title = '## Benefits And Strategic Considerations';
const F = '```';

const cases = [
  // info-string suffix must NOT close the outer fence (title stays masked)
  ['info-string kept fenced', [intro, F, F + 'js', title, F].join('\n') + HEADING_BODY, 0],
  // blank-suffix close still exposes the heading
  ['blank-suffix close exposes', [intro, F, 'code', F + ' \t', title].join('\n') + HEADING_BODY, 1],
  // nbsp after the marker is fence content, not a valid close
  ['nbsp stays fence content', [intro, F, 'code', F + '\u00a0', title].join('\n') + HEADING_BODY, 0],
  // CRLF line endings still allow a closing fence
  ['CRLF still closes', [intro, F, 'code', F, title].join('\r\n') + HEADING_BODY, 1],
];

let fail = 0;
for (const [name, text, want] of cases) {
  const got = titleCaseHits(text);
  const ok = got === want;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name} (got ${got}, want ${want})`);
  if (!ok) fail = 1;
}

// Preservation-validator probe for the fence info-string fix.
const docOriginal = [
  'Start of the document, long enough to matter for the validator.',
  '',
  '```npm test```',
  '',
  'Middle paragraph with its original wording intact here.',
  '',
  'End of the document prose.',
].join('\n');
const docRewritten = docOriginal.replace(
  'Middle paragraph with its original wording intact here.',
  'Middle paragraph now edited for clarity and flow.',
);
const preserve = v.validate(docOriginal, docRewritten);
const findings = preserve.issues || preserve.errors || preserve.findings || [];
const codeHits = findings.filter(
  (i) => (i.type || i.code) === 'code-block-modified',
).length;
const preserveOk = codeHits === 0;
console.log(`${preserveOk ? 'PASS' : 'FAIL'}  inline-span opens no fence (code-block-modified=${codeHits}, want 0)`);
if (!preserveOk) fail = 1;

process.exit(fail);
