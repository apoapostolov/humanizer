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

## 6. Opinion report (required)

Per monorepo SOURCES Update procedure: rate changes minor/moderate/major, what
they enable, and any rule conflicts (`change existing` / `ignore new` / `hybrid`).
