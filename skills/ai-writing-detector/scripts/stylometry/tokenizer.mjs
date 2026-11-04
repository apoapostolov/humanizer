const ABBREVIATIONS = {
  id: ['dll.', 'dsb.', 'dst.', 'dkk.', 'hlm.', 'no.', 'dr.', 'prof.', 'ir.', 'hj.', 'pt.', 'cv.', 'tbk.', 'rp.', 'tgl.', 's.d.', 'a.n.', 'u.p.'],
  en: ['mr.', 'mrs.', 'ms.', 'dr.', 'prof.', 'sr.', 'jr.', 'vs.', 'etc.', 'e.g.', 'i.e.', 'fig.', 'inc.', 'ltd.', 'co.', 'st.'],
  eu: ['p.ej.', 'sr.', 'sra.', 'z.b.', 'bzw.', 'm.a.w.'],
};

const DOT = '\uE000';
const DECIMAL = '\uE001';
const ELLIPSIS = '\uE002';
const CJK_PATTERN = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\uac00-\ud7af]/u;
const SPACED_TERMINAL_PUNCTUATION = /([.!?\u061f]+(?:["')\]”’]+)?)(?=\s|$)/gu;
const CJK_TERMINAL_PUNCTUATION = /([\u3002\uff01\uff1f]+(?:["')\]”’]+)?)(?=\s|$|[\p{L}\p{N}])/gu;
const WORD_CONNECTOR = /^(?:[-'’])$/u;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function normalizeLocale(language) {
  const value = String(language ?? '').trim().toLowerCase();
  if (!value || value === 'auto' || value === 'universal') return 'und';
  if (!/^[a-z]{2}$/u.test(value)) return 'und';
  try {
    return Intl.getCanonicalLocales(value)[0] ?? 'und';
  } catch {
    return 'und';
  }
}

export function isCJKText(text) {
  return CJK_PATTERN.test(String(text ?? ''));
}

function segmenter(locale, granularity) {
  if (typeof Intl?.Segmenter !== 'function') return null;
  try {
    return new Intl.Segmenter(normalizeLocale(locale), { granularity });
  } catch {
    return new Intl.Segmenter('und', { granularity });
  }
}

function abbreviationsFor(language) {
  if (language === 'id') return [...ABBREVIATIONS.id, ...ABBREVIATIONS.en, ...ABBREVIATIONS.eu];
  if (language === 'en') return [...ABBREVIATIONS.en, ...ABBREVIATIONS.id, ...ABBREVIATIONS.eu];
  return Object.values(ABBREVIATIONS).flat();
}

function protectAbbreviations(text, language) {
  let protectedText = text
    .replace(/\.{2,}/g, ELLIPSIS)
    .replace(/(\d)\.(\d)/g, `$1${DECIMAL}$2`);
  for (const abbreviation of [...new Set(abbreviationsFor(language))].sort((a, b) => b.length - a.length)) {
    protectedText = protectedText.replace(
      new RegExp(`\\b${escapeRegExp(abbreviation)}`, 'giu'),
      (match) => match.replaceAll('.', DOT),
    );
  }
  return protectedText;
}

function restoreProtectedText(text) {
  return text
    .replaceAll(DOT, '.')
    .replaceAll(DECIMAL, '.')
    .replaceAll(ELLIPSIS, '...');
}

function splitTerminalPunctuation(text) {
  return text
    .replace(SPACED_TERMINAL_PUNCTUATION, '$1\n')
    .replace(CJK_TERMINAL_PUNCTUATION, '$1\n');
}

export function splitSentences(text, language = 'auto') {
  const protectedText = protectAbbreviations(String(text ?? '').replace(/\s+/g, ' ').trim(), language);
  if (!protectedText) return [];
  const sentenceSegmenter = segmenter(language, 'sentence');
  const segments = sentenceSegmenter
    ? [...sentenceSegmenter.segment(protectedText)].map((entry) => entry.segment)
    : [protectedText];
  return segments
    .flatMap((segment) => splitTerminalPunctuation(segment).split('\n'))
    .map((segment) => restoreProtectedText(segment).trim())
    .filter(Boolean);
}

function fallbackWords(text) {
  return String(text ?? '').toLowerCase().match(/token_entity|[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?(?:-[\p{L}\p{N}]+)*/gu) ?? [];
}

export function tokenizeWords(text, language = 'auto') {
  const normalized = String(text ?? '').replace(/—|--/g, ' ');
  const wordSegmenter = segmenter(language, 'word');
  if (!wordSegmenter) return fallbackWords(normalized);

  const words = [];
  let previousEnd = -1;
  for (const entry of wordSegmenter.segment(normalized)) {
    if (!entry.isWordLike) continue;
    const word = entry.segment.toLowerCase();
    const between = previousEnd < 0 ? '' : normalized.slice(previousEnd, entry.index);
    if (words.length && WORD_CONNECTOR.test(between)) words[words.length - 1] += `${between}${word}`;
    else words.push(word);
    previousEnd = entry.index + entry.segment.length;
  }
  return words;
}

export function tokenizeText(input, language = 'auto') {
  const paragraphs = [];
  const sentences = [];
  const rawParagraphs = String(input ?? '').replace(/\r\n?/g, '\n').split(/\n\s*\n+/).map((value) => value.trim()).filter(Boolean);

  for (const [paragraphOffset, rawParagraph] of rawParagraphs.entries()) {
    const paragraphSentences = [];
    for (const text of splitSentences(rawParagraph, language)) {
      const words = tokenizeWords(text, language);
      if (!words.length) continue;
      const sentence = {
        text,
        words,
        wordCount: words.length,
        paragraphIndex: paragraphOffset + 1,
        sentenceIndex: sentences.length + 1,
        sentenceInParagraph: paragraphSentences.length + 1,
      };
      paragraphSentences.push(sentence);
      sentences.push(sentence);
    }

    if (paragraphSentences.length) {
      paragraphs.push({
        text: rawParagraph,
        paragraphIndex: paragraphOffset + 1,
        sentences: paragraphSentences,
        words: paragraphSentences.flatMap((sentence) => sentence.words),
      });
    }
  }

  return {
    paragraphs,
    sentences,
    words: sentences.flatMap((sentence) => sentence.words),
  };
}

export { ABBREVIATIONS };