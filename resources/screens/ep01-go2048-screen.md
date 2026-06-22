# go2048 Game Board

## Layout Mode: Single-column (header + square board)

```
┌──────────────────────────────────────────────┐
│  [← Back]  go2048           [◉ lang] [☀/☾]    │  ← header row A
├──────────────────────────────────────────────┤
│  ┌──────────────┐  ┌────────┐  ┌──────────┐  │  ← header row B
│  │ [ New Game ] │  │ SCORE  │  │  BEST    │  │
│  │              │  │  3548  │  │  4096    │  │
│  └──────────────┘  └────────┘  └──────────┘  │
├──────────────────────────────────────────────┤
│  ┌────────┬────────┬────────┬────────┐       │
│  │   2    │   4    │   8    │  16    │       │
│  ├────────┼────────┼────────┼────────┤       │  ← 4×4 board
│  │        │   2    │  32    │  64    │       │
│  ├────────┼────────┼────────┼────────┤       │
│  │        │        │   4    │ 128    │       │
│  ├────────┼────────┼────────┼────────┤       │
│  │        │        │   2    │ 256    │       │
│  └────────┴────────┴────────┴────────┘       │
│                                              │
│            (swipe / arrow keys)              │
└──────────────────────────────────────────────┘

# board is a square: min(W-32, 520, H*0.58); cells laid out with a fixed gap
# overlay (win/over) covers the board with a centered title + action button
```

## Components
- Back: returns to the Discover dashboard (`Hub.show()`).
- Header: title "go2048", language toggle, theme toggle.
- HUD: New Game button, SCORE box, BEST box.
- Board: 4×4 grid of `TileView` (rounded rect + centered number), PixiJS-rendered.
- Overlay: win ("Keep going") / game over ("Try again"), shown over the board.

## States
- Initial: restored saved board, or a fresh 2-tile game.
- Animating: tiles sliding/merging (input ignored).
- Win: overlay with "Keep going".
- Over: overlay with "Try again".

## Events
- Move(dir) → `GameScene.handleMove(dir)` (slide/merge/spawn, persist)
- NewGame → reset board
- BackTapped → return to Discover
- ThemeToggle / LangToggle → re-render with new palette / locale
