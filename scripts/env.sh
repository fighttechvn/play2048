#!/usr/bin/env bash
# Shared environment for build.sh / run.sh / firebase-distribute.sh.
# Sourced, not executed. Sets JAVA_HOME (JDK 21), ANDROID_HOME, a portable
# ruby/fastlane PATH, $APP_DIST, and the load_env helper. No hardcoded
# machine-specific paths.

# Project root — found by walking up to the capacitor.config.ts marker. This is
# shell-agnostic (BASH_SOURCE is empty under zsh) and works whether env.sh is
# executed via the bash scripts or sourced directly. All entry scripts cd to the
# project root before sourcing, so $PWD starts there.
_d="$PWD"
while [ "$_d" != "/" ] && [ ! -e "$_d/capacitor.config.ts" ]; do _d="$(dirname "$_d")"; done
if [ -e "$_d/capacitor.config.ts" ]; then APP_ROOT="$_d"; else APP_ROOT="$PWD"; fi
export APP_DIST="$APP_ROOT/.app_dist"

# --- JDK 21 (Capacitor 8 / cordova-android 14 need it) -----------------------
_need_jdk21() { ! "${JAVA_HOME:-/nonexistent}/bin/java" -version 2>&1 | grep -q 'version "21'; }
if _need_jdk21; then
  for _cand in \
    "/Applications/Android Studio.app/Contents/jbr/Contents/Home" \
    "$(/usr/libexec/java_home -v 21 2>/dev/null)"; do
    if [ -n "$_cand" ] && [ -x "$_cand/bin/java" ]; then export JAVA_HOME="$_cand"; break; fi
  done
fi
_need_jdk21 && echo "⚠️  JDK 21 not found (Capacitor 8 needs it). Android builds may fail." >&2

# --- Android SDK -------------------------------------------------------------
if [ -z "${ANDROID_HOME:-}" ]; then
  for _cand in "$HOME/development/androidsdk" "$HOME/Library/Android/sdk"; do
    [ -d "$_cand" ] && export ANDROID_HOME="$_cand" && break
  done
fi
export ANDROID_SDK_ROOT="${ANDROID_HOME:-}"
[ -n "${ANDROID_HOME:-}" ] && export PATH="$ANDROID_HOME/platform-tools:$PATH"

# --- Ruby / fastlane (Homebrew ruby; gem bindir resolved, not hardcoded) -----
if [ -x /opt/homebrew/opt/ruby/bin/ruby ]; then
  export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
  _gembin="$(/opt/homebrew/opt/ruby/bin/ruby -e 'print Gem.bindir' 2>/dev/null)"
  [ -n "$_gembin" ] && export PATH="$_gembin:$PATH"
fi

# --- Apple team (for iOS signing) -------------------------------------------
export APPLE_TEAM_ID="${APPLE_TEAM_ID:-86PC33ZDHF}"

# --- load_env: make credentials available -----------------------------------
# Canonical credentials live in .app_dist/.env.prod (private repo). If the
# project root has no .env.prod, copy it over so local tools find it, then
# source it. $APP_DIST is exported first so the file's ${APP_DIST} paths resolve.
load_env() {
  local src=""
  [ -f "$APP_DIST/.env.prod" ] && src="$APP_DIST/.env.prod"
  [ -z "$src" ] && [ -f "$APP_ROOT/.env.prod" ] && src="$APP_ROOT/.env.prod"
  if [ -z "$src" ]; then
    echo "❌ No .env.prod found (looked in .app_dist/ and project root)." >&2
    echo "   Check out the private play2048.app_dist repo into .app_dist/." >&2
    return 1
  fi
  if [ ! -f "$APP_ROOT/.env.prod" ]; then
    cp "$src" "$APP_ROOT/.env.prod"
    echo "Copied .env.prod from .app_dist for the build."
  fi
  set -a; . "$src"; set +a
  export LANG="${LANG:-en_US.UTF-8}" LC_ALL="${LC_ALL:-en_US.UTF-8}"
}

# ensure_fastlane: the canonical Appfile/Fastfile + store metadata live in
# .app_dist/fastlane/{android,ios} (private repo). Mirror them into the native
# projects (android/fastlane, ios/App/fastlane — both gitignored) so fastlane
# finds ./fastlane when run from each platform dir. ALWAYS refresh from the
# canonical source (rm + cp) — a "copy only if missing" left stale/cross-copied
# Fastfiles (e.g. the android lanes landing in ios/App/fastlane).
ensure_fastlane() {
  local plat src dst
  for plat in android ios; do
    src="$APP_DIST/fastlane/$plat"
    [ "$plat" = "ios" ] && dst="$APP_ROOT/ios/App/fastlane" || dst="$APP_ROOT/android/fastlane"
    if [ -d "$src" ]; then
      rm -rf "$dst"; cp -R "$src" "$dst"
      echo "Synced $plat fastlane from .app_dist"
    elif [ ! -d "$dst" ]; then
      echo "⚠️  No fastlane for $plat in .app_dist/fastlane/." >&2
    fi
  done
}

echo "JAVA_HOME = ${JAVA_HOME:-<unset>}"
echo "ANDROID_HOME = ${ANDROID_HOME:-<unset>}"
echo "APP_DIST = $APP_DIST"
