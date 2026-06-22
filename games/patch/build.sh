#!/usr/bin/env bash
# Build THIS mini-game standalone: generate levels, assemble a self-contained,
# offline bundle into public/games/<id>/ (for the main app) AND zip it to
# landing/sdk/<id>.zip (its own SDK). Run from anywhere.
set -euo pipefail
cd "$(dirname "$0")"
ID="$(basename "$PWD")"
ROOT="$(cd ../.. && pwd)"
DEST="$ROOT/public/games/$ID"
mkdir -p "$DEST"
node gen-levels.mjs > "$DEST/levels.json"   # full source generator → levels
cp index.html "$DEST/"                       # full self-contained game source
# standalone SDK zip
SDK="$ROOT/landing/sdk"; mkdir -p "$SDK"
TMP="$(mktemp -d)"; cp -R "$DEST" "$TMP/$ID"
( cd "$TMP" && zip -qr "$ID.zip" "$ID" ); mv "$TMP/$ID.zip" "$SDK/$ID.zip"; rm -rf "$TMP"
echo "✅ $ID → public/games/$ID ($(node -e "console.log(require('$DEST/levels.json').count)") levels) + landing/sdk/$ID.zip ($(du -h "$SDK/$ID.zip" | cut -f1))"
