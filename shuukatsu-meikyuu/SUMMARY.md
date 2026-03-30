# Shuukatsu Meikyuu (就活迷宮) — Summary

## What Was Built

A Rust+WASM roguelike dungeon crawler themed around the Japanese job search process. Each run generates a unique 5-floor labyrinth with randomly generated companies, interview encounters, and events. Player stats (communication, technical, presentation, mental) grow through encounters. A dashboard tracks run history and skill growth over time.

## Features

- 5 themed floors: ES Hell → Group Discussion → First Interview → Technical Test → Final Interview
- Procedural dungeon generation (5x5 grid per floor, 7 room types)
- Random company generator (prefix × suffix × industry × size combinations)
- 4-stat system with skill checks, items (max 3), and encounter resolution
- Canvas-based dungeon map with color-coded room types
- Run history dashboard with statistics
- 47 Rust unit tests covering all game logic

## Tech Decisions

- **Rust for game logic**: Type safety, fast procedural generation, easy testing
- **wasm-bindgen**: Clean Rust↔JS interface via JSON serialization
- **Canvas 2D**: Lightweight dungeon rendering without heavy frameworks
- **Seeded RNG**: Each run is reproducible from a seed, but seeds differ per run

## Potential Next Steps

- More encounter types (group interview, case study)
- Achievement / badge system
- Leaderboard with best runs
- Sound effects for encounters
