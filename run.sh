#!/usr/bin/env bash
#
# run.sh — run go2048 during development.
#
#   ./run.sh            run on BOTH iOS Simulator + Android emulator/device
#   ./run.sh android    run on Android emulator/device only
#   ./run.sh ios         run on iOS Simulator only
#   ./run.sh web         run the Vite dev server in the browser
#
# Extra args after the platform are passed through to `cap run`
# (e.g. ./run.sh ios --target "iPhone 17 Pro").
#
set -euo pipefail
cd "$(dirname "$0")"
# shellcheck source=scripts/env.sh
source scripts/env.sh

TARGET="${1:-all}"
shift || true

hr() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }

sync_web() {
  hr "Building web + cap sync ($1)"
  npm run build
  npx --no-install cap sync "$1"
}

run_web() {
  hr "Starting Vite dev server (http://localhost:5173)"
  npm run dev
}

run_ios() {
  sync_web ios
  hr "Running on iOS Simulator"
  # Auto-pick a booted simulator if the caller didn't specify a target.
  if [ "$#" -eq 0 ]; then
    local udid
    udid=$(xcrun simctl list devices booted -j 2>/dev/null \
      | /usr/bin/python3 -c 'import json,sys; d=json.load(sys.stdin); ids=[x["udid"] for v in d["devices"].values() for x in v if x.get("state")=="Booted"]; print(ids[0] if ids else "")' 2>/dev/null || true)
    if [ -n "$udid" ]; then set -- --target "$udid"; fi
  fi
  npx --no-install cap run ios "$@"
}

run_android() {
  sync_web android
  hr "Running on Android emulator/device"
  # Auto-pick the first connected device/emulator if none specified.
  if [ "$#" -eq 0 ] && command -v adb >/dev/null 2>&1; then
    local dev
    dev=$(adb devices | awk 'NR>1 && $2=="device"{print $1; exit}')
    if [ -n "$dev" ]; then set -- --target "$dev"; fi
  fi
  npx --no-install cap run android "$@"
}

case "$TARGET" in
  web)        run_web ;;
  android)    run_android "$@" ;;
  ios)        run_ios "$@" ;;
  all|"")     run_ios; run_android ;;
  *) echo "usage: ./run.sh [web|android|ios]"; exit 1 ;;
esac
