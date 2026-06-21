# go2048 — Build & Release

An H5 (HTML5) **2048** game built with **PixiJS v8** + **Vite + TypeScript**, packaged
for iOS & Android with **Capacitor (Ionic)**.

| | Value |
|---|---|
| Engine | PixiJS v8 (WebGL, Canvas fallback) |
| Bundler | Vite + TypeScript, output → `dist/` (`webDir`) |
| Native wrapper | Capacitor 8 (SPM on iOS, Gradle on Android) |
| Android applicationId | `com.tozstudio.go2048` (existing Play listing) |
| iOS bundle id | `vn.fighttech.go2048` (new App Store record) |
| Version | `1.1.0`  ·  Android `versionCode 5`  ·  iOS build `5` |
| Persistence | `@capacitor/preferences` (resume game + best score) |
| Min SDK / target | Android `minSdk 24` / `target 36`  ·  iOS 14+ |

> Current Play state checked via the service account: **production = versionCode 4**,
> beta = 3. An update must therefore use **versionCode ≥ 5** (set to 5). ✅

---

## Project layout

```
game-go2048/
  src/                 game + UI (PixiJS v8, TypeScript)
  index.html           web entry
  capacitor.config.ts  appId/appName/webDir + splash
  android/             Capacitor Android project (Gradle)
  ios/                 Capacitor iOS project (SPM)
  assets/logo.svg      source art → icons/splash (via @capacitor/assets)
  signing/             upload keystore + key.properties  (GITIGNORED, secrets)
  .claude/skills/      pixijs + ionic-capacitor skills (installed)
  _reference/          cloned reference repos (gitignored)
```

## Dev / build commands

Convenience scripts (handle JDK 21 + ANDROID_HOME automatically):

```bash
./run.sh            # run on iOS Simulator + Android
./run.sh ios        # iOS Simulator only
./run.sh android    # Android emulator/device only
./run.sh web        # Vite dev server in the browser

./build.sh          # build Android APK + iOS IPA
./build.sh android  # APK  → build-output/go2048-release.apk
./build.sh aab      # AAB  → build-output/go2048-release.aab  (for Play upload)
./build.sh ios      # IPA  → build-output/App.ipa  (needs iOS provisioning, below)
```

Underlying npm commands:

```bash
npm install
npm run dev          # vite dev server (browser)
npm run build        # tsc --noEmit && vite build  → dist/
npx cap sync         # copy dist + plugins into ios/ and android/   (after every build)
```

**JDK note:** Capacitor 8 / cordova-android 14 require **JDK 21**. This machine has
JDK 17 on PATH but Android Studio bundles JBR 21 — use it for Gradle:

```bash
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME=/Users/trunghieuvn/development/androidsdk
```

---

## Android — build the release AAB

```bash
npm run build && npx cap sync
cd android
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" \
ANDROID_HOME=/Users/trunghieuvn/development/androidsdk \
  ./gradlew :app:bundleRelease --no-daemon
# → android/app/build/outputs/bundle/release/app-release.aab  (signed, ~3 MB)
```

Signed with `signing/go2048-upload.jks` (alias `go2048`). Verified: `jar verified`.

### ⚠️ BLOCKER — `com.tozstudio.go2048` is a LEGACY app, NOT on Play App Signing

Tested with a real `fastlane supply` upload (service account has edit access ✅).
Google rejected it with:

> **"For uploading an AppBundle you must be enrolled in Play Signing."**

So this acquired app still uses the **legacy signing** model (APK signed directly
with the original release key, current production = versionCode 4). To upload an
**AAB** the app must be **enrolled in Play App Signing** — and enrolling an existing
app requires providing the **original app signing key** so existing installs stay
upgradeable. That original `com.tozstudio.go2048` key is currently **not in hand**.

**Chosen path — enroll in Play App Signing with our key (PEPK):**

The original key is lost, so we enroll using **`signing/go2048-upload.jks`** as the new
app signing key. Play Console provides an `encryption_public_key.pem` + `pepk.jar`; we
encrypt the key for Google with:

```bash
java -jar pepk.jar \
  --keystore=signing/go2048-upload.jks --alias=go2048 \
  --output=signing/go2048-app-signing-key-encrypted.zip \
  --rsa-aes-encryption --encryption-key-path=encryption_public_key.pem \
  --keystore-pass=<store-pass> --key-pass=<key-pass> --include-cert
```

Output `go2048-app-signing-key-encrypted.zip` (contains `encryptedPrivateKey` +
`certificate.pem`) is uploaded in **Play Console → Test and release → App integrity →
Play App Signing → "Export and upload a key from Java keystore"**. After that, the app
signing key = upload key = `go2048-upload.jks` (cert SHA-256 `95:CD:74:F2:…:75:20`),
and `fastlane internal` uploads the AAB.

> ⚠️ **Existing-install caveat:** the published v4 was signed with the original (lost)
> key. Setting a *different* app signing key means existing installs **cannot update
> over-the-top** (signature mismatch) — they would need to reinstall. Acceptable only if
> the current install base is negligible. There is no way around this without the
> original key.

Once unblocked, upload is one command:

```bash
set -a; source .env.prod; set +a; source scripts/env.sh
cd android && fastlane internal          # build AAB + upload to internal track (draft)
```

### ✅ Android testing NOW — Firebase App Distribution (no Play signing needed)

Until the Play key question is resolved, testers get the APK directly via Firebase
App Distribution (Firebase project **fightechvn**, app
`1:820726184443:android:c96196969bd35acfaab35e`, group **developer**). One command:

```bash
./scripts/firebase-distribute.sh "release notes here"
```

It builds a fresh signed APK (`build-output/go2048-release.apk`) and uploads it.
Config is in `.env.prod` (FIREBASE_APP_ID / FIREBASE_GROUPS / token). The APK is
signed with our `go2048-upload.jks` — fine for Firebase (any signing works; Play
signing is irrelevant here). **First release 1.1.0 (5) already distributed.** ✅

---

## iOS — build & submit (via the `store-release` fastlane lanes)

Bundle id `vn.fighttech.go2048`, version `1.1.0 (5)`. Compiles clean and runs on the
simulator. Fastlane lanes live in `ios/App/fastlane/` (auth = ASC API key `5F4KKWDHNV`,
team `86PC33ZDHF`).

**✅ DONE — build 1.1.0 (5) is on TestFlight.**
- ✅ App ID `vn.fighttech.go2048` registered (id `BT8SXMLD7D`, via ASC API).
- ✅ ASC app record created (id `6782550523`, **"Go2048 Free"**).
- ✅ Signed `.ipa` built (automatic signing, profile created via `-allowProvisioningUpdates`)
  → `ios/build-output/go2048.ipa` (~950 KB).
- ✅ Uploaded to TestFlight via `fastlane testflight_upload`.

Rebuild + re-upload any time (e.g. after bumping the build number):

```bash
set -a; source .env.prod; set +a
export LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8
export PATH="/opt/homebrew/opt/ruby/bin:/opt/homebrew/lib/ruby/gems/3.4.0/bin:$PATH"
npm run build && npx cap sync ios
cd ios/App
fastlane build_ipa && fastlane testflight_upload
# fastlane release_listing    # later: metadata + screenshots for App Store review
```

**Remaining (manual, in App Store Connect):** add TestFlight test info / testers; for a
public App Store release, fill the listing (screenshots, description, privacy, age
rating) and submit for review. `ITSAppUsesNonExemptEncryption=false` is set, so builds
skip the export-compliance prompt.

---

## Signing secrets (NOT in git — `signing/` is gitignored)

| File | Purpose |
|---|---|
| `signing/go2048-upload.jks` | new upload keystore (alias `go2048`) |
| `signing/go2048-upload-certificate.pem` | upload cert → register in Play Console |
| `signing/key.properties` | store/key passwords consumed by Gradle |

Back these up securely (e.g. alongside `HackNaoEnglish/.app_dist`). Losing the
keystore means another upload-key reset.

---

## Store assets still to prepare (manual)

- Screenshots (phone + tablet sizes) — capture from the running app.
- Store listing copy, privacy (no tracking, no ads currently), age rating.
- iOS: App Store Connect metadata + screenshots for `vn.fighttech.go2048`.
