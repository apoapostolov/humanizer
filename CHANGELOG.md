# Changelog

All notable changes to this project will be documented in this file.

## [2.8.3] - 2026-08-30

The AI-writing signals skill tracks upstream engine release v3.28.0, and the humanizer catalog grows by seven rhetorical-tic patterns.

### Added

- **ai-writing-detector 1.1.0**: engine pin to `v3.28.0` with three new
  detector types (`performed-insight`, `negation-chain`,
  `dev-blog-boilerplate`) and `sourceMode: "rendered-markdown"` scoring that
  masks YAML frontmatter and HTML comments while keeping issue offsets
  aligned with the source file.
- **humanizer patterns 86-92** in the catalog: performed insight, negation
  chain, dev-blog boilerplate, stacked rhetorical questions, same-opener
  sentence runs, stranded auxiliary contrast, and colon into a triple. The
  deterministic detector covers only the narrow subset of these; the rest
  stay editorial judgment.

## [2.8.2] - 2026-08-27

vale-cli/vale pin moves to `v3.19.0` (from v3.18.0). Patch bump, pin-only.

- **writing-prose**: WSL binary updated to 3.19.0; `vale sync` re-run for
  the Microsoft style pack. No house config change: the release is MDX/JSX
  children linting, Elixir comment extraction, and repeated-occurrence
  tokens, none of which touch Markdown prose rules we run. House gate
  verified on the skill set (SKILL.md clean, 0 errors).
- **Win11 winget** still at 3.17.1 (manifest lag); house config stays
  compatible with it.

## [2.8.1] - 2026-08-26

Humanizer now flags empty metaphor nouns and a couple of sentence habits that make a paragraph sound interchangeable with another project's docs.

### Added

- Abstract metaphor nouns in the vocabulary tiers (substrate, wedge, vector, locus, vantage, nexus, primitive-as-noun, flywheel, north star, endgame, and similar) with concrete-word substitutes.
- Interchangeability test on the required-checks revision gate: a sentence that could appear unchanged in another project's docs is carrying nothing specific to this piece.
- Mid-sentence colon crutch in the pattern catalog (connective colon with comparison framing). List and example colons stay legitimate.

## [2.8.0] - 2026-08-24

Edit mode refuses the wrong kind of file. Before rewriting a path in place, Humanizer confirms the file is prose and stops on source code, configuration, and generated data, with a reason. Quoted material, code blocks, and tables were already protected inside a file; this closes the choose-the-wrong-file case.

### Changed

- **humanizer 1.5.0**: prose-file gate in edit mode, documented in `ai-ism-audit.md`.

## [2.7.0] - 2026-08-22

New skill: `writing-voice` 1.0.0. One home for how an agent talks to its user, writes for other humans, and writes for machines.

### Added

- Three audience modes (Chat, Human, Worker) plus tone overlays (`<tone> <mode>`, for example "casual worker" or "professional human").
- Tone definitions live in the Humanizer voice-profile table. Writing Voice routes and never restates them. Never-inject bounds every tone.
- No personal data in the skill: no user facts, no platform names, no host paths beyond a deployment note. Personalized deployments keep their own copy and add user-specific routing on top.

## [2.6.0] - 2026-08-22

The Humanizer voice-profile table is now the tone definition store for Writing Voice subtypes. Writing Voice routes `<tone> <mode>` requests to that table and never restates the targets.

### Changed

- **humanizer 1.4.0**: voice-profile section notes the table doubles as the tone store. No target changes. The Never-inject binding from 2.5.3 still governs those tones.

## [2.5.3] - 2026-08-22

A voice profile can bring out what the source already has. It cannot manufacture what the source lacks.

### Changed

- **humanizer 1.3.1**: the voice-profile table opens with that binding. Casual, professional, and warm rows carry bounded targets, so the editor is not asked to add a first-person touch, a concrete claim, an explicit ask, or an acknowledgment the source never contained.

## [2.5.2] - 2026-08-21

The Vale gate runs 3.18.0. More document formats, same house rules.

### Changed

- **writing-prose 1.1.1**: WSL Vale binary updated to 3.18.0 (native MDX, Typst, Quarto, MyST, QDoc, R Markdown, plus scoping and alert-position fixes). House gate verified on the sample set and a real draft. Win11 winget still lags at 3.17.1; the WSL binary stays canonical.
- `READMEs` added to the house accept list (pre-existing Vale spelling false positive).

## [2.5.1] - 2026-08-19

Closing Markdown fences now follow CommonMark: a fence is closed only when the closer is followed by spaces or tabs. An info string such as ` ```js ` no longer closes an outer fence, so headings inside a fenced block stay masked from the title-case-header rule.

### Changed

- **ai-writing-detector 1.0.6**: engine fence-range fix. New `scripts/fence-probe.js` behavioral probe (info-string masking, blank-suffix close, nbsp stays fenced, CRLF close) wired into `smoke.sh`.

## [2.5.0] - 2026-08-19

Humanizer's pattern catalog grows by five durable tells.

### Added

- Patterns 81–85: rhetorical setup (*What if...?*, *Think about it:*, *And that's okay*), narrator-from-a-distance, announced significance (*this is what X actually looks like*), additive hedge escalation (*not just X but also Y*), and template narrative arc (*By the time X, I was Y*). Each has tell, repair, and carve-outs, cross-referenced against adjacent patterns 9 and 76.

### Changed

- **humanizer 1.3.0**: version bump for the five catalog patterns.

## [2.4.0] - 2026-08-18

`ste_lint` is now `voice_lint`. The linter is a generic voice check, not STE-locked, and it can report AI-slop tells without counting them as form violations.

### Changed

- **Rename**: `scripts/ste_lint.py` → `scripts/voice_lint.py`. Usage docs, the test contract, and sibling references updated. Historical changelog entries keep the old name.
- **New `tells` report-only dict** (never counted toward `total`): cliché global openers, conclusion signposts, hedge softeners, AI buzzwords, and the "No A. No B. Just C." negation triad. Narrow legitimate uses stay judgment calls.
- **simple-english 2.4.0**: version bump for the rename and tells.

## [2.3.0] - 2026-08-18

voice_lint catches a single clipped negation fragment (`"Not a X."`) closing a paragraph.

### Added

- **simple-english 2.3.0**: `detect_rhythm()` gains `end_para_neg_fragments` for verbless negation fragments that close a paragraph. Precise shape keeps false positives near zero: paragraph-final segment only, negation lead plus determiner or adjective, no finite verb, no contrast-comma continuation. Skipped idioms include "Not that", "No,", "No thanks", "No one", and "Not everyone". Report-only, never counted toward the form total.

## [2.2.0] - 2026-08-18

Prose-rhythm findings join the mechanical lint.

### Added

- **simple-english 2.2.0**: voice_lint gains `detect_rhythm()`, reporting staccato stacks (3+ consecutive sentences of six words or fewer) and clipped negation-fragment tails ("No X. No Y." closing a paragraph). Sentence-length variance ships as context. Markdown-aware: headings break stacks, each bullet is one unit, table rows are skipped. Rhythm findings are reported separately and never counted toward the form total.

### Fixed

- **simple-english 2.2.1**: flush staccato stacks that run to end of text.

## [2.1.0] - 2026-08-17

Skills now declare who they write for. Humanizer is for other humans. Simple English is for machines and procedures.

### Added

- **simple-english 2.1.0**: Worker register (machines and procedures only; README and changelog work bounce to Humanizer).
- **humanizer 1.2.0**: Human register (READMEs, changelogs, public posts, OSS issues and PR comments; PR bodies bounce to Simple English).

## [2.0.1] - 2026-08-17

Humanizer picks up two new editorial patterns and tightens a few existing ones.

### Added

- **humanizer 1.1.1**: patterns 79 (shadowboxing objections) and 80 (editorial scar tissue). Pattern 11 extended with repeated sentence openings. Pattern 21 extended with casual-register signposts ("heads up", "quick note", "one thing that bit me"). Figurative "gate/gated/gating" added to Tier 2 vocabulary, with a technical-usage carve-out (CI gates, gated clocks, gated releases stay). Named objections, real design alternatives, and deliberate rhetorical repetition stay.

## [2.0.0] - 2026-08-17

`plain-english` is now `simple-english`. The skill carries a full practical STE catalog.

### Changed

- **simple-english 2.0.0** (renamed from plain-english): word, verb, sentence, punctuation, and structure rules with ASD-STE100 rule-number citations; modal ladder; slop-to-simple substitution table; vocabulary discipline; word-counting rules (backticked commands count as one word); condition-first; warnings-before-steps; and beyond-documentation use cases (error messages, runbooks, incident reports, release notes, agent instructions, translation prep). Adds `references/checklist.md` and `references/use-cases.md`. Existing strict and STE-flavored modes, the linter workflow, and guardrails stay.
- Cross-skill references, README, and tests use the new name. Install command is `npx skills add apoapostolov/humanizer --skill simple-english`.

## [1.1.0] - 2026-08-14

Clearer voice ownership across the suite.

### Changed

- **humanizer 1.1.0**: explicit voice hierarchy. User samples, medium, audience, and source voice outrank generic pattern rules. Mixed documents are edited by section job instead of passing through every skill in sequence.
- **plain-english 1.1.0**: separates strict form control from STE-flavored diagnosis. Contractions and sentence-length findings are no longer automatic failures in natural technical prose. Mixed-document whole-file scoring is rejected.
- **writing-prose 1.1.0**: Vale warnings are reread prompts. Drops a stale dependency on the retired `writing` skill. Blocks forced facts, manufactured digressions, and uniform short-sentence cleanup.
- Mode-boundary examples and regression tests for the cross-skill voice contract.

## [1.0.3] - 2026-08-13

The detector and Humanizer both treat unnecessary hyphenation as a copyedit, not an authorship signal.

### Added

- **ai-writing-detector 1.0.5**: `unnecessary-hyphenation` rule (welded open noun phrases, closed-form compounds, adverbial attributive hyphens). Zero-weight P2 copyedit; it does not affect the AI score. Path masking hardened against superlinear backtracking.
- **humanizer**: pattern 57 expanded with cut-first `actually` guidance (delete when emphasis-only, keep for named corrections). New pattern 78 (unnecessary hyphenation). "Hyphenated modifier pile" renamed to "hyphenated modifier stacking."

## [1.0.2] - 2026-08-07

Maintenance only. No skill behavior change.

## [1.0.1] - 2026-08-05

Detector lookup no longer false-positives on `constructor`. Vale gate moves to 3.17.1.

### Fixed

- **ai-writing-detector 1.0.4**: `Object.hasOwn` guard in tier lookups. `check-engine-pin.sh` syntax bug fixed.

### Changed

- **writing-prose 1.0.1**: Vale binary 3.17.0 → 3.17.1 (startup and lookaround performance, Org HTML writer, dry-run config, Windows on ARM). No style-pack or config changes.

## [1.0.0] - 2026-08-05

Initial release. Four writing skills for agents: Humanizer, Plain English, AI Writing Detector, and Writing Prose.

MIT licensed. See each skill's `SKILL.md` for usage.
