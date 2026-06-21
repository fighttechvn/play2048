// Visual theme for go2048. Dark UI inspired by the claude-ide palette
// (#1a1a1a surfaces, #e0e0e0 text) with a warm, high-contrast tile ramp so
// each value stays readable on a dark board.

export const COLORS = {
  background: 0x0f1115,
  boardBg: 0x1a1d23,
  cellEmpty: 0x242831,
  text: 0xe6e8ec,
  textMuted: 0x8b909a,
  textOnTile: 0x1a1d23,
  textOnTileLight: 0xf7f5f0,
  accent: 0xf2b137,
  overlay: 0x0f1115,
  buttonBg: 0x2f343d,
  buttonText: 0xf2b137,
} as const;

// Tile color ramp keyed by value. Low values are light/cream (dark text),
// higher values shift to warm gold/orange and finally a glowing accent.
interface TileStyle {
  bg: number;
  text: number;
}

const TILE_STYLES: Record<number, TileStyle> = {
  2: { bg: 0xeee4da, text: COLORS.textOnTile },
  4: { bg: 0xede0c8, text: COLORS.textOnTile },
  8: { bg: 0xf2b179, text: COLORS.textOnTileLight },
  16: { bg: 0xf59563, text: COLORS.textOnTileLight },
  32: { bg: 0xf67c5f, text: COLORS.textOnTileLight },
  64: { bg: 0xf65e3b, text: COLORS.textOnTileLight },
  128: { bg: 0xedcf72, text: COLORS.textOnTileLight },
  256: { bg: 0xedcc61, text: COLORS.textOnTileLight },
  512: { bg: 0xedc850, text: COLORS.textOnTileLight },
  1024: { bg: 0xedc53f, text: COLORS.textOnTileLight },
  2048: { bg: 0xedc22e, text: COLORS.textOnTileLight },
};

const SUPER_TILE: TileStyle = { bg: 0x3c3a32, text: COLORS.textOnTileLight };

export function tileStyle(value: number): TileStyle {
  return TILE_STYLES[value] ?? SUPER_TILE;
}

// Font size shrinks as the digit count grows so numbers always fit a tile.
export function tileFontSize(value: number, tileSize: number): number {
  const digits = String(value).length;
  const scale = digits <= 2 ? 0.5 : digits === 3 ? 0.42 : digits === 4 ? 0.34 : 0.26;
  return Math.round(tileSize * scale);
}

export const GRID_SIZE = 4;
export const WIN_VALUE = 2048;
