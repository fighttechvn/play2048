// Game Hub — the Discover dashboard (DOM) + the full-screen game launcher (EP02).
// DOM/CSS is the right tool for a scrollable card list; games render in PixiJS
// (internal) or a sandboxed iframe (external). Themed with the shared palette.

import { GAMES, type GameMeta } from "./registry";
import { resolveIsDark, setThemeMode, hexString, COLORS, type ThemeMode } from "../game/theme";
import { isRTL, setLocale, t, type Locale } from "../game/i18n";
import { loadSettings, saveSettings } from "../game/storage";
import { Preferences } from "@capacitor/preferences";

const THEME_CYCLE: ThemeMode[] = ["system", "light", "dark"];

const APP_NAME = "go2048";
const APP_VERSION = "1.1.1";
const APP_BUILD = "15";
const BASE = "https://fighttechvn.github.io/play2048";
const LINKS = { privacy: `${BASE}/privacy/`, terms: `${BASE}/terms/`, support: `${BASE}/support/` };
const LANG_NAMES: Record<Locale, string> = {
  en: "English", vi: "Tiếng Việt", ko: "한국어", zh: "中文", ar: "العربية",
};

export interface HubHooks {
  /** Lazily create + show the go2048 PixiJS canvas. */
  showGo2048: () => void | Promise<void>;
  /** Hide the go2048 canvas. */
  hideGo2048: () => void;
}

export class Hub {
  private root = document.getElementById("hub")!;
  private frame!: HTMLIFrameElement;
  private backBtn!: HTMLButtonElement;
  private notInstalled!: HTMLDivElement;
  private themeMode: ThemeMode = "system";
  private locale: Locale = "en";

  constructor(private hooks: HubHooks) {}

  async start(): Promise<void> {
    const s = await loadSettings();
    this.themeMode = s.theme ?? "system";
    this.locale = s.locale ?? this.locale;
    setThemeMode(this.themeMode);
    setLocale(this.locale);
    this.injectStyles();
    this.buildChrome();
    this.applyTheme();
    this.render();
    this.show();
    await this.maybeAutoOpen();
  }

  /** Deep-link: ?open=<id> (web) or a one-shot stored key (native) opens a game. */
  private async maybeAutoOpen(): Promise<void> {
    let id = new URLSearchParams(location.search).get("open");
    if (!id) {
      try {
        const { value } = await Preferences.get({ key: "go2048.autoOpen" });
        if (value) { id = value; await Preferences.remove({ key: "go2048.autoOpen" }); }
      } catch { /* not native */ }
    }
    if (id) {
      const g = GAMES.find((x) => x.id === id);
      if (g) await this.launch(g);
    }
  }

  // ---- view ------------------------------------------------------------

  private render(): void {
    const list = this.root.querySelector(".hub-list")!;
    list.innerHTML = "";
    for (const g of GAMES) list.appendChild(this.card(g));
    (this.root.querySelector(".hub-title") as HTMLElement).textContent = t("discover");
    this.root.dir = isRTL(this.locale) ? "rtl" : "ltr";
  }

  private card(g: GameMeta): HTMLElement {
    const el = document.createElement("article");
    el.className = "hub-card";
    el.innerHTML = `
      <div class="hub-cover">
        <img src="${g.thumbnail}" alt="${g.title}" loading="lazy"
             onerror="this.style.display='none'" />
        ${g.badge ? `<span class="hub-badge">${g.badge}</span>` : ""}
      </div>
      <div class="hub-body">
        <div class="hub-head">
          <h3>${g.title}</h3>
          <button class="hub-details" type="button">${t("details")} →</button>
        </div>
        <p class="hub-tagline">${g.tagline}</p>
        <div class="hub-stats">
          ${g.stats
            .map((s) => `<div class="hub-stat"><b>${s.value}</b><span>${s.label}</span></div>`)
            .join('<div class="hub-divider"></div>')}
        </div>
        <button class="hub-play" type="button">${t("playNow")}</button>
      </div>`;
    el.querySelector(".hub-play")!.addEventListener("click", () => this.launch(g));
    el.querySelector(".hub-details")!.addEventListener("click", () =>
      el.classList.toggle("expanded"),
    );
    return el;
  }

  // ---- launch / back ---------------------------------------------------

  private async launch(g: GameMeta): Promise<void> {
    this.hide();
    this.backBtn.style.display = "grid";
    this.notInstalled.style.display = "none";
    if (g.type === "internal") {
      this.frame.style.display = "none";
      await this.hooks.showGo2048();
    } else {
      this.hooks.hideGo2048();
      this.frame.style.display = "block";
      this.frame.src = g.entry;
      // If the bundle isn't installed the iframe fails to load anything useful.
      this.frame.onerror = () => this.showNotInstalled(g);
      // Heuristic: probe the entry; show a friendly panel if it 404s.
      fetch(g.entry, { method: "HEAD" })
        .then((r) => { if (!r.ok) this.showNotInstalled(g); })
        .catch(() => this.showNotInstalled(g));
    }
  }

  private showNotInstalled(g: GameMeta): void {
    this.frame.style.display = "none";
    this.notInstalled.style.display = "grid";
    this.notInstalled.innerHTML = `
      <div>
        <h2>${g.title} isn't installed</h2>
        <p>Fetch &amp; build its bundle into <code>public/${g.entry.replace(/\/index\.html$/, "")}</code>:</p>
        <pre>./scripts/fetch-bubbo.sh</pre>
        <button class="hub-play" type="button" id="ni-back">${t("discover")}</button>
      </div>`;
    this.notInstalled.querySelector("#ni-back")!.addEventListener("click", () => this.show());
  }

  private show(): void {
    this.root.style.display = "block";
    this.backBtn.style.display = "none";
    this.frame.style.display = "none";
    this.frame.src = "about:blank";
    this.notInstalled.style.display = "none";
    this.hooks.hideGo2048();
  }

  private hide(): void {
    this.root.style.display = "none";
  }

  // ---- chrome (back, frame, theme/lang toggles) ------------------------

  private buildChrome(): void {
    this.root.innerHTML = `
      <header class="hub-topbar">
        <span class="hub-title">Discover</span>
        <div class="hub-controls">
          <button class="hub-ctl hub-theme" type="button" aria-label="Theme">☀</button>
          <button class="hub-ctl hub-cog" type="button" aria-label="Settings">⚙</button>
        </div>
      </header>
      <div class="hub-list"></div>`;

    this.frame = document.createElement("iframe");
    this.frame.className = "hub-frame";
    this.frame.allow = "autoplay; fullscreen; gamepad";
    document.body.appendChild(this.frame);

    this.notInstalled = document.createElement("div");
    this.notInstalled.className = "hub-notinstalled";
    document.body.appendChild(this.notInstalled);

    this.backBtn = document.createElement("button");
    this.backBtn.className = "hub-back";
    this.backBtn.innerHTML = "‹";
    this.backBtn.setAttribute("aria-label", "Back to Discover");
    this.backBtn.addEventListener("click", () => this.show());
    document.body.appendChild(this.backBtn);

    this.root.querySelector(".hub-theme")!.addEventListener("click", () => {
      this.themeMode = THEME_CYCLE[(THEME_CYCLE.indexOf(this.themeMode) + 1) % 3];
      setThemeMode(this.themeMode);
      this.applyTheme();
      void saveSettings(this.themeMode, this.locale);
    });
    this.root.querySelector(".hub-cog")!.addEventListener("click", () => this.showSettings());
    this.buildSettings();
  }

  // ---- settings screen -------------------------------------------------

  private settings!: HTMLDivElement;

  private buildSettings(): void {
    this.settings = document.createElement("div");
    this.settings.className = "hub-settings";
    document.body.appendChild(this.settings);
  }

  private showSettings(): void {
    this.renderSettings();
    this.settings.style.display = "block";
  }
  private hideSettings(): void {
    this.settings.style.display = "none";
  }

  private renderSettings(): void {
    const modes: ThemeMode[] = ["system", "light", "dark"];
    const seg = modes
      .map(
        (m) =>
          `<button class="set-seg ${m === this.themeMode ? "on" : ""}" data-mode="${m}">${t(m)}</button>`,
      )
      .join("");
    const langs = (["en", "vi", "ko", "zh", "ar"] as Locale[])
      .map(
        (l) =>
          `<button class="set-row ${l === this.locale ? "on" : ""}" data-lang="${l}">
            <span>${LANG_NAMES[l]}</span><span class="set-check">${l === this.locale ? "✓" : ""}</span></button>`,
      )
      .join("");
    this.settings.dir = isRTL(this.locale) ? "rtl" : "ltr";
    this.settings.innerHTML = `
      <header class="set-top">
        <button class="set-back" aria-label="Back">‹</button>
        <span>${t("settings")}</span><span style="width:40px"></span>
      </header>
      <div class="set-body">
        <div class="set-label">${t("appearance")}</div>
        <div class="set-segwrap">${seg}</div>
        <div class="set-label">${t("language")}</div>
        <div class="set-card">${langs}</div>
        <div class="set-label">${t("support")}</div>
        <div class="set-card">
          <a class="set-row" href="${LINKS.privacy}" target="_blank" rel="noopener"><span>${t("privacy")}</span><span class="set-check">›</span></a>
          <a class="set-row" href="${LINKS.terms}" target="_blank" rel="noopener"><span>${t("terms")}</span><span class="set-check">›</span></a>
          <a class="set-row" href="${LINKS.support}" target="_blank" rel="noopener"><span>${t("support")}</span><span class="set-check">›</span></a>
        </div>
        <div class="set-app">
          <img src="thumbs/go2048.png" alt="" />
          <div><b>${APP_NAME}</b><small>${t("version")} ${APP_VERSION}(${APP_BUILD})</small></div>
        </div>
      </div>`;
    this.settings.querySelector(".set-back")!.addEventListener("click", () => this.hideSettings());
    this.settings.querySelectorAll<HTMLElement>(".set-seg").forEach((b) =>
      b.addEventListener("click", () => {
        this.themeMode = b.dataset.mode as ThemeMode;
        setThemeMode(this.themeMode);
        this.applyTheme();
        void saveSettings(this.themeMode, this.locale);
        this.renderSettings();
      }),
    );
    this.settings.querySelectorAll<HTMLElement>("[data-lang]").forEach((b) =>
      b.addEventListener("click", () => {
        this.locale = b.dataset.lang as Locale;
        setLocale(this.locale);
        void saveSettings(this.themeMode, this.locale);
        this.render();
        this.renderSettings();
      }),
    );
  }

  private applyTheme(): void {
    const dark = resolveIsDark(this.themeMode);
    const hex = hexString(COLORS.background);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    // Update the CSS var the html/body bg uses (not just body) so the safe-area
    // / overscroll regions follow the theme instead of staying the dark default
    // (the "black top/bottom").
    document.documentElement.style.setProperty("--bg", hex);
    document.body.style.background = hex;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", hex);
    (this.root.querySelector(".hub-theme") as HTMLElement).textContent = dark ? "☾" : "☀";
  }

  private injectStyles(): void {
    if (document.getElementById("hub-styles")) return;
    const css = document.createElement("style");
    css.id = "hub-styles";
    css.textContent = HUB_CSS;
    document.head.appendChild(css);
  }
}

const HUB_CSS = `
:root{--hb:#0f1115;--hs:#171a20;--hs2:#1d2128;--ht:#e6e8ec;--hm:#8b909a;--hbd:#262a32;--acc:#f2b137;--accd:#1a1d23}
[data-theme=light]{--hb:#faf8ef;--hs:#fff;--hs2:#f3efe2;--ht:#5b5247;--hm:#9a9286;--hbd:#e9e2d4;--acc:#c77f1a;--accd:#fff}
#hub{position:fixed;inset:0;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;background:var(--hb);color:var(--ht);
 font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
.hub-topbar{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;
 padding:calc(18px + env(safe-area-inset-top,0px)) 20px 18px;background:var(--hb);border-bottom:1px solid var(--hbd)}
.hub-title{font-size:30px;font-weight:800;letter-spacing:-.02em}
.hub-controls{display:flex;gap:8px}
.hub-ctl{width:42px;height:42px;border-radius:12px;border:1px solid var(--hbd);background:var(--hs2);
 color:var(--ht);font-weight:700;font-size:15px;cursor:pointer}
.hub-list{max-width:560px;margin:0 auto;padding:16px 16px calc(40px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:18px}
.hub-card{background:var(--hs);border:1px solid var(--hbd);border-radius:20px;overflow:hidden}
.hub-cover{position:relative;aspect-ratio:16/10;background:linear-gradient(135deg,var(--acc),#e0901a);display:flex}
.hub-cover img{width:100%;height:100%;object-fit:cover}
.hub-badge{position:absolute;left:14px;bottom:14px;background:rgba(0,0,0,.55);color:#fff;font-size:13px;
 font-weight:700;padding:6px 12px;border-radius:999px;backdrop-filter:blur(4px)}
.hub-body{padding:18px 20px 20px}
.hub-head{display:flex;align-items:center;justify-content:space-between}
.hub-head h3{margin:0;font-size:22px;font-weight:800}
.hub-details{border:0;background:none;color:var(--hm);font-weight:600;font-size:14px;cursor:pointer}
.hub-tagline{color:var(--hm);font-size:14.5px;margin:4px 0 0;max-height:0;overflow:hidden;transition:max-height .25s}
.hub-card.expanded .hub-tagline{max-height:80px}
.hub-stats{display:flex;align-items:center;gap:18px;margin:16px 0}
.hub-stat{display:flex;flex-direction:column}
.hub-stat b{font-size:24px;font-weight:800}
.hub-stat span{color:var(--hm);font-size:12.5px;text-transform:uppercase;letter-spacing:.04em}
.hub-divider{width:1px;align-self:stretch;background:var(--hbd)}
.hub-play{width:100%;border:0;border-radius:999px;background:var(--acc);color:var(--accd);
 font-weight:800;font-size:17px;padding:15px;cursor:pointer;transition:filter .15s}
.hub-play:active{filter:brightness(.92)}
.hub-frame{position:fixed;inset:0;border:0;width:100%;height:100%;display:none;background:#000;z-index:5}
.hub-notinstalled{position:fixed;inset:0;display:none;place-items:center;background:var(--hb);color:var(--ht);
 z-index:6;text-align:center;padding:24px;font-family:inherit}
.hub-notinstalled pre{background:var(--hs2);padding:12px 16px;border-radius:10px;display:inline-block;margin:8px 0 18px}
.hub-notinstalled code{background:var(--hs2);padding:2px 6px;border-radius:6px}
.hub-back{position:fixed;top:calc(14px + env(safe-area-inset-top,0px));left:14px;z-index:7;display:none;place-items:center;width:44px;height:44px;
 border-radius:50%;border:0;background:rgba(0,0,0,.55);color:#fff;font-size:30px;line-height:0;cursor:pointer}
[dir=rtl] .hub-back{left:auto;right:14px}
.hub-cog{font-size:20px}
/* settings screen */
.hub-settings{position:fixed;inset:0;z-index:8;display:none;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;
 background:var(--hb);color:var(--ht);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
.set-top{position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-weight:800;font-size:19px;
 padding:calc(14px + env(safe-area-inset-top,0px)) 16px 14px;background:var(--hb);border-bottom:1px solid var(--hbd)}
.set-back{width:40px;height:40px;border:0;background:none;color:var(--ht);font-size:30px;line-height:0;cursor:pointer}
.set-body{max-width:560px;margin:0 auto;padding:16px 16px calc(40px + env(safe-area-inset-bottom,0px))}
.set-app{display:flex;align-items:center;gap:14px;background:var(--hs);border:1px solid var(--hbd);border-radius:16px;padding:16px;margin-top:24px}
.set-app img{width:54px;height:54px;border-radius:13px}
.set-app b{font-size:18px;display:block}.set-app small{color:var(--hm);font-size:13px}
.set-label{color:var(--hm);font-size:12.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin:22px 6px 8px}
.set-segwrap{display:flex;gap:6px;background:var(--hs);border:1px solid var(--hbd);border-radius:14px;padding:6px}
.set-seg{flex:1;border:0;border-radius:10px;background:none;color:var(--ht);font-weight:700;font-size:15px;padding:12px;cursor:pointer}
.set-seg.on{background:var(--acc);color:var(--accd)}
.set-card{background:var(--hs);border:1px solid var(--hbd);border-radius:14px;overflow:hidden}
.set-row{display:flex;align-items:center;justify-content:space-between;width:100%;text-align:start;border:0;background:none;
 color:var(--ht);font-size:16px;font-weight:550;padding:15px 18px;cursor:pointer;text-decoration:none}
.set-row+.set-row{border-top:1px solid var(--hbd)}
.set-row.on{color:var(--acc)}
.set-check{color:var(--acc);font-weight:800}
`;
