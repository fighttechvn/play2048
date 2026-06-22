# EP03: Brain Games (Zip + Patch) User Stories

Two logic puzzles added to the Game Hub (EP02). Each ships as a self-contained
bundle under `public/games/<id>/` with **99 progressively harder levels** built by
a generator following the `game-designer` skill, and registered in
`src/hub/registry.ts` as `iframe` games.

## Zip — numbered path

### EP03.US001: Draw the path
As a player, I want to draw one continuous path that fills every cell so that I
solve the level.

Acceptance criteria:
- I drag from cell to adjacent cell to extend a single path; dragging back removes
  the last step.
- The path cannot cross a wall or revisit a cell.
- The level is solved when the path covers **every** cell and passes the numbered
  dots **1 → 2 → … → K in order**.

### EP03.US002: Numbers in order
As a player, I want the game to enforce visiting numbers in order so the puzzle is
well-defined.

Acceptance criteria:
- I cannot enter a numbered cell `k` before having passed `k-1`.
- The path must start at dot **1**.

### EP03.US003: Undo / Hint / Reset
Acceptance criteria:
- **Undo** removes the last path step; **Reset** clears the path.
- **Hint** extends the path by one correct step toward the stored solution.

## Patch — shapes / Shikaku

### EP03.US004: Fill the grid with shapes
As a player, I want to partition the grid into rectangles so each numbered cell's
region has the right size and shape.

Acceptance criteria:
- I drag a rectangle around a numbered cell; on release it is claimed only if it
  contains exactly one number, its **area equals that number**, and its **shape**
  matches the clue (Square / Tall / Wide / Any).
- Tapping a claimed region removes it; **Undo** removes the last region; **Reset**
  clears all.
- The level is solved when every cell is covered by valid rectangles.

### EP03.US005: Shape constraints
Acceptance criteria:
- Square = equal sides; Tall = height > width; Wide = width > height; Any = any rectangle.
- A clue marked **Any** (dashed badge) hides the shape, requiring more deduction.

## Both games

### EP03.US006: 99 levels, increasing difficulty
As a player, I want 99 levels that get gradually harder so there's a long ramp.

Acceptance criteria:
- Each game has exactly 99 levels generated easy → hard (board size up, fewer
  anchors, more ambiguity), with a sawtooth for relief.
- My current level is remembered; solving a level advances to the next.

### EP03.US007: Play from the Hub
As a player, I want to open Zip and Patch from the Discover dashboard.

Acceptance criteria:
- Both appear as cards in the Discover hub and open full-screen with a Back control.
- Both are downloadable from the landing `/sdk` page like the other games.
