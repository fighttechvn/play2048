# play2048 — public site

This repository **hosts the public website** for our multi-game brain hub
(landing/intro + the playable game). It does **not** contain the source code.

## 🔗 Live site
- **Landing:** https://fighttechvn.github.io/play2048/
- **Play the game:** https://fighttechvn.github.io/play2048/play/

## How it works
- **Source code** lives in the private repo **`fighttechvn/game-play2048`**
  (the game, the mini-games, the landing source, and the mobile builds).
- That repo's CI builds the site and publishes it to the **`gh-pages`** branch
  of *this* repo, which GitHub Pages serves. The `main` branch here is
  intentionally just this README.
- Do **not** develop here. Open PRs and make changes in `game-play2048`; the
  live site updates automatically on merge to its `main`.

## Layout served on `gh-pages`
```
/            → marketing landing (+ privacy / terms / support / sdk)
/play/       → the playable game (Discover hub)
```
