// Rhythm and repetition findings for ai-writing-detector.
//
// Ported from humanizer-lint (MIT) `scripts/core/analyzer-core.mjs`
// (`repetitiveNgramViolations`, `monotonyViolations`,
// `paragraphRhythmViolations`, `repeatedOpenings`). Each function reports a
// shape in the text. None of them decides whether the text passes.
// See ../references/stylometry.md.

const DEFAULT_SIZES = [4, 3];
const DEFAULT_WINDOW_WORDS = 400;
const DEFAULT_MIN_WORDS = 120;
const DEFAULT_LIMIT = 5;

// Upstream filters one sentinel token emitted by its fallback tokenizer; it can
// never be a real word, so it stays filtered here for parity.
const SENTINEL = 'token_entity';

export function repeatedNgrams(tokenized, options = {}) {
  const {
    stopwords = [],
    sizes = DEFAULT_SIZES,
    windowWords = DEFAULT_WINDOW_WORDS,
    minWords = DEFAULT_MIN_WORDS,
    limit = DEFAULT_LIMIT,
  } = options;
  if (tokenized.words.length < minWords) return [];

  const ignored = new Set(stopwords);
  const content = tokenized.words
    .map((word, index) => ({ word, index }))
    .filter(({ word }) => !ignored.has(word) && word !== SENTINEL);

  const findings = [];
  const seen = new Set();
  for (const size of sizes) {
    const occurrences = new Map();
    for (let index = 0; index <= content.length - size; index += 1) {
      const phrase = content.slice(index, index + size).map(({ word }) => word).join(' ');
      const positions = occurrences.get(phrase) ?? [];
      positions.push(content[index].index);
      occurrences.set(phrase, positions);
    }
    for (const [phrase, positions] of occurrences) {
      if (seen.has(phrase)) continue;
      const repeated = positions.some((start, index) => positions[index + 2] != null && positions[index + 2] - start <= windowWords);
      if (!repeated) continue;
      seen.add(phrase);
      findings.push({
        phrase,
        words: size,
        occurrences: positions.length,
        word_positions: positions,
      });
      if (findings.length >= limit) return findings;
    }
  }
  return findings;
}

// Three consecutive sentences inside one paragraph whose lengths sit within
// three words of each other.
export function uniformRuns(tokenized) {
  const runs = [];
  for (const paragraph of tokenized.paragraphs) {
    for (let index = 0; index <= paragraph.sentences.length - 3; index += 1) {
      const window = paragraph.sentences.slice(index, index + 3);
      const lengths = window.map((sentence) => sentence.wordCount);
      if (Math.abs(lengths[1] - lengths[0]) <= 3 && Math.abs(lengths[2] - lengths[1]) <= 3) {
        runs.push({
          paragraph: paragraph.paragraphIndex,
          sentences: [window[0].sentenceIndex, window[2].sentenceIndex],
          lengths,
        });
      }
    }
  }
  return runs;
}

// A paragraph of four or more sentences with a compressed spread of lengths.
export function flatParagraphs(tokenized) {
  const findings = [];
  for (const paragraph of tokenized.paragraphs) {
    if (paragraph.sentences.length < 4) continue;
    const lengths = paragraph.sentences.map((sentence) => sentence.wordCount);
    const range = Math.max(...lengths) - Math.min(...lengths);
    const average = lengths.reduce((sum, value) => sum + value, 0) / lengths.length;
    const deviation = Math.sqrt(lengths.reduce((sum, value) => sum + (value - average) ** 2, 0) / lengths.length);
    const cv = average ? deviation / average : 0;
    if (cv < 0.25 && range < 7) {
      findings.push({
        paragraph: paragraph.paragraphIndex,
        sentences: paragraph.sentences.length,
        lengths,
        cv: Math.round(cv * 10000) / 10000,
        range,
      });
    }
  }
  return findings;
}

// Adjacent sentences that open with the same two words.
export function repeatedOpenings(tokenized) {
  const runs = [];
  for (const paragraph of tokenized.paragraphs) {
    let active = null;
    for (let index = 1; index < paragraph.sentences.length; index += 1) {
      const first = paragraph.sentences[index - 1];
      const second = paragraph.sentences[index];
      const opening = first.words.length >= 3 ? first.words.slice(0, 2).join(' ') : '';
      const next = second.words.length >= 3 ? second.words.slice(0, 2).join(' ') : '';
      if (opening && opening === next) {
        if (active && active.opening === opening) {
          active.count += 1;
          active.sentences[1] = second.sentenceIndex;
        } else {
          active = {
            opening,
            paragraph: paragraph.paragraphIndex,
            sentences: [first.sentenceIndex, second.sentenceIndex],
            count: 2,
          };
          runs.push(active);
        }
      } else {
        active = null;
      }
    }
  }
  return runs;
}
