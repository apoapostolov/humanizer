'use strict';
// Behavioral probe for engine pin b504e20 (upstream PR #127, fixes #77):
// a closing Markdown fence may only be followed by spaces/tabs, per CommonMark.
// An info string (e.g. "```js") must NOT close an outer fence, so headings
// inside a fenced block stay masked instead of reaching title-case-header.
// Mirrors upstream detector/patterns.test.js '#77' through the packaged API.
const { analyzeText } = require('./patterns.js');

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
process.exit(fail);
