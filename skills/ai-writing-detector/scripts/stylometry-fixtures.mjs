#!/usr/bin/env node
/**
 * Behavioural fixtures for scripts/stylometry.mjs.
 *
 * The pinned numbers in the parity block were produced by humanizer-lint
 * v1.5.1 (`node scripts/analyze.mjs --file`) on the same text at vendoring
 * time. They exist so a future edit to the ported metric code cannot drift
 * silently away from the definitions the numbers claim to implement.
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CLI = join(HERE, 'stylometry.mjs');

const work = mkdtempSync(join(tmpdir(), 'stylometry-fixtures-'));
let pass = 0;
let fail = 0;

function check(name, fn) {
  try {
    fn();
    pass += 1;
    process.stdout.write(`PASS  ${name}\n`);
  } catch (error) {
    fail += 1;
    process.stdout.write(`FAIL  ${name}\n        ${error.message}\n`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function fixture(name, text) {
  const path = join(work, name);
  writeFileSync(path, text, 'utf8');
  return path;
}

function run(args, input) {
  return execFileSync(process.execPath, [CLI, ...args], {
    encoding: 'utf8',
    input,
  });
}

function report(path, extra = []) {
  return JSON.parse(run(['--json', ...extra, path]));
}

const PARITY_TEXT = [
  '# A heading that stays out of the count',
  '',
  'In today\'s fast-paced digital landscape, it is important to note that managing your files has become more complex than ever. Our new plugin is a comprehensive solution that seamlessly integrates with your existing workflow.',
  '',
  'Here is what changed. The walker now skips hidden trees. It also keeps a small cache of directory handles, which keeps the second scan cheap on slow drives and avoids the repeated stat calls that made the first version drag on a large library.',
  '',
  '```js',
  '// fenced code must not count as prose',
  'const unused = 42;',
  '```',
  '',
  'Setup takes one command. Done.',
].join('\n');

const NGRAM_TEXT = [
  'The watcher keeps the index fresh. The watcher keeps the index small during quiet hours.',
  'The watcher keeps the index current when the queue drains.',
  '',
  'Between those statements the draft rambles about directory handles, the incremental hashing pass, the archive rotation schedule, the retry policy for locked files, and the way the backlog is drained after a long weekend when nobody was watching the machine at all.',
  '',
  'The tool documents a staging directory, a quarantine area for half-written archives, and a log rotation rule that keeps only the last fourteen days of output so the disk does not fill quietly.',
  '',
  'A second pass over the same list repeats the template. The watcher keeps the index small, and the repetition is the point of this fixture.',
].join('\n');

const FLAT_TEXT = [
  'The tool counts the words in a line. The tool counts the sentences in a file. The tool prints a number for the reader. The tool never explains itself.',
  '',
  'It never decides who wrote the text. It never ranks one author above another. It never claims that a score proves a machine. It never asks for a share of the credit.',
].join('\n');

const BULGARIAN_TEXT = [
  'Инструментът мери ритъма на изреченията, а не авторството на текста. Прави го локално, без мрежови заявки, и не изпраща нищо навън.',
  '',
  'Когато текстът е равномерен, читателят усеща умора преди да назове причината. Затова тези мерки помагат. Те не решават вместо редактора.',
].join('\n');

check('parity with humanizer-lint v1.5.1 metric definitions', () => {
  const r = report(fixture('parity.md', PARITY_TEXT));
  const m = r.measurement;
  const expected = {
    word_count: 83,
    sentence_count: 7,
    mean_sentence_length: 11.8571,
    sentence_length_stddev: 10.9339,
    cv: 0.9221,
    paragraph_cv: 0,
    adjacent_delta: 13.1667,
    short_sentence_ratio: 0.5714,
    long_sentence_ratio: 0.1429,
    mattr: 0.8996,
  };
  for (const [key, value] of Object.entries(expected)) {
    assert(m[key] === value, `${key}: expected ${value}, got ${m[key]}`);
  }
});

check('sanitizer drops headings and fenced code from prose', () => {
  const r = report(fixture('scope.md', PARITY_TEXT));
  assert(r.measurement.raw_word_count > r.measurement.word_count, 'raw word count should exceed measured');
  const text = JSON.stringify(r);
  assert(!text.includes('unused'), 'fenced code leaked into the report');
  assert(!text.includes('heading that stays'), 'heading leaked into the report');
});

check('abbreviations and decimals do not end a sentence', () => {
  const r = report(fixture('abbrev.md', 'Dr. Smith counted 3.5 files, e.g. the ones by Mr. Janez. Then he stopped. That was all.'));
  assert(r.measurement.sentence_count === 3, `expected 3 sentences, got ${r.measurement.sentence_count}`);
});

check('repeated n-gram is reported with its occurrence count', () => {
  const r = report(fixture('ngram.md', NGRAM_TEXT));
  const hit = r.repetitive.ngrams.find((entry) => entry.phrase === 'watcher keeps index');
  assert(hit, `expected the repeated phrase, got ${JSON.stringify(r.repetitive.ngrams)}`);
  assert(hit.words === 3, `expected the function-word-free phrase, got ${hit.words} words`);
  assert(hit.occurrences >= 3, `expected repeat occurrences, got ${hit.occurrences}`);
});

check('uniform runs and flat paragraphs are found in flat prose', () => {
  const r = report(fixture('flat.md', FLAT_TEXT));
  assert(r.repetitive.uniform_runs.length >= 1, 'expected at least one uniform run');
  assert(r.repetitive.flat_paragraphs.length >= 1, 'expected at least one flat paragraph');
});

check('short input is reported as unreliable, not as a verdict', () => {
  const r = report(fixture('short.md', 'One sentence. Two sentences.'));
  assert(r.reliability.too_short_for_rhythm === true, 'two sentences cannot carry rhythm claims');
  assert(r.reliability.too_short_for_ngrams === true, 'short text cannot carry n-gram claims');
});

check('Cyrillic prose measures without a phrase catalog', () => {
  const r = report(fixture('bg.md', BULGARIAN_TEXT), ['--lang', 'bg']);
  assert(r.measurement.word_count > 20, `expected real Cyrillic word count, got ${r.measurement.word_count}`);
  assert(r.measurement.sentence_count === 5, `expected 5 sentences, got ${r.measurement.sentence_count}`);
  assert(r.measurement.cv > 0, 'cv should be computed');
});

check('report carries no score, verdict or authorship field', () => {
  const r = report(fixture('guard.md', NGRAM_TEXT));
  assert(r.interpretation === 'diagnostics_only', 'interpretation must stay diagnostics_only');
  assert(typeof r.disclaimer === 'string' && r.disclaimer.length > 0, 'disclaimer missing');
  for (const banned of ['score', 'status', 'verdict', 'label', 'document_classification', 'pass', 'fail']) {
    assert(!(banned in r), `report must not carry a ${banned} field`);
  }
});

check('empty input returns empty measurements instead of crashing', () => {
  const out = run(['--json', '--stdin'], '');
  const r = JSON.parse(out);
  assert(r.measurement.word_count === 0, 'expected zero words');
  assert(r.measurement.sentence_count === 0, 'expected zero sentences');
});

check('batch mode keeps one report per file', () => {
  const a = fixture('batch-a.md', PARITY_TEXT);
  const b = fixture('batch-b.md', NGRAM_TEXT);
  const r = JSON.parse(run(['--json', a, b]));
  assert(r.schema === 'ai-writing-detector.stylometry.batch.v1', `unexpected schema ${r.schema}`);
  assert(r.files.length === 2, 'expected two reports');
});

check('quiet mode prints one line per file', () => {
  const out = run(['--quiet', fixture('quiet-a.md', PARITY_TEXT), fixture('quiet-b.md', NGRAM_TEXT)]);
  assert(out.trim().split('\n').length === 2, `expected two lines, got ${out}`);
});

process.stdout.write(`\n${pass} passed, ${fail} failed\n`);
if (fail > 0) process.exit(1);
