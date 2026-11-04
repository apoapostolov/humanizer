// Stylometry metrics core for ai-writing-detector.
//
// Vendored from humanizer-lint (MIT, yanstd888) `scripts/utils/metrics-core.mjs`
// and reduced to the measurements that carry no verdict: spread, variation,
// adjacent delta and moving-average type-token ratio. The upstream score,
// PASS/FAIL gate, thresholds and compression ratio are deliberately absent.
// See ../references/stylometry.md and ../references/ATTRIBUTION.md.

export const MIN_SENTENCES_FOR_RHYTHM = 8;

export function round(value, places = 4) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function standardDeviation(values) {
  if (!values.length) return 0;
  const average = mean(values);
  return Math.sqrt(mean(values.map((value) => (value - average) ** 2)));
}

export function coefficientOfVariation(values) {
  const average = mean(values);
  return average ? standardDeviation(values) / average : 0;
}

export function adjacentDelta(values) {
  if (values.length < 2) return 0;
  let total = 0;
  for (let index = 1; index < values.length; index += 1) total += Math.abs(values[index] - values[index - 1]);
  return total / (values.length - 1);
}

// MATTR: average type-token ratio over a sliding window, so the number does
// not fall just because the document is longer than a plain TTR would allow.
export function mattrWindow(wordCount) {
  return Math.min(50, Math.max(10, Math.floor(wordCount / 2)));
}

export function mattr(words, requestedWindow) {
  if (!words.length) return 0;
  const window = Math.min(words.length, requestedWindow ?? mattrWindow(words.length));
  if (words.length <= window) return new Set(words).size / words.length;
  let total = 0;
  let windows = 0;
  for (let index = 0; index <= words.length - window; index += 1) {
    total += new Set(words.slice(index, index + window)).size / window;
    windows += 1;
  }
  return total / windows;
}

export function calculateMetrics(tokenized) {
  const lengths = tokenized.sentences.map((sentence) => sentence.wordCount);
  const paragraphLengths = tokenized.paragraphs
    .filter((paragraph) => paragraph.sentences.length >= 4)
    .map((paragraph) => coefficientOfVariation(paragraph.sentences.map((sentence) => sentence.wordCount)));
  const wordCount = tokenized.words.length;
  const sentenceCount = lengths.length;
  const window = Math.min(wordCount || 1, mattrWindow(wordCount));
  return {
    word_count: wordCount,
    sentence_count: sentenceCount,
    paragraph_count: tokenized.paragraphs.length,
    mean_sentence_length: round(mean(lengths)),
    sentence_length_stddev: round(standardDeviation(lengths)),
    cv: round(coefficientOfVariation(lengths)),
    paragraph_cv: round(paragraphLengths.length ? mean(paragraphLengths) : 0),
    adjacent_delta: round(adjacentDelta(lengths)),
    short_sentence_ratio: round(sentenceCount ? lengths.filter((length) => length <= 6).length / sentenceCount : 0),
    long_sentence_ratio: round(sentenceCount ? lengths.filter((length) => length >= 26).length / sentenceCount : 0),
    mattr: round(mattr(tokenized.words)),
    mattr_window: window,
    sentence_lengths: lengths,
  };
}
