# SUMMARY — danboaru-za

## What was built

A browser app that maps the unopened cardboard boxes in a freshly-moved apartment to stars in a generated night sky. Each box's name deterministically hashes to a star position and color; "opening" a box triggers a supernova animation, and once every star has detonated, the sky is empty and the user is officially declared 完全移住完了 ("fully relocated") in a fake astronomical catalogue. The intent (Intent 3: 笑わせる) lives in the contrast between mundane chore tracking and grand cosmic vocabulary.

The piece refuses every productivity-app cliché: no streaks, no progress bars, no checklist. The only state is "stars left in the sky". This makes the whole flow feel like stargazing rather than task closure, which is the joke.

## Tech decisions

- **p5.js + plain ESM**, no framework. p5 is loaded from CDN and used in instance mode so it doesn't pollute globals. App logic stays in two ES modules — `core.js` (pure, importable from Node) and `app.js` (browser glue).
- **Deterministic placement**: FNV-1a-ish 32-bit hash → mulberry32 PRNG → normalized star coordinates. The same box label always produces the same star, so a returning user sees the same constellation.
- **Catalogue name**: deterministic from the *sorted* set of box labels. Adding a box is allowed to change the constellation's name (it's a different set of stars, so a different catalogue entry); the order of insertions doesn't matter.
- **No backend**. Everything persists in `localStorage` under one key.
- **Color**: warm starlight (HSL 28–60) for ~75% of stars, cool blue (200–220) for ~25%. The mix reads as "real sky" rather than "single-color theme".
- **Supernova animation** is plain `drawingContext` 2D — outward shock ring + radial flash gradient, ~1.4 s.

## Tests

24 Node test cases (`node:test`) covering:
- Hash determinism + uniqueness
- mulberry32 determinism + range
- placeStar determinism, range, size→magnitude monotonicity
- nearestNeighborEdges: empty/single/dedup/full-coverage
- catalogueName: empty + order-insensitive
- BoxStore: add/open/remove/reset/isClear/JSON roundtrip/corrupted-input tolerance/averageMagnitude

## Files

```
danboaru-za/
├── index.html       (~70 LOC)
├── styles.css       (~430 LOC) — glassmorphism + cosmic gradients
├── core.js          (~140 LOC) — pure logic (importable from Node)
├── app.js           (~280 LOC) — p5 sketch + DOM glue + state
├── test/core.test.mjs (~200 LOC)
└── README / PLAN / SUMMARY / CLAUDE
```

## Potential next steps

1. **Shareable card**. After 完全移住完了, render the final sky + catalogue name to a PNG postcard the user can save or share. The joke gets funnier when handed to someone else.
2. **Multi-room mode**. Each room (kitchen / bedroom / 物置) gets its own constellation, and the dashboard becomes a "northern hemisphere" with multiple constellations side by side.
3. **Audio**. A 14-sec ambient drone (similar to mado's Rust DSP, but here a simple Web Audio loop) playing while the sky is on screen, fading on supernova for a brief silent moment.
