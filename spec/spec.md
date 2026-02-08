## Overview
Font Match is a single-screen React + TypeScript app for trying font pairings in realistic text layouts.
The user controls two roles:
- Primary font
- Secondary font

The preview area renders one selected layout. Controls stay visually stable while only font/content selections change.

## Implemented behavior
### Layouts
The app supports four preview layouts:
- Hero
- Brief
- Essay
- Quote

See `spec/layouts.md` for exact field usage and typography values.

### Content
Each author snippet includes:
- `title`
- `subtitle`
- `paragraph1`
- `paragraph2`

Available authors:
- Lucas
- Rowling
- Tolkien
- Meyer
- Martin
- Herbert

See `spec/content.md` for the active content catalog.

### Font controls and shuffle
- Two dropdowns select primary and secondary fonts from a shared font pool.
- `Shuffle Fonts` randomizes both fonts.
- One lock can be active at a time.
- If `primary` is locked, shuffle changes only `secondary`.
- If `secondary` is locked, shuffle changes only `primary`.
- Clicking the same lock again unlocks both.

### Initial state
- Layout defaults to `hero`.
- Author defaults to the first author key (`Lucas`).
- Font pair initializes with a random non-duplicate pair.

### Loading fonts
Selected font families are loaded on demand from Google Fonts and memoized so duplicate link tags are not appended.

## Technical requirements (current)
- Stack: React + TypeScript + Vite.
- Browser-only frontend (no backend).
- Responsive behavior for desktop and mobile.
- Minimal neutral visual palette (white/gray/near-black) to keep typography as the focus.
