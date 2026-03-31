# Sekaiquest - Summary

## What Was Built

**世界クエスト (Sekaiquest)** is a Textual TUI world map explorer. Navigate an ASCII world map with arrow keys, discover 25 travel destinations across 7 regions, collect passport stamps, and learn fun facts about each city. Rich terminal UI with map panel, info panel, progress bar, and modal passport viewer.

## Key Features

- **ASCII world map** (80x20) with continent outlines and destination markers
- **25 destinations** across 7 regions (Asia, Europe, N.America, S.America, Africa, Middle East, Oceania)
- **Passport stamp collection**: Visit cities to collect stamps, track progress
- **Fun facts & trends**: Each city has a unique trivia fact and 2026 travel trend
- **Modal passport viewer**: Tab to see full collection status in a Rich table
- **Persistent state**: Visits saved to JSON file
- **Progress bar**: Visual percentage of world explored
- **Cursor navigation**: Arrow keys/WASD, Enter to visit

## Tech Stack

- Python 3 / Textual TUI framework
- Rich (tables, panels, styled text)
- JSON (state persistence)
