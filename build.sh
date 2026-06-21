#!/usr/bin/env bash
#
# build.sh — build release artifacts for go2048.
#
#   ./build.sh            build BOTH: Android APK + iOS IPA
#   ./build.sh android    Android APK only  → build-output/go2048-release.apk
#   ./build.sh ios        iOS IPA only      → build-output/App.ipa
#   ./build.sh aab        Android AAB (for Play upload)
#
# Notes:
#   • APK/AAB are signed with signing/go2048-upload.jks (see signing/key.properties).
#   • IPA export needs the App ID + distribution profile for vn.fighttech.go2048
#     (see RELEASE.md). Without them the archive succeeds but export will fail —
#     the .xcarchive is kept so you can finish signing in Xcode.
#
set -euo pipefail
cd "$(dirname "$0")"
# shellcheck source=scripts/env.sh
source scripts/env.sh

TARGET="${1:-all}"
OUT="build-output"
mkdir -p "$OUT"

hr() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }

build_web() {
  hr "Building web (Vite) + cap sync"
  npm run build
  npx --no-install cap sync
}

build_android_apk() {
  hr "Building Android release APK"
  ( cd android && ./gradlew :app:assembleRelease --no-daemon )
  local apk
  apk=$(find android/app/build/outputs/apk/release -name '*.apk' | head -1)
  cp "$apk" "$OUT/go2048-release.apk"
  echo "✅ APK → $OUT/go2048-release.apk"
}

build_android_aab() {
  hr "Building Android release AAB"
  ( cd android && ./gradlew :app:bundleRelease --no-daemon )
  cp android/app/build/outputs/bundle/release/app-release.aab "$OUT/go2048-release.aab"
  echo "✅ AAB → $OUT/go2048-release.aab"
}

build_ios_ipa() {
  hr "Archiving iOS app"
  local arch="$OUT/App.xcarchive"
  rm -rf "$arch"
  xcodebuild -project ios/App/App.xcodeproj -scheme App \
    -configuration Release -destination 'generic/platform=iOS' \
    -archivePath "$arch" \
    DEVELOPMENT_TEAM="$APPLE_TEAM_ID" \
    -allowProvisioningUpdates archive

  hr "Exporting .ipa"
  if xcodebuild -exportArchive \
      -archivePath "$arch" \
      -exportOptionsPlist scripts/ExportOptions.plist \
      -exportPath "$OUT" \
      -allowProvisioningUpdates; then
    echo "✅ IPA → $OUT/App.ipa"
  else
    echo "⚠️  IPA export failed — almost certainly missing the App Store provisioning"
    echo "    profile / App ID for vn.fighttech.go2048 (see RELEASE.md)."
    echo "    The archive is kept at: $arch  (open in Xcode → Distribute App)."
    return 1
  fi
}

build_web
case "$TARGET" in
  android) build_android_apk ;;
  aab)     build_android_aab ;;
  ios)     build_ios_ipa ;;
  all|"")  build_android_apk; build_ios_ipa || true ;;
  *) echo "usage: ./build.sh [android|ios|aab|all]"; exit 1 ;;
esac

hr "Done — artifacts in $OUT/"
ls -lh "$OUT" 2>/dev/null || true
