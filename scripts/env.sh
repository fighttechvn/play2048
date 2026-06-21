#!/usr/bin/env bash
# Shared environment for build.sh / run.sh.
# Sourced, not executed. Sets JAVA_HOME (JDK 21, required by Capacitor 8) and
# ANDROID_HOME, picking sensible defaults for this machine.

# --- JDK 21 (Capacitor 8 / cordova-android 14 need it) -----------------------
_need_jdk21() { ! "${JAVA_HOME:-/nonexistent}/bin/java" -version 2>&1 | grep -q 'version "21'; }
if _need_jdk21; then
  for _cand in \
    "/Applications/Android Studio.app/Contents/jbr/Contents/Home" \
    "$(/usr/libexec/java_home -v 21 2>/dev/null)"; do
    if [ -n "$_cand" ] && [ -x "$_cand/bin/java" ]; then
      export JAVA_HOME="$_cand"; break
    fi
  done
fi
if _need_jdk21; then
  echo "⚠️  JDK 21 not found (Capacitor 8 needs it). Android builds may fail." >&2
fi

# --- Android SDK -------------------------------------------------------------
if [ -z "${ANDROID_HOME:-}" ]; then
  for _cand in "$HOME/development/androidsdk" "$HOME/Library/Android/sdk"; do
    if [ -d "$_cand" ]; then export ANDROID_HOME="$_cand"; break; fi
  done
fi
export ANDROID_SDK_ROOT="${ANDROID_HOME:-}"
[ -n "${ANDROID_HOME:-}" ] && export PATH="$ANDROID_HOME/platform-tools:$PATH"

# --- Apple team (for iOS signing) -------------------------------------------
export APPLE_TEAM_ID="${APPLE_TEAM_ID:-86PC33ZDHF}"

echo "JAVA_HOME = ${JAVA_HOME:-<unset>}"
echo "ANDROID_HOME = ${ANDROID_HOME:-<unset>}"
