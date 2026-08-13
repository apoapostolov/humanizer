---
name: plain-english
category: writing
description: "STE simplified english rewrite for docs/PR/errors + ste-lint."
tags:
- ste
- simplified-technical-english
- anti-slop
- docs
- lint
version: 1.1.0
related_skills:
- writing-prose
- humanizer
- ai-writing-detector
---

<!-- markdownlint-disable MD013 MD029 MD034 -->

# Simplified English (ASD-STE100)

Write technical prose with ASD-STE100-inspired control. Use full control for
procedures, safety text, and errors. Use a lighter clarity pass for reference
documentation, PR descriptions, and technical sections inside mixed documents.

**Not for:** code, identifiers, command syntax, product voice, essays, personal
writing, or any section whose job is to persuade or carry a distinct voice. STE
strips voice on purpose.

**Unlike** `writing-prose` / `humanizer` (natural human voice, anti-formula, keep
personality): this skill is a **controlled writing system** with mechanical
rules and a measurable linter. Prefer this when the user wants plain technical
clarity or "not AI slop" on engineer-facing text. Prefer humanizer when the goal
is natural voice in essays, social, or long-form. Prefer sibling
`ai-writing-detector` only for mechanical AI-writing **signal scores** or
rewrite preservation checks. It is not for STE rewrites or authorship proof.

Source kit (episode materials, adapted):
[woosal1337/blog ep01](https://github.com/woosal1337/blog/tree/main/videos/ep01-the-cure-for-ai-slop).
Spec: free official ASD-STE100 at https://asd-ste100.org (copyrighted; do not
paste the full standard).

Skill version: **1.1.0** (package ship: apoapostolov/humanizer repository).

## When to use

- Make procedures, technical docs, README reference sections, PR text, errors,
  or release notes plain and non-sloppy
- Enforce controlled / simplified technical English
- Lint a draft for mechanical slop markers, then rewrite
- User says STE, simplified English, ASD-STE100, or "cure AI slop" on technical
  prose

## Modes

| Mode | Use for | Discipline |
| --- | --- | --- |
| **strict** | procedures, runbooks, safety, error messages | Every rule, both length caps, no contractions |
| **STE-flavored** | technical explanations, reference docs, PR descriptions | Plain words and direct syntax; length and contraction findings require judgment |

Default to **STE-flavored** for technical prose. For a mixed document, apply it
only to procedures and technical reference. Route product, editorial, and
personal sections to `humanizer` or `writing-prose`.

### Mode boundary

Strict mode controls form. STE-flavored mode diagnoses friction.

| Finding | Strict | STE-flavored |
| --- | --- | --- |
| Instruction over 20 words | Rewrite | Rewrite when the action is hard to follow |
| Description over 25 words | Rewrite | Review; keep when the relationship needs one sentence |
| Contraction | Expand | Keep when it matches the medium and audience |
| Two related ideas in one sentence | Split if they are separate actions | Keep together when splitting makes the prose choppy |
| Passive voice | Rewrite when the actor is known | Keep when the actor is unknown, irrelevant, or already clear |
| Semicolon | Replace | Review; keep only when it clarifies a close relationship and the house style permits it |

The linter cannot infer mode or intent. A reported item is not an automatic
failure in STE-flavored prose.

## Rules

### Words

- One name for one thing. Do not rename the same item mid-text.
- Prefer short common words: start (not begin/commence/initiate), use (not
  utilize/leverage), help (not facilitate), make sure (not ensure), before (not
  prior to), after (not subsequent to), about (not regarding/concerning), get
  (not obtain/acquire), show (not demonstrate), also (not
  additionally/furthermore/moreover).
- One meaning per word in context. Example: "fall" means move down, not decrease.
- No marketing adjectives: seamless, robust, powerful, cutting-edge, effortless,
  world-class, next-generation, revolutionary, and peers (see linter list).
- Follow the project's established spelling. Default to American spelling only
  when the project has no stated or visible convention.

### Verbs

- Prefer active voice when the actor matters: "The parser reads the file."
  Passive voice can stay when the actor is unknown, irrelevant, or less
  important than the result.
- Use a verb for an action. "Analyze the log", not "Perform an analysis of the
  log".
- No stacked auxiliaries. Not "it is important to note that this may help to
  improve". Write "This improves X".
- Review "-ing" as the main verb. Prefer a simple tense when it is clearer, not
  as a mechanical substitution.

### Sentences

- In strict mode, use one instruction per sentence.
- In strict mode, use at most **20** words for instructions and **25** for
  descriptive sentences.
- In strict mode, expand contractions. In STE-flavored prose, contractions are
  allowed when they fit the medium and surrounding voice.
- In STE-flavored prose, keep closely related thoughts together when splitting
  them would create false crispness or a staccato rhythm.
- Use articles: a, an, the, this, these.

### Punctuation

- In strict mode, replace semicolons. In STE-flavored prose, keep one only when
  it clarifies a close relationship and the surrounding house style permits it.
- **No em dash** (common slop marker; house rule in this package). Prefer period,
  comma, colon, or a short new sentence.
- Avoid en dash as a parenthetical stand-in.

### Structure

- In strict mode, use one topic per paragraph and at most six sentences.
- In STE-flavored prose, use one useful paragraph job; do not split a developed
  thought only to satisfy a sentence count.
- For steps, use a numbered vertical list with one action per item.
- Put a condition before its command.

### Delivery

Write only the requested text. No preamble, no summary, no closing remarks
unless the user asked for commentary.

## Workflow

1. Identify genre (README, PR, error, procedure, API note) and pick **strict** or
   **STE-flavored**.
2. Draft or rewrite under the rules above.
3. Self-lint (below), then run the script when the draft is non-trivial:

```bash
# From this skill directory (repo or install):
python3 scripts/ste_lint.py path/to/draft.md
python3 scripts/ste_lint.py < draft.md

# Install path (if installed under writing/):
python3 ~/.hermes/skills/writing/plain-english/scripts/ste_lint.py path/to/draft.md
```

4. Score = findings per 100 words. In strict mode, use the delta as a form
   signal. In STE-flavored mode, review each finding in context; lower is not
   automatically better.
5. Return the cleaned prose (and the lint summary only if the user wants it).

## Self-lint (before return)

1. In strict mode, split instructions over 20 words and descriptions over 25.
   In STE-flavored mode, split only when the sentence is hard to follow.
2. Replace em dashes. In strict mode, replace semicolons. In flavored mode,
   judge whether a semicolon carries a useful relationship.
3. In strict mode, expand contractions. In STE-flavored mode, keep natural ones.
4. Does passive voice hide an actor the reader needs? Make that actor active.
5. "-ing" main verb, `nominalization` ("perform an analysis"), or loose phrasal
   verb ("spin up")? Prefer a plain verb.
6. Same thing named two ways? Pick one name.

Mechanical rules can be linted and remove most form-slop. Full STE still needs
human judgment (right technical noun, whether a sentence makes sense). This
skill fixes **form**. It cannot make a hollow paragraph true.

## Guardrails

- Do not rewrite code, API names, flags, paths, or quoted error strings that must
  stay literal.
- Do not apply one whole-file score to a mixed README, proposal, or guide. Lint
  the procedural and technical sections where controlled form fits.
- Do not invent product claims to sound "cleaner".
- Do not split related thoughts or remove a writer's contractions only to lower
  the score.
- Do not replace an established spelling convention with the package default.
- Do not apply STE voice to fiction, marketing manifesto, or personal essays
  unless the user insists.
- Linter is heuristic, not certified STE. Judgment rules of ASD-STE100 need a
  human.

Mode examples and mixed-document routing are in
[`references/mode-boundaries.md`](references/mode-boundaries.md).

## References

- [references/before-after-samples.md](references/before-after-samples.md):
  real baseline vs STE examples
- [references/experiment-results.md](references/experiment-results.md):
  cross-model headline
- [references/experiment-results-openai.md](references/experiment-results-openai.md)
  GPT category breakdown
- [references/source-and-limits.md](references/source-and-limits.md):
  attribution, what the linter does and does not do
- [scripts/ste_lint.py](scripts/ste_lint.py): deterministic anti-slop linter

## Quick contrast

| Goal | Load |
| --- | --- |
| Plain tech docs / kill form-slop | **plain-english** |
| Natural human rewrite, keep voice | `humanizer` (sibling skill in this repo) |
| Broader prose craft / long-form | `writing-prose` |
