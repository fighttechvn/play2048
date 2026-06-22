import { Application } from "pixi.js";
import { Capacitor } from "@capacitor/core";
import { GameScene } from "./game/gameScene";
import { attachInput } from "./game/input";
import { COLORS } from "./game/theme";
import { Tweener } from "./game/tween";
import { Hub } from "./hub/hub";

function showFatal(message: string): void {
  const host = document.getElementById("app");
  if (!host) return;
  host.style.display = "block";
  host.innerHTML =
    '<pre style="color:#ff6b6b;font:12px monospace;white-space:pre-wrap;padding:16px">' +
    message.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!) +
    "</pre>";
}

// go2048 (PixiJS) is created lazily the first time it's launched from the Hub,
// then just shown/hidden on subsequent launches (its state persists).
let app: Application | null = null;

async function initGo2048(host: HTMLElement): Promise<void> {
  // PixiJS v7 (WebGL1) — runs on iOS 12+ WKWebView, which lacks the WebGL2
  // that PixiJS v8 requires. The constructor is synchronous in v7.
  app = new Application({
    resizeTo: host,
    background: COLORS.background,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
  host.appendChild(app.view as HTMLCanvasElement);

  const tweener = new Tweener(app.ticker);
  const scene = new GameScene(app, tweener);
  await scene.start();
  attachInput(host, (dir) => scene.handleMove(dir));
}

async function main(): Promise<void> {
  const gameHost = document.getElementById("app")!;

  // SDK embed mode: `?embed=go2048` boots the standalone game directly (no Hub),
  // so a third party can iframe just that game.
  const embed = new URLSearchParams(location.search).get("embed");
  if (embed === "go2048") {
    document.getElementById("hub")!.style.display = "none";
    gameHost.style.display = "block";
    await initGo2048(gameHost);
    return;
  }

  gameHost.style.display = "none"; // hidden until a game is launched
  const hub = new Hub({
    showGo2048: async () => {
      gameHost.style.display = "block";
      if (!app) {
        await initGo2048(gameHost);
      } else {
        app.resize(); // re-apply resizeTo after being display:none
      }
    },
    hideGo2048: () => {
      gameHost.style.display = "none";
    },
  });
  await hub.start();

  // Hide the native splash once the Discover dashboard is up.
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
