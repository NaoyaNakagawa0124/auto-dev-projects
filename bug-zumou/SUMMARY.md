# SUMMARY — bug-zumou

## What was built

A native macOS SwiftUI app that turns developer pain points (the kind you actually find on Stack Overflow) into a 60-second sumo match. You see a buggy 3–7 line code snippet in one of six "stables" — null/nil mistakes, off-by-one, equality traps, regex pitfalls, concurrency, type coercion — and click the line that holds the bug. Streaks build your rank from 序ノ口 (apprentice) up through 横綱 (grand champion); a single miss drops you to the bottom. No social features, no ads, no daily quota — just one match at a time, in a quiet vermillion-on-black window.

The intent (Intent 5: 夢中にさせる) shows up in the design choices: a 60-second clock, immediate reveal with a named "wrestler" per bug, persistent career-best, and the asymmetric streak ladder (1 → 3 → 6 → 10 → 15 → 22 → 30 → 40 → 55) that makes each rank feel earned.

## Tech decisions

- **Swift 5.9 + SwiftUI** for native macOS look-and-feel. SwiftPM `.executableTarget` ships a single-binary app — no Xcode project needed, no AppKit boilerplate.
- **`@MainActor` `ObservableObject` GameState** for a deterministic phase machine (idle / playing / revealing) that's easy to test on the main thread.
- **`UserDefaults` persistence** rather than a JSON file — it's tiny (4 ints), survives restarts, and lets the app start with no IO.
- **Hand-curated 24-puzzle corpus** rather than scraping or generating — every bug is one a working developer has actually shipped, and every wrestler name is a tiny pun (`ぬるぽ太郎`, `飛び越え十一`, `素通り forEach`, `型変わらず`...).
- **Color**: vermillion (朱色) `#f58e44` against near-black panels — references traditional sumo banner colors without leaning on cliché motifs.

## Tests

19 XCTest cases passing:
- `CorpusTests` (6): non-empty, every stable has ≥4 puzzles, IDs unique, buggy index in range, all required fields populated, `isCorrect` matches index.
- `RankTests` (5): zero → 序ノ口, all 10 thresholds exact, between-thresholds, capped at 横綱, ordering matches thresholds.
- `GameStateTests` (8): initial state, start transitions to playing, correct picks update streak / rank / career best, wrong pick resets streak but preserves career best, cancel returns to idle, persistence across instances, recent-puzzle avoidance, full reset.

## Files

```
bug-zumou/
├── Package.swift
├── Sources/BugZumou/
│   ├── BugZumouApp.swift   (~17 LOC)
│   ├── ContentView.swift   (~370 LOC) — all SwiftUI views
│   ├── Theme.swift         (~30 LOC)
│   ├── Models.swift        (~110 LOC)
│   ├── Corpus.swift        (~280 LOC) — 24 puzzles
│   └── GameState.swift     (~150 LOC)
└── Tests/BugZumouTests/
    ├── CorpusTests.swift
    ├── RankTests.swift
    └── GameStateTests.swift
```

## Potential next steps

1. **Daily 親方の一番** — one curated puzzle per day shared across all users (still solo, but seeded by date), with a tiny built-in calendar of which days you took.
2. **Keyboard line picking** — `1`–`9` to pick a line, `Return` to confirm. Currently mouse-only by design, but power users would love it.
3. **Custom corpora** — drop a JSON file of additional puzzles in `~/Library/Application Support/bug-zumou/` to extend the 24-puzzle base. Useful for teams who want to drill on their own classic bugs.
