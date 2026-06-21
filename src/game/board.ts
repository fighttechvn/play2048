import { GRID_SIZE, WIN_VALUE } from "./theme";

export type Direction = "up" | "down" | "left" | "right";

export interface Tile {
  id: number;
  value: number;
}

export interface Cell {
  r: number;
  c: number;
}

/** A tile sliding from one cell to another during a move. */
export interface Movement {
  id: number;
  value: number;
  from: Cell;
  to: Cell;
  /** This tile slides into `to` and is then consumed by a merge. */
  mergedAway: boolean;
}

/** A new, doubled tile produced where two tiles merged. */
export interface Merge {
  id: number;
  value: number;
  at: Cell;
}

/** The random tile spawned after a successful move. */
export interface Spawn {
  id: number;
  value: number;
  at: Cell;
}

export interface MoveResult {
  moved: boolean;
  scoreGained: number;
  movements: Movement[];
  merges: Merge[];
  spawn: Spawn | null;
  won: boolean;
  over: boolean;
}

export interface BoardState {
  grid: (Tile | null)[][];
  nextId: number;
  score: number;
  best: number;
  won: boolean;
  /** Set once the player has acknowledged a win and chosen to keep playing. */
  keptPlaying: boolean;
}

const N = GRID_SIZE;

export class Board {
  grid: (Tile | null)[][];
  private nextId = 1;
  score = 0;
  best = 0;
  won = false;
  keptPlaying = false;

  constructor() {
    this.grid = emptyGrid();
  }

  // ---- lifecycle -------------------------------------------------------

  newGame(): void {
    this.grid = emptyGrid();
    this.nextId = 1;
    this.score = 0;
    this.won = false;
    this.keptPlaying = false;
    this.addRandomTile();
    this.addRandomTile();
  }

  serialize(): BoardState {
    return {
      grid: this.grid.map((row) => row.map((t) => (t ? { ...t } : null))),
      nextId: this.nextId,
      score: this.score,
      best: this.best,
      won: this.won,
      keptPlaying: this.keptPlaying,
    };
  }

  load(state: BoardState): void {
    this.grid = state.grid.map((row) => row.map((t) => (t ? { ...t } : null)));
    this.nextId = state.nextId;
    this.score = state.score;
    this.best = state.best;
    this.won = state.won;
    this.keptPlaying = state.keptPlaying;
  }

  // ---- queries ---------------------------------------------------------

  forEachTile(fn: (tile: Tile, cell: Cell) => void): void {
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const t = this.grid[r][c];
        if (t) fn(t, { r, c });
      }
    }
  }

  private emptyCells(): Cell[] {
    const cells: Cell[] = [];
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (!this.grid[r][c]) cells.push({ r, c });
      }
    }
    return cells;
  }

  private addRandomTile(): Spawn | null {
    const free = this.emptyCells();
    if (free.length === 0) return null;
    const { r, c } = free[Math.floor(Math.random() * free.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    const tile: Tile = { id: this.nextId++, value };
    this.grid[r][c] = tile;
    return { id: tile.id, value, at: { r, c } };
  }

  hasMoves(): boolean {
    if (this.emptyCells().length > 0) return true;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const v = this.grid[r][c]?.value;
        if (v === undefined) continue;
        if (c + 1 < N && this.grid[r][c + 1]?.value === v) return true;
        if (r + 1 < N && this.grid[r + 1][c]?.value === v) return true;
      }
    }
    return false;
  }

  // ---- the move --------------------------------------------------------

  move(dir: Direction): MoveResult {
    const movements: Movement[] = [];
    const merges: Merge[] = [];
    let scoreGained = 0;
    let moved = false;

    const lines = lineCells(dir); // each line ordered from the target edge inward

    for (const line of lines) {
      // Tiles in this line, in scan order (nearest target edge first).
      const tiles: { tile: Tile; from: Cell }[] = [];
      for (const cell of line) {
        const t = this.grid[cell.r][cell.c];
        if (t) tiles.push({ tile: t, from: cell });
      }

      // Compact + merge.
      const slots: { primary: { tile: Tile; from: Cell }; merge?: { tile: Tile; from: Cell } }[] = [];
      for (const entry of tiles) {
        const last = slots[slots.length - 1];
        if (last && !last.merge && last.primary.tile.value === entry.tile.value) {
          last.merge = entry;
        } else {
          slots.push({ primary: entry });
        }
      }

      // Clear the line, then place compacted tiles and record animations.
      for (const cell of line) this.grid[cell.r][cell.c] = null;

      slots.forEach((slot, index) => {
        const to = line[index];

        if (slot.merge) {
          const newValue = slot.primary.tile.value * 2;
          const mergedTile: Tile = { id: this.nextId++, value: newValue };
          this.grid[to.r][to.c] = mergedTile;
          scoreGained += newValue;
          moved = true;
          if (newValue >= WIN_VALUE) this.won = true;

          movements.push({
            id: slot.primary.tile.id,
            value: slot.primary.tile.value,
            from: slot.primary.from,
            to,
            mergedAway: true,
          });
          movements.push({
            id: slot.merge.tile.id,
            value: slot.merge.tile.value,
            from: slot.merge.from,
            to,
            mergedAway: true,
          });
          merges.push({ id: mergedTile.id, value: newValue, at: to });
        } else {
          this.grid[to.r][to.c] = slot.primary.tile;
          const from = slot.primary.from;
          if (from.r !== to.r || from.c !== to.c) {
            moved = true;
            movements.push({
              id: slot.primary.tile.id,
              value: slot.primary.tile.value,
              from,
              to,
              mergedAway: false,
            });
          }
        }
      });
    }

    let spawn: Spawn | null = null;
    if (moved) {
      spawn = this.addRandomTile();
      this.score += scoreGained;
      if (this.score > this.best) this.best = this.score;
    }

    return {
      moved,
      scoreGained,
      movements,
      merges,
      spawn,
      won: this.won,
      over: !this.hasMoves(),
    };
  }
}

function emptyGrid(): (Tile | null)[][] {
  return Array.from({ length: N }, () => Array<Tile | null>(N).fill(null));
}

/**
 * For a direction, return the lines (rows or columns) the move operates on,
 * each as a list of cells ordered from the destination edge inward — so the
 * first cell in the list is where a tile would end up if it slid all the way.
 */
function lineCells(dir: Direction): Cell[][] {
  const lines: Cell[][] = [];
  if (dir === "left" || dir === "right") {
    for (let r = 0; r < N; r++) {
      const line: Cell[] = [];
      for (let c = 0; c < N; c++) line.push({ r, c });
      if (dir === "right") line.reverse();
      lines.push(line);
    }
  } else {
    for (let c = 0; c < N; c++) {
      const line: Cell[] = [];
      for (let r = 0; r < N; r++) line.push({ r, c });
      if (dir === "down") line.reverse();
      lines.push(line);
    }
  }
  return lines;
}
