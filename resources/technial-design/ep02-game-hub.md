# EP02 Technical Design: Game Hub / Discover

## Technologies
- TypeScript + Vite.
- DOM/CSS for the Discover dashboard shell (lightweight list UI, themed with the
  shared palette). Games render in PixiJS (`internal`) or a sandboxed `<iframe>`
  (`external`).
- Shared `theme.ts` palette + `i18n.ts` strings.

## Entry Points
- `src/main.ts` — boots the Hub instead of the game directly.
- `src/hub/registry.ts` — the single source of truth: the games catalog.
- `src/hub/hub.ts` — renders the Discover dashboard + the game launcher.
- `src/game/gameScene.ts` — the go2048 game, mounted on demand by the launcher.

## Architecture
```
                 ┌─────────────── registry.ts (GameMeta[]) ───────────────┐
                 │                                                        │
        src/hub/hub.ts (Discover DOM)            landing/sdk/index.html   │
                 │   Play(game)                     Download .zip / embed │
        ┌────────┴─────────┐                                             │
   internal  →  mount PixiJS GameScene (#app)                            │
   iframe    →  <iframe src=games/<id>/index.html>  ← built by package.sh ┘
```

## Flow
1. App launch → `Hub.show()` renders cards from `registry.ts`.
2. Player taps **Play** on a card → `Hub.launch(game)`.
3. `internal` → hide the hub DOM, lazy-create the PixiJS `Application` + `GameScene`.
4. `iframe` → hide the hub DOM, show a full-screen `<iframe>` of the game bundle;
   if the bundle is missing (HEAD/onerror), render a "not installed" panel.
5. **Back** → destroy/hide the game, `Hub.show()` again.

## Entities
- `GameMeta { id, title, tagline, thumbnail, stats[], type: 'internal'|'iframe',
   entry, version, sizeKB, badge? }`
- `GameStat { value, label }`

## Packaging (SDK)
- `scripts/package-games.sh` builds each game into `dist-games/<id>/` and zips it to
  `landing/sdk/<id>.zip` (self-contained, relative paths, runs offline).
- `landing/sdk/index.html` lists each game with a download link + iframe-embed
  snippet, read from the same catalog.
- `bubbo-bubbo` is fetched + built from
  https://github.com/pixijs/open-games (see `scripts/fetch-bubbo.sh`).

## Flow steps (SDK download)
1. Developer opens `/sdk`.
2. Picks a game → clicks **Download .zip**.
3. Unzips and serves `index.html`, or embeds via the shown `<iframe>` snippet.

## Tests
- Unit: registry integrity (unique ids, required fields, type ∈ {internal,iframe}).
- Widget/DOM: Discover renders one card per registry entry; Play wires to launch.
- Integration: launch go2048 from the hub and return via Back.
- Screenshot e2e: Discover dashboard (light/dark) + each game launched.
