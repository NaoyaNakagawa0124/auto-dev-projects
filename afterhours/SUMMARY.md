# AfterHours — Build Summary

## What Was Built

A Rust + WASM web app that only works between midnight and 6am. Each night, it reveals a themed movie recommendation based on the date (cultural events, holidays). Movie nerds log what they watched, building a "Midnight Viewing Log." Visit outside those hours and the doors are locked with a countdown.

## Core Features

1. **Time Gate** — Rust WASM function `is_after_hours()` checks the hour. Outside midnight-6am, shows a locked screen with countdown timer. Override button for testing.

2. **Nightly Theme** — 30+ specific date themes (Int'l Mermaid Day, Pi Day, Halloween, etc.) plus rotating defaults. Each theme maps to a movie tag (ocean, night, romance, etc.).

3. **60 Movies** — Curated database spanning 1939-2020 across genres. Each movie has themes for matching. Deterministic selection per date (same night = same movie).

4. **Watch Log** — Mark films as watched. Persists to localStorage. Shows last 10 entries.

## Tech Decisions

- **Rust + wasm-bindgen** — Core logic (time gate, theming, movie selection) in Rust, compiled to WASM
- **Deterministic selection** — `(month * 31 + day) % matches.len()` ensures same movie every visit on same date
- **No framework frontend** — Vanilla HTML/CSS/JS loads WASM module via ES import
- **Art direction** — Dark, warm, cinematic aesthetic with gold accents on near-black background

## Stats

- **16 Rust tests** passing (time gate, themes, movies, data integrity)
- **3 Rust source files** + HTML/CSS frontend
- **~398 Rust LOC** + ~250 HTML/CSS/JS LOC
- **WASM output**: ~35KB
- **Build time**: ~40 seconds (cargo + wasm-pack)

## Potential Next Steps

1. Add movie poster images via TMDB API
2. Social sharing — "I watched X at 3am"
3. Streak tracking — consecutive nights watching
4. Sound design — ambient nighttime audio when doors open
