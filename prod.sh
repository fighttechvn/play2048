#!/usr/bin/env bash
#
# prod.sh — production STORE release through fastlane (App Store + Google Play).
# The internal-distribution path (Firebase) is scripts/firebase-distribute.sh.
#
#   ./prod.sh android          build signed AAB + upload to Play internal (draft)
#   ./prod.sh ios              build signed IPA + upload to TestFlight
#   ./prod.sh                  both
#   ./prod.sh android-listing  upload Play store listing (metadata + images)
#   ./prod.sh ios-listing      upload App Store listing (metadata + screenshots)
#
# Prereqs are handled automatically:
#   • load_env     — sources .app_dist/.env.prod (copies it to ./ if missing)
#   • ensure_fastlane — copies .app_dist/fastlane/{android,ios} into the native
#                       projects if android/fastlane or ios/App/fastlane is absent
# Both require the private play2048.app_dist repo checked out into .app_dist/.
#
set -euo pipefail
cd "$(dirname "$0")"
# shellcheck source=scripts/env.sh
source scripts/env.sh
load_env
ensure_fastlane

hr() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }

# Build the web app + copy it into the native project BEFORE the native build —
# fastlane's gradle/xcodebuild lanes do NOT do this, so without it the store
# build ships stale web assets.
sync_web() {
  hr "Building web + cap sync ($1)"
  npm run build
  npx --no-install cap sync "$1"
}

prod_android() {
  sync_web android
  hr "Google Play — build AAB + upload to internal track (draft)"
  ( cd android && fastlane internal )
}

prod_ios() {
  sync_web ios
  hr "App Store — build signed IPA + upload to TestFlight"
  ( cd ios/App && fastlane build_ipa && fastlane testflight_upload )
}

android_listing() {
  hr "Google Play — upload store listing (metadata + images)"
  ( cd android && fastlane metadata )
}

ios_listing() {
  hr "App Store — upload listing (metadata + screenshots)"
  # screenshots go in a separate call: a brand-new first version 'No data's on
  # the version-finalize step that runs after text-metadata upload.
  ( cd ios/App && fastlane release_listing; fastlane upload_screenshots )
}

case "${1:-both}" in
  android)          prod_android ;;
  ios)              prod_ios ;;
  both|"")          prod_android; prod_ios ;;
  android-listing)  android_listing ;;
  ios-listing)      ios_listing ;;
  *) echo "usage: ./prod.sh [android|ios|both|android-listing|ios-listing]"; exit 1 ;;
esac

hr "Done."
