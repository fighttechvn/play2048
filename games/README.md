# games/ — mini-game source

Each sub-folder is a **self-contained** H5 mini-game (full source). They build two
ways from the same source:

- **Standalone SDK** — `landing/sdk/<id>.zip`, embeddable via an `<iframe>`.
- **Into the main app** — copied to `public/games/<id>/`, shown in the Discover hub.

```
games/
  <id>/
    index.html      # complete game (HTML + inline Canvas2D/JS) — no external deps
    gen-levels.mjs  # seeded level generator (see the game-designer skill)
    build.sh        # ./build.sh → public/games/<id>/ + landing/sdk/<id>.zip
  build.sh          # build every game (run by npm "prebuild" + "postinstall")
```

## Build
- One game:  `bash games/<id>/build.sh`
- All:       `npm run games`  (also runs automatically before `npm run build`)

## Add a game
1. `mkdir games/<id>`, add `index.html` + `gen-levels.mjs` + copy a `build.sh`.
2. Register it in `src/hub/registry.ts` (and add a `public/thumbs/<id>.png`).

`bubbo-bubbo` is an external PixiJS open-game — fetched/built by
`scripts/fetch-bubbo.sh` rather than living here.
