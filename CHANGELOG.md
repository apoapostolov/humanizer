# Changelog

All notable changes to this project will be documented in this file.

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
