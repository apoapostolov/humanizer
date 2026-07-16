<!-- markdownlint-disable MD013 MD026 -->

# AGENTS.md

This document teaches AI agents how to maintain the `humanizer` skill over time.

The job is not only to edit files when asked. The real job is to keep the skill aligned with the best available public practice for detecting and rewriting AI-sounding prose, while avoiding low-quality "AI detector evasion" cargo cults.

## Mission

Maintain this repository as a high-quality humanizer skill that:

- tracks real changes in public best practices
- absorbs useful improvements from strong humanizer projects and prompts
- ignores low-signal anti-detector spam and SEO sludge
- preserves the repository's editorial standards and organization
- records when external sources were last reviewed

## Repository Scope

This repository currently centers on:

- [`skills/humanizer/SKILL.md`](./skills/humanizer/SKILL.md): concise skill
  routing, workflow, guardrails, and output contract
- [`skills/humanizer/agents/openai.yaml`](./skills/humanizer/agents/openai.yaml):
  OpenAI-facing display metadata and default prompt
- [`skills/humanizer/references/pattern-catalog.md`](./skills/humanizer/references/pattern-catalog.md):
  ordered 55-pattern diagnostic catalog and delivery-residue checks
- [`skills/humanizer/references/examples.md`](./skills/humanizer/references/examples.md):
  concrete before/after examples
- [`skills/humanizer/references/humanizing-text.md`](./skills/humanizer/references/humanizing-text.md):
  complete editing workflow, voice preservation, audience adaptation, and tone
  guidance
- [`README.md`](./README.md): public-facing documentation and installation guidance
- [`CHANGELOG.md`](./CHANGELOG.md): user-facing release notes only

Do not turn this repository into a general prompt dump. Keep it focused on maintaining one strong humanizer skill.

Keep the installable package self-contained under `skills/humanizer/`. Do not
place runtime references or agent metadata at the repository root.

## Source Of Truth Hierarchy

When updating the skill, trust sources in this order:

1. The current repository files and existing design intent
2. Wikipedia's `Wikipedia:Signs_of_AI_writing` page
3. High-quality public humanizer skills, prompts, and example sets
4. GitHub issues, discussions, and commit history around those projects
5. Social sources such as X and Reddit, but only as weak signals unless they provide concrete examples or links to better primary material

Do not elevate social chatter above concrete examples, documented heuristics, or strong repository changes.

## Maintenance Principles

### 1. Prefer durable patterns over hype

Only adopt new guidance when it reflects stable writing behavior, not a passing meme.

### 2. Improve the skill, not just the wording

A good update usually lands in one of these buckets:

- new AI-writing tell worth teaching
- better rewrite workflow
- stronger audience or tone control
- better examples
- better evaluation criteria
- stronger guardrails against hype, vagueness, or fake specificity

### 3. Avoid detector-evasion sludge

Reject sources that frame the goal as "bypass AI detectors" without improving writing quality.

Bad signals include:

- "100% undetectable" marketing
- claims without examples
- content farm SEO language
- advice that adds random typos or awkwardness to mimic humans
- advice that encourages deception rather than better writing

### 4. Preserve repository quality

When updating:

- keep `skills/humanizer/SKILL.md` concise, imperative, and focused on routing
- keep `skills/humanizer/references/pattern-catalog.md` complete, ordered,
  and free of duplicate core text
- keep `skills/humanizer/references/examples.md` example-heavy and practical
- keep `skills/humanizer/references/humanizing-text.md` focused on the complete
  editing workflow and calibration rather than pattern taxonomy
- keep `skills/humanizer/agents/openai.yaml` aligned with the current skill name
  and behavior; regenerate it with the skill-creator utility
- keep `README.md` professional and install-focused
- keep `CHANGELOG.md` user-facing, not development-log style

## Baseline Source Register

Update this section every time you perform a real maintenance review.

### Last repository maintenance review

- Last full external review: `2026-07-15T04:11:17-07:00`
- Last targeted Wikipedia history review: `2026-07-15T04:11:17-07:00`
- Last targeted skill-reference sync: `2026-07-16T12:41:17-07:00`
- Reviewer: AI agent
- Latest review scope: targeted audit of `conorbronsdon/avoid-ai-writing`,
  including its current skill, detector map, changelog, commit history, issues,
  and merged pull requests; other baseline sources were not refreshed

### Baseline sources already checked

#### 1. Wikipedia

- Source: `https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing`
- Role: primary taxonomy source for recurring AI-writing tells
- Last read: `2026-07-15T04:11:17-07:00`
- Last analyzed: `2026-07-15T04:11:17-07:00`
- Latest review notes:
  - Added the newer `X rather than Y` negative-parallelism form to the existing
    sentence-pattern guidance.
  - Added broadly useful formatting checks for unnecessary small tables, skipped
    heading levels, and decorative thematic breaks.
  - The expanded speculation-about-source-gaps guidance reinforced the rule
    against inventing privacy, motive, or biography when information is missing.
  - The page now stresses even more clearly that patterns are surface signals,
    not the underlying problem or reliable proof of authorship; the skill already
    follows that standard.
  - New Wikipedia markup, citation-bug, moderation, user-page, and permissions
    indicators remain platform-specific and were not imported.

#### 2. blader/humanizer

- Source: `https://github.com/blader/humanizer`
- Role: primary public upstream in the same skill family
- Last read: `2026-07-15T04:11:17-07:00`
- Last analyzed: `2026-07-15T04:11:17-07:00`
- Latest review notes:
  - Reviewed all commits since the March baseline through upstream version 2.8.2;
    the repository's latest content push was `2026-06-29T20:43:06Z`.
  - Adopted diff-anchored prose, manufactured punchline runs, aphorism formulas,
    fake-candid openers, speculative gap filling, and stronger cleanup-pass
    checks.
  - Voice calibration, content preservation, passive-voice nuance, and
    false-positive safeguards were already represented in this repository.
  - Recent issues reinforced the existing light-edit default for human-written
    input. Universal-audience appeals overlap with promotional language; casual
    intensifiers and isolated subjectless-fragment proposals remain on hold for
    stronger cross-source evidence.
  - Did not adopt the upstream hard ban on em and en dashes; this repository
    continues to judge punctuation in context.

#### 3. op7418/Humanizer-zh

- Source: `https://github.com/op7418/Humanizer-zh`
- Role: translation and derivative signal for how the skill is being extended or adapted
- Last read: `2026-07-15T04:11:17-07:00`
- Last analyzed: `2026-07-15T04:11:17-07:00`
- Latest review notes:
  - The repository has no content commits since `2026-01-19T07:46:35Z` and no
    commits after the previous baseline.
  - Its Chinese adaptation, core rules, 24-pattern catalog, scoring rubric, and
    examples added no durable general guidance missing from this skill.

#### 4. GitHub discovery search

- Source: GitHub repo and code search
- Role: discovery lane for new humanizer skills, prompts, examples, and discussions
- Last read: `2026-07-15T04:11:17-07:00`
- Last analyzed: `2026-07-15T04:11:17-07:00`
- Latest review notes:
  - Reviewed repository and code searches for humanizer skills, `SKILL.md`
    implementations, and references to Wikipedia's signs-of-AI page.
  - `orange2ai/renwei-writing` reinforced minimal intervention, treating rough
    edges as possible author fingerprints, and avoiding invented scene anchors.
  - `asavvin-pixel/unslop` contributed useful epistemic checks, replacement-tic
    detection, and the cleanup-pass uniformity idea.
  - `AIScientists-Dev/academic-humanizer` contributed evidence-strength, named
    baseline, and citation-relevance checks that generalize beyond academia.
  - Detector-focused projects that prescribe random disfluency, detector-scored
    variants, rigid punctuation quotas, or fabricated plausible specificity were
    rejected as detector-evasion guidance.

#### 5. Forbidden Lands writing voice anti-AI reference

- Source: `apoapostolov/Forbidden-Lands-2e`, `skills/forbidden-lands-writing-voice/references/anti-ai-humanizer.md`
- Role: source for the seven-layer failure model, 55-pattern catalog, enumeration standard, diagnostic checklist, and staged revision protocol
- Last read: `2026-07-15T04:11:17-07:00`
- Last analyzed: `2026-07-15T04:11:17-07:00`
- Integration notes:
  - Verified the reference is unchanged since commit `0dfac815` on
    `2026-07-14T20:09:44Z`; it added no content beyond the existing sync.
  - Port the general editing rules and preserve their pattern numbering.
  - Generalize manuscript-specific examples instead of importing Forbidden Lands lore or author emulation guidance.
  - Retain this repository's web, assistant-residue, attribution, formatting, and template checks alongside the 55-pattern model.

#### 6. conorbronsdon/avoid-ai-writing

- Source: `https://github.com/conorbronsdon/avoid-ai-writing`
- Role: source for publication fingerprints, conversational response residue,
  persuasive-template checks, and false-positive review practices
- Last read: `2026-07-16T12:41:17-07:00`
- Last analyzed: `2026-07-16T12:41:17-07:00`
- Latest review notes:
  - Reviewed the repository through version 3.16.0 and commit `af346121`, plus
    its detector category map, tests, changelog, issues, and merged pull requests.
  - Adopted checks for prompt and reasoning echoes, recap-flattery, speculative
    scenario openers, generic endorsement closers, novelty inflation, leaked
    citation or attachment tokens, and AI-added URL parameters.
  - Added a context-sensitive conversational-layout check and a clearer
    exclusion for quoted examples, code, and attributed excerpts.
  - Vague third-party validation, split negative pivots, evidence calibration,
    voice matching, and most formatting guidance were already covered.
  - Did not import the deterministic detector, tiered word blacklist, hard
    punctuation quotas, TTR thresholds, mandatory first person, edit-to-zero
    iteration, or list-label punctuation rule. These either optimize for
    detection, overgeneralize from weak signals, or conflict with contextual
    editing.
  - Held the new metaphorical `load-bearing` rule for observation. Its literal
    carve-out remains under active upstream discussion in issue 56.

## Review Cadence

Run a maintenance review:

- before every release
- after any major public change to the Wikipedia page
- after meaningful upstream commits in tracked humanizer repos
- at least once per month if the project is active
- immediately if a user asks for a refresh based on current practice

If there is little signal, do not force a release. Update the review timestamps anyway.

## Standard Maintenance Workflow

Follow this sequence.

### Step 1. Inspect the current repository state

Read:

- `skills/humanizer/SKILL.md`
- `skills/humanizer/agents/openai.yaml`
- `skills/humanizer/references/pattern-catalog.md`
- `skills/humanizer/references/examples.md`
- `skills/humanizer/references/humanizing-text.md`
- `README.md`
- `CHANGELOG.md`
- this `AGENTS.md`

Understand what the current skill already does before looking outward.

### Step 2. Refresh the source register

Record the current timestamp and then review the main sources. If a source was not actually checked, do not update its timestamps.

### Step 3. Review the Wikipedia page

Check the page for:

- newly named AI-writing patterns
- pattern splits or merges
- stronger wording around known tells
- examples that reveal a sharper or more durable heuristic
- formatting or communication patterns that have become more prominent

Questions to answer:

- Is there a genuinely new tell not represented in the pattern catalog?
- Is an existing tell better described than our current version?
- Is there a better example that belongs in
  `skills/humanizer/references/examples.md`?

### Step 4. Review tracked humanizer projects

Start with:

- `blader/humanizer`
- `op7418/Humanizer-zh`

Inspect:

- recent commits
- `SKILL.md`
- examples
- README installation changes if relevant

Look for:

- better examples
- stronger workflows
- more effective guardrails
- improved structure
- new prompt patterns worth adapting

Do not copy blindly. Import only the useful concept, then rewrite it in this repository's style.

### Step 5. Search GitHub for new candidates

Use GitHub search to find:

- repos named `humanizer`
- repos mentioning `Signs of AI writing`
- prompts that focus on removing AI writing patterns
- repos with strong README discussions or issue threads about AI-sounding prose

Useful `gh` commands:

```bash
gh search repos "humanizer in:name,description,readme" --limit 50 \
  --json name,owner,url,description,updatedAt,stargazersCount

gh search repos "\"AI writing\" humanizer prompt" --limit 50 \
  --json name,owner,url,description,updatedAt,stargazersCount

gh search repos "\"Signs of AI writing\"" --limit 50 \
  --json name,owner,url,description,updatedAt,stargazersCount

gh search code "\"Signs of AI writing\"" --limit 50 \
  --json repository,path,url

gh search code "\"humanizer\" \"SKILL.md\"" --limit 50 \
  --json repository,path,url
```

Useful web-search patterns:

- `site:github.com humanizer "Signs of AI writing"`
- `site:github.com humanizer prompt "AI writing"`
- `site:github.com "Natural Style Writing Assistant"`
- `site:github.com "remove signs of AI-generated writing"`

### Step 6. Review GitHub issues, discussions, and commits

For promising projects, inspect:

- issue titles and comments
- README discussions
- commit messages that mention examples, heuristics, workflow, or voice preservation

What matters:

- recurring complaints about weak examples
- repeated requests for better voice preservation
- discussions of new AI tells
- practical revisions that improve the skill in use

Ignore:

- vanity stars with no substance
- derivative forks with no original value
- issues about marketing claims only

### Step 7. Optional social search lane

This lane is optional and lower trust. Use it only when tools are available and when the goal is discovery, not source-of-truth validation.

#### X.com

Search for:

- `humanizer AI writing`
- `signs of AI writing`
- `avoid AI writing`
- `AI sounding prose`
- `rewrite AI text naturally`

What to look for:

- linked examples
- screenshots of before/after rewrites
- complaints that reveal new recurrent AI tells
- references to strong GitHub repos or docs

Do not trust:

- viral claims without examples
- "undetectable AI" marketing
- low-effort prompt screenshots with no evidence

#### Reddit

Search for:

- `humanizer ai writing site:reddit.com`
- `avoid ai writing reddit`
- `signs of ai writing reddit`
- `chatgpt writing sounds robotic reddit`

What to look for:

- practitioner complaints about recurring LLM writing habits
- examples from editors, teachers, marketers, or technical writers
- repo or prompt links worth escalating to GitHub review

Treat Reddit and X as discovery surfaces. Confirm anything valuable against stronger sources before editing the skill.

## Candidate Evaluation Rubric

For each new practice, classify it before adopting it.

### Adopt immediately

Use when the idea is:

- clear
- durable
- example-supported
- aligned with better writing rather than detector gaming
- either new or materially better than what the repo already has

### Hold for observation

Use when the idea is interesting but not yet stable.

Examples:

- discussed repeatedly but examples are thin
- useful in one genre only
- overlaps heavily with existing guidance

### Reject

Reject when the idea:

- exists to evade detectors rather than improve writing
- depends on random errors or deliberate degradation
- is just a paraphrase of something the repo already teaches
- reduces clarity or honesty
- relies on fabricated specificity or false personal voice

## Mapping Changes To Files

Use this file mapping when integrating improvements.

### Update `skills/humanizer/SKILL.md` when:

- the core workflow improves
- the intake logic improves
- rewrite modes need adjustment
- ethics or guardrails need strengthening
- reference routing or output behavior changes

### Update `skills/humanizer/references/pattern-catalog.md` when:

- a new durable AI-writing tell should be taught
- a pattern split, merge, definition, diagnostic, or repair improves
- the catalog's organization or delivery checks change

### Update `skills/humanizer/references/examples.md` when:

- a better before/after example exists
- a current example is weaker than a newly found one
- a new domain or tone needs coverage
- weaker models would benefit from additional contrastive examples

### Update `skills/humanizer/references/humanizing-text.md` when:

- the end-to-end editing sequence improves
- voice-preservation guidance improves
- audience or platform adaptation changes
- tone presets or style-continuity checks improve

### Update `skills/humanizer/agents/openai.yaml` when:

- the display name, short description, or default prompt no longer matches the skill
- the skill is renamed or its primary user-facing behavior changes

### Update `README.md` when:

- install paths change
- the public positioning changes
- the main feature list changes
- new supported agent ecosystems matter

### Update `CHANGELOG.md` when:

- a user-facing feature or capability changes

Do not write:

- internal notes
- sourcing narratives
- "researched X, then Y"
- development diary details

Keep the changelog release-note quality only.

## Example Upgrade Rules

Examples should be upgraded only if they are genuinely better.

A better example is one that:

- isolates the pattern more clearly
- shows a stronger rewrite
- preserves meaning while reducing slop
- teaches a transferable technique
- sounds like real writing, not a toy sentence

When comparing examples:

- prefer concrete nouns over vague abstractions
- prefer realistic genres over generic lorem-ipsum prose
- prefer examples that teach both detection and rewriting
- prefer examples that preserve voice when relevant

## Anti-Regression Rules

Do not let maintenance drift into these failures:

- bloating `skills/humanizer/SKILL.md` with detailed catalogs or examples
- duplicating the same rule in the core and a reference
- turning `skills/humanizer/references/examples.md` into an uncurated dump
- letting `skills/humanizer/agents/openai.yaml` drift from the core skill
- weakening the skill into generic "write better" advice
- confusing "natural" with sloppy
- confusing "human" with deceptive
- overfitting the skill to one model family

## Release Workflow For Maintenance Updates

When a review produces real improvements:

1. Update `AGENTS.md` timestamps and notes
2. Patch the relevant files under `skills/humanizer/`
3. Regenerate `agents/openai.yaml` when interface metadata may be stale
4. Update `README.md` only if public behavior or installation changed
5. Add concise user-facing notes to `CHANGELOG.md`
6. Run skill validation, Markdown checks, and a final editorial pass
7. Commit, push, and tag only when the change is meaningful

If the review produces no worthwhile change:

- update only the timestamps and source notes
- do not manufacture a release

## Suggested Maintenance Prompt For Future Agents

Use this prompt shape when asked to refresh the skill:

> Review the current humanizer repository against the latest `Wikipedia:Signs_of_AI_writing`, tracked upstream humanizer projects, GitHub search results, and optionally Reddit/X discovery signals. Update only the parts of the skill that are genuinely improved by new evidence. Refresh `AGENTS.md` timestamps and keep `CHANGELOG.md` user-facing.

## Non-Negotiables

- Always record when external sources were actually checked.
- Always prefer better writing over detector evasion.
- Always compare against what the repository already does before adding anything.
- Always keep this repo curated, not crowded.
