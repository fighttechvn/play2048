#!/usr/bin/env bash
# Build every source mini-game into public/games/<id>/ (+ landing/sdk/<id>.zip).
# Runs automatically before the main app build (npm "prebuild"). bubbo-bubbo is an
# external PixiJS open-game — fetched/built separately by scripts/fetch-bubbo.sh.
set -euo pipefail
cd "$(dirname "$0")"
for bs in */build.sh; do bash "$bs"; done
[ -f "../public/games/bubbo-bubbo/index.html" ] || \
  echo "ℹ️  bubbo-bubbo not installed — run ./scripts/fetch-bubbo.sh to add it to the hub."
