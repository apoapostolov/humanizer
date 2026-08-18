---
name: simple-english
category: writing
description: "STE (ASD-STE100) rewrite + ste-lint for docs, PRs, errors."
tags:
- ste
- simplified-technical-english
- asd-ste100
- anti-slop
- docs
- lint
version: 2.2.0
related_skills:
- writing-prose
- humanizer
- ai-writing-detector
---

<!-- markdownlint-disable MD013 MD029 MD034 -->

# Simple English (ASD-STE100)

Write technical prose with ASD-STE100 control. Use full control for
procedures, safety text, and errors. Use a lighter clarity pass for reference
documentation, PR descriptions, and technical sections inside mixed documents.

**Pi register: Worker.** Machines and procedures only. README and changelog
work bounces to `humanizer`. Chat with the primary user loads neither skill.

**Not for:** code, identifiers, command syntax, product voice, essays, personal
writing, or any section whose job is to persuade or carry a distinct voice. STE
strips voice on purpose.

**Unlike** `writing-prose` / `humanizer` (natural human voice, anti-formula,
keep personality): this skill is a **controlled writing system** with
mechanical rules and a measurable linter. Prefer this when the user wants plain
technical clarity or "not AI slop" on engineer-facing text. Prefer humanizer
when the goal is natural voice in essays, social, or long-form. Prefer sibling
`ai-writing-detector` only for mechanical AI-writing **signal scores** or
rewrite preservation checks. It is not for STE rewrites or authorship proof.

Source kit (episode materials, adapted):
[woosal1337/blog ep01](https://github.com/woosal1337/blog/tree/main/videos/ep01-the-cure-for-ai-slop).
Spec: ASD-STE100 Issue 9 (free official standard at https://asd-ste100.org,
copyrighted, do not paste the full standard). Additional adaptation from
AminBlg/SimpleEnglish and the Hermes optional-skill port
`optional-skills/creative/simple-english` (merged; see monorepo history).

Skill version: **2.2.0** (renamed from `plain-english`; package ship:
apoapostolov/humanizer repository).

## When to use

- Make procedures, technical docs, README reference sections, PR text, errors,
  or release notes plain and non-sloppy
- Enforce controlled / simplified technical English
- Lint a draft for mechanical slop markers, then rewrite
- User says STE, simplified English, ASD-STE100, or "cure AI slop" on technical
  prose
- User names a specific form consumer: error messages, runbooks, incident
  reports, release notes, agent instructions, translation prep, UI copy

## Modes

| Mode | Use for | Discipline |
| --- | --- | --- |
| **strict** | procedures, runbooks, safety, error messages | Every rule, both length caps, no contractions, approved vocabulary |
| **STE-flavored (pragmatic)** | technical explanations, reference docs, PR descriptions | Plain words and direct syntax; length and contraction findings require judgment, domain vocabulary stays |

Default to **STE-flavored** for technical prose. Full STE naming (strict mode)
means the ASD dictionary rules — in the practical sense, one word one meaning
with a fixed check/verify/set/delete vocabulary per document. For a mixed
document, apply it only to procedures and technical reference. Route product,
editorial, and personal sections to `humanizer` / `writing-prose`.

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
| Non-approved modal (should/would/may/might/could) | Replace per the modal ladder | Replace when the reader could read it as optional |

The linter cannot infer mode or intent. A reported item is not an automatic
failure in STE-flavored prose.

## Classify before drafting

| | Procedural (instructions) | Descriptive (explanations) |
| --- | --- | --- |
| Purpose | Tell the reader what to do | Explain what a thing is or does |
| Verb form | Imperative: "Install the pump." | Simple present/past/future |
| Sentence limit | **20 words** | **25 words** |
| Unit rule | One instruction per sentence | One topic per paragraph, max six sentences |

Do not mix the two in one passage. A "Getting started" section is procedural.
An "Architecture" section is descriptive. A note inside a procedure is
descriptive (25-word limit, no imperative).

## Rules

### 1. Words

- One name for one thing. Do not rename the same item mid-text (Rule 1.11).
- Prefer short common words: start (not begin/commence/initiate), use (not
  utilize/leverage), make sure (not ensure), before (not prior to), after (not
  subsequent to), about (not regarding/concerning), get (not obtain/acquire),
  show (not demonstrate), also (not additionally/furthermore/moreover).
- Technical nouns and verbs are legal as their own part of speech; never use a
  technical noun as a verb ("webhook the event" is wrong; "send the event to
  the webhook" is right) and never a technical verb as a noun.
- Multi-word technical nouns: three words or fewer; longer chains break with
  prepositions ("the timeout value for the connection pool", not "the
  connection pool timeout configuration value").
- One meaning per word in context. "Fall" means move down, not decrease.
- No marketing adjectives: seamless, robust, powerful, cutting-edge,
  effortless, world-class, next-generation, revolutionary, and peers (see
  linter list).
- Follow the project's established spelling. Default to American spelling only
  when the project has no stated or visible convention.

### 2. Verbs

- Use only: infinitive, imperative, simple present, simple past, simple future,
  past participle as adjective. No present perfect, no "is to be installed".
- **Approved modals: can, will, must. Banned: should, would, may, might,
  could** (Rule 3.2). "Should" reads as optional to models and tired humans;
  a requirement becomes "must", a suggestion becomes a fact or is deleted.
- Use an "-ing" form only as a technical noun or inside one ("logging", "the
  mounting bracket"), never as a verb. No progressive passive ("is being
  rebuilt" -> "rebuilds").
- Prefer active voice when the actor matters: "The parser reads the file."
  Passive voice stays when the actor is unknown, irrelevant, or less important
  than the result (Rule 3.6).
- Use a verb for an action. "Analyze the log", not "Perform an analysis of the
  log" (Rule 3.7).
- No stacked auxiliaries. Not "it is important to note that this may help to
  improve". Write "This improves X".
- Review "-ing" as the main verb. Prefer a simple tense when it is clearer, not
  as a mechanical substitution.

### 3. Sentences

- In strict mode, use one instruction per sentence (Rule 5.2), max **20** words
  for instructions and **25** for descriptive sentences (Rules 5.1, 6.3).
- In strict mode, expand contractions and write complete grammar: keep
  articles, keep "that". STE is short sentences with complete grammar, not
  telegraph style. "Make sure that the file exists", not "Ensure file exists"
  (Rule 4.2).
- In STE-flavored prose, contractions are allowed; keep closely related
  thoughts together when splitting creates false crispness or a staccato
  rhythm.
- Use articles: a, an, the, this, these (Rule 4.5).
- Put a required condition before its command: "If the build fails, read the
  log" (Rule 5.4). Search every "if"/"when" — each stands at the START of its
  sentence, before the command.

### 4. Punctuation and word count

- **No semicolon** in strict mode (Rule 8.1). Write two sentences instead.
- **No em dash** (common slop marker; house rule in this package). Prefer
  period, comma, colon, or a short new sentence. Avoid en dash as a
  parenthetical stand-in.
- Parentheses are legal for references, item numbers, abbreviations, plural
  forms, explanations, alternatives (Rule 8.3).
- **Word counting** (Rules 8.4-8.7): in a vertical list the lead-in colon ends
  a sentence; text inside parentheses counts as one word; numbers, numbers with
  units, abbreviations, alphanumeric identifiers, quoted text, titles, labels,
  proper nouns each count as one word; a hyphenated word counts as one word.
  So `sqlpipe run --config sqlpipe.yaml` in backticks counts as one word; long
  identifiers do not blow the sentence budget.

### 5. Structure

- In strict mode, one topic per paragraph, at most six sentences (Rules 6.5,
  6.6); one new fact per sentence (Rule 6.1).
- For steps, use a numbered vertical list with one action per item.
- Notes give information, never instructions (Rule 5.5). Notes get the
  25-word limit.
- Warnings and cautions: command or condition FIRST, risk or result second
  (Rules 7.1-7.3). "CAUTION: Do not use the `--force` flag against production.
  The flag deletes rows that do not match the source." Never bury the
  instruction after the explanation.

### 6. Vocabulary discipline (strict mode) + slop table

The official ASD-STE100 dictionary (~900 approved words, ~1,200 banned with
alternatives) is copyrighted and not reproduced here. Its mechanics apply
without it: **one word, one meaning, one part of speech** (Rules 1.1-1.14).

Known part-of-speech rulings that agents break most: test/check/work are nouns
("Do a test", "make sure that X"); run/execute are rejected verbs (use
"operate"/"do", or pick one in pragmatic mode); remove is approved; delete/drop
as verbs are rejected (use "erase" for data, "remove" for physical); display/
render are rejected (use "show"); ensure/confirm/verify are rejected as verbs
(use "make sure that" in strict mode; pick one in pragmatic mode).

| Slop word | Write instead |
| --- | --- |
| leverage, utilize | use |
| in order to | to |
| prior to | before |
| it is worth noting that | (delete) |
| it's important to, crucially | (delete — state the fact) |
| simply, just, easily, seamlessly, effortlessly | (delete) |
| robust, powerful, comprehensive, performant | (delete, or give the measurable property) |
| functionality | function, feature |
| enables you to, allows you to | you can |
| is designed to, aims to | (delete — say what it does) |
| facilitate | help, make possible |
| dive into, delve into | read, examine |
| when it comes to | for |
| in the event that | if |
| due to the fact that | because |
| as needed, as necessary | (state the condition) |
| and/or | pick one, or write "X, or Y, or both" |
| optimally, gracefully handles | (say what it does: "retries three times, then stops") |
| out of the box | by default |
| under the hood | internally |
| blazingly fast, state-of-the-art | fast (give the number) / (delete) |
| streamline | make simpler, make faster |
| plethora, myriad | many |
| addresses the issue, tackles | corrects the fault, removes the error |

If the word carries no fact, delete it instead of replacing it.

**Modal ladder** (Rule 3.2):

| You wrote | STE writes |
| --- | --- |
| should (requirement) | must |
| should (recommendation) | delete it, or state it as fact |
| may / might / could (possibility) | can |
| may (permission) | can |
| would (hypothetical) | restructure: "If X occurs, Y occurs" |

**Consistency pass** (Rules 1.11, 9.4): collapse synonym rotations to one term.
Pick ONE and keep it: config/configuration/settings/options.
Pick ONE: check/verify/confirm/ensure (strict: "make sure that").
Pick ONE: run/execute/operate.

### 7. Delivery

Write only the requested text. No preamble, no summary, no closing remarks
unless the user asked for commentary.

## Beyond documentation

Same rules, different targets. Full adaptations in
[`references/use-cases.md`](references/use-cases.md):

- **Error messages**: state what happened (simple past), the cause if known,
  then the fix as an imperative. No "Oops", no "Please ensure", no apology
  filler: "Connection to the database failed. The password for user `app` was
  not correct. Set `DB_PASSWORD` and connect again."
- **Runbooks**: STE's home turf. Imperative steps, conditions first, warnings
  before the step.
- **Incident reports**: simple past only. "Between 14:02 and 14:31 UTC, 12% of
  requests failed", not "We have identified an issue that may have impacted..."
- **Release notes**: breaking changes follow the warning pattern, command
  first, risk second.
- **Agent instructions (prompts, AGENTS.md)**: a system prompt is a procedure
  for a reader that cannot ask questions. One instruction per sentence, no
  "should", condition first. Models read "should" as optional.
- **Translation prep**: STE's original job. One meaning per word plus complete
  grammar removes most translation ambiguity.

## Workflow

1. Identify genre (README, PR, error, procedure, API note) and pick **strict**
   or **STE-flavored**.
2. Classify each passage as procedural or descriptive; keep the two unmixed.
3. Draft or rewrite under the rules above. In strict mode, pick your one
   check-verb and one config-noun before drafting (consistency pass).
4. Self-lint (below), then run the script when the draft is non-trivial:

```bash
# From this skill directory (repo or install):
python3 scripts/ste_lint.py path/to/draft.md
python3 scripts/ste_lint.py < draft.md

# Install path (if installed under writing/):
python3 ~/.hermes/skills/writing/simple-english/scripts/ste_lint.py path/to/draft.md
```

5. Score = findings per 100 words. In strict mode, use the delta as a form
   signal. In STE-flavored mode, review each finding in context; lower is not
   automatically better.
6. Return the cleaned prose (and the lint summary only if the user wants it).
   For a full audit, run the verification checklist:
   `references/checklist.md` in check mode.

## Self-lint (before return)

1. Count words in the three longest sentences. Over 20 (procedural) or 25
   (descriptive) — split them.
2. Search for: contractions (`'ll`, `'re`, `'s`), `has been`/`have been`,
   `should`/`would`/`may`/`might`/`could`, `is being`/`are being`, "-ing" verbs
   after a comma, semicolons, `e.g.`/`i.e.`/`etc.`.
3. Search for every `if` and `when`. Each one stands at the START of its
   sentence, before the command.
4. Replace em dashes. In strict mode, replace semicolons and expand
   contractions.
5. Does passive voice hide an actor the reader needs? Make that actor active.
6. Same thing named two ways (check vs verify vs ensure; config vs settings)?
   Pick one.

Mechanical rules can be linted and remove most form-slop. Full STE still needs
human judgment (right technical noun, whether a sentence makes sense). This
skill fixes **form**. It cannot make a hollow paragraph true.

## Guardrails

- Do not rewrite code, API names, flags, paths, or quoted error strings that
  must stay literal (they count as one word each under Rule 8.6).
- Do not apply one whole-file score to a mixed README, proposal, or guide. Lint
  the procedural and technical sections where controlled form fits.
- Do not invent product claims to sound "cleaner".
- Do not split related thoughts or remove a writer's contractions only to lower
  the score.
- Do not replace an established spelling convention with the package default.
- Do not apply STE voice to fiction, marketing manifesto, or personal essays
  unless the user insists. When asked for STE on marketing text, say so and
  offer it for the docs instead.
- Linter is heuristic, not certified STE. Judgment rules of ASD-STE100 need a
  human. No tool can guarantee compliance; final approval rests with the
  writer.

Mode examples and mixed-document routing are in
[`references/mode-boundaries.md`](references/mode-boundaries.md).

## References

- [references/checklist.md](references/checklist.md): verification pass with
  searchable patterns, for check mode and final audits (added from upstream)
- [references/use-cases.md](references/use-cases.md): long-form adaptations —
  error messages, runbooks, incident reports, commits, UI copy, i18n (added
  from upstream)
- [references/before-after-samples.md](references/before-after-samples.md):
  real baseline vs STE examples
- [references/experiment-results.md](references/experiment-results.md):
  cross-model headline
- [references/experiment-results-openai.md](references/experiment-results-openai.md)
  GPT category breakdown
- [references/source-and-limits.md](references/source-and-limits.md):
  attribution, what the linter does and does not do
- [scripts/ste_lint.py](scripts/ste_lint.py): deterministic anti-slop linter

Rule citations reference the ASD-STE100 Issue 9 numbering (as adapted by the
upstream Hermes simple-english port); the practical substance is merged here.

## Quick contrast

| Goal | Load |
| --- | --- |
| Plain tech docs / kill form-slop | **simple-english** |
| Natural human rewrite, keep voice | `humanizer` (sibling skill in this repo) |
| Broader prose craft / long-form | `writing-prose` |