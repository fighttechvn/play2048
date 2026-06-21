#!/usr/bin/env bash
#
# deploy-web.sh — build the web app and publish dist/ to the gh-pages branch
# of the GitHub Pages repo. Live at https://fighttechvn.github.io/play2048/
#
set -euo pipefail
cd "$(dirname "$0")/.."

REPO="${PAGES_REPO:-https://github.com/fighttechvn/play2048}"
BRANCH="gh-pages"

echo "==> Building web (Vite)"
npm run build

echo "==> Publishing dist/ to ${BRANCH} on ${REPO}"
touch dist/.nojekyll            # tell GitHub Pages not to run Jekyll on the assets
pushd dist >/dev/null
rm -rf .git
git init -q -b "$BRANCH"
git add -A
git -c user.email="deploy@fighttech.vn" -c user.name="go2048 deploy" \
    commit -qm "deploy go2048 web $(date +%Y-%m-%d)"
git push -f "$REPO" "$BRANCH"
rm -rf .git
popd >/dev/null

echo "✅ Deployed. Live at https://fighttechvn.github.io/play2048/ (allow ~1 min)"
