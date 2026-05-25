#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_SKILL="$REPO_ROOT/skills/aqua2-ui/SKILL.md"
CODEX_SKILL="${CODEX_HOME:-$HOME/.codex}/skills/aqua2-ui/SKILL.md"

usage() {
  cat <<'EOF'
Usage: scripts/sync-skill.sh [pull|push]

pull: copy SKILL.md from Codex skill directory into repo
push: copy SKILL.md from repo into Codex skill directory
EOF
}

if [[ $# -ne 1 ]]; then
  usage
  exit 1
fi

case "$1" in
  pull)
    if [[ ! -f "$CODEX_SKILL" ]]; then
      echo "Missing Codex skill file: $CODEX_SKILL" >&2
      exit 1
    fi
    mkdir -p "$(dirname "$REPO_SKILL")"
    cp "$CODEX_SKILL" "$REPO_SKILL"
    echo "Pulled to repo: $REPO_SKILL"
    ;;
  push)
    if [[ ! -f "$REPO_SKILL" ]]; then
      echo "Missing repo skill file: $REPO_SKILL" >&2
      exit 1
    fi
    mkdir -p "$(dirname "$CODEX_SKILL")"
    cp "$REPO_SKILL" "$CODEX_SKILL"
    echo "Pushed to Codex: $CODEX_SKILL"
    ;;
  *)
    usage
    exit 1
    ;;
esac
