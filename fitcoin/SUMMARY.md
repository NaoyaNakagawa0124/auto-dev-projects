# FitCoin — Build Summary

## What Was Built

A Node.js CLI that treats fitness like a financial portfolio. The anti-Strava: no metrics, no PRs, no shame. Deposit FitCoins for working out, earn streak bonuses and dividends, view ASCII portfolio charts in the terminal. Only extended gaps trigger a small "market correction."

## Core Features

1. **Deposit** — +10 FC per workout. One per day. Anti-punishment: no penalty for single missed days.
2. **Streak Bonuses** — +5 FC at 3 days, +15 at 7, +50 at 30. Incentivizes consistency.
3. **Dividends** — 2% daily compound after 3-day streak. Rewards long-term commitment.
4. **Market Correction** — Only after 7+ day gap: -5% balance. Gentle nudge, not punishment.
5. **ASCII Portfolio Chart** — Bar chart of balance over time, rendered in terminal.
6. **Stats Dashboard** — Box-drawn statistics: balance, workouts, dividends, consistency %.

## Tech Decisions

- **Node.js** — Universal CLI, no build step, runs everywhere
- **Zero dependencies** — All rendering and logic from scratch
- **JSON persistence** — ~/.fitcoin/data.json for portable data
- **CommonJS** — Maximum compatibility across Node versions

## Stats

- **61 tests** passing (portfolio logic + chart rendering)
- **8 files** (4 source + tests)
- **~700 LOC**

## Potential Next Steps

1. Weekly summary emails
2. "Market open" notifications (morning reminder)
3. Export to CSV for spreadsheet analysis
