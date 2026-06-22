# Discover Dashboard

## Layout Mode: Single-column (scrollable card list)

```
┌──────────────────────────────────────────────┐
│  Discover                      [◉ lang][☀]    │  ← header
├──────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │                                        │  │
│  │            [thumbnail: go2048]         │  │  ← cover art
│  │   [🏷 Featured]                         │  │  ← badge (optional)
│  ├────────────────────────────────────────┤  │
│  │  go2048                    Details  →   │  │  ← title + details link
│  │  ┌──────────────┬───────────────────┐  │  │
│  │  │   2048        │     4×4           │  │  │  ← stats row
│  │  │   top tile    │     board         │  │  │
│  │  └──────────────┴───────────────────┘  │  │
│  │  ┌────────────────────────────────────┐ │  │
│  │  │            [ Play Now ]            │ │  │  ← primary action
│  │  └────────────────────────────────────┘ │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │            [thumbnail: bubbo-bubbo]    │  │
│  │  bubbo-bubbo               Details  →   │  │
│  │  [ Play Now ]                          │  │
│  └────────────────────────────────────────┘  │
│  ...                                         │  ← more games scroll
└──────────────────────────────────────────────┘

# header: fixed; card list: flex:1, vertical scroll
# card thumbnail aspect ≈ 16:10; Play Now full-width inside the card
```

## Components
- Header: title "Discover" + language toggle `[◉ lang]` + theme toggle `[☀/☾]`.
- Game card: cover thumbnail, optional badge `[Featured]`, title, "Details →" link,
  stats row (value + label pairs from `GameMeta.stats`), and a `[Play Now]` button.
- Card list: vertical scroll container, one card per registry entry.

## States
- Initial: cards rendered from `registry.ts`, first card highlighted.
- Loading: skeleton card placeholders while thumbnails decode.
- Launching: tapped card dims; full-screen game view fades in over the list.
- Error (external game): card body shows "Not installed — run package script".

## Events
- PlayTapped(game) → `Hub.launch(game)` (mount PixiJS or iframe full-screen)
- DetailsTapped(game) → expand card / show description
- BackFromGame → destroy game view, `Hub.show()`
- ThemeToggle → `setThemeMode(next)` + re-render
- LangToggle → `setLocale(next)` + re-render
