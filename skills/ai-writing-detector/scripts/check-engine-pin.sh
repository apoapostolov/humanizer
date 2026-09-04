#!/usr/bin/env bash
# Compare vendored engine files to a local avoid-ai-writing checkout (optional).
# Usage:
#   bash scripts/check-engine-pin.sh
#   AVOID_AI_WRITING_ROOT=/path/to/clone bash scripts/check-engine-pin.sh
#
# Does not require a clone. Without one, prints expected pin + local sha256 only.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# Default optional clone path is intentionally not hard-required.
CLONE="${AVOID_AI_WRITING_ROOT:-}"

PAT_LOCAL="$ROOT/scripts/patterns.js"
VAL_LOCAL="$ROOT/scripts/validate.js"

sha() { sha256sum "$1" | awk '{print $1}'; }

echo "ai-writing-detector engine pin check"
echo "skill_root=$ROOT"
echo "patterns_sha=$(sha "$PAT_LOCAL")"
echo "validate_sha=$(sha "$VAL_LOCAL")"
echo "expected_upstream_tag=v3.29.0 (3 rule types launch-intro/crowd-contrast/fake-casual-prop, pin d8c2351, see monorepo SOURCES.md)"

if [[ -z "$CLONE" ]]; then
  # Common layout — only used if present
  for c in \
    "${HOME}/.local/avoid-ai-writing" \
    "${HOME}/git-ext/avoid-ai-writing" \
    ; do
    if [[ -f "$c/detector/patterns.js" ]]; then
      CLONE="$c"
      break
    fi
  done
fi

if [[ -z "$CLONE" || ! -f "$CLONE/detector/patterns.js" ]]; then
  echo "status=local_only (set AVOID_AI_WRITING_ROOT to diff against a checkout)"
  exit 0
fi

echo "clone=$CLONE"
PAT_UP=$(sha "$CLONE/detector/patterns.js")
VAL_UP=$(sha "$CLONE/detector/validate.js")
echo "upstream_patterns_sha=$PAT_UP"
echo "upstream_validate_sha=$VAL_UP"

st=0
if [[ "$(sha "$PAT_LOCAL")" != "$PAT_UP" ]]; then
  echo "DRIFT patterns.js differs from clone detector/patterns.js"
  st=1
fi
if [[ "$(sha "$VAL_LOCAL")" != "$VAL_UP" ]]; then
  echo "DRIFT validate.js differs from clone detector/validate.js"
  st=1
fi

if [[ "$st" -eq 0 ]]; then
  echo "status=match"
else
  echo "status=drift (refresh vendored files from pin, then smoke.sh)"
fi
exit "$st"
