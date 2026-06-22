// Game Hub — the single catalog of games (EP02). The Discover dashboard, the
// in-app launcher, and the landing /sdk page all read this list, so adding a
// game is a data change here (+ its bundle), not a UI rewrite.

export interface GameStat {
  value: string;
  label: string;
}

export interface GameMeta {
  /** Stable id; also the bundle folder name under public/games/<id>/. */
  id: string;
  title: string;
  tagline: string;
  /** Cover image, relative to the web root (served from public/). */
  thumbnail: string;
  /** Optional ribbon, e.g. "Featured". */
  badge?: string;
  /** Two short value/label pairs shown on the card. */
  stats: GameStat[];
  /**
   * internal → mounted in this app's PixiJS canvas (the go2048 game).
   * iframe   → loaded full-screen from `entry` (a self-contained bundle).
   */
  type: "internal" | "iframe";
  /** For iframe games: path to the bundle entry (under public/). */
  entry: string;
  version: string;
  /** Approx packaged size, shown on /sdk. */
  sizeKB?: number;
}

export const GAMES: GameMeta[] = [
  {
    id: "go2048",
    title: "go2048",
    tagline: "Classic 2048 number puzzle — merge tiles to 2048.",
    thumbnail: "thumbs/go2048.png",
    badge: "Featured",
    stats: [
      { value: "2048", label: "goal tile" },
      { value: "4 × 4", label: "board" },
    ],
    type: "internal",
    entry: "",
    version: "1.1.1",
    sizeKB: 520,
  },
  {
    id: "bubbo-bubbo",
    title: "Bubbo Bubbo",
    tagline: "Arcade bubble shooter from the PixiJS open-games collection.",
    thumbnail: "thumbs/bubbo-bubbo.png",
    stats: [
      { value: "Arcade", label: "genre" },
      { value: "PixiJS", label: "engine" },
    ],
    type: "iframe",
    entry: "games/bubbo-bubbo/index.html",
    version: "1.0.0",
    sizeKB: 4200,
  },
  {
    id: "zip",
    title: "Zip",
    tagline: "Draw one path through every cell, hitting the numbers in order.",
    thumbnail: "thumbs/zip.png",
    badge: "Brain",
    stats: [
      { value: "99", label: "levels" },
      { value: "Path", label: "logic" },
    ],
    type: "iframe",
    entry: "games/zip/index.html",
    version: "1.0.0",
    sizeKB: 60,
  },
  {
    id: "patch",
    title: "Patch",
    tagline: "Split the grid into shapes — match each number's size and form.",
    thumbnail: "thumbs/patch.png",
    badge: "Brain",
    stats: [
      { value: "99", label: "levels" },
      { value: "Shikaku", label: "logic" },
    ],
    type: "iframe",
    entry: "games/patch/index.html",
    version: "1.0.0",
    sizeKB: 60,
  },
];

export function gameById(id: string): GameMeta | undefined {
  return GAMES.find((g) => g.id === id);
}
