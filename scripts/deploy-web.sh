#!/usr/bin/env bash
#
# deploy-web.sh — publish the marketing landing site (with the playable game
# under /play/) to the gh-pages branch. Live at
#   https://fighttechvn.github.io/play2048/         → landing + privacy/terms/support
#   https://fighttechvn.github.io/play2048/play/    → the playable game
#
set -euo pipefail
cd "$(dirname "$0")/.."

REPO="${PAGES_REPO:-https://github.com/fighttechvn/play2048}"
BRANCH="gh-pages"

echo "==> Building game (Vite)"
npm run build

echo "==> Assembling site (landing at root + game at /play/)"
PUB="$(mktemp -d)"
cp -R landing/. "$PUB/"          # marketing landing + legal pages at root
mkdir -p "$PUB/play"
cp -R dist/. "$PUB/play/"        # playable game under /play/
touch "$PUB/.nojekyll"           # don't run Jekyll over the assets

echo "==> Publishing to ${BRANCH} on ${REPO}"
( cd "$PUB"
  git init -q -b "$BRANCH"
  git add -A
  git -c user.email="deploy@fighttech.vn" -c user.name="go2048 deploy" \
      commit -qm "deploy go2048 site $(date +%Y-%m-%d)"
  git push -f "$REPO" "$BRANCH" )
rm -rf "$PUB"

echo "✅ Deployed."
echo "   Landing: https://fighttechvn.github.io/play2048/"
echo "   Game:    https://fighttechvn.github.io/play2048/play/"
