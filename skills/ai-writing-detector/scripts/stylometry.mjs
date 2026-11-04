#!/usr/bin/env node
/**
 * Stylometry probe for ai-writing-detector.
 *
 * Measures sentence and paragraph spread, adjacent delta, moving-average
 * type-token ratio, repeated n-grams, uniform runs, flat paragraphs and
 * repeated sentence openings. Language-agnostic: it counts what the segmenter
 * returns and never consults a phrase catalog.
 *
 * Deliberately absent: a score, a pass/fail status, and any authorship field.
 * The numbers describe shape. A reader decides what to do with the text.
 *
 * Metrics core and rhythm rules are ported from humanizer-lint (MIT, yanstd888).
 * See ../../references/stylometry.md and ../../references/ATTRIBUTION.md.
 */

import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { basename, dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { tokenizeText, tokenizeWords } from './stylometry/tokenizer.mjs';
import { sanitizeMarkdownWithMap } from './stylometry/sanitizer.mjs';
import { calculateMetrics, mean, round, MIN_SENTENCES_FOR_RHYTHM } from './stylometry/metrics.mjs';
import {
  flatParagraphs,
  repeatedNgrams,
  repeatedOpenings,
  uniformRuns,
} from './stylometry/rhythm.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { version: PACKAGE_VERSION } = require('../package.json');

const DEFAULT_MIN_WORDS = 120;

const USAGE = `Usage: node scripts/stylometry.mjs [options] [file ...]

Print shape measurements: sentence and paragraph spread, adjacent delta,
moving-average type-token ratio, repeated n-grams and rhythm runs. No score,
no verdict, no authorship field.

Options:
  --json                 JSON report (ai-writing-detector.stylometry.v1)
  --quiet                One line per file
  --lang CODE            Language hint for the segmenter (default: auto)
  --stdin                Read stdin even when files are listed (files win)
  --sentence-map         Include every sentence and its word count
  --no-ngrams            Skip repeated n-gram detection
  --no-stopwords         Do not filter function words from n-gram content
  --stopwords FILE       Replace the built-in English list (JSON array or newline list)
  --min-words N          Minimum document size for n-grams (default ${DEFAULT_MIN_WORDS})
  -h, --help             Show this help
`;

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function requireNode() {
  const major = Number(String(process.versions.node || '0').split('.')[0]);
  if (!Number.isFinite(major) || major < 18) {
    process.stderr.write(`ai-writing-detector stylometry requires Node.js >= 18 (found ${process.versions.node})\n`);
    process.exit(2);
  }
}

function parseArgs(argv) {
  const options = {
    json: false,
    quiet: false,
    stdin: false,
    sentenceMap: false,
    ngrams: true,
    stopwords: 'builtin',
    stopwordsFile: null,
    minWords: DEFAULT_MIN_WORDS,
    lang: 'auto',
    files: [],
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const next = () => {
      const value = argv[index + 1];
      if (value === undefined) fail(`Missing value for ${argument}`);
      index += 1;
      return value;
    };
    switch (argument) {
      case '--json': options.json = true; break;
      case '--quiet': options.quiet = true; break;
      case '--stdin': options.stdin = true; break;
      case '--sentence-map': options.sentenceMap = true; break;
      case '--no-ngrams': options.ngrams = false; break;
      case '--no-stopwords': options.stopwords = 'none'; break;
      case '--stopwords':
        options.stopwords = 'file';
        options.stopwordsFile = next();
        break;
      case '--min-words': {
        const value = Number(next());
        if (!Number.isFinite(value) || value < 0) fail('--min-words needs a non-negative number');
        options.minWords = value;
        break;
      }
      case '--lang': options.lang = next(); break;
      case '-h':
      case '--help':
        process.stdout.write(USAGE);
        process.exit(0);
        break;
      default:
        if (argument.startsWith('--')) fail(`Unknown flag: ${argument}\n\n${USAGE}`);
        options.files.push(argument);
    }
  }
  return options;
}

function loadStopwords(options) {
  if (options.stopwords === 'none') return [];
  const path = options.stopwordsFile
    ? (isAbsolute(options.stopwordsFile) ? options.stopwordsFile : resolve(process.cwd(), options.stopwordsFile))
    : resolve(HERE, 'stylometry', 'stopwords-en.json');
  const raw = readFileSync(path, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map((word) => String(word).toLowerCase()).filter(Boolean);
  } catch {
    // Fall through to the newline form.
  }
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim().toLowerCase())
    .filter((line) => line && !line.startsWith('#'));
}

function buildReport(source, text, options, stopwords) {
  const prose = sanitizeMarkdownWithMap(text).text;
  const tokenized = tokenizeText(prose, options.lang);
  const metrics = calculateMetrics(tokenized);
  const { sentence_lengths: lengths, ...measurement } = metrics;
  measurement.raw_word_count = tokenizeWords(String(text ?? ''), options.lang).length;

  const paragraphs = tokenized.paragraphs.map((paragraph) => {
    const paragraphLengths = paragraph.sentences.map((sentence) => sentence.wordCount);
    const average = mean(paragraphLengths);
    const deviation = Math.sqrt(
      paragraphLengths.reduce((sum, value) => sum + (value - average) ** 2, 0) / paragraphLengths.length,
    );
    return {
      index: paragraph.paragraphIndex,
      sentence_count: paragraph.sentences.length,
      lengths: paragraphLengths,
      cv: round(average ? deviation / average : 0),
    };
  });

  const report = {
    schema: 'ai-writing-detector.stylometry.v1',
    interpretation: 'diagnostics_only',
    source,
    language: options.lang,
    scope: 'prose only: frontmatter, fenced code, headings, tables, thematic breaks, link targets and inline code are excluded before measurement',
    generated_by: `ai-writing-detector ${PACKAGE_VERSION} stylometry`,
    measurement,
    sentence_lengths: lengths,
    paragraphs,
    repetitive: {
      ngrams: options.ngrams
        ? repeatedNgrams(tokenized, { stopwords, minWords: options.minWords })
        : [],
      uniform_runs: uniformRuns(tokenized),
      flat_paragraphs: flatParagraphs(tokenized),
      repeated_openings: repeatedOpenings(tokenized),
    },
    reliability: {
      too_short_for_rhythm: metrics.sentence_count < MIN_SENTENCES_FOR_RHYTHM,
      too_short_for_ngrams: metrics.word_count < options.minWords,
      mattr_window_clamped: metrics.word_count > 0 && metrics.mattr_window === metrics.word_count,
    },
    reading_notes: [
      'Measurements describe shape, not authorship. A flat score is not evidence of a machine author.',
      'Do not add fragments or merge sentences to move a number. Length should follow the thought.',
      'Formal, legal and regulated text legitimately runs with lower variance.',
    ],
    disclaimer: 'Diagnostics only. Not an authorship verdict and not a rewrite target.',
  };

  if (options.sentenceMap) {
    report.sentences = tokenized.sentences.map((sentence) => ({
      index: sentence.sentenceIndex,
      paragraph: sentence.paragraphIndex,
      words: sentence.wordCount,
      text: sentence.text,
    }));
  }
  return report;
}

function formatText(report, options) {
  const lines = [];
  const m = report.measurement;
  lines.push(`source: ${report.source}   language: ${report.language}`);
  lines.push(
    `words ${m.word_count} measured of ${m.raw_word_count} · sentences ${m.sentence_count} · paragraphs ${m.paragraph_count} · `
    + `mean ${m.mean_sentence_length} · sd ${m.sentence_length_stddev}`,
  );
  lines.push(
    `cv ${m.cv} · adjacent delta ${m.adjacent_delta} · paragraph cv ${m.paragraph_cv} · `
    + `short<=6 ${(m.short_sentence_ratio * 100).toFixed(1)}% · long>=26 ${(m.long_sentence_ratio * 100).toFixed(1)}%`,
  );
  lines.push(`mattr ${m.mattr} (window ${m.mattr_window})`);

  if (options.sentenceMap) {
    lines.push('lengths');
    for (const paragraph of report.paragraphs) {
      lines.push(`  p${paragraph.index}: ${paragraph.lengths.join(' ')}`);
    }
  }

  const { ngrams, uniform_runs: runs, flat_paragraphs: flats, repeated_openings: openings } = report.repetitive;
  if (options.ngrams) {
    lines.push(`repeated n-grams: ${ngrams.length}`);
    for (const ngram of ngrams) {
      lines.push(`  "${ngram.phrase}" ×${ngram.occurrences} (${ngram.words} words)`);
    }
  }
  lines.push(`uniform runs: ${runs.length}`);
  for (const run of runs) {
    lines.push(`  paragraph ${run.paragraph}, sentences ${run.sentences[0]}-${run.sentences[1]}: ${run.lengths.join(', ')} words`);
  }
  lines.push(`flat paragraphs: ${flats.length}`);
  for (const paragraph of flats) {
    lines.push(`  paragraph ${paragraph.paragraph}, cv ${paragraph.cv}, range ${paragraph.range}`);
  }
  lines.push(`repeated openings: ${openings.length}`);
  for (const opening of openings) {
    lines.push(`  "${opening.opening}" ×${opening.count} (sentences ${opening.sentences[0]}-${opening.sentences[1]})`);
  }

  if (report.reliability.too_short_for_rhythm) {
    lines.push(`note: under ${MIN_SENTENCES_FOR_RHYTHM} sentences, so spread numbers are unstable`);
  }
  if (report.reliability.too_short_for_ngrams) {
    lines.push('note: under the n-gram minimum, no repeated-phrase scan ran');
  }
  return lines.join('\n');
}

function readSource(file) {
  const path = isAbsolute(file) ? file : resolve(process.cwd(), file);
  return { label: path, text: readFileSync(path, 'utf8') };
}

function readStdin() {
  return readFileSync(0, 'utf8');
}

function main() {
  requireNode();
  const options = parseArgs(process.argv.slice(2));
  if (!options.files.length && !options.stdin) {
    if (process.stdin.isTTY) fail(USAGE);
    options.stdin = true;
  }
  const stopwords = options.ngrams ? loadStopwords(options) : [];

  const sources = options.files.length
    ? options.files.map(readSource)
    : [{ label: '<stdin>', text: readStdin() }];

  const reports = sources.map((source) => buildReport(source.label, source.text, options, stopwords));

  if (options.json) {
    const payload = reports.length === 1
      ? reports[0]
      : { schema: 'ai-writing-detector.stylometry.batch.v1', interpretation: 'diagnostics_only', files: reports };
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
    return;
  }

  if (options.quiet) {
    for (const report of reports) {
      const m = report.measurement;
      process.stdout.write(
        `${basename(report.source)}: ${m.word_count}w ${m.sentence_count}s cv=${m.cv} delta=${m.adjacent_delta} `
        + `mattr=${m.mattr} ngrams=${report.repetitive.ngrams.length}\n`,
      );
    }
    return;
  }

  process.stdout.write(`${reports.map((report) => formatText(report, options)).join('\n\n')}\n`);
  process.stdout.write('\nDiagnostics only. Not an authorship verdict and not a rewrite target.\n');
}

main();
