# Changelog

All notable changes to this project will be documented in this file.

## [2.6.0] - 2026-08-22

The humanizer voice-profile table becomes the tone definition store for the
Hermes `writing-voice` subtype tones ("casual worker", "professional human",
"warm agent"). writing-voice routes `<tone> <mode>` requests to this table
and never restates the targets.

- **humanizer 1.4.0**: `ai-ism-audit.md` voice-profile section gains a
  one-line pointer declaring the table doubles as the tone definition store.
  No target changes; the Never-inject binding from 2.5.3 carries over and
  governs the tones everywhere they apply.

## [2.5.3] - 2026-08-22

avoid-ai-writing pin moves to `v3.25.1` (ca2206c): voice-profile targets
bound to the Never-inject guardrails (upstream #100 / PR #133, wording
ported back from wshobson/agents#645).

- **humanizer 1.3.1**: `ai-ism-audit.md` voice-profile table now opens with
  the binding line ("a voice profile can bring out what the source already
  has, never manufacture what it lacks") and the casual / professional /
  warm rows carry bounded targets. The old rows could be read as requiring
  the editor to add a first-person touch, a concrete claim, an explicit
  ask, or an acknowledgment the source never contained, which contradicted
  the Never-inject list two sections above. Now both sections agree.
  Engine untouched (no detector changes in v3.25.1).

## [2.5.2] - 2026-08-21

Vale pin moves to `v3.18.0`; blader/humanizer tip checked and absorbed as a
pin-only update (packaging rework, no new tells).

- **writing-prose 1.1.1**: WSL vale binary updated to 3.18.0 (largest format
  expansion since 3.0: native MDX, Typst, Quarto, MyST, QDoc, R Markdown;
  scoping and alert-position fixes). House gate verified on the sample set
  and a real draft: behavior-neutral on house rules. Win11 winget manifest
  reached 3.17.1 and still lags 3.18.0; the WSL binary stays canonical.
- **Vocab**: `READMEs` added to the house accept list (pre-existing
  `Vale.Spelling` false positive, unrelated to the 3.18.0 upgrade).
- **blader-humanizer**: tip `e2e92e7` (two commits past v2.11.1) is packaging
  only: README restructured, plugin symlink and separate Claude Desktop zip
  removed, SKILL.md description reworded. No change to the 35 patterns, no
  editorial absorb.

## [2.5.1] - 2026-08-19

ai-writing-detector engine pin moves to `b504e20` (upstream tip after
v3.25.0) for the closing-fence blank guard (upstream PR #127, fixes #77).

- **Engine absorb (patterns.js only)**: `fenceRanges()` now treats a closing
  Markdown fence as valid only when followed by spaces or tabs (CommonMark).
  An info string such as ` ```js ` no longer closes an outer fence, so
  headings inside a fenced block stay masked instead of reaching the
  title-case-header rule. Patterns byte-for-byte identical to upstream tip.
- **ai-writing-detector 1.0.6**: version bump for the engine absorb. New
  `scripts/fence-probe.js` behavioral probe (info-string masking, blank-suffix
  close, nbsp stays fenced, CRLF close) wired into `smoke.sh`; smoke
  16/16 green.
- **blader-humanizer v2.11.1**: checked, release is packaging-only (Claude
  Desktop-ready flat `humanizer/SKILL.md` zip; no change to the 35 patterns),
  nothing absorbed. Release pins updated only.

## [2.5.0] - 2026-08-19

humanizer absorbs the remaining durable tells from stop-slop (MIT): five new
pattern-catalog entries close the gap the August ingest left open.

- **New patterns 81-85**: rhetorical setup (*What if...?*, *Think about it:*,
  *And that's okay*), narrator-from-a-distance, announced significance (*this
  is what X actually looks like*), additive hedge escalation (*not just X but
  also Y*), and template narrative arc (*By the time X, I was Y*). Each with
  tell/repair/carve-outs, cross-referenced against adjacent patterns 9 and 76.
- **humanizer 1.3.0**: version bump for the five new catalog patterns;
  SOURCES.md lands_in + ingest_policy updated to record full coverage of the
  pinned stop-slop tip (8da1f03).

## [2.4.0] - 2026-08-18

ste_lint becomes **voice_lint**: the linter is renamed and un-shackled from
simple-english, and gains report-only AI-slop "tells" so prose-rule checks
ride beside the mechanical bans.

- **Rename**: `scripts/ste_lint.py` → `scripts/voice_lint.py`. The tool is a
  generic voice linter, not STE-locked, and can move to writing-voice. All
  usage docs, the test contract, SOURCES lands_in, and sibling references
  updated. Historical changelog entries keep the old name.
- **New `tells` report-only dict** (never counted toward `total`): cliché
  global openers, conclusion signposts, hedge softeners, AI buzzwords, and the
  "No A. No B. Just C." negation triad. Each is a real signal with narrow
  legitimate uses, so they ship as agent judgment cues rather than violations.
  Loved the discipline from the 2.3.0 negation-fragment work: paragraph-final
  scoping, no-verb/no-comma guards, and FP probes before shipping.
- **simple-english 2.4.0**: version bump for the rename + tells feature.

## [2.3.0] - 2026-08-18

voice_lint catches the single clipped negation fragment (`"Not a X."`) closing
a paragraph. That is the sharper AI-slop tell than staccato stacking.

- **simple-english 2.3.0**: `detect_rhythm()` gains `end_para_neg_fragments`:
  verbless negation fragments that close a paragraph, e.g. "This was a really
  good session. Not a random waste." Precise shape keeps false positives near
  zero: paragraph-final segment only, negation lead plus determiner/adjective,
  no finite verb, no contrast-comma continuation. Skipped idioms: "Not that",
  "No,", "No thanks", "No one", "Not everyone". Report-only, never counted
  toward the form total.

## [2.2.0] - 2026-08-18

Prose-rhythm findings join the mechanical lint, giving the house voice bans
the same checkable surface as the em dash rule.

- **simple-english 2.2.0**: voice_lint gains `detect_rhythm()` reporting
  staccato stacks (3+ consecutive sentences of six words or fewer) and
  clipped negation-fragment tails ("No X. No Y." closing a paragraph).
  Sentence-length variance ships as context. Markdown-aware: headings break
  stacks, each bullet is one unit, table rows are skipped. Rhythm findings
  are reported separately and never counted toward the form total.
- **simple-english 2.2.1**: flush staccato stacks that run to end of text
  (a stack interrupted by nothing was never recorded).

## [2.1.0] - 2026-08-17

Voice routing registers for cross-agent use (Hermes + Pi three-mode model).

- **simple-english 2.1.0**: `Pi register: Worker` block (machines and
  procedures only; README/changelog bounces to humanizer); removed the
  hard date stamp from the optional-skills merge note; body version
  aligned with frontmatter.
- **humanizer 1.2.0**: `Pi register: Human` block (READMEs, changelogs,
  public posts, OSS issues and PR comments; PR bodies bounce to
  simple-english).

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
