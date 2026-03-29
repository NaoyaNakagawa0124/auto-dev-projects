# ShipWatch - Summary

## What Was Built

A one-hand-usable Node.js CLI for monitoring global shipping disruptions. Based on real 2026 events (Strait of Hormuz closure, Suez congestion, Panama drought, Middle East airspace restrictions). All navigation uses left-hand single keys — no modifier combos.

## Key Features

- **Dashboard**: Global risk score (0-100), 5 active disruptions with severity/impact
- **Disruption details**: Per-disruption report with carriers, reroute info, cost impact
- **Route delays**: 8 shipping lanes with delay calculations based on active disruptions
- **Package tracker**: 6 shipments with status, ETA, delay reasons
- **One-hand navigation**: All keys reachable with left hand (d, r, t, q, 1-5, ?)
- **Interactive mode**: Raw terminal input for single-key switching

## Tech Decisions

- **Zero dependencies**: Pure Node.js, no npm install needed
- **ANSI terminal rendering**: Box-drawing characters, color-coded severity
- **Data-driven architecture**: data.js (pure data + logic), renderer.js (display), cli.js (I/O)
- **Real 2026 events**: Disruption data based on actual March 2026 supply chain crises

## Potential Next Steps

- Live API integration (MarineTraffic, Xeneta)
- Custom package tracking (add your own tracking numbers)
- Alert mode (watch for changes, beep on severity increase)
- Export to JSON/CSV
