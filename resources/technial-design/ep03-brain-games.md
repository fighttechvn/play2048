# EP03 Technical Design: Brain Games (Zip + Patch)

## Technologies
- Self-contained **HTML + Canvas2D + vanilla TS/JS** per game (no PixiJS needed —
  these are static grid puzzles), under `public/games/<id>/`.
- Registered in `src/hub/registry.ts` as `type: "iframe"` games → playable in the
  Discover hub and packageable to `landing/sdk/<id>.zip`.
- Level generators are Node ESM scripts using a seeded RNG (reproducible) that
  follow the `game-designer` skill's difficulty curve.

## Entry Points
- `public/games/zip/index.html` + `public/games/zip/levels.json`
- `public/games/patch/index.html` + `public/games/patch/levels.json`
- `scripts/gen-zip-levels.mjs`, `scripts/gen-patch-levels.mjs`

## Generation flow (per game)
1. `paramsForLevel(i, N)` maps progress `t=(i)/(N-1)` → difficulty knobs via
   `easeInOut` + a sawtooth (relief) + jitter.
2. Build a candidate that is **valid by construction**:
   - **Zip**: a random Hamiltonian path via the *backbite* technique (start from a
     snake path; repeatedly reconnect an endpoint to a grid-neighbour and reverse
     the segment — preserves Hamiltonicity). Waypoints = path cells at increasing
     indices; walls = grid edges not on the path.
   - **Patch**: a random *guillotine* rectangle tiling (recursive split, stop by
     size/probability). Each region → one clue: number = area, shape =
     square/tall/wide (or hidden "any").
3. The constructed object **is** a solution → stored for Hint and validation.
4. Emit `levels.json` (99 levels, easy→hard), each with `solution`.

## Runtime flow (per game)
1. Fetch `levels.json`; restore current level from `localStorage`.
2. Render grid + clues to canvas; handle pointer drag.
3. **Zip**: extend/backtrack the path; reject illegal moves (wall, revisit,
   out-of-order number). Win when all cells filled + dots in order.
4. **Patch**: drag a rectangle → validate (one clue, area==number, shape match,
   no overlap) → claim. Win when all cells covered.
5. On win → advance level, persist.

## Entities
- Zip `Level { rows, cols, numbers:[{r,c,n}], walls:[{r,c,r2,c2}], solution:[[r,c]] }`
- Patch `Level { rows, cols, clues:[{r,c,size,shape}], solution:[{r0,c0,h,w}] }`
- `shape ∈ square | tall | wide | any`

## Difficulty knobs (the ramp)
- **Zip**: board 5×5→8×8; waypoints `size+1 → 3` (fewer = harder); walls `0 → size`.
- **Patch**: board 4×4→8×8; max region area `4 → 8`; stop-prob `0.35 → 0.6`
  (larger regions = fewer clues = harder); "any" share `0 → 0.4`.

## Tests
- Generator validators (run): Zip — solution is a Hamiltonian path covering all
  cells with dots in order (99/99). Patch — regions tile the grid exactly and each
  clue size equals its region area (99/99).
- Runtime e2e: drive **Hint** to completion → win fires (verified for both).
