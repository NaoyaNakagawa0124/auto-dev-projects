# CLAUDE.md — AfterHours

## Overview
Rust+WASM midnight-only movie picker web app.

## Architecture
- `src/lib.rs` — WASM exports, time gate, movie selection, themes
- `src/movies.rs` — Movie database
- `src/themes.rs` — Date-to-theme mapping
- `index.html` — Frontend
- `style.css` — Styles

## Build
```bash
cargo test          # Run Rust tests
wasm-pack build --target web  # Build WASM
```

## Conventions
- Rust 2021 edition, snake_case
- wasm-bindgen for JS interop
- serde for JSON serialization
