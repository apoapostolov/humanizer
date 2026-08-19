---
name: ai-writing-detector
category: writing
description: "Production AI-writing signal scan + preservation validate. Not evasion or authorship proof."
tags:
- detector
- ai-isms
- signals
- audit
- validate
version: 1.0.6
related_skills:
- humanizer
- simple-english
- writing
---

# AI writing detector

Production skill for **deterministic** AI-writing **signals** and rewrite
**preservation** checks.

This is not humanizer. Humanizer improves writing and voice. This skill measures
surface signals and protected-span integrity, then refuses to launder scores
into authorship claims.

## Mission

- Flag regex-detectable AI-writing patterns (vendored engine)
- Emit a **sanitized report** (`interpretation: signals_only`) by default
- Separate Tier 1A markers from Tier 1B clarity hits
- Validate rewrites did not trash code, URLs, tables, or structure
- Document calibration limits and judgment-only gaps

## Hard guardrails

- **Signals, not proof.** Never use output alone for academic integrity, hiring,
  discipline, or attribution.
- **Not detector evasion.** Do not minimize a score. Do not add typos or noise.
  Quality rewrites → `humanizer`. STE docs → `simple-english`.
- **Do not invent facts** to clear flags.
- Prefer clusters and reader impact over single weak hits.
- Default CLI/JSON **omits** authorship-shaped engine fields
  (`document_classification`, `class_probabilities`, `confidence_category`).
  Use `--raw` or `--json-engine` only when debugging the vendored engine.

## When to use

| Need | Load |
| --- | --- |
| Natural rewrite / voice | `humanizer` |
| STE / docs form control | `simple-english` |
| Score, issue list, category map | **this skill** |
| Preserve code/URLs/structure after edit | **this skill** (`validate`) |
| Cron / batch signal scan | **this skill** (`--quiet`, multi-file) |
| Authorship claim | provenance — not this score |

## When not to use

- User wants better prose, voice, or a rewrite → `humanizer`
- User wants STE/docs form control → `simple-english` (+ `voice_lint.py`)
- User asks “was this written by AI?” as a verdict → refuse; offer signals +
  provenance, not a classification label
- Text is a few words → report will mark `too_short`; do not call it clean
- You are tempted to edit only to lower the score → stop; that is evasion

## Modes

### analyze (default)

```bash
# From this skill directory (Node >= 18):
node scripts/analyze.js path/to/file.md
node scripts/analyze.js --json path/to/file.md
node scripts/analyze.js --json --raw path/to/file.md
node scripts/analyze.js --context technical file.md
node scripts/analyze.js --quiet file.md                 # one-line (cron)
node scripts/analyze.js --summary-only a.md b.md        # batch totals only
node scripts/analyze.js --min-severity high file.md
node scripts/analyze.js --fail-above 25 --json file.md  # exit 3 if score >= 25
node scripts/analyze.js --strict-short file.md          # exit 2 if too short
node scripts/analyze.js a.md b.md c.md                  # batch + summary
echo 'text' | node scripts/analyze.js --stdin
```

**Default report fields (schema `ai-writing-detector.analyze.v1`):**

- `interpretation: "signals_only"`
- `source`, `score`, `label`, `issue_count`, `word_count`, `context_mode`
- `bands.tier1_markers` / `bands.tier1_clarity` / `bands.other_signals`
- `by_type`, `by_severity`, `samples`, `warnings`, `reliability`
- `disclaimer`, `handoff`
- Multi-file: `ai-writing-detector.analyze.batch.v1` with **`summary`** totals
- **not** top-level `document_classification` / class probabilities

Human text puts **warnings first** (short-input trap visible before a low score)
and labels tier1 as 1A markers vs tier1-clarity as 1B.

### validate

```bash
node scripts/validate-cli.js original.md rewritten.md
node scripts/validate-cli.js --json original.md rewritten.md
node scripts/validate-cli.js --quiet original.md rewritten.md
node scripts/validate-cli.js --fail-on-warnings original.md rewritten.md
# exit 1 on errors; exit 4 on warnings-only if --fail-on-warnings
```

Errors: fenced code, frontmatter, blockquotes, table cells, inline code, URLs,
paths, heading structure, residual pattern count growing.  
Warnings: reworded headings, missing figures, large word drop.

### explain

- [references/categories.md](references/categories.md)
- [references/scoring-and-limits.md](references/scoring-and-limits.md)
- [references/measurement-notes.md](references/measurement-notes.md)
- [references/relationship-to-humanizer.md](references/relationship-to-humanizer.md)
- [references/examples.md](references/examples.md)
- [references/update-engine.md](references/update-engine.md)

### smoke / pin check / CI

```bash
bash scripts/smoke.sh
bash scripts/check-engine-pin.sh
npm run smoke
```

GitHub Actions: `.github/workflows/ai-writing-detector.yml` runs smoke on
changes under `skills/ai-writing-detector/`.

## Deliver

**analyze**

1. Sanitized report first (text, `--quiet`, `--summary-only`, or `--json`)
2. Lead with warnings + bands + clusters, not the number alone
3. Call out Tier 1B clarity separately from Tier 1A markers
4. Surface `reliability.too_short`
5. Never claim human-written or AI-written from the score
6. Rewrite request → humanizer (no score-chase)

**validate**

1. ok / errors / warnings (or quiet one-liner)
2. Exit 1 on errors; exit 4 on warnings if `--fail-on-warnings`

## Engine

Vendored from [conorbronsdon/avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing)
detector (MIT): `scripts/patterns.js`, `scripts/validate.js`.  
Package report layer: `scripts/report.js` (this skill — not upstream).  
Pin procedure: monorepo `SOURCES.md` + `scripts/check-engine-pin.sh` +
`references/update-engine.md`.  
Self-contained: no external clone required.

Requires **Node.js >= 18** (`package.json` engines). No npm dependencies.

Skill version: **1.0.6**. Engine pin: avoid-ai-writing **v3.25.0+tip** (`b504e20`, closing-fence blank guard).
