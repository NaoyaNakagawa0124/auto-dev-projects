# CLAUDE.md — danboaru-za

## What to keep in mind when editing this project

- **Intent 3 (「こんなのアリ？」と笑わせる)** is the soul. Don't add productivity-style features (streaks, percentages, "today's progress"). The whole joke is that this is a stargazing app pretending to be a chore tracker. If a feature would make the user feel they're checking off a TODO, leave it out.
- **All UI text is Japanese**. The sprinkled Latin (`Constellatio Cartonensis`, `DBZ-CATALOGUE`) is intentional flavor — it reads as fake-academic precisely because the rest is JP.
- **Determinism matters**. `placeStar` and `catalogueName` MUST stay deterministic — if the same set of boxes produces a different sky after a refresh, the spell breaks. Don't introduce time-dependent or random-without-seed elements into placement.
- **`core.js` is importable from Node**. Don't reference `document`, `localStorage`, or `p5` from `core.js`. The rule is: pure logic in `core.js`, side effects in `app.js`.
- **Test invariants**:
  - `nearestNeighborEdges` must always dedupe `[i,j]` and `[j,i]` to a single edge.
  - `BoxStore.isClear` must be `false` for an empty store.
  - `BoxStore.fromJSON` must tolerate corrupted entries (wrong shape / null / non-object) silently.
- **Animation budget**: supernova is one ~1.4-second animation per box opening. Don't add more layers — the moment is intentionally brief.
- **localStorage key is `danboaru-za.v1`**. If the schema ever changes, bump to `.v2` and migrate, don't silently overwrite.

## Adding a new feature

1. If it's about box state → put it in `BoxStore` and write a Node test in `test/core.test.mjs`.
2. If it's about visual rendering → put it in `app.js` (p5 instance) and don't import `document`/`localStorage` from `core.js`.
3. Run `node --test test/core.test.mjs` before considering it done.

## Testing

```sh
node --test test/core.test.mjs           # 24 unit tests
python3 -m http.server 8765                # serve and open http://localhost:8765
```
