"use strict";

/**
 * Long-document scoring for the vendored engine.
 *
 * The engine refuses text over 10,000 words: it returns label "Text too long",
 * score 0, and no issues. In a report that is indistinguishable from a clean
 * zero, so a long draft reads as signal-free when it was never scanned at all.
 *
 * This module scores those documents instead. It splits the text on paragraph
 * boundaries into chunks of at most CHUNK_WORDS words, scans every chunk, and
 * combines the accepted chunks with a word-weighted average, rounded. Issue
 * categories are counted across every accepted chunk.
 *
 * The algorithm mirrors upstream `scripts/self-scan.js` (#382) so this package
 * and the upstream self-scan tool agree on a long document. It is a package
 * layer: the vendored engine stays byte-identical to upstream.
 */

const AIDetector = require("./patterns.js");

/** Upper bound for one engine scan. Mirrors MAX_WORDS in patterns.js. */
const ENGINE_MAX_WORDS = 10000;

/** Paragraph-aligned chunk budget. Mirrors CHUNK_WORDS in upstream self-scan.js. */
const CHUNK_WORDS = 4000;

function countWords(text) {
  return (String(text || "").match(/\S+/g) || []).length;
}

/** True when the engine would refuse this text for length. */
function needsChunking(text) {
  return countWords(text) > ENGINE_MAX_WORDS;
}

/**
 * Split text into paragraph-aligned chunks of at most CHUNK_WORDS words.
 * A single paragraph larger than the budget becomes one oversized chunk, which
 * the engine then refuses; that chunk counts as unscored.
 */
function chunkParagraphs(text) {
  const paragraphs = String(text || "").split(/\n\s*\n/);
  const chunks = [];
  let current = [];
  let words = 0;
  for (const para of paragraphs) {
    const n = countWords(para);
    if (words + n > CHUNK_WORDS && current.length) {
      chunks.push(current.join("\n\n"));
      current = [];
      words = 0;
    }
    current.push(para);
    words += n;
  }
  if (current.length) chunks.push(current.join("\n\n"));
  return chunks.filter((c) => c.trim().length > 0);
}

function totalWords(results) {
  return results.reduce((sum, r) => sum + ((r.stats && r.stats.wordCount) || 0), 0);
}

/**
 * Score a document the engine refused for length.
 *
 * @param {string} text
 * @param {object} [options] engine options (contextMode, sourceMode)
 * @returns {object|null} a long-document result, or null when chunking cannot
 *   help (every chunk was too short, or a single chunk is itself over the
 *   limit). A null return means the caller keeps the engine's own refusal.
 */
function analyzeLongText(text, options = {}) {
  const chunks = chunkParagraphs(text);
  if (!chunks.length) return null;

  const results = chunks.map((chunk) => AIDetector.analyzeText(chunk, options));

  // A declined (unsupported-script) chunk is not a completed scan. Report the
  // document as unscannable instead of scoring it as a clean zero (#241).
  if (results.some((r) => r.unsupportedScript)) {
    return {
      score: 0,
      label: "Unsupported script",
      issues: [],
      declined: true,
      stats: {
        wordCount: totalWords(results),
        chunks: chunks.length,
        chunksScored: 0,
        chunksUnscored: chunks.length,
        engineLimitWords: ENGINE_MAX_WORDS,
        chunkWords: CHUNK_WORDS,
      },
    };
  }

  const accepted = results.filter((r) => !r.tooShort && !r.tooLong);
  if (!accepted.length) return null;

  const words = totalWords(accepted);
  const weighted = accepted.reduce(
    (sum, r) => sum + r.score * ((r.stats && r.stats.wordCount) || 0),
    0
  );
  const score = Math.round(weighted / (words || 1));

  return {
    score,
    label: AIDetector.getLabel(score),
    issues: accepted.flatMap((r) => r.issues || []),
    declined: false,
    stats: {
      wordCount: words,
      chunks: chunks.length,
      chunksScored: accepted.length,
      chunksUnscored: chunks.length - accepted.length,
      engineLimitWords: ENGINE_MAX_WORDS,
      chunkWords: CHUNK_WORDS,
    },
  };
}

module.exports = {
  ENGINE_MAX_WORDS,
  CHUNK_WORDS,
  countWords,
  needsChunking,
  chunkParagraphs,
  analyzeLongText,
};
