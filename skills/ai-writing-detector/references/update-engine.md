<!-- markdownlint-disable MD013 -->

# Update vendored detector engine

Checklist when avoid-ai-writing publishes a newer detector than the monorepo pin
(see root `SOURCES.md` → packaged skill `ai-writing-detector`).

## 1. Fetch upstream

```bash
# optional local checkout
git -C "$AVOID_AI_WRITING_ROOT" fetch --tags origin
git -C "$AVOID_AI_WRITING_ROOT" log --oneline <old_pin>..vX.Y.Z -- detector/
git -C "$AVOID_AI_WRITING_ROOT" diff <old_pin>..vX.Y.Z -- \
  detector/patterns.js detector/validate.js detector/CATEGORIES.md
```

## 2. Copy engine files only

```bash
cp "$AVOID_AI_WRITING_ROOT/detector/patterns.js" scripts/patterns.js
cp "$AVOID_AI_WRITING_ROOT/detector/validate.js" scripts/validate.js
```

Keep this package’s wrapper layer:

- `scripts/report.js`
- `scripts/analyze.js`
- `scripts/validate-cli.js`
- `scripts/smoke.sh`
- `scripts/check-engine-pin.sh`

Re-apply the short package banner at the top of `validate.js` if upstream
overwrite removed it (CLI wrappers do not depend on that banner).

## 3. Categories

If upstream types changed, update `references/categories.md` (localized map).
Do not paste upstream paths that reference missing CI files.

## 4. Verify

```bash
bash scripts/smoke.sh
bash scripts/check-engine-pin.sh   # optional clone compare
```

## 5. Version + monorepo

- Bump skill `version` in `SKILL.md` + `package.json` (**patch** for pin-only).
- Update monorepo `SOURCES.md` pin fields and `ai_writing_detector_skill_version`.
- `CHANGELOG.md` note: engine pin old → new; what changed editorially if anything.
- Sync live installs; commit; push if asked.

## 5b. Do not vendor

- corpus/, RAID/HC3 downloaders, PROOF.md self-scan budgets
- detector-evasion framing
- treating scores as authorship

### No-engine-delta releases

v3.23.0 (2026-08-03) changed no `detector/` files. The release added the
optional `--style` house-style layer: user-supplied JSON config
(`register` + `mechanics`), `scripts/check-style.js` for the checkable
mechanics, and `examples/` starters. No bundled guides; a bare guide name is a
best-effort fallback with an explicit no-compliance claim. Not vendored: it is
upstream CLI machinery outside the detector engine, and this package already
covers mechanical form control via the sibling `simple-english` STE lint. On
such releases, update SOURCES release pins but keep the engine pin and
`check-engine-pin.sh` `expected_upstream_tag` unchanged.

v3.23.1 (2026-08-05) changed no `detector/` files. The Object.hasOwn FP fix
(`constructor` and other `Object.prototype` collisions) was already at our
engine pin `1ea2f0c` (post-v3.23.0 tip). `patterns.js` and the functional body
of `validate.js` are byte-identical between our pin and the tag. The release
formalized CI/release automation (npm provenance pipeline, cursor-rules leak
gate, pattern-count CI assertion). SOURCES release pins updated; engine pin,
detector skill version, and `check-engine-pin.sh` unchanged.

### No-engine-delta releases (continued)

v3.37.0 (2026-10-04; tag `db82bc8`, docs-only) changes no `detector/` file.
`patterns.js` is byte-identical to our pin, and the functional body of
`validate.js` matches ours once the four-line packaging banner is stripped.
Three durable documentation gains landed. (1) The Tier 3 threshold is now
stated per word, `max(3, floor(wordCount x 0.03))` uses of one listed form, with
separately listed forms counted separately, which is what the engine has always
done. Probed: fifty Tier 3 hits spread over ten words in a 710-word text produce
zero findings, while one word repeated past the threshold produces one. (2)
`detector/README.md` publishes a severity-to-P-tier table, so this package ships
its own measured version of it in `scoring-and-limits.md`, including the three
types that emit more than one severity. (3) `CATEGORIES.md` promotes list-label
periods, speculative gap-filling, and infomercial engagement hooks to the
judgment-only list with their carve-outs; absorbed into our section C.
Not vendored: the paste-field size table and the ChatGPT plugin install advice in
`README.md` (distribution docs for destinations this package does not ship to),
and the version/license frontmatter sweep plus the new `validate-openai-plugin.py`
checks (upstream release plumbing). Engine pin stays `bdeb726`. Detector skill
version 1.1.10 for the documentation absorb only.

### Engine-delta releases

v3.24.0 (2026-08-07) added `unnecessary-hyphenation` to `patterns.js`: a
zero-weight P2 copyedit with 48 engine `type`s (was 47) and 62 categories
(was 61). Three curated subclasses: welded open noun phrases, closed-form
compounds, and adverbial attributive hyphens. Protected-span masking
hardened (code, quotes, URLs, paths, YAML, tables, HTML) with bounded path
components to prevent superlinear backtracking. `validate.js` unchanged.
Engine pin moved to `3c0fd8a`. Detector skill version 1.0.5.

v3.25.0 (2026-08-12) added `actually` as a cut-first hollow intensifier to
`SKILL.md` only. No `detector/` changes. The token is context-dependent
(emphasis filler vs corrective prose), so a regex would flag ordinary
corrective writing. Catalog stays at 62 categories, engine at 48 `type`s.
Editorial-only absorb into humanizer pattern 57.

Untagged tip `b504e20` (2026-08-19, upstream PR #127, fixes #77) tightened
`fenceRanges()` so a closing Markdown fence is valid only when followed by
spaces or tabs (CommonMark). Previously any same-char fence line, including
an info-string opener such as ```js, closed an outer fence, which exposed
headings inside a fenced block to the title-case-header detector. Patterns
byte-for-byte identical to upstream tip; `validate.js` unchanged. Engine pin
moved to `b504e20`. Detector skill version 1.0.6. No editorial change (engine
FP/masking fix only). Behavioral probe `scripts/fence-probe.js` added and
wired into `smoke.sh`.

v3.28.0 (2026-08-28) added three new engine `type`s from Simon Willison's LLM
cliche highlighter: `performed-insight` (weight 3, density-classified like
tier2), `negation-chain` (weight 5, strong structural tell), and
`dev-blog-boilerplate` (weight 3). Engine total 48 -> 51 `type`s. The
deterministic subset is deliberately narrower than the editorial rules:
performed-insight omits literal "the punchline" / "worth naming" senses;
negation-chain fires only on sentence-initial chains of three-plus short
"no ..." items, comma-joined subject-elided "did not ..." chains, and the
"don't call it X -- call it Y" repeat (two-item chains stay judgment calls);
dev-blog-boilerplate omits literal "batteries included" but keeps "it just
works out of the box" detectable without reviving the "works out to" FP.
The same release added `sourceMode: "rendered-markdown"` to `analyzeText`:
initial YAML frontmatter and HTML comments are masked before scoring while
issue and sentence-highlight offsets stay aligned with the source file. The
`validate.js` comment contract was also refreshed ("tables" joined the
protected-span list; AI-referrer wording tightened) with no logic change.
Behavioral probes (hit + FP quiet + rendered-markdown masking) verified at
absorb time. Detector skill version 1.1.0 (new engine capabilities: 3 rule
types + scoring source mode).

v3.29.0 (2026-09-03) added three more engine `type`s from the
`welttowelt/stop-slop-refined` merged-system diff (upstream #108):
`launch-intro` (weight 8, single-hit opener class), `crowd-contrast`
(weight 6, gated on dismissive verbs in -ing plus "was still"), and
`fake-casual-prop` (weight 8, closed lists: six asterisk stage directions
and the four (yes|no) x (really|seriously) parentheticals). Engine total
51 -> 54 `type`s. Precision-over-recall residue is disclosed per rule:
two-token product names miss, literal progressive uses of the crowd verbs
fire, and register neighbours like `*checks calendar*` stay clean on
purpose. `validate.js` unchanged this release. Behavioral probes (hit +
FP quiet on person-introductions, UI `Enter` instructions, and literal
simultaneity) verified at absorb time. Detector skill version 1.1.1.

v3.30.0–v3.33.0 (2026-09-05; single absorb) changed the engine in exactly two
places. `patterns.js`: the `load-bearing` rule flipped from a structural-noun
blocklist (fire unless a building noun follows) to an abstract-noun allowlist
(fire only before assumption, claim, invariant, premise, constraint,
dependency, argument, or abstraction, including plurals). Literal building
uses, unlisted nouns, intervening modifiers, mixed physical-or-abstract nouns
(structure, element, frame, foundation), and predicative uses now pass by
construction: precision over recall, with the missed-metaphor residue disclosed
in the rule comment (upstream #56). `validate.js`: CRLF line endings normalize
to LF once, up front, so YAML frontmatter and table blocks in Windows-authored
documents stay visible to the protection extractors; a lone carriage return
remains meaningful and still compares exactly. v3.30.0–v3.32.0 editorial
additions (repeated setup/reversal punchlines, judgment-only clarity rules,
quote normalizer, SKILL-to-references split, OpenAI plugin packaging) carry no
engine delta and were absorbed as humanizer catalog entries 96–99 plus
pattern 9/72/74 extensions, not as engine changes. Behavioral probes
(load-bearing allowlist hit + FP quiet + predicative quiet; CRLF frontmatter
protection) verified at absorb time. Detector skill version 1.1.2.

v3.33.0+tip `a465548` (2026-09-08; no new tag) changes the engine in one
place. `patterns.js`: the `em-dash` rule weight drops 4 to 0, so over-limit
dashes stay visible as P2 writing-quality flags without moving the score,
label, probabilities, confidence, or classification (upstream #73). The
technical-mode comment refreshes to match: prose-only rules carry their own
gates instead of a blanket em-dash weight cut. `validate.js` unchanged.
Vendored `patterns.js` is byte-identical to upstream tip. The URL
quote-boundary fix in upstream `scripts/markdown-prose.js` is packaging
tooling we do not vendor, so it stays held. Behavioral probe (em-dash-heavy
text: flag visible, score and label unchanged vs baseline) verified at absorb
time. Detector skill version 1.1.3.

v3.34.0 (2026-09-11; no-engine-delta) does not change `detector/patterns.js`,
`detector/validate.js`, or `detector/CATEGORIES.md` versus tip `a465548`.
The tag wraps the already-absorbed em-dash zero-weight (#73) plus a new
zero-dependency CLI (`bin/avoid-ai-writing.js`), a pattern-proposal issue
form, SSOT CI, and README/npm docs. We do not vendor the CLI: this package
already ships `analyze.js` / `validate-cli.js`. Detector skill version stays
1.1.3. Engine pin stays `a465548`.

v3.35.0 (2026-09-16; patterns.js delta) changes engine behavior in three
durable ways. (1) `--context technical` now suppresses eight
technical-legitimate vocabulary terms (`robust`, `comprehensive`, `seamless`,
`ecosystem`, `leverage`, `facilitate`, `underpin`, `streamline`) via a
`TECHNICAL_EXEMPT` set; general mode still flags them (#237). (2) The
Title Case header rule accepts acronyms (`AI`, `API`, `CLI`) and capital
`A` as interior tokens, so more genuine tells flag without breaking all-caps
banner lines (#240). (3) Several quadratic scans in `analyzeText()` are now
linear, and the `emotional-flatline` category is relabeled "Stock reaction
framing" with weight 2 to 0 (style-only for authorship scoring; the API type
name is stable). Not vendored: the new GitHub Action / pre-commit gate
(`avoid-ai-writing-gate`, per-file finding threshold) and fp-measure tooling;
this package's report layer and smoke already cover the operator surface.
Behavioral probe at absorb: 50-word technical prose with six exempt terms
scored 16/5 issues in technical mode vs 53/14 in general, and no exempt term
appeared in technical findings. Detector skill version 1.1.4.

v3.36.0 post-release tip `2a7e999` changes `patterns.js` only. It masks
double-quoted spans and recognizes single-line and compact Markdown quote blocks,
so quoted material is excluded before scoring while offsets remain aligned to
the source. It adds narrow staged-discovery matches under the existing
`performed-insight` type and deduplicates contained insight/flatline signals.
`validate.js` and `CATEGORIES.md` have no behavioral delta. Keep the package
report layer, CLI, and smoke suite unchanged. Probes cover a staged discovery,
a literal outcome, quoted AI phrasing, and unquoted prose.

v3.36.0 tip range `2a7e999..7cd166c` (2026-09-29 absorb) changes
`patterns.js` only; `validate.js` is byte-identical to the prior pin and
`CATEGORIES.md` moves one framing line between its judgment and engine lists.
Four durable engine changes: (1) new `negative-parallelism` type (engine 54
types) — a reveal frame with a minimizer (`isn't just/merely/simply X, it's
Y`) flags alone; plain joined contrasts and the split-sentence reveal flag
only when another frame starts within two sentences in the same paragraph;
`not only X but Y` / `not X but Y` correlatives stay unmatched on
control-corpus frequency (#351/#353). (2) Word joiners (U+2060) next to
URLs, spaces, or punctuation no longer count as bypass characters, while a
joiner that splits a word still does — including a supplementary-plane letter
boundary (#351/#353). (3) Cyrillic and Greek prose no longer reads as
homoglyph substitution: script dominance is decided per sentence (#352).
(4) Ignore markers `<!-- avoid-ai-writing:ignore-start/end -->` exclude a
passage from scoring in every source mode; `stats.ignoredRegions` counts
regions (#351). Upstream README gains a per-agent install section and
`--source-mode`/`--context` CLI flags that the upstream bundled script had
rejected; this package's `analyze.js` already accepts them. Probes at
absorb: reveal-alone flags, contrast pairing within the window + paragraph,
far-paragraph pairs and correlatives stay quiet, joiner-adjacent-to-URL
quiet, Cyrillic prose clean, ignore-marker region counted and content
excluded. Detector skill version 1.1.8.

v3.36.0 tip range `7cd166c..bdeb726` (2026-10-03 absorb) changes `patterns.js`
and `validate.js`; `CATEGORIES.md` did not change in the range, so the localized
map only picked up the moved framing line. Three durable engine changes:
(1) `false-concession` narrowed to a genuinely empty pair (#211/#359): the
opener subject widens past one word but stays inside its clause, the vague close
must follow a comma, semicolon or colon in the same sentence, and the close
stops at the next clause separator. The bare `despite X challenges` opener is
dropped. (2) `low-ttr` now averages type-token ratio over 200-token windows
instead of taking it across the whole text (#361). Whole-text TTR falls with
length, so the old rule fired on all 13 human control documents longer than
1,900 tokens. (3) `validate()` returns `preservation` and `quality` separately
and takes `residualPolicy: "error" | "warn"` (#204); `warn` keeps mechanical
damage blocking and reports residual pattern growth as a quality warning. The
validator also warns on numbers added by the rewrite, and `analyzeText` throws
a `TypeError` on non-string input with full stats on empty input (#234). Upstream
README and SKILL.md now document `--residual-policy warn` as the editorial
policy; our `validate-cli.js` exposes the same flag so the package contract
matches. Probes at absorb: vague pair flags, concrete continuation and
abbreviation cases stay quiet, warn policy blocks nothing mechanical, a bad
policy value exits 2, 3000-token varied text no longer trips low-TTR while a
repetitive 200-token text still does. Detector skill version 1.1.9.

Untagged tip `db82bc8..0469c97` (2026-10-07 absorb, upstream #212/#376)
changes `patterns.js`, `CATEGORIES.md`, and prose docs; `validate.js` has no
behavioral delta (banner-only sha difference). Two durable FP fixes:
(1) `significance-inflation` requires an inflating word immediately before
"in the evolution of" (moment, milestone, chapter, era, turning point,
watershed, inflection point, leap, role, new phase); bare and neutral uses
stay clean regardless of the following object. (2) `template-phrase`
requires a vague-praise adjective before "step towards/forward" (closed
list of 23: meaningful, significant, major, crucial, important, big, huge,
bold, giant, monumental, pivotal, critical, key, vital, massive,
tremendous, substantial, decisive, landmark, historic, exciting,
transformative); neutral adjectives ("first", "small") stay clean
regardless of the following goal. Note the new shape matches "an" as well
as "a" and drops the old "forward for" variant tail. Upstream also lands
`#212` regression tests (hit + FP-quiet for both rules) and removes the two
types from the legacy-uncovered list in `categories.test.js`; that file is
CI tooling we do not vendor. README install lines and the bug-report form
are held upstream. Category map rows for both types now carry the partial
carve-out notes; humanizer pattern 1 and the template-phrase tiers carry
one-line boundary notes. Probes at absorb: inflating-word hit, literal
evolution-of quiet, vague-praise step hit, neutral step quiet. Detector
skill version 1.1.11.

Untagged tip `0469c97..5a5cf6a` (2026-10-09 absorb, upstream
#215/#351/#380/#382/#384/#389/#391/#393) changes `patterns.js` and
`CHANGELOG.md` only; `validate.js` and `CATEGORIES.md` have no delta, and the
functional body of `validate.js` still matches ours once the four-line packaging
banner is stripped. Five durable changes:

1. **`features` is a copula substitute only as a verb** (#351/#384/#391/#393).
   A bounded noun-context heuristic covers sentence, line and list openers,
   determiners, numbers, possessives, quantifiers, `of`/`or` and compound
   modifiers, plus bare product objects ("we ship features"), and treats
   "which/what features" in an indirect question and "whose features" as nouns.
   Verb uses still flag: "the app features a dashboard", relative clauses
   ("a library which features dashboards"), and versioned product subjects
   ("GPT-5 features a..."). Upstream states plainly that this is a context
   heuristic, not a grammatical classifier. Probed at absorb: "three new
   features" and a *Features* heading quiet, "the app features a dashboard" and
   "a library which features dashboards" still flag, "Decide which features
   matter" quiet, "a library features support for async tasks" flags while "The
   experimental features support for offline mode" stays quiet.
2. **The lookalike gate is decided per sentence** (#389, follow-up to #352).
   A sentence unit now keeps internal ASCII-token dots ("07.10", "v1.2",
   "report.pdf") and prose hard wraps, and ends only on sentence punctuation,
   blank lines, Markdown separators/tables and HTML block starts. A word spelled
   entirely in lookalike letters is swapped only when its sentence holds no
   non-lookalike Cyrillic or Greek letter. Probed at absorb: Russian technical
   prose beside English terms is quiet where the old engine emitted
   `normalization-flag`. Fully substituted words beside Russian or Greek prose,
   including across plain hard wraps, remain a documented limit.
3. **Word-table suggestions are concrete** (#215/#380). Rows that read
   *describe what changed* / *describe the actual complexity* now carry a direct
   alternative (`game-changer` -> "changes how [X] works", `tapestry` ->
   "complex structure, rich history", `synergy` -> "combined effect, benefit of
   working together", `symphony` -> "coordination, balance", `multifaceted` ->
   "having several parts, with several aspects", `paradigm-shifting` ->
   "changes the basic model", `transformative` -> "changes how [X] works" as an
   adjective and "major change, overhaul" as a noun). `breakthrough` is removed
   from the `game-changer` suggestions so the table stops preserving an
   unsupported importance claim. Probed at absorb through the engine's own
   `suggestion` field.
4. **Long self-scan documents use a rounded word-weighted average** of their
   accepted chunks instead of the worst chunk score (#382). Upstream keeps this
   in `scripts/self-scan.js`, which this package does not vendor. The package
   reimplements the same algorithm in `scripts/longdoc.js` and applies it in the
   analyze CLI, because the engine refusal above 10,000 words returned a clean
   zero for a long draft. Short-document scoring is unchanged.
5. **Sentence-boundary handling** for the homoglyph pass is shared with the
   normalization pre-pass, so Markdown block starts cannot hide a swap inside
   unrelated text.

Vendored since 2.12.12: `detector/patterns.test.js` as
`scripts/engine-fixtures.js` (verbatim, 275 cases, requires the vendored
`./patterns.js`), and the `#382` algorithm as `scripts/longdoc.js`. Still not
vendored: `scripts/self-scan.js` (upstream self-scan tooling, not the detector
engine), `cursor-rules/` (the generated rule drops the `normalize-quotes.js`
command, which this monorepo does not ship), `dist/` (flattened paste artifact
with no local consumer), and the `.ssot.yaml` / promo-drift workflow release
plumbing. Engine pin stays `5a5cf6a`. Detector skill version 1.2.0.

## 6. Opinion report (required)

Per monorepo SOURCES Update procedure: rate changes minor/moderate/major, what
they enable, and any rule conflicts (`change existing` / `ignore new` / `hybrid`).
