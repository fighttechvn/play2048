# Patch Game

## Layout Mode: Single-column (header + square grid + controls)

```
┌──────────────────────────────────────────────┐
│ [Patch · Level 1]                [0/16 filled]│
├──────────────────────────────────────────────┤
│  ┌─────┬─────┬─────┬─────┐                    │
│  │ [1] │ │3│ │ [1] │     │   [n] square clue  │
│  ├─────┼─────┼─────┼─────┤   │n│ tall clue    │
│  │     │     │ │2│ │ │2│ │   ▭n  wide clue     │
│  ├─────┼─────┼─────┼─────┤   ⌐n⌐ any (dashed)  │
│  │ │2│ │     │     │ │2│ │                    │
│  ├─────┼─────┼─────┼─────┤   ███ claimed rect  │
│  │     │▭2▭ │ [1] │     │                    │
│  └─────┴─────┴─────┴─────┘                    │
├──────────────────────────────────────────────┤
│   [ Undo ]      [ Hint ]      [ Reset ]       │
├──────────────────────────────────────────────┤
│ Complete each shape to fill the grid.         │
│ Square · Tall · Wide · Any (legend)           │
└──────────────────────────────────────────────┘

# drag a rectangle around a clue; valid → claimed (coloured fill + border)
```

## Components
- Status pills: "Patch · Level N" and cells-filled progress.
- Canvas grid: clue badges (number + shape: square / tall / wide / dashed-any),
  claimed rectangles (coloured fill + outline), live drag preview (green=valid,
  red=invalid).
- Controls: Undo, Hint, Reset + a shape legend.

## States
- Initial: clue badges only.
- Dragging: preview rectangle, valid/invalid tint.
- Solved: every cell covered by valid rectangles → win overlay → Next level.

## Events
- DragRect(start,end) → on release validate (one clue, area==number, shape match,
  no overlap) → claim or reject
- TapClaimed(region) → remove · Undo → remove last · Reset → clear all
- Hint → place one unclaimed solution region · Next → advance level
