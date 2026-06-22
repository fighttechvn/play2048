# EP02: Game Hub / Discover User Stories

A multi-game listing platform. The app boots into a **Discover** dashboard that
lists playable H5 games from a registry; each card opens its game. The same
registry powers the web landing **/sdk** page where third parties download a
packaged game zip to embed in their own product.

## EP02.US001: Discover games
As a player, I want a Discover screen listing the available games so I can choose
what to play.

Acceptance criteria:
- On launch the app shows the Discover dashboard (not a game directly).
- Each game is a card: thumbnail, title, short stats, and a **Play** button.
- At least the two seeded games are shown: **go2048** and **bubbo-bubbo**.
- The list is scrollable and works on phone, tablet, and desktop widths.

## EP02.US002: Open a game
As a player, I want to tap **Play** on a card to open that game.

Acceptance criteria:
- Tapping Play launches the selected game full-screen over the dashboard.
- A **Back** control returns to the Discover dashboard.
- An `internal` game (go2048) mounts in the app's PixiJS canvas.
- An `external` game (bubbo-bubbo) loads in a sandboxed iframe from its bundle.
- If an external game bundle is not installed, the card shows a clear
  "not installed" state instead of a broken frame.

## EP02.US003: Registry-driven catalog
As the platform owner, I want games defined in one registry so adding a game is a
data change, not a UI rewrite.

Acceptance criteria:
- A single `GameMeta` registry holds id, title, tagline, thumbnail, stats,
  `type` (`internal` | `iframe`), and entry/source.
- The Discover dashboard, the launcher, and the landing `/sdk` page all read the
  same registry.
- Adding a third game requires only a new registry entry (+ its bundle).

## EP02.US004: Download an SDK package (web /sdk)
As a third-party developer, I want to download a self-contained zip of a game so I
can embed it in my own product.

Acceptance criteria:
- The landing site has a `/sdk` page listing every game.
- Each game offers a **Download .zip** link to its packaged bundle.
- The page shows a copy-paste integration snippet (iframe embed) and the bundle
  size + version.
- Bundles are built by a script and contain everything needed to run offline.

## EP02.US005: Theme & language consistency
As a player, I want the Discover dashboard to respect my theme and language.

Acceptance criteria:
- The dashboard uses the same Dark/Light/System palette as the games.
- Visible labels are localized for the same 5 locales as go2048.
