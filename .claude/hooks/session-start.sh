#!/bin/bash
# Ставит зависимости в начале облачной сессии Claude Code, чтобы сразу работали build/lint.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"
npm install --no-audit --no-fund
