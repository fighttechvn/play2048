// Theming for go2048 — dark + light palettes. The `COLORS` export is a *live
// binding* (a `let`) reassigned by setThemeMode(), so any module that reads
// `COLORS.x` at call time picks up the active palette. Text objects created
// once still need their fills re-applied on change (GameScene.applyTheme).

export const GRID_SIZE = 4;
export const WIN_VALUE = 2048;

export type ThemeMode = "system" | "dark" | "light";

export interface Palette {
  background: number;
  boardBg: number;
  cellEmpty: number;
  text: number;
  textMuted: number;
  accent: number;
  overlay: number;
  overlayAlpha: number;
  buttonBg: number;
  buttonText: number;
  controlBg: number;
  controlIcon: number;
}

const DARK: Palette = {
  background: 0x0f1115,
  boardBg: 0x1a1d23,
  cellEmpty: 0x242831,
  text: 0xe6e8ec,
  textMuted: 0x8b909a,
  accent: 0xf2b137,
  overlay: 0x0f1115,
  overlayAlpha: 0.86,
  buttonBg: 0x2f343d,
  buttonText: 0xf2b137,
  controlBg: 0x242831,
  controlIcon: 0xe6e8ec,
};

const LIGHT: Palette = {
  background: 0xfaf8ef,
  boardBg: 0xbbada0,
  cellEmpty: 0xcdc1b4,
  text: 0x6b6357,
  textMuted: 0x9c9388,
  accent: 0xb8860b,
  overlay: 0xfaf8ef,
  overlayAlpha: 0.84,
  buttonBg: 0x8f7a66,
  buttonText: 0xf9f6f2,
  controlBg: 0xd6cdc2,
  controlIcon: 0x6b6357,
};

// The active palette. Reassigned by setThemeMode().
export let COLORS: Palette = DARK;

let currentMode: ThemeMode = "system";

function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches === true
  );
}

export function resolveIsDark(mode: ThemeMode = currentMode): boolean {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return systemPrefersDark();
}

export function setThemeMode(mode: ThemeMode): void {
  currentMode = mode;
  COLORS = resolveIsDark(mode) ? DARK : LIGHT;
}

export function getThemeMode(): ThemeMode {
  return currentMode;
}

// Tile color ramp — shared across themes (the classic warm 2048 ramp reads well
// on both the dark and light boards). Text-on-tile is fixed per value.
interface TileStyle {
  bg: number;
  text: number;
}

const TILE_DARK_TEXT = 0x1a1d23;
const TILE_LIGHT_TEXT = 0xf7f5f0;

const TILE_STYLES: Record<number, TileStyle> = {
  2: { bg: 0xeee4da, text: TILE_DARK_TEXT },
  4: { bg: 0xede0c8, text: TILE_DARK_TEXT },
  8: { bg: 0xf2b179, text: TILE_LIGHT_TEXT },
  16: { bg: 0xf59563, text: TILE_LIGHT_TEXT },
  32: { bg: 0xf67c5f, text: TILE_LIGHT_TEXT },
  64: { bg: 0xf65e3b, text: TILE_LIGHT_TEXT },
  128: { bg: 0xedcf72, text: TILE_LIGHT_TEXT },
  256: { bg: 0xedcc61, text: TILE_LIGHT_TEXT },
  512: { bg: 0xedc850, text: TILE_LIGHT_TEXT },
  1024: { bg: 0xedc53f, text: TILE_LIGHT_TEXT },
  2048: { bg: 0xedc22e, text: TILE_LIGHT_TEXT },
};

const SUPER_TILE: TileStyle = { bg: 0x3c3a32, text: TILE_LIGHT_TEXT };

export function tileStyle(value: number): TileStyle {
  return TILE_STYLES[value] ?? SUPER_TILE;
}

export function tileFontSize(value: number, tileSize: number): number {
  const digits = String(value).length;
  const scale = digits <= 2 ? 0.5 : digits === 3 ? 0.42 : digits === 4 ? 0.34 : 0.26;
  return Math.round(tileSize * scale);
}
