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
version: 1.0.0
related_skills:
- writing-prose
- humanizer
- ai-writing-detector
---

# Simplified English (ASD-STE100)

Write **prose** in ASD-STE100 Simplified Technical English. Use for
documentation, READMEs, PR descriptions, error messages, release notes, and
comments.

**Not for:** code, identifiers, command syntax, marketing voice pieces, essays,
or anything that needs a strong personal voice. STE strips voice on purpose.

**Unlike** `writing-prose` / `humanizer` (natural human voice, anti-formula, keep
personality): this skill is a **controlled writing system** with mechanical
rules and a scoreable linter. Prefer this when the user wants plain technical
clarity or "not AI slop" on engineer-facing text. Prefer humanizer when the goal
is natural voice in essays, social, or long-form. Prefer sibling
`ai-writing-detector` only for mechanical AI-writing **signal scores** or
rewrite preservation checks — not for STE rewrites and not as authorship proof.

Source kit (episode materials, adapted):
[woosal1337/blog ep01](https://github.com/woosal1337/blog/tree/main/videos/ep01-the-cure-for-ai-slop).
Spec: free official ASD-STE100 at https://asd-ste100.org (copyrighted; do not
paste the full standard).

Skill version: **1.0.0** (package ship: apoapostolov/humanizer monorepo).

## When to use

- Make docs, README, PR text, errors, or release notes plain and non-sloppy
- Enforce controlled / simplified technical English
- Lint a draft for mechanical slop markers, then rewrite
- User says STE, simplified English, ASD-STE100, or "cure AI slop" on technical
  prose

## Modes

| Mode | Use for | Discipline |
| --- | --- | --- |
| **strict** | procedures, runbooks, safety, error messages | Every rule + both length caps |
| **STE-flavored** (default for most docs) | READMEs, PR descriptions, general docs | Sentence/paragraph, active voice, plain verbs; relax full dictionary lockdown so text stays usable |

Default to **STE-flavored** unless the text is a procedure, safety note, or
error message.

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
- American spelling.

### Verbs

- Active voice. "The parser reads the file", not "The file is read by the
  parser".
- Use a verb for an action. "Analyze the log", not "Perform an analysis of the
  log".
- No stacked auxiliaries. Not "it is important to note that this may help to
  improve". Write "This improves X".
- Avoid "-ing" as the main verb when a simple tense works.

### Sentences

- One instruction per sentence.
- Max **20** words for instructions; max **25** for descriptive sentences.
- No contractions. Use articles: a, an, the, this, these.

### Punctuation

- No semicolons. Write two sentences.
- **No em dash** (common slop marker; house rule in this package). Prefer period,
  comma, colon, or a short new sentence.
- Avoid en dash as a parenthetical stand-in.

### Structure

- One topic per paragraph; max six sentences.
- For steps: numbered vertical list, one action per item, imperative form.
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

4. Score = violations per 100 words. Lower is cleaner. Lint before and after; the
   **delta** is the signal.
5. Return the cleaned prose (and the lint summary only if the user wants it).

## Self-lint (before return)

1. Any sentence over 20 words (instruction) / 25 (descriptive)? Split it.
2. Any semicolon or em dash? Replace with a period or restructure.
3. Any contraction? Expand it.
4. Passive with a known actor? Make it active.
5. "-ing" main verb, nominalization ("perform an analysis"), or loose phrasal
   verb ("spin up")? Prefer a plain verb.
6. Same thing named two ways? Pick one name.

Mechanical rules are lintable and remove most form-slop. Full STE still needs
human judgment (right technical noun, whether a sentence makes sense). This
skill fixes **form**. It cannot make a hollow paragraph true.

## Guardrails

- Do not rewrite code, API names, flags, paths, or quoted error strings that must
  stay literal.
- Do not invent product claims to sound "cleaner".
- Do not apply STE voice to fiction, marketing manifesto, or personal essays
  unless the user insists.
- Linter is heuristic, not certified STE. Judgment rules of ASD-STE100 need a
  human.

## References

- [references/before-after-samples.md](references/before-after-samples.md) —
  real baseline vs STE examples
- [references/experiment-results.md](references/experiment-results.md) —
  cross-model headline
- [references/experiment-results-openai.md](references/experiment-results-openai.md)
  — gpt category breakdown
- [references/source-and-limits.md](references/source-and-limits.md) —
  attribution, what the linter does and does not do
- [scripts/ste_lint.py](scripts/ste_lint.py) — deterministic anti-slop linter

## Quick contrast

| Goal | Load |
| --- | --- |
| Plain tech docs / kill form-slop | **plain-english** |
| Natural human rewrite, keep voice | `humanizer` (sibling skill in this repo) |
| Broader prose craft / long-form | `writing-prose` |
