#!/usr/bin/env bash
#
# firebase-distribute.sh — build and push a test build to Firebase App
# Distribution (no Play / App Store signing needed for testers).
#
#   ./scripts/firebase-distribute.sh android ["notes"]   # signed APK
#   ./scripts/firebase-distribute.sh ios     ["notes"]   # ad-hoc IPA (all devices)
#   ./scripts/firebase-distribute.sh         ["notes"]   # both
#
# Config from .app_dist/.env.prod: FIREBASE_APP_ID (android),
# FIREBASE_IOS_APP_ID, FIREBASE_GROUPS, FIREBASE_TOKEN.
#
set -euo pipefail
cd "$(dirname "$0")/.."
# shellcheck source=scripts/env.sh
source scripts/env.sh
load_env

PLATFORM="android"; NOTES=""
case "${1:-}" in
  android|ios|both) PLATFORM="$1"; NOTES="${2:-}";;
  "" ) PLATFORM="both";;
  * )  NOTES="$1";;
esac
NOTES="${NOTES:-go2048 ${APP_VERSION:-} — Firebase App Distribution}"

[ -n "${FIREBASE_TOKEN:-}" ] || { echo "❌ No FIREBASE_TOKEN in .env.prod" >&2; exit 1; }

dist_android() {
  echo "==> Building signed release APK"
  ./build.sh android >/dev/null
  echo "==> Distributing APK to Firebase ($FIREBASE_APP_ID)"
  firebase appdistribution:distribute build-output/go2048-release.apk \
    --app "$FIREBASE_APP_ID" --token "$FIREBASE_TOKEN" \
    --groups "$FIREBASE_GROUPS" --release-notes "$NOTES (Android)"
}

dist_ios() {
  echo "==> Building ad-hoc IPA (all devices)"
  npm run build >/dev/null && npx --no-install cap sync ios >/dev/null
  ( cd ios/App && fastlane build_adhoc )   # ruby PATH + env from scripts/env.sh
  echo "==> Distributing IPA to Firebase ($FIREBASE_IOS_APP_ID)"
  firebase appdistribution:distribute ios/build-output/go2048-adhoc.ipa \
    --app "$FIREBASE_IOS_APP_ID" --token "$FIREBASE_TOKEN" \
    --groups "$FIREBASE_GROUPS" --release-notes "$NOTES (iOS ad-hoc)"
}

case "$PLATFORM" in
  android) dist_android ;;
  ios)     dist_ios ;;
  both)    dist_android; dist_ios ;;
esac
echo "✅ Done."
