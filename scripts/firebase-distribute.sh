#!/usr/bin/env bash
#
# firebase-distribute.sh — build a fresh signed APK and push it to
# Firebase App Distribution (Android internal testing, no Play signing needed).
#
#   ./scripts/firebase-distribute.sh ["release notes"]
#
# Reads config from .env.prod: FIREBASE_APP_ID, FIREBASE_GROUPS, and the CI token
# (from FIREBASE_TOKEN, or FIREBASE_TOKEN_FILE pointing at another .env.prod).
#
set -euo pipefail
cd "$(dirname "$0")/.."
# shellcheck source=scripts/env.sh
source scripts/env.sh
set -a; source .env.prod; set +a

NOTES="${1:-go2048 ${APP_VERSION:-} build — Firebase App Distribution}"

# Resolve the Firebase token: inline FIREBASE_TOKEN, else from FIREBASE_TOKEN_FILE.
if [ -z "${FIREBASE_TOKEN:-}" ] && [ -n "${FIREBASE_TOKEN_FILE:-}" ] && [ -f "$FIREBASE_TOKEN_FILE" ]; then
  FIREBASE_TOKEN=$(grep -E '^FIREBASE_TOKEN' "$FIREBASE_TOKEN_FILE" | cut -d= -f2- | tr -d '"')
fi
[ -n "${FIREBASE_TOKEN:-}" ] || { echo "❌ No FIREBASE_TOKEN available" >&2; exit 1; }

echo "==> Building signed release APK"
./build.sh android >/dev/null
APK=build-output/go2048-release.apk

echo "==> Distributing $APK to Firebase ($FIREBASE_APP_ID, groups: $FIREBASE_GROUPS)"
firebase appdistribution:distribute "$APK" \
  --app "$FIREBASE_APP_ID" \
  --token "$FIREBASE_TOKEN" \
  --groups "$FIREBASE_GROUPS" \
  --release-notes "$NOTES"
