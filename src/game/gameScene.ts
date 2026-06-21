import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Application, Container, Graphics, Text } from "pixi.js";
import { Board, type Direction, type Cell } from "./board";
import { saveState, loadState } from "./storage";
import { COLORS, GRID_SIZE } from "./theme";
import { TileView } from "./tileView";
import { Ease, Tweener } from "./tween";

const N = GRID_SIZE;
const SLIDE_MS = 110;
const POP_MS = 130;
const MAX_BOARD = 520;

export class GameScene {
  private board = new Board();
  private tiles = new Map<number, TileView>();
  private animating = false;

  private root = new Container();
  private header = new Container();
  private boardLayer = new Container();
  private boardBg = new Graphics();
  private tileLayer = new Container();
  private overlay = new Container();

  private scoreValue!: Text;
  private bestValue!: Text;

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

    this.buildHeader();

    const saved = await loadState();
    if (saved && saved.grid?.length) {
      this.board.load(saved);
      if (!this.board.hasMoves() && saved.grid.flat().every((t) => t)) {
        // Loaded into a dead board — start fresh instead of stranding the user.
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

    // Post-slide step: resolve merges, spawn, HUD, end states.
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
      this.tweener.add((k) => view.scale.set(k), {
        duration: POP_MS,
        ease: Ease.outBack,
      });
    }

    this.refreshHud();
    this.animating = false;
    void this.persist();

    if (this.board.won && !this.board.keptPlaying) {
      this.showOverlay("You win! 🎉", "Keep going", () => {
        this.board.keptPlaying = true;
        this.hideOverlay();
        void this.persist();
      });
    } else if (result.over) {
      this.showOverlay("Game over", "Try again", () => this.newGame());
    }
  }

  // ---- tiles -----------------------------------------------------------

  private rebuildTiles(): void {
    for (const view of this.tiles.values()) view.destroy();
    this.tiles.clear();
    this.board.forEachTile((tile, cell) => {
      this.addTile(tile.id, tile.value, cell);
    });
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

    this.boardSize = Math.min(W - 32, MAX_BOARD, H * 0.6);
    this.gap = this.boardSize * 0.028;
    this.cell = (this.boardSize - this.gap * (N + 1)) / N;

    const headerH = this.boardSize * 0.36;
    const totalH = headerH + this.boardSize;

    const originX = (W - this.boardSize) / 2;
    const originY = Math.max(16, (H - totalH) / 2);

    this.root.position.set(originX, originY);

    // Board background + empty cells.
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

  // ---- header / HUD ----------------------------------------------------

  private titleText!: Text;
  private scoreBox!: Graphics;
  private bestBox!: Graphics;
  private scoreLabel!: Text;
  private bestLabel!: Text;
  private newBtn!: Container;

  private buildHeader(): void {
    this.titleText = new Text({
      text: "go2048",
      style: { fontFamily: "-apple-system, Helvetica, Arial, sans-serif", fontWeight: "800", fill: COLORS.text },
    });

    this.scoreBox = new Graphics();
    this.bestBox = new Graphics();
    this.scoreLabel = miniLabel("SCORE");
    this.bestLabel = miniLabel("BEST");
    this.scoreValue = boxValue("0");
    this.bestValue = boxValue("0");

    this.newBtn = new Container();
    this.newBtn.eventMode = "static";
    this.newBtn.cursor = "pointer";
    const btnBg = new Graphics();
    const btnText = new Text({
      text: "New Game",
      style: { fontFamily: "-apple-system, Helvetica, Arial, sans-serif", fontWeight: "700", fill: COLORS.buttonText },
    });
    btnText.anchor.set(0.5);
    this.newBtn.addChild(btnBg, btnText);
    (this.newBtn as Container & { _bg: Graphics; _text: Text })._bg = btnBg;
    (this.newBtn as Container & { _bg: Graphics; _text: Text })._text = btnText;
    this.newBtn.on("pointertap", () => this.newGame());

    this.header.addChild(
      this.titleText,
      this.scoreBox,
      this.bestBox,
      this.scoreLabel,
      this.bestLabel,
      this.scoreValue,
      this.bestValue,
      this.newBtn,
    );
  }

  private layoutHeader(headerH: number): void {
    const boxW = Math.min(this.boardSize * 0.26, 130);
    const boxH = headerH * 0.5;
    const pad = this.gap;

    const bestX = this.boardSize - boxW;
    const scoreX = bestX - boxW - pad;
    const boxY = 0;

    // Title sits to the left of the score boxes; clamp its size so it never
    // overlaps them (matters on wide viewports where the board is capped).
    this.titleText.style.fontSize = Math.round(headerH * 0.4);
    const titleAvail = scoreX - pad;
    if (this.titleText.width > titleAvail) {
      this.titleText.style.fontSize = Math.floor(
        this.titleText.style.fontSize * (titleAvail / this.titleText.width),
      );
    }
    this.titleText.position.set(0, (boxH - this.titleText.height) / 2);

    drawBox(this.scoreBox, scoreX, boxY, boxW, boxH);
    drawBox(this.bestBox, bestX, boxY, boxW, boxH);

    placeLabel(this.scoreLabel, scoreX + boxW / 2, boxY + boxH * 0.26, boxH);
    placeLabel(this.bestLabel, bestX + boxW / 2, boxY + boxH * 0.26, boxH);
    placeValue(this.scoreValue, scoreX + boxW / 2, boxY + boxH * 0.66, boxH);
    placeValue(this.bestValue, bestX + boxW / 2, boxY + boxH * 0.66, boxH);

    const btnW = boxW * 2 + pad;
    const btnH = headerH * 0.32;
    const btnX = this.boardSize - btnW;
    const btnY = boxH + this.gap * 0.8;
    const btn = this.newBtn as Container & { _bg: Graphics; _text: Text };
    btn._bg.clear();
    btn._bg.roundRect(0, 0, btnW, btnH, btnH * 0.28).fill(COLORS.buttonBg);
    btn._text.style.fontSize = Math.round(btnH * 0.42);
    btn._text.position.set(btnW / 2, btnH / 2);
    this.newBtn.position.set(btnX, btnY);
  }

  private refreshHud(): void {
    this.scoreValue.text = String(this.board.score);
    this.bestValue.text = String(this.board.best);
  }

  // ---- overlay ---------------------------------------------------------

  private overlayAction: (() => void) | null = null;

  private showOverlay(title: string, action: string, onAction: () => void): void {
    this.overlay.removeChildren();
    this.overlayAction = onAction;

    const bg = new Graphics();
    const titleText = new Text({
      text: title,
      style: { fontFamily: "-apple-system, Helvetica, Arial, sans-serif", fontWeight: "800", fill: COLORS.text, fontSize: Math.round(this.boardSize * 0.1) },
    });
    titleText.anchor.set(0.5);

    const btn = new Container();
    btn.eventMode = "static";
    btn.cursor = "pointer";
    const btnBg = new Graphics();
    const btnText = new Text({
      text: action,
      style: { fontFamily: "-apple-system, Helvetica, Arial, sans-serif", fontWeight: "700", fill: COLORS.buttonText, fontSize: Math.round(this.boardSize * 0.045) },
    });
    btnText.anchor.set(0.5);
    btn.addChild(btnBg, btnText);
    btn.on("pointertap", () => this.overlayAction?.());

    const bw = this.boardSize * 0.46;
    const bh = this.boardSize * 0.12;
    btnBg.roundRect(-bw / 2, -bh / 2, bw, bh, bh * 0.3).fill(COLORS.buttonBg);

    this.overlay.addChild(bg);
    (this.overlay as Container & { _bg: Graphics })._bg = bg;
    titleText.position.set(this.boardSize / 2, this.boardSize * 0.4);
    btn.position.set(this.boardSize / 2, this.boardSize * 0.58);
    this.overlay.addChild(titleText, btn);

    // Overlay is a child of root; align it over the board area.
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
      alpha: 0.86,
    });
  }

  private hideOverlay(): void {
    this.overlay.visible = false;
    this.overlay.removeChildren();
    this.overlayAction = null;
  }

  // ---- side effects ----------------------------------------------------

  private async persist(): Promise<void> {
    await saveState(this.board.serialize());
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

// ---- small text helpers ------------------------------------------------

function miniLabel(text: string): Text {
  const t = new Text({
    text,
    style: { fontFamily: "-apple-system, Helvetica, Arial, sans-serif", fontWeight: "700", fill: COLORS.textMuted, letterSpacing: 1 },
  });
  t.anchor.set(0.5);
  return t;
}

function boxValue(text: string): Text {
  const t = new Text({
    text,
    style: { fontFamily: "-apple-system, Helvetica, Arial, sans-serif", fontWeight: "800", fill: COLORS.text },
  });
  t.anchor.set(0.5);
  return t;
}

function drawBox(g: Graphics, x: number, y: number, w: number, h: number): void {
  g.clear();
  g.roundRect(x, y, w, h, h * 0.22).fill(COLORS.cellEmpty);
}

function placeLabel(t: Text, cx: number, cy: number, boxH: number): void {
  t.style.fontSize = Math.round(boxH * 0.18);
  t.position.set(cx, cy);
}

function placeValue(t: Text, cx: number, cy: number, boxH: number): void {
  t.style.fontSize = Math.round(boxH * 0.34);
  t.position.set(cx, cy);
}
