# STE experiment results (cross-model)

First-party test from the ep01 kit: does forcing an LLM to write in ASD-STE100 reduce form-slop?

- 6 engineer-writing tasks: README, PR description, API docs, error message, getting-started, deprecation
- 4 conditions: baseline, banned-words list, Orwell's 6 rules, STE skill
- Metric: heuristic violations per 100 words (lower is cleaner)
- Models: Claude sonnet, OpenAI gpt-5.5

## Headline

| Condition | Claude sonnet | gpt-5.5 |
|---|---|---|
| baseline | 4.36 | 3.54 |
| ban-words | 4.21 (-3%) | 2.14 (-40%) |
| Orwell's 6 | 2.48 (-43%) | 1.69 (-52%) |
| **STE skill** | **1.12 (-74%)** | 1.76 (-50%) |

## What held across models

- STE cut form-slop on both families (large drop).
- A full writing system (Orwell or STE) beat baseline. STE was best on Claude and roughly tied with Orwell on gpt-5.5.

## What did not hold

- "Banning words does nothing" was mostly a Claude story. gpt-5.5 cut ~40% on ban-words alone.
- Models slop differently: Claude defaults show more flashy markers (em dashes, marketing adjectives, run-ons). gpt-5.5 defaults showed more passive voice and empty closers.
- On 1 of 6 tasks (API docs) STE scored slightly worse than baseline on gpt-5.5, partly because many short sentences can trip the long-paragraph heuristic.

## Caveats

- Heuristic linter, small n. Directional, not proof.
- per-100w is noisy on very short outputs.
- STE fixes form, not empty substance.

## Robust claim

Give the model a writing system and form-slop drops by half or more on every model in the kit. STE was best or tied-best. One-at-a-time word bans are the least reliable fix.
