import { Application } from "pixi.js";
import { Capacitor } from "@capacitor/core";
import { GameScene } from "./game/gameScene";
import { attachInput } from "./game/input";
import { COLORS } from "./game/theme";
import { Tweener } from "./game/tween";

function showFatal(message: string): void {
  const host = document.getElementById("app");
  if (!host) return;
  host.innerHTML =
    '<pre style="color:#ff6b6b;font:12px monospace;white-space:pre-wrap;padding:16px">' +
    message.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!) +
    "</pre>";
}

async function main(): Promise<void> {
  const host = document.getElementById("app")!;

  const app = new Application();
  await app.init({
    resizeTo: host,
    background: COLORS.background,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    preference: "webgl",
  });
  host.appendChild(app.canvas);

  const tweener = new Tweener(app.ticker);
  const scene = new GameScene(app, tweener);
  await scene.start();

  attachInput(host, (dir) => scene.handleMove(dir));

  // Hide the native splash once the first frame is up.
  if (Capacitor.isNativePlatform()) {
    try {
      const { SplashScreen } = await import("@capacitor/splash-screen");
      await SplashScreen.hide();
    } catch {
      /* plugin not present on web */
    }
  }
}

let started = false;

// Only surface a fatal overlay for failures *before* the canvas is up; once
// the game is running a stray error must not wipe the UI.
window.addEventListener("error", (e) => {
  if (!started) showFatal("error: " + (e.message || e.error));
});
window.addEventListener("unhandledrejection", (e) => {
  if (!started) showFatal("promise: " + (e.reason?.stack || e.reason));
});

void main()
  .then(() => {
    started = true;
  })
  .catch((err) => showFatal("init: " + (err?.stack || String(err))));
