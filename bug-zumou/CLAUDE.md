# CLAUDE.md — bug-zumou

## What to keep in mind when editing this project

- **Intent is 夢中にさせる (Intent 5)**. Don't pad the experience: no scrolling history, no leaderboards, no social, no notifications. The streak + 60-sec timer is the whole engagement loop.
- **All user-facing text is Japanese**. UI labels, button copy, blurbs, and even the wrestler/title strings in the corpus. English is fine in code identifiers, comments, README headings.
- **Corpus is hand-curated**. Don't generate puzzles algorithmically — the punny wrestler names + the realism of the bug both matter. Every new puzzle should answer two questions: "is this a bug a real developer would ship?" and "does the wrestler name make me smile?".
- **`buggyLineIndex` is the source of truth**. The line index can shift when you reformat code — `swift test` catches out-of-range indices but not the case where you moved the bug to a different line and forgot to update the index. Re-read the snippet after any code edit.
- **`GameState` is `@MainActor`**. All test entry points use `@MainActor final class XCTestCase`. If you add a non-main test target, scope it correctly.
- **Persistence keys are stable strings** (`bugzumou.streak`, `bugzumou.best`, etc). Don't rename them — that silently wipes user progress.

## Adding a new stable

1. Add a case to `Stable` (`Models.swift`) with `symbol` and `blurb`.
2. Add ≥4 puzzles in `Corpus.swift`.
3. The `testEveryStableHasAtLeastFourPuzzles` test enforces the floor.
4. The `IdleHeroView` stable strip auto-picks them up via `Stable.allCases`.

## Adding a new rank

1. Add a case to `Rank` with the streak `threshold`.
2. `Rank.allCases` order must remain ascending by threshold (the test enforces this).
3. Add a `rankBlurb` line in `IdleHeroView`.

## Testing

```sh
swift test          # 19 unit tests
swift build         # debug build
swift run           # launch the app
swift build -c release && .build/release/bug-zumou
```
