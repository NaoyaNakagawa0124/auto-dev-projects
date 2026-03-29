# CLAUDE.md — FitCoin

## Overview
Anti-Strava Node.js CLI. Fitness as a financial portfolio.

## Architecture
- `src/cli.js` — CLI entry point, command routing
- `src/portfolio.js` — Balance, deposits, dividends, corrections
- `src/streak.js` — Streak tracking and bonuses
- `src/storage.js` — JSON file persistence (~/.fitcoin/data.json)
- `src/chart.js` — ASCII chart rendering for terminal
- `src/format.js` — Number and date formatting

## Conventions
- Node.js, ES modules (type: module in package.json or .mjs)
- CommonJS for compatibility
- camelCase, no external dependencies
- Data stored in ~/.fitcoin/data.json
- Tests: node tests/run-all.js
