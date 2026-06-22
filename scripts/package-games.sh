#!/usr/bin/env bash
#
# package-games.sh — build each game in the registry into a self-contained,
# offline-capable bundle and zip it for the landing /sdk download page.
#
#   ./scripts/package-games.sh
#
# Output: landing/sdk/<id>.zip  (one per game)
#
set -euo pipefail
cd "$(dirname "$0")/.."

OUT="landing/sdk"
mkdir -p "$OUT"

hr() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }

# ---- go2048 (this Vite app, built with a relative base so it runs anywhere) --
hr "Packaging go2048"
npm run build >/dev/null
TMP="$(mktemp -d)"; pkg="$TMP/go2048"
mkdir -p "$pkg"
cp -R dist/. "$pkg/"
# Drop the hub-only assets (other games' bundles + card thumbnails) — the
# standalone go2048 package boots straight into the game via ?embed=go2048.
rm -rf "$pkg/games" "$pkg/thumbs"
( cd "$TMP" && zip -qr "go2048.zip" go2048 )
mv "$TMP/go2048.zip" "$OUT/go2048.zip"
rm -rf "$TMP"
echo "✅ $OUT/go2048.zip ($(du -h "$OUT/go2048.zip" | cut -f1))"

# ---- every self-contained iframe game under public/games/<id>/ --------------
for dir in public/games/*/; do
  id="$(basename "$dir")"
  [ -f "$dir/index.html" ] || { echo "⚠️  Skipping $id — no index.html (fetch its bundle first)."; continue; }
  hr "Packaging $id"
  TMP="$(mktemp -d)"
  cp -R "$dir" "$TMP/$id"
  ( cd "$TMP" && zip -qr "$id.zip" "$id" )
  mv "$TMP/$id.zip" "$OUT/$id.zip"
  rm -rf "$TMP"
  echo "✅ $OUT/$id.zip ($(du -h "$OUT/$id.zip" | cut -f1))"
done

hr "Done. Zips in $OUT/"
ls -lh "$OUT"/*.zip 2>/dev/null || true
