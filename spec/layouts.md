## Shared layout rules
- Preview canvas width: `max-width: 820px`
- Preview canvas height on desktop: `clamp(200px, calc(100vh - 180px), 500px)`
- Preview canvas height on mobile (`<= 780px`): `clamp(180px, calc(100vh - 200px), 420px)`
- Primary text uses the selected primary font family.
- Secondary text uses the selected secondary font family.

## Hero
- Uses: `title`, `subtitle`
- Container: centered text, `padding: 4rem 2rem`
- `title`: weight `700`, line-height `1.1`, size `4.2rem` desktop / `3.15rem` mobile
- `subtitle`: weight `400`, line-height `1.4`, size `2.4rem` desktop / `1.8rem` mobile

## Brief
- Uses: `title`, `subtitle`, `paragraph1`
- Container: `max-width: 700px`, `padding: 3rem 2rem`, centered block
- `title`: primary font, weight `700`, line-height `1.2`, size `2.4rem` desktop / `1.8rem` mobile
- `subtitle`: primary font, weight `300`, line-height `1.2`, size `1.8rem` desktop / `1.35rem` mobile
- `paragraph1`: secondary font, weight `300`, line-height `1.6`, size `1.25rem` desktop / `0.9375rem` mobile

## Essay
- Uses: `title`, `paragraph1`, `paragraph2`
- Container: `max-width: 700px`, `padding: 3rem 2rem`, centered block
- `title`: primary font, weight `300`, line-height `1.2`, size `2.4rem` desktop / `1.8rem` mobile
- Body paragraphs: secondary font, weight `300`, line-height `1.6`, size `1.25rem` desktop / `0.9375rem` mobile
- `paragraph1` has bottom spacing of `1.2rem`

## Quote
- Uses: first sentence of `paragraph1`, plus `subtitle` as attribution
- Container: centered text, `max-width: 700px`, `padding: 4rem 2rem`
- Quote line: secondary font, italic, weight `300`, line-height `1.3`, size `1.8rem` desktop / `1.35rem` mobile
- Attribution: primary font, uppercase, letter-spacing `0.08em`, weight `700`, line-height `1.3`, size `1.05rem` desktop / `0.7875rem` mobile
