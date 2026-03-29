# ShipWatch

A one-hand-usable CLI for monitoring global shipping disruptions at 3am. Based on real 2026 Strait of Hormuz crisis data. All navigation uses left-hand-only single keys.

## Features

- Dashboard with global risk score and active disruptions
- Detailed disruption reports with reroute info
- Route delay estimator for 8 major shipping lanes
- Package tracker with 6 sample shipments
- Interactive mode with single-key navigation

## One-Hand Controls (Left Hand Only)

- `d` — Dashboard
- `1-5` — Disruption details
- `r` — Route delays
- `t` — Package tracker
- `q` — Quit
- `?` — Help

No Ctrl/Shift/Alt combos. Designed for 3am one-hand use.

## Run

```bash
node src/cli.js           # Dashboard
node src/cli.js r         # Routes
node src/cli.js t         # Packages
node src/cli.js i         # Interactive mode
node tests/test.js        # Tests
```
