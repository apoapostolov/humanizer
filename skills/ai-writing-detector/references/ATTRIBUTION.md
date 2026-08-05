# AI writing detector — engine attribution

## Upstream engine

- Project: [conorbronsdon/avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing)
- Vendored paths: `detector/patterns.js` → `scripts/patterns.js`,
  `detector/validate.js` → `scripts/validate.js`
- License: MIT
- Category research trail: upstream `detector/CATEGORIES.md` (rewritten locally
  as `references/categories.md`)

## This package (not upstream)

| Path | Role |
| --- | --- |
| `scripts/report.js` | Sanitized analyze report (`signals_only`) |
| `scripts/analyze.js` | Production CLI |
| `scripts/validate-cli.js` | Validate CLI + JSON schema wrapper |
| `scripts/smoke.sh` | Fixture smoke tests |
| `fixtures/` | Deterministic test inputs |
| `references/*` | Limits, examples, relationship, localized categories |

## Self-contained runtime

No separate checkout is required. Node.js >= 18. No npm dependencies.

Upstream-only research assets (hash-only corpus, FP runners, PROOF.md) are not
shipped. See [measurement-notes.md](measurement-notes.md).

## Update rule

1. Diff upstream `detector/patterns.js`, `validate.js`, and category changes
   after the pin in monorepo `SOURCES.md`.
2. Copy engine files into `scripts/` (keep our `report.js` / CLIs / smoke).
3. Refresh `references/categories.md` if types change.
4. Run `bash scripts/smoke.sh`.
5. Bump skill `version` (patch for engine pin; minor if report schema breaks).
