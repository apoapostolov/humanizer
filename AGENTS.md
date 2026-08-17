<!-- markdownlint-disable MD013 MD026 -->

# AGENTS.md

This document teaches AI agents how to maintain the `humanizer` skill over time.

The job is not only to edit files when asked. Keep the skill aligned with the
best available public practice for detecting and rewriting AI-sounding prose,
while avoiding low-quality "AI detector evasion" cargo cults.

**Source pins, last-ingested versions, clone paths, and the
"update humanizer sources" procedure live only in
[`SOURCES.md`](./SOURCES.md).** Do not duplicate them here.

## Mission

Maintain this repository as a high-quality humanizer skill that:

- tracks real changes in public best practices
- absorbs useful improvements from strong humanizer projects and prompts
- ignores low-signal anti-detector spam and SEO sludge
- preserves the repository's editorial standards and organization
- records checks and ingests in `SOURCES.md` (pins and timestamps)

This repository currently centers on:

- [`SOURCES.md`](./SOURCES.md): external source pins, version policy, ingest
  update procedure, packaged skill versions
- [`skills/humanizer/`](./skills/humanizer/): natural-voice humanizer skill
- [`skills/simple-english/`](./skills/simple-english/): STE simple-english skill
  (v2.0.0) + `ste_lint.py`
- [`skills/ai-writing-detector/`](./skills/ai-writing-detector/): production
  AI-writing signals + preservation validate (v1.0.5); batch summary + CI smoke;
  not a rewrite skill
- [`skills/writing-prose/`](./skills/writing-prose/): vale-gated prose craft
  (v1.1.0); editorial rules + deterministic lint gate; house style in `vale/`;
  ingest source vale-cli/vale tracked in `SOURCES.md`
- [`README.md`](./README.md): public docs and install
- [`CHANGELOG.md`](./CHANGELOG.md): user-facing release notes only

Do not turn this repository into a general prompt dump. Keep each writing skill
on one job: voice (humanizer), STE form (simple-english), mechanical signals
(ai-writing-detector), vale-gated prose craft (writing-prose).

Keep each installable skill self-contained under `skills/<name>/`. Do not place
runtime references or agent metadata at the repository root. Do **not** ship
third-party detector engines inside `skills/humanizer/`. Detector engines and
validate scripts belong only in `skills/ai-writing-detector/`.

The skills may cooperate, but they must not become a sequential filter stack.
Route by the job of each section. Simple English controls technical form;
humanizer preserves a writer; writing-prose shapes broader reader-facing prose.

## Source Of Truth Hierarchy

When updating the skill, trust sources in this order:

1. Current repository files and existing design intent
2. Tracked pins and policies in `SOURCES.md`
3. Wikipedia `Wikipedia:Signs_of_AI_writing`
4. High-quality public humanizer skills, prompts, and example sets
5. GitHub issues, discussions, and commit history around those projects
6. Social sources (X, Reddit) as weak discovery only

Do not elevate social chatter above concrete examples, documented heuristics, or
strong repository changes.

## Maintenance Principles

### 1. Prefer durable patterns over hype

Only adopt guidance that reflects stable writing behavior, not a passing meme.

### 2. Improve the skill, not just the wording

A good update usually lands in one of these buckets:

- new AI-writing tell worth teaching
- better rewrite workflow
- stronger audience or tone control
- better examples
- better evaluation criteria
- stronger guardrails against hype, vagueness, or fake specificity

### 3. Avoid detector-evasion sludge

Reject sources that frame the goal as "bypass AI detectors" without improving
writing quality.

Bad signals include:

- "100% undetectable" marketing
- claims without examples
- content farm SEO language
- advice that adds random typos or awkwardness to mimic humans
- advice that encourages deception rather than better writing

Standing rejects and on-hold items for tracked upstreams are listed in
`SOURCES.md`. Do not re-litigate them without new evidence.

### 4. Preserve repository quality

When updating:

- keep `skills/humanizer/SKILL.md` concise, imperative, and focused on routing
- keep `pattern-catalog.md` complete, ordered, and free of duplicate core text
- keep `examples.md` example-heavy and practical
- keep `humanizing-text.md` on the full editing workflow, not pattern taxonomy
- keep `agents/openai.yaml` aligned with the skill name and behavior
- keep `README.md` professional and install-focused
- keep `CHANGELOG.md` user-facing, not a development diary
- keep version pins and ingest procedure only in `SOURCES.md`

## Review Cadence

Run a maintenance review:

- before every release
- after any major public change to the Wikipedia page
- after meaningful upstream commits on tracked repos (see `SOURCES.md`)
- at least once per month if the project is active
- immediately if a user asks for a refresh based on current practice

If there is little signal, do not force a release. Still stamp
`last_checked_at` in `SOURCES.md` when you actually checked.

## Maintenance Workflow

### A. "Update humanizer sources"

Follow [`SOURCES.md`](./SOURCES.md) **Update procedure** only. That covers
fetch, pin diffs, ingest, patch version bump, live skill sync, and report
shape. Do not restate the pin list or steps here.

The report after a diff pass is not optional. Always include:

1. Opinion on each material improvement (**minor / moderate / major**) and what
   it enables here.
2. Rejected or held items with reasons.
3. **Conflicts** between old house rules and new upstream rules, with an
   explicit decision: change existing, ignore new, or hybrid, plus why.

Silent pin bumps without that judgment are incomplete.

### B. Full editorial / capability review

Use this when improving the skill beyond a pin-driven absorb.

#### 1. Inspect current package state

Read `SOURCES.md`, this file, `skills/humanizer/**`, `README.md`, and
`CHANGELOG.md`. Know what the skill already does before looking outward.

#### 2. Review sources via SOURCES.md

- For each `active_ingest` entry: fetch and diff after `last_ingested_ref`.
- Check `monitor` entries lightly.
- Update pins and timestamps in `SOURCES.md` only when you actually checked or
  ingested. Never invent newer pins.

#### 3. Wikipedia (when in scope)

Look for newly named tells, splits/merges, sharper heuristics, and stronger
examples. Ask: is it new here, better described here, or example-worthy?

#### 4. Evaluate candidates

**Adopt** when clear, durable, example-supported, writing-quality focused, and
new or materially better than what we have.

**Hold** when interesting but thin, genre-narrow, or heavy overlap.

**Reject** detector evasion, random errors, pure paraphrase of existing rules,
clarity/honesty loss, or fabricated specificity / fake personal voice.

Import the useful concept only. Rewrite it in this repository's style. Do not
copy blindly.

#### 5. Optional discovery (full reviews only)

GitHub search ideas:

```bash
gh search repos "humanizer in:name,description,readme" --limit 50 \
  --json name,owner,url,description,updatedAt,stargazersCount

gh search repos "\"Signs of AI writing\"" --limit 50 \
  --json name,owner,url,description,updatedAt,stargazersCount

gh search code "\"humanizer\" \"SKILL.md\"" --limit 50 \
  --json repository,path,url
```

Web patterns: `site:github.com humanizer "Signs of AI writing"`,
`site:github.com humanizer prompt "AI writing"`.

For promising projects, read issues, README, and commits about examples,
heuristics, workflow, or voice. Ignore vanity stars, empty forks, and marketing
noise.

X/Reddit are optional low-trust discovery. Escalate only with examples or repo
links; confirm against stronger sources before editing the skill.

#### 6. Map changes to files

| Change | File |
| --- | --- |
| Core workflow, modes, intake, guardrails, routing | `skills/humanizer/SKILL.md` |
| New or improved durable tells | `references/pattern-catalog.md` |
| Tier tables / phrase replacements | `references/vocabulary-tiers.md` |
| Detect/edit/severity/context/voice audit mechanics | `references/ai-ism-audit.md` |
| End-to-end edit sequence, voice, audience, tone | `references/humanizing-text.md` |
| Better before/after examples | `references/examples.md` |
| Silent post-edit QA checklist | `references/required-checks.md` |
| Extra long-form heuristics | `references/long-form-diagnostics.md` |
| Authorship vs style (high-stakes) | `skills/humanizer/references/provenance.md` |
| STE / plain tech docs / ste-lint | `skills/simple-english/**` |
| Display name / default prompt | `skills/*/agents/openai.yaml` |
| Install paths or public positioning | `README.md` |
| User-facing capability change | `CHANGELOG.md` |
| Pins, clone paths, ingest procedure, version bump policy | `SOURCES.md` only |

#### 7. Example upgrade rules

Upgrade an example only if it is genuinely better: clearer pattern isolation,
stronger rewrite, meaning preserved, transferable technique, real-genre prose.
Prefer concrete nouns, realistic genres, detection+rewrite teaching, and voice
preservation when relevant.

#### 8. Ship

When there are real improvements:

1. Patch skill files as mapped above
2. Update `SOURCES.md` pins/timestamps for sources you touched
3. Bump version per `SOURCES.md` policy (ingest-only = **patch only**)
4. Regenerate `agents/openai.yaml` if interface metadata may be stale
5. Update `README.md` only if public behavior or install changed
6. Add concise user-facing notes to `CHANGELOG.md`
7. Sync `skills/humanizer/` → `~/.hermes/skills/writing/humanizer/`
8. Commit; push/tag only when asked or when releasing

If the review finds nothing worth shipping: update `last_checked_at` in
`SOURCES.md` only. Do not manufacture a release.

## Anti-Regression Rules

Do not:

- bloat `SKILL.md` with catalogs or examples
- duplicate the same rule in core and a reference
- turn `examples.md` into an uncurated dump
- let `openai.yaml` drift from the core skill
- weaken the skill into generic "write better" advice
- confuse "natural" with sloppy or "human" with deceptive
- overfit to one model family
- duplicate `SOURCES.md` pin tables or update steps into this file

## Suggested Prompts

**Sources only:**

> Update humanizer sources per SOURCES.md. Diff after each last_ingested_ref,
> ingest meaningful improvements, bump patch only, sync the live skill, report
> pins.

**Full review:**

> Review the humanizer repo against SOURCES.md pins, Wikipedia Signs of AI
> writing, and optional GitHub discovery. Update only genuinely improved parts.
> Record checks in SOURCES.md. Keep CHANGELOG user-facing.

## Non-Negotiables

- Record external checks and ingests in `SOURCES.md`, not as a second register
  here
- Prefer better writing over detector evasion
- Compare against what the repository already does before adding anything
- Keep this repo curated, not crowded
