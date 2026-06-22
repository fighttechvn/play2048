#!/usr/bin/env bash
#
# fetch-bubbo.sh — fetch + build the "bubbo-bubbo" game from the PixiJS
# open-games monorepo and install it as an iframe game bundle under
# public/games/bubbo-bubbo/ (referenced by src/hub/registry.ts).
#
#   ./scripts/fetch-bubbo.sh
#
set -euo pipefail
cd "$(dirname "$0")/.."

REPO="https://github.com/pixijs/open-games"
DEST="public/games/bubbo-bubbo"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "==> Sparse-cloning $REPO (bubbo-bubbo only)"
git clone --depth 1 --filter=blob:none --sparse "$REPO" "$WORK/open-games"
( cd "$WORK/open-games" && git sparse-checkout set bubbo-bubbo )

echo "==> Installing + building bubbo-bubbo"
( cd "$WORK/open-games/bubbo-bubbo"
  npm install
  # The repo's build runs AssetPack first (generates src/manifest.json + processes
  # assets) then vite build. Run it, then rebuild vite with a relative base so the
  # bundle runs from any sub-path / iframe.
  npm run build
  npx vite build --base ./ )

echo "==> Installing bundle into $DEST"
rm -rf "$DEST"
mkdir -p "$DEST"
cp -R "$WORK/open-games/bubbo-bubbo/dist/." "$DEST/"

echo "✅ bubbo-bubbo installed at $DEST"
echo "   It now plays in the hub and can be packaged via ./scripts/package-games.sh"
