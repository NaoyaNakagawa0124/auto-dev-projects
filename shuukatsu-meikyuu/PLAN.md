# Shuukatsu Meikyuu — Implementation Plan

## Phase 1: Rust Core & WASM Setup
- Rust project with wasm-bindgen and wasm-pack
- Game state machine (title, exploring, encounter, result, dashboard)
- Procedural dungeon generation (rooms, corridors, events)
- Player stats system (communication, technical, presentation, mental)

## Phase 2: Encounters & Game Logic
- Company encounter system (random company generation)
- Interview encounters (skill checks with dice rolls)
- Event encounters (networking, study, rest, setback)
- Item system (ES templates, portfolio, reference letters)
- Floor progression (easy → medium → hard → final interview)

## Phase 3: Web Frontend & Rendering
- HTML/CSS/JS frontend consuming WASM
- Canvas-based dungeon map renderer
- UI panels for stats, inventory, encounter dialog
- Dashboard with run history charts

## Phase 4: Polish
- Japanese text throughout
- Pixel-art-inspired minimal visuals
- Sound effects via Web Audio
- localStorage for run history persistence
