# Changelog

All notable changes to this project will be documented in this file.

## [2.0.1] - 2026-08-17

Patch: blader/humanizer v2.9.2 - v2.11.0 editorial absorb.

- **humanizer 1.1.1**: new patterns 79 (shadowboxing objections) and 80
  (editorial scar tissue); pattern 11 extended with repeated sentence openings
  and pattern 21 with casual-register signposts ("heads up", "quick note",
  "one thing that bit me"); figurative "gate/gated/gating" added to Tier 2
  vocabulary with a technical-usage carve-out (CI gates, gated clocks, gated
  releases stay). False-positive discipline added for each: named objections,
  real design alternatives, and deliberate rhetorical repetition stay.
- Upstream's v2.11.0 plain-language reskin of its own SKILL.md was reviewed and
  not adopted (house voice already plain; our catalog is organized by editing
  layer). Their em-dash rule moved from hard ban to sample-aware, matching the
  house stance since 1.1.0.

## [2.0.0] - 2026-08-17

Major: `plain-english` renamed to `simple-english` + upstream STE catalog merge.

- **simple-english 2.0.0** (renamed from plain-english): merges the Hermes
  optional-skill port `creative/simple-english` (ASD-STE100 Issue 9) into the
  existing STE skill. Adds the full practical rule catalog (word/verb/sentence/
  punctuation/structure rules with ASD-STE100 rule-number citations), the modal
  ladder (should/would/may/might/could -> must/can/restructured), the slop-to-
  simple substitution table, vocabulary discipline, word-counting rules
  (backticked commands count as one word), the condition-first rule, the
  warnings-before-steps pattern, and the beyond-documentation use cases
  (error messages, runbooks, incident reports, release notes, agent
  instructions, translation prep). Adds `references/checklist.md` (verification
  pass with searchable patterns) and `references/use-cases.md` (long-form
  adaptations). Existing strict/STE-flavored modes, ste_lint.py workflow, and
  guardrails are preserved.
- All cross-skill references (humanizer, ai-writing-detector, writing-prose,
  README, tests) updated to the new name. Install command is now
  `npx skills add apoapostolov/humanizer --skill simple-english`.

## [1.1.0] - 2026-08-14

Minor: clearer voice ownership across the writing suite.

- **humanizer 1.1.0**: adds an explicit voice hierarchy. User samples, medium,
  audience, and source voice now outrank generic pattern rules. Mixed documents
  are edited by section job instead of passing through every skill in sequence.
- **plain-english 1.1.0**: separates strict form control from STE-flavored
  diagnosis. Contractions and sentence-length findings are no longer automatic
  failures in natural technical prose. Mixed-document whole-file scoring is
  explicitly rejected.
- **writing-prose 1.1.0**: treats Vale warnings as reread prompts, removes a
  stale dependency on the retired `writing` skill, and prevents forced facts,
  manufactured digressions, and uniform short-sentence cleanup.
- Adds mode-boundary examples and regression tests for the cross-skill voice
  contract.

## [1.0.3] - 2026-08-13

Patch: engine pin absorb v3.24.0 + v3.25.0 + editorial.

- **ai-writing-detector**: absorb upstream `unnecessary-hyphenation` engine
  rule (48 `type`s, 62 categories). New pattern catches welded open noun
  phrases (`research-impact` to `research impact`), closed-form compounds
  (`code-base` to `codebase`), and adverbial attributive hyphens (`in
  real-time` to `in real time`). Zero-weight P2 copyedit, does not affect
  AI score. Path masking hardened against superlinear backtracking.
  validate.js unchanged. Engine pin moved from post-v3.23.0 tip `1ea2f0c`
  to v3.25.0 tag tip `3c0fd8a`. Skill version 1.0.5.
- **humanizer**: pattern-catalog pattern 57 expanded with cut-first
  `actually` guidance (delete when emphasis-only, keep for named
  corrections). New pattern 78 (unnecessary hyphenation). "Hyphenated
  modifier pile" renamed to "hyphenated modifier stacking" to match
  upstream taxonomy split.
- **SOURCES.md**: pins updated for avoid-ai-writing v3.25.0.

## [1.0.2] - 2026-08-07

Patch: dropped a tracked ingest source.

- **SOURCES.md**: removed `apoapostolov/Forbidden-Lands-2e` from active
  ingest (user decision). Already-absorbed generalized rules stay in
  humanizer references. Remaining sources renumbered.

## [1.0.1] - 2026-08-05

Patch: engine pin absorb + vale upgrade.

- **ai-writing-detector**: absorb upstream `Object.hasOwn` guard fix
  (prevents `constructor` prototype FP in tier lookups). Fix
  `check-engine-pin.sh` syntax bug and update engine pin to post-v3.23.0
  tip `1ea2f0c`. Skill version 1.0.4.
- **writing-prose**: vale binary updated v3.17.0 to v3.17.1 (perf:
  startup core allocation, lookaround hoisting, rule compilation skip;
  fix: Org HTML writer, dry-run config, rule-embedded scripts validation;
  feat: Windows on ARM build). No style-pack or config changes. Skill
  version 1.0.1.
- **SOURCES.md**: updated all active ingest timestamps. Engine pin moved
  from `v3.22.3`/`5897f7b` to post-tag tip `1ea2f0c`.

## [1.0.0] - 2026-08-05

Initial clean release. Four writing skills for agents:

- **humanizer**: natural voice, rewrite, editorial catalogs.
- **plain-english**: STE-flavored speech form with lint gate.
- **ai-writing-detector**: mechanical AI-writing signals and preservation
  validate. Engine vendored from avoid-ai-writing.
- **writing-prose**: vale-gated prose craft with house style config
  (HermesHouse: EmDash, WordChoice, AiSlop, Weasel) + Microsoft whitelist.

MIT licensed. See each skill's `SKILL.md` for usage and triggers.
