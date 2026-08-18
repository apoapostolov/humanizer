# Source and limits

## Source

Adapted from the public episode kit:

- Repo path: https://github.com/woosal1337/blog/tree/main/videos/ep01-the-cure-for-ai-slop
- Core skill text: `ste-writing-skill.md`
- Linter: `voice-lint.py`
- Experiments: `experiment-results.md`, `experiment-results-openai.md`
- Samples: `before-after-samples.md`

Official standard (free download; copyrighted; do not paste in full):

- https://asd-ste100.org (ASD-STE100 Issue 9+)

Adaptations:

- Skill name: `simple-english` (category `writing`; formerly plain-english, before that simplified-english)
- Hard ban on em dash (package house rule + common slop marker)
- Cross-links to `writing` and sibling `humanizer` so STE is not used for voice
  work
- Shipped in the `apoapostolov/humanizer` monorepo as `skills/plain-english/`
  (version **1.0.0**) alongside `skills/humanizer/`

## What the linter measures

Violations per 100 words (length-normalized), categories:

- long_sentence (>20w)
- semicolon
- contraction
- passive_voice
- ing_main_verb
- nominalization
- phrasal_verb
- banned_word (thesaurus bloat)
- marketing_adjective
- modal_hedge
- long_paragraph (>6 sentences)

Also reports em/en dash count as a slop marker (not always folded into the main total the same way across forks; treat it as a separate signal).

## What it is not

- Not certified ASD-STE100 compliance
- Does not judge whether technical nouns are correct
- Does not fix empty substance ("form of slop", not truth)
- n small in the published experiment (6 tasks x 4 conditions x 2 model families): directional evidence, not a universal proof
- Ban-word lists alone are an unreliable fix (model-dependent)

## Headline experiment (from kit)

| Condition | Claude sonnet | gpt-5.5 |
|---|---|---|
| baseline | 4.36 | 3.54 |
| banned-words list | 4.21 (-3%) | 2.14 (-40%) |
| Orwell's 6 rules | 2.48 (-43%) | 1.69 (-52%) |
| STE skill | 1.12 (-74%) | 1.76 (-50%) |

Claim safe to reuse: give the model a writing system and form-slop drops by about half or more on the models tested. STE was best or tied-best. Single-word bans are the least reliable tool.

## Reproduction note

The kit's `run-openai.py` needs companion files (`prompts.json`, condition system prompts, local `voice_lint` import) that were not all published in the same folder. This package ships the **linter + rules + results snapshots** only. Re-run experiments only if you rebuild that harness.
