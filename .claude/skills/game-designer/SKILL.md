---
name: game-designer
description: Research + apply difficulty-curve and pacing design to puzzle games and to generate progressive level lists. Use when designing or tuning a puzzle game's difficulty ramp, authoring a list of N levels that get gradually harder, parameterizing a level generator, or balancing pacing (session length, cognitive load, flow). Applies to grid/logic puzzles (Shikaku, numbered-path/Zip, Sudoku-likes, 2048-likes).
---

# Game Designer — pacing & difficulty research

A process for turning a puzzle's rules into a **smooth, progressive level list** and a
well-paced session. Use it to tune a generator's knobs, not to hand-author every level.

## 1. Identify the difficulty knobs

For any grid puzzle, list the parameters that change perceived difficulty, then split
them into **size** (search space) and **constraint** (how guided the solver is):

| Knob | Effect | Direction |
|---|---|---|
| Board size (R×C) | bigger search space | ↑ harder |
| Number of clues / waypoints | more clues = more anchors | ↑ clues = easier |
| Clue density (clues ÷ cells) | sparse = more deduction | ↓ density = harder |
| Branching / ambiguity | dead-ends, multiple candidate moves | ↑ harder |
| Helper constraints (walls, shape-type) | prune the search | context-dependent |
| Required look-ahead depth | moves before a mistake shows | ↑ harder |

The honest difficulty signal is **solver effort** (nodes a backtracking solver expands),
not board size alone. Where feasible, rate a generated level by running the reference
solver and counting backtracks; bucket by that.

## 2. The difficulty curve (the ramp)

Design a curve, not a line. A good N-level ramp has phases:

```
difficulty
  ^                                          ____ Expert (plateau, high)
  |                                    ___---
  |                         ___-------          ← steady climb
  |        __--------------                      ← gentle ramp
  |  _/‾\__/   ← tutorial wiggle (easy dips to teach)
  +--------------------------------------------------> level #
   1                                              N
```

- **Tutorial (first ~10%)**: trivially small, one mechanic at a time. Add easy *dips*
  after a new mechanic so the player consolidates.
- **Ramp (~10–70%)**: increase one knob at a time; never two big jumps at once.
- **Climb (~70–95%)**: combine knobs; introduce ambiguity / look-ahead.
- **Plateau (last ~5%)**: hardest, roughly constant — for the dedicated.
- **Sawtooth**: every ~5–8 levels, drop difficulty ~20% then climb past the prior peak.
  Constant climbing fatigues; the sawtooth gives relief + a sense of mastery.

Map a normalized progress `t = (level-1)/(N-1)` (0..1) to each knob with an easing curve
(e.g. `size = round(min + (max-min) * easeInOut(t))`), and add small per-level jitter so
the list doesn't feel mechanical.

## 3. Pacing (the session, not just one level)

- **Time-to-first-success** under ~30 s on level 1; players quit early levels, not hard ones.
- **Target solve time** should grow sub-linearly — aim ~20 s early → a few minutes late.
- **Cognitive load**: introduce at most one new idea per ~5 levels. A "Difficulty: HARD"
  label sets expectation and licenses a spike.
- **Flow**: keep challenge just above current skill. Undo + Hint lower the floor so a hard
  level is *engaging*, not a wall.

## 4. Generator recipe (apply per game)

1. Enumerate knobs (§1) with `[min, max]` for this game.
2. Write `paramsForLevel(i, N)`: map `t` → each knob via easing + jitter + the sawtooth.
3. Generate a candidate from those params (random but rule-valid by construction).
4. **Validate**: solvable (the constructed solution is one); optionally check near-uniqueness
   and rate by solver effort.
5. If a level's measured difficulty is off-band for its slot, regenerate or reseed.
6. Emit `levels.json` ordered easy→hard; keep the per-level params for traceability.

## 5. Verify the curve

- Plot the difficulty proxy (solver backtracks or solve time) vs level # — it should match
  the §2 shape, monotone-with-sawtooth, no cliffs.
- Spot-playtest levels at 5%, 25%, 50%, 75%, 95% and the final.
- Re-tune `paramsForLevel`, not individual levels — keep generation reproducible (fixed seed).

## Output
- A `paramsForLevel(i, N)` function (the curve, documented).
- A generator that emits `levels.json` (N levels, easy→hard, each with its solution).
- A short note on which knob drives the ramp and where mechanics are introduced.
