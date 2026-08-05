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
covers mechanical form control via the sibling `plain-english` STE lint. On
such releases, update SOURCES release pins but keep the engine pin and
`check-engine-pin.sh` `expected_upstream_tag` unchanged.

v3.23.1 (2026-08-05) changed no `detector/` files. The Object.hasOwn FP fix
(`constructor` and other `Object.prototype` collisions) was already at our
engine pin `1ea2f0c` (post-v3.23.0 tip). `patterns.js` and the functional body
of `validate.js` are byte-identical between our pin and the tag. The release
formalized CI/release automation (npm provenance pipeline, cursor-rules leak
gate, pattern-count CI assertion). SOURCES release pins updated; engine pin,
detector skill version, and `check-engine-pin.sh` unchanged.

## 6. Opinion report (required)

Per monorepo SOURCES Update procedure: rate changes minor/moderate/major, what
they enable, and any rule conflicts (`change existing` / `ignore new` / `hybrid`).
