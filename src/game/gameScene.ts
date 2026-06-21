import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Application, Container, Graphics, Text } from "pixi.js";
import { Board, type Direction, type Cell } from "./board";
import { saveState, loadState, saveSettings, loadSettings } from "./storage";
import { COLORS, GRID_SIZE, resolveIsDark, setThemeMode, type ThemeMode } from "./theme";
import {
  detectLocale,
  isRTL,
  localeLabel,
  nextLocale,
  setLocale,
  t,
  type Locale,
} from "./i18n";
import { TileView } from "./tileView";
import { Ease, Tweener } from "./tween";

const N = GRID_SIZE;
const SLIDE_MS = 110;
const POP_MS = 130;
const MAX_BOARD = 520;
const THEME_CYCLE: ThemeMode[] = ["system", "light", "dark"];

type OverlayKind = "win" | "over" | null;

export class GameScene {
  private board = new Board();
  private tiles = new Map<number, TileView>();
  private animating = false;

  private themeMode: ThemeMode = "system";
  private locale: Locale = "en";
  private rtl = false;

  private root = new Container();
  private header = new Container();
  private boardLayer = new Container();
  private boardBg = new Graphics();
  private tileLayer = new Container();
  private overlay = new Container();

  private boardSize = 0;
  private cell = 0;
  private gap = 0;

  constructor(
    private app: Application,
    private tweener: Tweener,
  ) {}

  async start(): Promise<void> {
    this.app.stage.addChild(this.root);
    this.root.addChild(this.header, this.boardLayer, this.overlay);
    this.boardLayer.addChild(this.boardBg, this.tileLayer);
    this.overlay.visible = false;

    // Settings: saved value, else OS/browser defaults.
    const settings = await loadSettings();
    this.themeMode = settings.theme ?? "system";
    this.locale = settings.locale ?? detectLocale();
    setThemeMode(this.themeMode);
    setLocale(this.locale);
    this.rtl = isRTL(this.locale);

    this.buildHeader();
    this.applyDocumentChrome();
    this.app.renderer.background.color = COLORS.background;

    const saved = await loadState();
    if (saved && saved.grid?.length) {
      this.board.load(saved);
      if (!this.board.hasMoves() && saved.grid.flat().every((t) => t)) {
        this.board.newGame();
      }
    } else {
      this.board.newGame();
    }

    this.layout();
    this.rebuildTiles();
    this.refreshHud();

    this.app.renderer.on("resize", () => {
      this.layout();
      this.syncPositions();
    });
  }

  // ---- input -----------------------------------------------------------

  handleMove(dir: Direction): void {
    if (this.animating) return;
    if (this.overlay.visible) return;

    const result = this.board.move(dir);
    if (!result.moved) return;

    this.animating = true;

    for (const m of result.movements) {
      const view = this.tiles.get(m.id);
      if (!view) continue;
      const start = { x: view.x, y: view.y };
      const end = this.cellCenter(m.to);
      this.tweener.add(
        (k) => {
          view.x = start.x + (end.x - start.x) * k;
          view.y = start.y + (end.y - start.y) * k;
        },
        { duration: SLIDE_MS, ease: Ease.outQuad },
      );
    }

    this.tweener.add(() => {}, {
      duration: SLIDE_MS,
      onComplete: () => this.finishMove(result),
    });
  }

  newGame(): void {
    this.hideOverlay();
    this.board.newGame();
    this.rebuildTiles();
    this.refreshHud();
    void this.persist();
  }

  // ---- move resolution -------------------------------------------------

  private finishMove(result: ReturnType<Board["move"]>): void {
    for (const m of result.movements) {
      if (!m.mergedAway) continue;
      const view = this.tiles.get(m.id);
      if (view) {
        view.destroy();
        this.tiles.delete(m.id);
      }
    }

    for (const mg of result.merges) {
      const view = this.addTile(mg.id, mg.value, mg.at);
      this.popIn(view, 1.12);
    }
    if (result.merges.length > 0) void this.haptic();

    if (result.spawn) {
      const view = this.addTile(result.spawn.id, result.spawn.value, result.spawn.at);
      view.scale.set(0);
      this.tweener.add((k) => view.scale.set(k), { duration: POP_MS, ease: Ease.outBack });
    }

    this.refreshHud();
    this.animating = false;
    void this.persist();

    if (this.board.won && !this.board.keptPlaying) {
      this.showOverlay("win");
    } else if (result.over) {
      this.showOverlay("over");
    }
  }

  // ---- tiles -----------------------------------------------------------

  private rebuildTiles(): void {
    for (const view of this.tiles.values()) view.destroy();
    this.tiles.clear();
    this.board.forEachTile((tile, cell) => this.addTile(tile.id, tile.value, cell));
  }

  private addTile(id: number, value: number, cell: Cell): TileView {
    const view = new TileView(id, value, this.cell);
    const { x, y } = this.cellCenter(cell);
    view.position.set(x, y);
    this.tileLayer.addChild(view);
    this.tiles.set(id, view);
    return view;
  }

  private popIn(view: TileView, peak: number): void {
    view.scale.set(0);
    this.tweener.add(
      (k) => {
        const s = k < 0.6 ? (k / 0.6) * peak : peak - (peak - 1) * ((k - 0.6) / 0.4);
        view.scale.set(s);
      },
      { duration: POP_MS },
    );
  }

  private syncPositions(): void {
    this.board.forEachTile((tile, cell) => {
      const view = this.tiles.get(tile.id);
      if (view) {
        const { x, y } = this.cellCenter(cell);
        view.position.set(x, y);
      }
    });
  }

  // ---- layout ----------------------------------------------------------

  private layout(): void {
    const W = this.app.screen.width;
    const H = this.app.screen.height;

    this.boardSize = Math.min(W - 32, MAX_BOARD, H * 0.58);
    this.gap = this.boardSize * 0.028;
    this.cell = (this.boardSize - this.gap * (N + 1)) / N;

    const headerH = this.boardSize * 0.42;
    const totalH = headerH + this.boardSize;

    const originX = (W - this.boardSize) / 2;
    const originY = Math.max(16, (H - totalH) / 2);
    this.root.position.set(originX, originY);

    this.boardLayer.position.set(0, headerH);
    this.boardBg.clear();
    this.boardBg
      .roundRect(0, 0, this.boardSize, this.boardSize, this.boardSize * 0.03)
      .fill(COLORS.boardBg);
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const { x, y } = this.cellCenter({ r, c });
        this.boardBg
          .roundRect(x - this.cell / 2, y - this.cell / 2, this.cell, this.cell, this.cell * 0.12)
          .fill(COLORS.cellEmpty);
      }
    }

    this.layoutHeader(headerH);
    if (this.overlay.visible) this.drawOverlayBg();
  }

  private cellCenter(cell: Cell): { x: number; y: number } {
    const x = this.gap + cell.c * (this.cell + this.gap) + this.cell / 2;
    const y = this.gap + cell.r * (this.cell + this.gap) + this.cell / 2;
    return { x, y };
  }

  /** Mirror an x-position (of a `w`-wide element) when the locale is RTL. */
  private mx(x: number, w: number): number {
    return this.rtl ? this.boardSize - x - w : x;
  }

  // ---- header / HUD ----------------------------------------------------

  private titleText!: Text;
  private scoreBox!: Graphics;
  private bestBox!: Graphics;
  private scoreLabel!: Text;
  private bestLabel!: Text;
  private scoreValue!: Text;
  private bestValue!: Text;
  private newBtn!: Container;
  private themeBtn!: Container;
  private langBtn!: Container;

  private buildHeader(): void {
    this.titleText = text({ weight: "800", fill: COLORS.text });
    this.titleText.text = "go2048";

    this.scoreBox = new Graphics();
    this.bestBox = new Graphics();
    this.scoreLabel = centeredText({ weight: "700", fill: COLORS.textMuted, letterSpacing: 1 });
    this.bestLabel = centeredText({ weight: "700", fill: COLORS.textMuted, letterSpacing: 1 });
    this.scoreValue = centeredText({ weight: "800", fill: COLORS.text });
    this.bestValue = centeredText({ weight: "800", fill: COLORS.text });

    this.newBtn = makeButton();
    this.newBtn.on("pointertap", () => this.newGame());

    this.langBtn = makeButton();
    this.langBtn.on("pointertap", () => this.cycleLocale());

    this.themeBtn = makeIconButton();
    this.themeBtn.on("pointertap", () => this.cycleTheme());

    this.header.addChild(
      this.scoreBox,
      this.bestBox,
      this.titleText,
      this.scoreLabel,
      this.bestLabel,
      this.scoreValue,
      this.bestValue,
      this.newBtn,
      this.langBtn,
      this.themeBtn,
    );
  }

  private layoutHeader(headerH: number): void {
    const pad = this.gap;
    const rowAH = headerH * 0.4;
    const cs = Math.min(rowAH * 0.92, 48); // control button size
    const boxW = Math.min(this.boardSize * 0.26, 124);
    const boxH = headerH * 0.46;
    const rowBY = rowAH + pad * 0.6;

    // --- Row A: title (start side) + controls (end side) ---
    this.titleText.style.fontSize = Math.round(rowAH * 0.74);
    this.titleText.style.fill = COLORS.text;

    // controls at the "end" (right in LTR, left in RTL)
    const themeX = this.boardSize - cs;
    const langX = themeX - cs - pad * 0.6;
    placeSquareButton(this.themeBtn, this.mx(themeX, cs), 0, cs);
    placeSquareButton(this.langBtn, this.mx(langX, cs), 0, cs);
    drawThemeIcon(this.themeBtn, cs, resolveIsDark(this.themeMode));
    setControlText(this.langBtn, localeLabel(this.locale), Math.round(cs * 0.42), cs, COLORS.controlIcon);

    // title clamped so it never collides with the controls
    const titleAvail = langX - pad;
    if (this.titleText.width > titleAvail) {
      this.titleText.style.fontSize = Math.floor(
        this.titleText.style.fontSize * (titleAvail / this.titleText.width),
      );
    }
    this.titleText.position.set(
      this.mx(0, this.titleText.width),
      (cs - this.titleText.height) / 2,
    );

    // --- Row B: SCORE / BEST boxes (end side) + New Game (start side) ---
    const bestX = this.boardSize - boxW;
    const scoreX = bestX - boxW - pad;

    drawBox(this.scoreBox, this.mx(scoreX, boxW), rowBY, boxW, boxH);
    drawBox(this.bestBox, this.mx(bestX, boxW), rowBY, boxW, boxH);

    this.scoreLabel.text = t("score");
    this.bestLabel.text = t("best");
    // Latin labels get tracking; Arabic must keep letterSpacing 0 or the
    // letters won't join (RTL ligature shaping breaks with tracking).
    const tracking = this.rtl ? 0 : 1;
    this.scoreLabel.style.letterSpacing = tracking;
    this.bestLabel.style.letterSpacing = tracking;
    placeText(this.scoreLabel, this.mx(scoreX, boxW) + boxW / 2, rowBY + boxH * 0.27, boxH * 0.2, COLORS.textMuted);
    placeText(this.bestLabel, this.mx(bestX, boxW) + boxW / 2, rowBY + boxH * 0.27, boxH * 0.2, COLORS.textMuted);
    placeText(this.scoreValue, this.mx(scoreX, boxW) + boxW / 2, rowBY + boxH * 0.66, boxH * 0.34, COLORS.text);
    placeText(this.bestValue, this.mx(bestX, boxW) + boxW / 2, rowBY + boxH * 0.66, boxH * 0.34, COLORS.text);

    const btnW = Math.min(scoreX - pad, boxW * 1.6);
    const btnH = boxH;
    const btnX = 0;
    drawButton(this.newBtn, this.mx(btnX, btnW), rowBY, btnW, btnH, t("newGame"), Math.round(btnH * 0.36));
  }

  private refreshHud(): void {
    this.scoreValue.text = String(this.board.score);
    this.bestValue.text = String(this.board.best);
  }

  // ---- theme / locale --------------------------------------------------

  private cycleTheme(): void {
    const i = THEME_CYCLE.indexOf(this.themeMode);
    this.themeMode = THEME_CYCLE[(i + 1) % THEME_CYCLE.length];
    setThemeMode(this.themeMode);
    this.refreshChrome();
    void this.persistSettings();
  }

  private cycleLocale(): void {
    this.locale = nextLocale(this.locale);
    setLocale(this.locale);
    this.rtl = isRTL(this.locale);
    this.refreshChrome();
    void this.persistSettings();
  }

  /** Re-apply colors + strings after a theme or locale change. */
  private refreshChrome(): void {
    this.app.renderer.background.color = COLORS.background;
    this.applyDocumentChrome();
    this.layout();
    this.syncPositions();
    this.refreshHud();
    if (this.overlayKind) this.showOverlay(this.overlayKind);
  }

  private applyDocumentChrome(): void {
    if (typeof document === "undefined") return;
    const hex = hexString(COLORS.background);
    document.documentElement.style.setProperty("--bg", hex);
    document.body.style.background = hex;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", hex);
  }

  // ---- overlay ---------------------------------------------------------

  private overlayKind: OverlayKind = null;

  private showOverlay(kind: Exclude<OverlayKind, null>): void {
    this.overlay.removeChildren();
    this.overlayKind = kind;

    const titleKey = kind === "win" ? "win" : "gameOver";
    const actionKey = kind === "win" ? "keepGoing" : "tryAgain";
    const onAction =
      kind === "win"
        ? () => {
            this.board.keptPlaying = true;
            this.hideOverlay();
            void this.persist();
          }
        : () => this.newGame();

    const bg = new Graphics();
    this.overlay.addChild(bg);
    (this.overlay as Container & { _bg: Graphics })._bg = bg;

    const titleText = centeredText({ weight: "800", fill: COLORS.text });
    titleText.text = t(titleKey);
    titleText.style.fontSize = Math.round(this.boardSize * 0.1);
    titleText.position.set(this.boardSize / 2, this.boardSize * 0.4);

    const btn = makeButton();
    drawButton(
      btn,
      this.boardSize * 0.27,
      this.boardSize * 0.52,
      this.boardSize * 0.46,
      this.boardSize * 0.12,
      t(actionKey),
      Math.round(this.boardSize * 0.045),
    );
    btn.on("pointertap", onAction);

    this.overlay.addChild(titleText, btn);
    this.overlay.position.set(0, this.boardLayer.y);
    this.overlay.visible = true;
    this.drawOverlayBg();

    this.overlay.alpha = 0;
    this.tweener.add((k) => (this.overlay.alpha = k), { duration: 200 });
  }

  private drawOverlayBg(): void {
    const bg = (this.overlay as Container & { _bg?: Graphics })._bg;
    if (!bg) return;
    bg.clear();
    bg.roundRect(0, 0, this.boardSize, this.boardSize, this.boardSize * 0.03).fill({
      color: COLORS.overlay,
      alpha: COLORS.overlayAlpha,
    });
  }

  private hideOverlay(): void {
    this.overlay.visible = false;
    this.overlay.removeChildren();
    this.overlayKind = null;
  }

  // ---- side effects ----------------------------------------------------

  private async persist(): Promise<void> {
    await saveState(this.board.serialize());
  }

  private async persistSettings(): Promise<void> {
    await saveSettings(this.themeMode, this.locale);
  }

  private async haptic(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      /* haptics unavailable — ignore */
    }
  }
}

// ---- small UI helpers --------------------------------------------------

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

type Weight = "700" | "800";

function text(o: { weight: Weight; fill: number; letterSpacing?: number }): Text {
  return new Text({
    text: "",
    style: { fontFamily: FONT, fontWeight: o.weight, fill: o.fill, letterSpacing: o.letterSpacing ?? 0 },
  });
}

function centeredText(o: { weight: Weight; fill: number; letterSpacing?: number }): Text {
  const el = text(o);
  el.anchor.set(0.5);
  return el;
}

function placeText(t: Text, cx: number, cy: number, fontSize: number, fill: number): void {
  t.style.fontSize = Math.round(fontSize);
  t.style.fill = fill;
  t.position.set(cx, cy);
}

function drawBox(g: Graphics, x: number, y: number, w: number, h: number): void {
  g.clear();
  g.roundRect(x, y, w, h, h * 0.22).fill(COLORS.cellEmpty);
}

interface ButtonParts {
  _bg: Graphics;
  _text: Text;
}

function makeButton(): Container {
  const c = new Container();
  c.eventMode = "static";
  c.cursor = "pointer";
  const bg = new Graphics();
  const label = centeredText({ weight: "700", fill: COLORS.buttonText });
  c.addChild(bg, label);
  (c as Container & ButtonParts)._bg = bg;
  (c as Container & ButtonParts)._text = label;
  return c;
}

function drawButton(c: Container, x: number, y: number, w: number, h: number, label: string, fontSize: number): void {
  const p = c as Container & ButtonParts;
  p._bg.clear();
  p._bg.roundRect(0, 0, w, h, h * 0.28).fill(COLORS.buttonBg);
  p._text.text = label;
  p._text.style.fontSize = fontSize;
  p._text.style.fill = COLORS.buttonText;
  p._text.position.set(w / 2, h / 2);
  c.position.set(x, y);
}

function makeIconButton(): Container {
  const c = new Container();
  c.eventMode = "static";
  c.cursor = "pointer";
  const bg = new Graphics();
  const icon = new Graphics();
  c.addChild(bg, icon);
  (c as Container & { _bg: Graphics; _icon: Graphics })._bg = bg;
  (c as Container & { _bg: Graphics; _icon: Graphics })._icon = icon;
  return c;
}

function placeSquareButton(c: Container, x: number, y: number, size: number): void {
  const bg = (c as Container & { _bg: Graphics })._bg;
  bg.clear();
  bg.roundRect(0, 0, size, size, size * 0.28).fill(COLORS.controlBg);
  c.position.set(x, y);
}

function setControlText(c: Container, label: string, fontSize: number, size: number, fill: number): void {
  // reuse the button's existing _text child (from makeButton) for the label
  const txt = (c as Container & ButtonParts)._text;
  txt.text = label;
  txt.style.fontSize = fontSize;
  txt.style.fill = fill;
  txt.position.set(size / 2, size / 2);
}

function drawThemeIcon(c: Container, size: number, dark: boolean): void {
  const icon = (c as Container & { _icon: Graphics })._icon;
  icon.clear();
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.16;
  if (dark) {
    // crescent moon: a disc with an offset disc punched out in the button color
    icon.circle(cx, cy, r * 1.25).fill(COLORS.controlIcon);
    icon.circle(cx + r * 0.7, cy - r * 0.45, r * 1.15).fill(COLORS.controlBg);
  } else {
    // sun: disc + 8 rays
    icon.circle(cx, cy, r * 0.78).fill(COLORS.controlIcon);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const x1 = cx + Math.cos(a) * r * 1.15;
      const y1 = cy + Math.sin(a) * r * 1.15;
      const x2 = cx + Math.cos(a) * r * 1.6;
      const y2 = cy + Math.sin(a) * r * 1.6;
      icon.moveTo(x1, y1).lineTo(x2, y2);
    }
    icon.stroke({ width: Math.max(1.5, size * 0.045), color: COLORS.controlIcon, cap: "round" });
  }
}

function hexString(color: number): string {
  return "#" + color.toString(16).padStart(6, "0");
}
