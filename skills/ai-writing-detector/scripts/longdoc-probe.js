/**
 * Behavioral probe for long-document scoring.
 *
 * The engine refuses text over 10,000 words and returns score 0 with no
 * issues, which reads as a clean result. This probe pins the package behavior
 * that replaces it: paragraph-aligned chunking with a word-weighted average,
 * matching upstream self-scan (#382).
 *
 * Run: node scripts/longdoc-probe.js
 */

const assert = require("node:assert/strict");
const longdoc = require("./longdoc.js");
const AIDetector = require("./patterns.js");

let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ok ${name}`);
  } catch (err) {
    failed++;
    console.error(`  FAIL ${name}`);
    console.error(`    ${err.message}`);
  }
}

const CLEAN =
  "The build script copies the assets into the output folder and then prints a short summary line.";
const SLOP =
  "The dashboard serves as a robust and comprehensive hub that showcases a vibrant tapestry of synergy.";

/** Build a document of `paragraphs` paragraphs, every `slopEvery`-th one sloppy. */
function doc(paragraphs, wordsEach = 120, slopEvery = 7) {
  const filler = Array(wordsEach)
    .fill("Ordinary sentence about the pipeline and its output.")
    .join(" ");
  const parts = [];
  for (let i = 0; i < paragraphs; i++) {
    parts.push((i % slopEvery === 0 ? SLOP + " " : CLEAN + " ") + filler);
  }
  return parts.join("\n\n");
}

test("engine still refuses a document over the limit", () => {
  const text = doc(120);
  assert.ok(longdoc.countWords(text) > longdoc.ENGINE_MAX_WORDS, "fixture is long enough");
  const engine = AIDetector.analyzeText(text);
  assert.equal(engine.label, "Text too long");
  assert.equal(engine.score, 0);
  assert.equal(engine.issues.length, 0);
  assert.equal(engine.tooLong, true);
});

test("package scores the same document instead of reporting a clean zero", () => {
  const text = doc(120);
  const result = longdoc.analyzeLongText(text);
  assert.ok(result, "long document was scored");
  assert.ok(result.score > 0, `score is above zero (got ${result.score})`);
  assert.ok(result.issues.length > 0, "issues were collected across chunks");
  assert.ok(result.stats.chunksScored > 1, "more than one chunk was scored");
  assert.equal(result.stats.chunks, result.stats.chunksScored);
  assert.equal(result.declined, false);
  assert.equal(result.label, AIDetector.getLabel(result.score));
});

test("chunks stay paragraph-aligned and inside the engine limit", () => {
  const text = doc(120);
  const chunks = longdoc.chunkParagraphs(text);
  assert.ok(chunks.length > 1, "document splits into several chunks");
  for (const chunk of chunks) {
    assert.ok(
      longdoc.countWords(chunk) <= longdoc.CHUNK_WORDS + 120,
      `chunk stays near the budget (got ${longdoc.countWords(chunk)})`
    );
    assert.ok(!AIDetector.analyzeText(chunk).tooLong, "chunk is scannable");
  }
  assert.equal(chunks.join("\n\n").split(/\n\s*\n/).length, doc(120).split(/\n\s*\n/).length);
});

test("score is the word-weighted average of the chunks, not the worst chunk", () => {
  const text = doc(120);
  const result = longdoc.analyzeLongText(text);
  const scored = longdoc
    .chunkParagraphs(text)
    .map((c) => AIDetector.analyzeText(c))
    .filter((r) => !r.tooShort && !r.tooLong);
  const worst = Math.max(...scored.map((r) => r.score));
  const words = scored.reduce((s, r) => s + r.stats.wordCount, 0);
  const weighted = Math.round(
    scored.reduce((s, r) => s + r.score * r.stats.wordCount, 0) / words
  );
  assert.equal(result.score, weighted);
  assert.ok(result.score <= worst, "weighted average cannot exceed the worst chunk");
  assert.equal(
    result.stats.wordCount,
    words,
    "reported words are the accepted chunk words"
  );
});

test("clean long document stays at or near zero", () => {
  const parts = [];
  for (let i = 0; i < 120; i++) parts.push(CLEAN + " " + Array(120).fill(CLEAN).join(" "));
  const text = parts.join("\n\n");
  const result = longdoc.analyzeLongText(text);
  assert.ok(result, "long document was scored");
  assert.ok(result.score <= 15, `clean document stays in the minimal band (got ${result.score})`);
});

test("a single unbroken block cannot be chunked and is left refused", () => {
  const text = Array(1200).fill(CLEAN).join(" ");
  assert.ok(longdoc.countWords(text) > longdoc.ENGINE_MAX_WORDS);
  assert.equal(longdoc.analyzeLongText(text), null, "no paragraph breaks means no chunks");
  const engine = AIDetector.analyzeText(text);
  assert.equal(engine.tooLong, true);
});

test("a short paragraph that lands in its own chunk is excluded, not scored as clean", () => {
  // A paragraph already at the chunk budget closes the chunk, so the tiny
  // paragraph that follows starts one of its own and is too short to score.
  const big = Array(4000).fill("word").join(" ");
  const text = big + "\n\nToo short to score.";
  const result = longdoc.analyzeLongText(text);
  assert.ok(result, "document was scored");
  assert.equal(result.stats.chunks, 2, "two chunks");
  assert.equal(result.stats.chunksScored, 1, "only the long chunk is scored");
  assert.equal(result.stats.chunksUnscored, 1);
  assert.ok(
    !result.issues.some((i) => /Too short/i.test(String(i.text || ""))),
    "the excluded paragraph contributes no issues"
  );
});

test("needsChunking follows the engine limit", () => {
  assert.equal(longdoc.needsChunking("short text"), false);
  assert.equal(longdoc.needsChunking(Array(10001).fill("word").join(" ")), true);
});

if (failed > 0) {
  console.error(`\n${failed} long-document probe(s) failed`);
  process.exit(1);
}
console.log("\nAll long-document probes passed.");
