# Zip Game

## Layout Mode: Single-column (header + square grid + controls)

```
┌──────────────────────────────────────────────┐
│ [Zip · Level 1]              [Connect 1 → …]  │  ← status pills
├──────────────────────────────────────────────┤
│  ┌────┬────┬────┬────┬────┐                   │
│  │    │    │    │(2) │    │                   │  ← numbered dots
│  ├────┼────┼────┼────┼────┤                   │
│  │    │    │    │(1) │    │   ▓ = drawn path   │
│  ├────┼────┼━━━━┼────┼────┤   ━ = wall         │
│  │(6) │(5) │    │    │    │                   │
│  ├────┼────┼────┼────┼────┤                   │
│  │    │    │    │(3) │    │                   │
│  ├────┼────┼────┼────┼────┤                   │
│  │    │    │(4) │    │    │                   │
│  └────┴────┴────┴────┴────┘                   │
├──────────────────────────────────────────────┤
│   [ Undo ]      [ Hint ]      [ Reset ]       │
├──────────────────────────────────────────────┤
│ How to play: one path fills every cell,       │
│ passing the dots 1→2→3… in order.             │
└──────────────────────────────────────────────┘

# grid is square: cell = floor(boardWidth / cols); path drawn as a thick rounded line
```

## Components
- Status pills: "Zip · Level N" and live fill/dot progress.
- Canvas grid: numbered dots (black circles), walls (thick black segments), the
  player's path (light fill + bold line).
- Controls: Undo, Hint, Reset.

## States
- Initial: numbers + walls shown, no path.
- Drawing: dragging extends the path; illegal moves are rejected.
- Solved: all cells filled + dots in order → win overlay → Next level.

## Events
- DragExtend(cell) → append if adjacent, no wall, in number-order; or backtrack
- Undo → pop last cell · Reset → clear path · Hint → append next solution cell
- Next → advance level (persisted)
