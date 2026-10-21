<!-- markdownlint-disable MD013 -->

# Scoring and limits

## Default report (this package)

`scripts/analyze.js` prints schema **`ai-writing-detector.analyze.v1`** via
`scripts/report.js`. Multi-file uses **`ai-writing-detector.analyze.batch.v1`**.

| Field | Meaning |
| --- | --- |
| `interpretation` | Always `signals_only` in default mode |
| `source` | File path or `stdin` |
| `score` | 0–100 composite from the **full** engine run |
| `label` | Engine band string |
| `bands.tier1_markers` | Count of `tier1` hits (after optional severity filter) |
| `bands.tier1_clarity` | Count of `tier1-clarity` (wordiness, not authorship) |
| `bands.other_signals` | All other listed issue types |
| `min_severity` | Filter applied to listed issues, if any |
| `issue_count_unfiltered` | Count before severity filter |
| `by_type` / `by_severity` | Histograms of listed issues |
| `samples` | Short quoted spans (+ suggestion when present) |
| `warnings` | Reliability and reporting cautions (shown first in text mode) |
| `reliability.too_short` | Below recommended word floor (~40) |
| `engine_raw` | Only with `--raw` — full upstream payload |

**Omitted by default (unsafe for agents):**

- `document_classification` (`HUMAN_ONLY` / `MIXED` / `AI_ONLY`)
- `class_probabilities`
- `confidence_category`

Escape hatches: `--raw` or `--json-engine` (stderr warns).

## CLI quality-of-life

| Flag | Role |
| --- | --- |
| `--quiet` | One line per file (cron); batch also prints summary line |
| `--summary-only` | Aggregate totals only (batch schema) |
| `--min-severity` | Filter listed issues; score unchanged |
| `--sample-limit` / `--no-samples` | Control sample size |
| multi-file args | Batch report + summary |
| `--fail-above` / `--strict-short` | Exit 3 / 2 |

## Severity map (`critical` / `high` / `medium` / `low`)

The engine maps its four severity values to P-labels in `SEVERITY_LABELS`:
`critical` = P0, `high` = P1, `medium` = P2, `low` = P3. The counts below were
read off the vendored engine at the pinned tip, so they stay true to that pin.
`--min-severity high` gates the first two bands.

| Severity | Count | Types |
| --- | --- | --- |
| `critical` (P0) | 9 | `ai-citation-markup`, `ai-placeholder`, `ai-utm-source`, `chatbot`, `cutoff-disclaimer`, `normalization-flag`, `reasoning-artifact`, `sycophantic`, `vague-attribution` |
| `high` (P1) | 16 | `bullet-np-list`, `fake-casual-prop`, `fnword-trigram-entropy`, `formulaic-opener`, `future-narrative`, `hedge-stack`, `launch-intro`, `negation-chain`, `negative-parallelism`, `normalization-flag`, `significance-inflation`, `social-cta-closer`, `speculative-opener`, `template-phrase`, `tier1`, `tier3-phrase-cluster` |
| `medium` (P2) | 26 | `cross-para-burstiness`, `crowd-contrast`, `dev-blog-boilerplate`, `em-dash`, `false-concession`, `filler`, `fnword-trigram-entropy`, `formatting`, `generic-conclusion`, `hashtag-stuff`, `hollow-intensifier`, `lets-construction`, `lingering-attention`, `novelty-inflation`, `parenthetical-hedge`, `performed-insight`, `punct-distribution`, `real-actual-inflation`, `rhetorical-question`, `tier1-clarity`, `tier2`, `tier3-phrase`, `title-case-header`, `transition`, `uniformity`, `unnecessary-hyphenation` |
| `low` (P3) | 6 | `confidence-calibration`, `emotional-flatline`, `low-ttr`, `smart-punct-signature`, `tier3`, `uniformity` |

The counts are types that can emit that band, so a type present in two bands
appears twice. Three types emit more than one severity, so a type alone does not
fix a band: `normalization-flag` (roleplay markers are P1, zero-width and
homoglyph characters are P0), `fnword-trigram-entropy` (P1 when one trigram
repeats across the document, P2 at low entropy), and `uniformity` (P2 for
sentence length, P3 for paragraph length).

Style-only types carry zero authorship weight in the engine's `ISSUE_WEIGHTS`:
`em-dash`, `emotional-flatline`, `smart-punct-signature`, and
`unnecessary-hyphenation`. They still count toward finding totals and any
count-based gate, and they cannot move the score, label, probabilities,
classification, or confidence. `smart-punct-signature` is the narrowest of the
four: it reports only in `plain` source mode, always at `low` severity, and
never corroborates the classifier. Filter by type or severity when only
higher-priority findings should block a file.

Regenerate the bands after any engine absorb with
`node scripts/severity-bands.js`, which reads the vendored `scripts/patterns.js`.
That output is the source for this table.

Engine severity and the editorial P-tiers are not the same ladder. A type can sit
lower in the engine than its prose rule suggests (`real-actual-inflation` is P2
here while the writing rules group it with P1 vocabulary work). Gate on
`--min-severity` and read the band from the engine table above.

## Validate exit codes

| Code | Meaning |
| --- | --- |
| 0 | OK |
| 1 | Preservation errors |
| 2 | Usage / Node version / bad `--residual-policy` value |
| 4 | Warnings only + `--fail-on-warnings` |

## Residual policy

`validate()` returns `preservation` (mechanical damage: code, frontmatter,
blockquotes, table cells, inline code, URLs, paths, heading structure) separately
from `quality` (residual pattern growth). Two policies:

| Policy | Mechanical errors | Residual growth |
| --- | --- | --- |
| `error` (default, unchanged) | block, exit 1 | block, exit 1 |
| `warn` (`--residual-policy warn`) | block, exit 1 | reported as a review warning, exit 0 |

Use `warn` for an editorial pass that is allowed to leave a pattern in place on
purpose: a growing count is a quality signal, not proof of content damage.
Neither policy verifies meaning; claims, numbers, and scope still need a
separate read. Upstream `--residual-policy` landed with v3.24.0-era tip `bdeb726`
(#204).

## Exit codes (`analyze.js`)

| Code | Meaning |
| --- | --- |
| 0 | Ran successfully |
| 1 | Usage / Node version / IO error |
| 2 | `--strict-short` and input below recommended length |
| 3 | `--fail-above N` and `score >= N` (any file in a batch) |

## What the score is not

- Not proof a human or a model wrote the text
- Not calibrated like a production classifier product
- Not a target to minimize for "undetectable" output
- Not a substitute for provenance

## Bounded scan time

The engine scans adversarial Markdown in bounded time. A long whitespace run
after a table delimiter (`-|-`) or a thematic break (`***`) used to trigger
quadratic backtracking in the sentence-unit regex, so a 64 KB input took seconds
before the word limit applied. The pinned engine matches each whitespace run one
way, so those shapes scan in milliseconds with identical findings. A large input
still meets the documented word limit below, so treat a slow scan as an input
problem first, and run `node scripts/v3418-probe.js` when a timing regression is
suspected.

## Long documents (over 10,000 words)

The vendored engine refuses text over 10,000 words: label `Text too long`,
score 0, no issues. Reported as-is that reads like a clean zero, so this
package scores those documents instead. It splits the text on paragraph
boundaries into chunks of at most 4,000 words, scans each chunk, and combines
the accepted chunks with a word-weighted average, rounded. Issue categories are
counted across every accepted chunk. The algorithm mirrors upstream
`scripts/self-scan.js` (#382), so this package and the upstream self-scan tool
agree on a long document.

- A chunk below the reliable length is excluded and counted in
  `long_document.chunks_unscored`; the report warns when that count is above
  zero.
- A chunk in an unsupported script declines the whole document: score 0, label
  `Unsupported script`, `long_document.declined` true, and a warning. That is
  not a completed scan.
- A document with no blank-line paragraph breaks cannot be chunked. The engine
  refusal stands and the report warns that the input was never scanned.
- `word_count` is the words of the accepted chunks, which is less than the file
  length when a chunk was excluded.

## Known calibration limits (upstream research, avoid-ai-writing v3.22+)

1. Composite score can be weak at class separation.
2. Much of the 0–100 range may go unused on ordinary paragraphs.
3. Em-dash rate can invert as an authorship signal.
4. Tier 1B clarity words fire on ordinary professional prose.
5. Register dominates false positives.
6. Judgment-only rules are missing from the engine (categories section C).

## How to report results

1. Warnings first when short or clarity-only.
2. Separate Tier 1A markers from Tier 1B clarity.
3. Name `context_mode`.
4. State: mechanical signals only.
5. Offer humanizer for quality rewrite — without score-chasing.
