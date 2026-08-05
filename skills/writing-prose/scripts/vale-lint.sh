#!/usr/bin/env bash
# Hermes house prose lint gate (vale).
# Usage: vale-lint.sh <file-or-dir...>
# Semantics: vale exits nonzero only on error-level violations (em dash,
# spelling, repetition). Warnings are shown but do not block: fix them in the
# editorial pass. Exit 0 = no hard violations.
# Override config with VALE_CONFIG, binary with VALE_BIN.

set -uo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG="${VALE_CONFIG:-$SKILL_DIR/vale/vale.ini}"

VALE="${VALE_BIN:-}"
if [ -z "$VALE" ]; then
  if command -v vale >/dev/null 2>&1; then
    VALE="vale"
  elif [ -x "$HOME/.local/bin/vale" ]; then
    VALE="$HOME/.local/bin/vale"
  else
    echo "vale not found. Install from https://github.com/vale-cli/vale" >&2
    exit 127
  fi
fi

exec "$VALE" --config "$CONFIG" --minAlertLevel=warning "$@"
