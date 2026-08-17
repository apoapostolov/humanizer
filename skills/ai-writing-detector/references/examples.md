<!-- markdownlint-disable MD013 -->

# Examples

## Analyze — marketing slop

```bash
node scripts/analyze.js --json fixtures/slop.md
```

Expect:

- `interpretation: "signals_only"`
- `bands.tier1_markers` ≥ 1
- no top-level `document_classification`
- non-empty `disclaimer`
- human text lists **warnings** before score when short

## Analyze — human ops note

```bash
node scripts/analyze.js fixtures/human-ops.md
```

Expect low or zero issues. Specific infra detail is not an AI tell.

## Analyze — too short

```bash
echo Hi | node scripts/analyze.js --json
```

Expect `reliability.too_short: true` and a warning. Do not read score 0 as
“clean human prose.”

## Analyze — quiet / batch / severity / summary

```bash
node scripts/analyze.js --quiet fixtures/slop.md
node scripts/analyze.js --json fixtures/slop.md fixtures/human-ops.md
node scripts/analyze.js --summary-only fixtures/slop.md fixtures/human-ops.md
node scripts/analyze.js --min-severity high fixtures/slop.md
```

Batch JSON uses schema `ai-writing-detector.analyze.batch.v1` and includes
`summary` (max/mean score, totals, too_short counts).  
`--min-severity` filters listed issues; **score stays full-run**.  
`--summary-only` drops per-file `results` in JSON.

## Validate — prose ok, code broken

```bash
node scripts/validate-cli.js fixtures/validate-before.md fixtures/validate-after-ok.md
# exit 0

node scripts/validate-cli.js --quiet fixtures/validate-before.md fixtures/validate-after-bad-code.md
# exit 1 — ok=0 errors=1 ...
```

## Agent delivery template (analyze)

```text
Signals only (not authorship). context=general words=N score=S label=...
WARN if too_short.
Bands: tier1_markers(1A)=A tier1_clarity(1B)=B other=C
Top types: ...
Samples: ...
Next: rewrite with humanizer if you want better prose — I will not score-chase.
```

## When not to load this skill

| User ask | Load instead |
| --- | --- |
| Make this sound human | humanizer |
| STE / plain docs | simple-english |
| Did AI write this? (verdict) | refuse verdict; optional signals + provenance |
| Lower the detector score | refuse evasion framing |
