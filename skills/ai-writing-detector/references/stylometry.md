# Stylometry probe

Measures the shape of prose without naming an author. Sentence spread,
paragraph spread, adjacent delta, moving-average type-token ratio, repeated
n-grams, uniform runs, flat paragraphs, and repeated sentence openings.

The numbers come from definitions ported out of
[humanizer-lint](https://github.com/yanstd888/humanizer-lint) (MIT). The
catalog, the score, the PASS/FAIL gate, and its thresholds stay out of this
skill; [Calibration](#calibration-why-there-is-no-gate) explains why.

## Run

```bash
node scripts/stylometry.mjs draft.md
node scripts/stylometry.mjs --json draft.md
node scripts/stylometry.mjs --sentence-map draft.md     # every sentence and word count
node scripts/stylometry.mjs --lang bg draft.md          # segmenter hint
node scripts/stylometry.mjs --quiet a.md b.md           # one line per file
node scripts/stylometry.mjs --no-ngrams draft.md
node scripts/stylometry.mjs --stopwords my-words.txt draft.md
cat draft.md | node scripts/stylometry.mjs --stdin
```

Exit code is `0` for a completed measurement, `1` for a usage or read error,
`2` when Node is older than 18. There is no threshold exit code, because
there is no threshold.

Text output carries one line of measurement, then the rhythm findings:

```
words 183 measured of 192 · sentences 19 · paragraphs 7 · mean 9.6316 · sd 4.4273
cv 0.4597 · adjacent delta 3.2778 · paragraph cv 0.2818 · short<=6 36.8% · long>=26 0.0%
mattr 0.8169 (window 50)
uniform runs: 3
  paragraph 7, sentences 16-18: 11, 11, 11 words
```

## Report fields (`ai-writing-detector.stylometry.v1`)

| Field | Meaning |
| --- | --- |
| `interpretation` | Always `diagnostics_only` |
| `scope` | Prose only: frontmatter, fenced code, headings, tables, thematic breaks, link targets and inline code are removed before measurement |
| `measurement.word_count` | Words in the measured prose |
| `measurement.raw_word_count` | Words in the file as written, for comparison |
| `measurement.cv` | Coefficient of variation of sentence length: `sd / mean` |
| `measurement.paragraph_cv` | Mean CV across paragraphs of four or more sentences |
| `measurement.adjacent_delta` | Mean absolute change in word count between neighbouring sentences |
| `measurement.short_sentence_ratio` | Share of sentences at six words or fewer |
| `measurement.long_sentence_ratio` | Share of sentences at 26 words or more |
| `measurement.mattr` | Moving-average type-token ratio, window `min(50, max(10, words/2))` |
| `sentence_lengths` | Word count per sentence, in reading order |
| `paragraphs[]` | Per-paragraph sentence count, lengths and CV |
| `repetitive.ngrams[]` | Repeated 4- and 3-word content phrases within 400 words, five at most |
| `repetitive.uniform_runs[]` | Three consecutive sentences in one paragraph within three words of each other |
| `repetitive.flat_paragraphs[]` | Four or more sentences in one paragraph with CV below 0.25 and a range under seven words |
| `repetitive.repeated_openings[]` | Neighbouring sentences starting with the same two words |
| `reliability` | `too_short_for_rhythm` (under eight sentences), `too_short_for_ngrams` (under 120 words), `mattr_window_clamped` |
| `sentences[]` | Only with `--sentence-map` |

Multi-file input returns `ai-writing-detector.stylometry.batch.v1` with a
`files` array.

## What the numbers do not mean

MATTR and burstiness are stylometry terms for describing variation, not
authorship. A low CV says the sentences cluster around one length. It does not
say a machine wrote them: a legal clause, a product spec, and a news brief do
the same. A high MATTR says the vocabulary keeps changing. It does not say a
human wrote it, and the humanizer catalog already records a measurement where a
model scored above the human median.

Do not rewrite toward a number. A draft that gains fragments to lift
`short_sentence_ratio` reads worse than one that never had them. The metric
tells you where to reread; it does not tell you what to write.

## Calibration: why there is no gate

Upstream ships these defaults for English
(`profiles/default-human.json`): CV at least `0.45`, adjacent delta at least
`4`, short-sentence share at least `0.15`, long-sentence share at least `0.10`,
MATTR at least `0.74`, and a pass score of `80`. Passing the score is not
enough; the distribution and rhythm checks also have to pass.

A pre-LLM human essay, vendored upstream as `tests/corpus/en-pre-llm-essay.txt`,
measures well on the numbers this skill reports:

| Signal | Value | Upstream threshold | Result |
| --- | --- | --- | --- |
| CV | 0.5946 | 0.45 | passes |
| Adjacent delta | 15.5385 | 4 | passes |
| MATTR | 0.8276 | 0.74 | passes |
| Long sentences | 28.6% | 10% | passes |
| Short sentences | 0.0% | 15% | fails |
| Score | 86 | 80 | passes |

The essay fails anyway, because none of its sentences is six words or shorter.
The gate asks a human essay to add fragments it never had. That is the reason
this skill imports the measurements and not the verdict: a pass/fail shape gate
manufactures the uniform correction it is supposed to detect, and it contradicts
the humanizer rule that length follows the thought.

Upstream also labels its non-English rhythm diagnostics uncalibrated. Treat
every threshold above as a description of one corpus, not as a standard.

## Languages

There is no phrase catalog here, so nothing is language-specific:

- Sentences and words come from `Intl.Segmenter`, with an abbreviation guard for
  English, Indonesian, and the common European set. Pass `--lang` when the
  segmenter guesses badly; it only affects splitting.
- Cyrillic, Greek, and Latin-script text outside English measure normally.
  Bulgarian prose has been measured in the fixture suite.
- CJK splits on `。！？` when the locale is set to a CJK language.
- N-gram detection filters the built-in 20-word English function list by
  default. `--stopwords FILE` replaces it with a JSON array or a
  newline-separated list for another language; `--no-stopwords` disables
  filtering and raises the noise from function-word phrases.

## Vendored slice

| Local path | Upstream path | Change |
| --- | --- | --- |
| `scripts/stylometry/tokenizer.mjs` | `scripts/utils/tokenizer.mjs` | Unchanged |
| `scripts/stylometry/sanitizer.mjs` | `scripts/utils/sanitizer-mapped.mjs` | Unchanged |
| `scripts/stylometry/metrics.mjs` | `scripts/utils/metrics-core.mjs` | Kept CV, deviation, adjacent delta, MATTR; dropped the deterministic DEFLATE compression ratio, the score, and the thresholds |
| `scripts/stylometry/rhythm.mjs` | `scripts/core/analyzer-core.mjs` | Kept the n-gram, uniform-run, flat-paragraph and repeated-opening functions; dropped `fixInstruction` strings and every lexical pack |
| `scripts/stylometry/stopwords-en.json` | `rules/en-slop.json` `stopwords` | The 20-word function list only |
| `scripts/stylometry.mjs` | `scripts/analyze.mjs` | New CLI: no score, no status, no language pack selection |

Re-vendoring is diff, port, then prove parity:

1. `git -C C:/git-ext/humanizer-lint fetch --tags` and diff the four upstream
   paths against the pinned ref in `SOURCES.md`.
2. Port only changes to the functions listed above.
3. Run `node scripts/stylometry-fixtures.mjs`. Its parity block pins the
   metrics from upstream v1.5.1 on one fixed text; a drift in definitions shows
   up as a failing number, not as a slow slide.
4. Re-run `node C:/git-ext/humanizer-lint/scripts/analyze.mjs --file <same text>`
   and confirm the metric lines still match to four decimals.
