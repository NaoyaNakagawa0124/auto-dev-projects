# Wancostar (ワンコスター) — Summary

## What Was Built

A Swift macOS CLI app for dog-obsessed owners that turns daily walk logs into a cosmic galaxy visualization in the terminal. Each walk becomes a star (sized by duration, colored by route type, sparkled by mood), grouped by month into constellations. Includes infrastructure rating for sidewalks, shade, and dog-friendliness.

## Features

- Interactive walk logging with 6 route types and 3-axis infrastructure rating
- Cosmic galaxy visualization: stars grouped by month, colored by route, sized by duration
- Statistics: totals, averages, streaks, route breakdown, infrastructure averages with bar charts
- Unicode box-drawing tables and ANSI colored output throughout
- JSON persistence, export/import, auto-generated demo data (28 walks)
- 51 Swift tests covering all models, storage, statistics, and rendering

## Tech Decisions

- **Swift CLI (no Xcode)**: Pure Swift Package Manager for maximum portability
- **ANSI + Unicode art**: Rich terminal visualization without GUI dependencies
- **JSON persistence**: Simple, human-readable data format
- **Seeded star placement**: Walk date hash determines star position for consistency

## Potential Next Steps

- HealthKit integration for automatic walk detection
- GPS route recording via CoreLocation
- Animated terminal output (curses-based)
- Share galaxy screenshots to social media
