<h1 align="center">go2048</h1>

<p align="center">
  A fast, modern <b>2048</b> built as an H5 game with <b>PixiJS&nbsp;v8</b> —
  packaged for iOS &amp; Android with <b>Capacitor (Ionic)</b>.
</p>

<p align="center">
  <a href="https://fighttechvn.github.io/play2048/"><b>▶ Play in your browser</b></a>
</p>

<p align="center">
  <img src="docs/screenshot.png" alt="go2048 gameplay" width="300" />
</p>

---

## 🎮 The game

Slide the tiles, merge matching numbers, and chase **2048** — then keep going for a
high score. Classic 2048 rules, rebuilt from scratch with smooth tile animations on a
clean dark board.

**How to play**

- **Desktop:** arrow keys or **WASD**.
- **Mobile / touch:** swipe up · down · left · right.
- Every move spawns a new tile. Two tiles with the same number merge into one worth
  double. Reach **2048** to win — the board keeps going so you can push for more.
- Your game and **best score** are saved automatically; close and come back any time.

## ✨ Features

- 🧊 **PixiJS v8** rendering (WebGL with automatic Canvas fallback) — buttery 60 fps.
- 📱 **Responsive** portrait layout that fills any phone, tablet, or desktop window.
- 💾 **Auto-save** of the current game + best score (`@capacitor/preferences`).
- 📳 **Haptics** on merges (native).
- 🌑 Polished **dark theme** with the familiar warm 2048 tile ramp.
- 📦 One codebase → **Web, iOS, and Android** via Capacitor.

## 🛠️ Tech stack

| Layer | Tech |
|---|---|
| Game engine | [PixiJS v8](https://pixijs.com) (WebGL / WebGPU / Canvas) |
| Language / bundler | TypeScript + [Vite](https://vite.dev) |
| Native packaging | [Capacitor 8](https://capacitorjs.com) (Ionic) — SPM on iOS, Gradle on Android |
| Storage / native | `@capacitor/preferences`, `@capacitor/haptics`, `@capacitor/splash-screen` |

## 🚀 Run it locally

```bash
npm install
npm run dev      # http://localhost:5173

# or use the helper scripts:
./run.sh web      # dev server in the browser
./run.sh ios      # iOS Simulator
./run.sh android  # Android emulator/device
```

## 📦 Build

```bash
npm run build        # web → dist/
./build.sh android   # signed APK  → build-output/go2048-release.apk
./build.sh aab       # AAB         → build-output/go2048-release.aab
./build.sh ios       # signed IPA  → build-output/
```

## 🌐 Deploy the web build (GitHub Pages)

```bash
./scripts/deploy-web.sh     # builds dist/ and publishes it to the gh-pages branch
```

Live at **https://fighttechvn.github.io/play2048/**.

## 📲 Distribution

- **iOS** → TestFlight (`bundle vn.fighttech.go2048`).
- **Android** → Firebase App Distribution for testers; Play Store
  (`com.tozstudio.go2048`) — see [`RELEASE.md`](RELEASE.md).

Full build, signing, and store-submission details live in
**[RELEASE.md](RELEASE.md)**.

## 📁 Project layout

```
src/            game logic + PixiJS rendering (TypeScript)
index.html      web entry
capacitor.config.ts
android/  ios/   Capacitor native projects
assets/logo.svg source art → app icons / splash
scripts/        env, build, run, deploy helpers
```

## 📄 License

© FightTech. All rights reserved.
