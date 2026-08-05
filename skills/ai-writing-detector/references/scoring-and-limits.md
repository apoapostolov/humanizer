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

## Validate exit codes

| Code | Meaning |
| --- | --- |
| 0 | OK |
| 1 | Preservation errors |
| 2 | Usage / Node version |
| 4 | Warnings only + `--fail-on-warnings` |

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
