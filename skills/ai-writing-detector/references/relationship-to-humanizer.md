<!-- markdownlint-disable MD013 -->

# Relationship to humanizer and simple-english

This monorepo splits jobs on purpose.

| Skill | Job | Ships mechanical engine? |
| --- | --- | --- |
| **humanizer** | Natural voice, rewrite, editorial pattern catalog | No |
| **simple-english** | STE controlled tech prose + `voice_lint.py` | Yes (STE linter) |
| **ai-writing-detector** | Deterministic AI-writing *signals* + preservation validate | Yes (`patterns.js`, `validate.js`) |

## Why detector code is not inside humanizer

Humanizer's mission is better writing, not score minimization. Shipping a scorer
inside the rewrite skill invites:

- rewrite-to-green behavior
- treating hits as authorship proof
- cluttering the voice workflow with engine APIs

So humanizer keeps editorial detect/edit modes and points here for mechanical
scan and preservation checks.

## Recommended pipelines

1. **Audit only:** `ai-writing-detector` analyze → human decides from bands and
   samples (never from `document_classification`; default report omits it).
2. **Improve prose:** `humanizer` rewrite → optional `ai-writing-detector`
   validate on before/after if a file edit must protect code and structure.
3. **Docs / errors:** `simple-english` (+ voice-lint) rather than AI-signal scoring.
4. **Both voice and signals:** analyze first if useful, rewrite with humanizer,
   never reverse the goal into "clear the score."
5. **Regression:** `bash scripts/smoke.sh` after engine pin bumps.

## Shared ideas, different homes

| Idea | Lives in |
| --- | --- |
| Pattern catalog, voice, never-inject | humanizer |
| Tier 1A/1B *editorial* tables | humanizer `vocabulary-tiers.md` |
| Engine types including `tier1-clarity` | ai-writing-detector |
| STE sentence rules | simple-english |
| Hard em-dash ban as authorship proof | rejected in monorepo policy |
| Detector-score optimization / fake typos | rejected everywhere |

## Hand-off language

When analyze finishes and the user wants cleaner prose:

> Mechanical scan only. For a natural rewrite load humanizer. I will not
> optimize the text to chase this score.
