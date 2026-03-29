# AfterHours

> A secret cinema club that only opens between midnight and 6am.

## What is AfterHours?

AfterHours is a Rust + WASM web app for movie nerds who watch films late at night. It **only works between midnight and 6am** — visit outside those hours and the doors are locked.

Each night, AfterHours reveals a themed movie recommendation based on the date (holidays, cultural events, historical moments). Log what you watched. Build your midnight viewing history.

## Features

1. **Time Gate** — The app only unlocks between 00:00 and 06:00. Outside those hours, you see a "Doors closed" screen with a countdown.
2. **Nightly Theme** — Each date maps to a cultural event/holiday. The movie pick matches the theme.
3. **Watch Log** — Mark films as watched. View your midnight cinema history.
4. **60+ Movies** — Curated database spanning genres, decades, and themes.

## Tech Stack

- **Rust** — Core logic (time gate, movie selection, theming)
- **WASM** — Compiled via wasm-pack for browser execution
- **HTML/CSS/JS** — Frontend rendering
- **localStorage** — Watch history persistence

## Build & Run

```bash
# Build WASM
wasm-pack build --target web

# Serve locally (any static server)
python3 -m http.server 8080
# Open http://localhost:8080 (between midnight and 6am!)

# Run Rust tests
cargo test
```

## License

MIT
