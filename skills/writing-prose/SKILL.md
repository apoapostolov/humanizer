---
name: writing-prose
category: writing
description: "Draft/revise reader-facing prose with the vale house gate; articles, docs, criticism."
version: 1.1.0
tags:
- prose
- revision
- style-guide
- vale
- lint
related_skills:
- simple-english
- humanizer
- ai-writing-detector
- markdown-lint
- writing-skills-maintenance
---

<!-- markdownlint-disable MD013 -->

# Writing Prose (vale-gated)

## Purpose

Prose that fits the medium, the task, and the reader. The vale gate catches
mechanical issues deterministically (spelling, em dashes, word choice,
repetition). The editorial rules catch what a linter cannot: specificity,
regularity, voice, fact discipline. Vale is a gate, not a writer. It never
replaces the editorial pass.

Human voice comes from selection, relationships, judgment, and fit to the
reader. It does not come from maximizing sentence variation or clearing every
warning a tool can produce.

## When to use

Reader-facing prose: articles, blog posts, docs, criticism, reports, long
replies. Anything a human will read and judge for quality.

When not to use:

- Strict technical docs, procedures, error messages, release notes: use
  `simple-english` (STE) with `ste_lint.py` instead.
- "Make this sound human" rewrites of AI text: use `humanizer`.
- Mechanical AI-signal catalogs or scoring: use `ai-writing-detector`. For
  editorial pattern diagnosis, use the references in this skill or `humanizer`.

## Tooling

- vale binary: WSL `~/.local/bin/vale`; Win11 via winget (`errata-ai.Vale`).
  The latest release is tracked as ingest source #1; pins live in the
  repository root `SOURCES.md` (not here).
- Gate script (WSL): `scripts/vale-lint.sh` runs vale with the house config at
  warning level. Exit 0 = no error-level violations. Warnings are shown but do
  not block the exit code.
- Direct invocation (any platform):
  `vale --config vale/vale.ini --minAlertLevel=warning <file>`. On Win11 pass
  the absolute config path:
  `~/.config/agents/skills/writing-prose/vale/vale.ini`.
- House config: `vale/vale.ini`. Styles: `vale/styles/`.

## Workflow

1. Identify the medium, audience, reader need, and job of the text.
2. Draft for that context, not for an abstract idea of good writing.
3. Mechanical pass (gate): run `scripts/vale-lint.sh <file>`. Fix house-format
   errors. Review each warning (word choice, AI slop, passive voice, sentence
   length) and change only what harms the text. Re-run until errors are clear
   and every remaining warning has an intentional reason to stay.
4. Editorial pass: run the required checks
   (`references/required-checks.md`), all ten tripwires.
5. Cut what is generic, ceremonial, over-engineered, or too cleanly modular.

## House style (what the gate enforces)

Custom rules in `vale/styles/HermesHouse/`:

| Rule | Level | Enforces |
| --- | --- | --- |
| EmDash | error | No em dash anywhere. Hard house rule: use a period, comma, colon, or restructure. |
| WordChoice | warning | STE-flavored plain words: utilize->use, leverage->use, prior to->before, initiate->start, demonstrate->show, in order to->to. |
| AiSlop | warning | Marketing and AI-slop words: delve, seamless, empower, supercharge, game-changer, "it is important to note", "circle back". |
| Weasel | suggestion | Vague intensifiers: very, really, quite, essentially, basically. |

From the Microsoft style (whitelisted): Passive, SentenceLength (< 30 words),
HeadingPunctuation, Acronyms. Everything else is disabled so each issue is
reported once by one voice.

From the Vale built-in style: Spelling (US English, with the Hermes vocab
accept-list) and Repetition.

## Vocab

Add domain terms to `vale/styles/config/vocabularies/Hermes/accept.txt` so
Spelling does not flag them. Common stack terms (Jellyfin, Prowlarr, WSL, ...)
are pre-loaded. The `Hermes` vocab name is a project label, not an
endorsement; rename it to match your own stack if you prefer.

## Per-project overrides

Copy `vale/vale.ini` to the project root, adjust, then run
`vale --config .vale.ini .`. To relax one rule for a project:
`HermesHouse.EmDash = NO` in the project section. To add a style pack: list it
in `Packages`, add it to `BasedOnStyles`, run `vale sync`.

## Editorial core

Salvaged from the legacy `writing` skill. These are the quality rules the
linter cannot see. They are mandatory, not optional.

1. **Anchor to the actual context before drafting.** Decide the text type,
   audience, register, and the answer or next action the reader needs. A reply
   that could be pasted into any thread is generic even when the prose is
   clean. Keep register stable across the piece.
2. **Fit the format to the medium.** Over-structuring casual writing feels
   formulaic. Under-structuring technical writing is hard to use. Match the
   format, do not obey a global ban on bullets or headers.
3. **Prefer concrete specificity over polished generality.** Each substantial
   passage needs a concrete anchor: a proper noun, a specific number, a direct
   quote, a named decision, a checkable detail, or a clear relationship to an
   anchor established nearby. Do not force a new fact into every paragraph.
   Vague intensifiers (essentially, fundamentally, ultimately) and bare
   milestone names do not count.
4. **Specificity must be earned.** Fewer verified facts beat many guessed
   ones. No invented milestone names, synthetic quotes, or decorative
   factuality. Do not narrate hidden mechanisms as fact. Treat exact quotes,
   public metrics, and causal claims as high-fragility facts: if the source is
   weaker, narrow the claim or cut it.
5. **Use plain words. Allow ordinary repetition. Prefer verbs.** Do not chase
   synonyms for problem, change, system, work, people. Prefer "we changed it"
   to "the implementation of the change".
6. **Cohere through reference and sentence shape.** Pronouns and continued
   reference beat restating the full frame. Justify signpost openers
   (Furthermore, Moreover, Importantly) instead of using them as defaults.
   Let closely related thoughts share a sentence; use a period for a real
   pause, not where an adjacent thought happened to arrive.
7. **Do not perform.** No keynote cadence, mission-statement phrasing,
   applause-line endings, or ceremonial wrap-ups. No service-desk tone: no
   "Great question", no "I hope this helps". Start where the answer starts.
   Stop where the answer stops.
8. **Calibrate confidence, stance, and voice to genre.** Be confident where
   evidence is strong, explicit where it is weak. Let the writer appear where
   the genre expects a writer (review, opinion, comment reply); keep
   neutrality where the genre expects it (summary, documentation, news).
9. **Show concrete things before generalizing.** Do not open with abstract
   diagnosis. Order: what happened, where the pattern appeared, what
   constraint mattered, what failed or changed, what it seems to mean.
10. **Watch regularity.** Repeated parallel enumeration, concession-plus-
    positive rhythm ("not X, but Y"), paragraph-closing definitions, one neat
    claim sentence at the top of every paragraph, the same punctuation move in
    every paragraph: these read as machine output. Break the pattern where it
    starts to dominate. Do not over-correct into false crispness (splitting
    every clause into its own sentence).
11. **Let the thought develop when the material supports it.** Longer pieces
    should not feel pre-solved, but do not manufacture hesitation, asides, or
    digressions to imitate a person. A cumulative sentence can carry the claim
    plus its reason.
12. **Choose structure consciously for longer pieces.** Default genre shapes
    are not wrong, only wrong by reflex. For retrospectives and criticism
    avoid starting-state -> changes -> verdict and one-bucket-per-paragraph.
    Pick a through-line: one complaint that stopped mattering, one system that
    changed the rest.
13. **Do not turn a piece into catalog prose.** If a paragraph is mainly
    names, milestones, and feature nouns, it is catalog prose. Cross-wire
    paragraphs so they depend on each other instead of sitting like labeled
    boxes.
14. **Revise by reading and cutting.** Re-read as a first-time reader. Cut
    anything that is auditioning. Most edits make the text shorter; combining
    two tightly related sentences can be the cleaner edit when it restores the
    relationship between thoughts.

## Skill boundaries

- Use `humanizer` when preserving or matching a particular writer's voice is
  the main job.
- Use `simple-english` strict mode for procedures, safety text, and errors.
- Use this skill for broader reader-facing prose and section-level product copy.
- Use `ai-writing-detector` only for mechanical signals or preservation checks.
- For a mixed document, route sections by job. Do not run every skill across the
  whole file in sequence; each pass can erase decisions made by the previous
  one.

## Required checks

`references/required-checks.md`: ten tripwires (register fit, concrete-anchor
audit, fact discipline, source-fit, regularity and sentence-continuity,
repeated-frame, stance and voice, developed thought, shape and spine,
over-correction). Run for every piece; longer pieces run all ten. Do not
output the audit unless asked.

## References (absorbed from the legacy writing skill)

- `references/examples.md`: useful corrections to read when a paragraph feels
  generic, puffy, vague, choppy, or over-regular
- `references/long-form-diagnostics.md`: optional deeper diagnostics when the
  required checks passed but longer work still feels off
- `references/formula-watchlist.md`: repeated formula and fallback jargon scan
- `references/provenance.md`: authorship-adjudication guidance for
  high-stakes contexts (read only when an authorship claim is at stake)
- `references/book-writer.md`: long-form manuscript and book writing support
- `references/book-development-estimator.md` (+ `book-development-estimator/`)
  Cost and stage modeling for Markdown book projects (token models, hybrid
  routing, break-even)
- `references/llm-rewrite-cost-patterns.md`: cost estimation for
  ingest-reasoning-rewrite loops over large documents

## Pitfalls

- vale exits nonzero only on error-level findings. Warnings display but do not
  change the exit code: review each one anyway.
- Punctuation is stripped from `scope: text`. Em-dash rules need plain tokens
  with `nonword: true` (or `scope: raw`).
- The Vocab accept-list lives at `styles/config/vocabularies/<Name>/accept.txt`,
  not `styles/Vocab/`. Missing it aborts the run with a runtime error.
- Built-in Vale style rules need `BasedOnStyles = ..., Vale` and capital keys
  (`Vale.Spelling = YES`). Lowercase keys silently do nothing.
- Microsoft rules are all enabled by default when the style is in
  BasedOnStyles. Whitelist explicitly (Microsoft.X = NO) or you get double
  flags on the same word from Microsoft.Wordiness and HermesHouse.WordChoice.
- The Microsoft pack is fetched by `vale sync` (Packages = Microsoft in the
  `.ini`). Re-sync after a Vale upgrade.
- Do not let the gate become the editor. It cannot judge specificity,
  regularity, voice, or facts. The editorial pass is mandatory.
- Do not clear warnings by making prose uniformly short, explicit, or regular.
  A warning identifies a place to read again, not a required rewrite.

## Versioning & sources

This skill is packaged in the writing-skills repository (apoapostolov/humanizer
on GitHub)
alongside humanizer, simple-english, and ai-writing-detector. The package
version and the ingest pins for vale-cli/vale (ingest source #1) live in the
root `SOURCES.md`, not here. Bump policy: ingest-only work bumps patch;
a new packaging story bumps minor. The Microsoft style pack under
`vale/styles/Microsoft/` is a sync artifact from `vale sync`, refreshed on
vale release ingests.

## Related

- `simple-english`: strict STE for procedures and errors; flavored control for
  technical reference.
- `humanizer` / `ai-writing-detector`: voice rewrites and AI-signal scoring.
- `markdown-lint`: markdown formatting and syntax.
- `writing-skills-maintenance`: repository source ingest, Vale release updates,
  packaging, live sync.
