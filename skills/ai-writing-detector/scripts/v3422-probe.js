// Behavioral probe: avoid-ai-writing #422 — stats.indentedBlocks must count only
// real indented code blocks (blank line outside a list), not fenced content and
// not four-space paragraph continuations.
const V = require("C:/git-public/humanizer/skills/ai-writing-detector/scripts/validate.js");
const { extractIndentedBlocks } = V;

const cases = [
  ["fence-only", "Intro text.\n\n```\n    const a = 1;\n    const b = 2;\n```\n\nDone.", 0],
  ["fence-nested-in-list", "- item\n\n  ```\n      code here\n  ```\n\n- next", 0],
  ["lazy-continuation", "First line of para\n    continued by four spaces\nstill same para.", 0],
  ["real-indented-block", "Para.\n\n    code line one\n    code line two\n\nAfter.", 1],
  ["list-indented-content", "- item\n\n    still list content\n- two", 0],
  ["tab-indented-fence", "Para.\n\n\t```\n    x\n\t```\n", 1],
  ["no-indent", "Plain paragraph.\n\nAnother.", 0],
];

let fail = 0;
for (const [name, text, expect] of cases) {
  const got = extractIndentedBlocks(text).length;
  const ok = got === expect;
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}: got ${got} expect ${expect}`);
}
console.log(`\n${fail === 0 ? "ALL PASS" : fail + " FAILED"} (${cases.length} cases)`);
process.exit(fail === 0 ? 0 : 1);
