# CramSleuths — Build Summary

## What Was Built

A 2D local co-op detective puzzle game built with C and Raylib. Two student detectives investigate "The Missing Thesis" — a campus mystery across three interconnected rooms. Players share a keyboard (WASD+E / Arrows+Space), find clues, solve co-op puzzles, and deduce the culprit.

## Core Features

1. **Two-Player Co-op** — Local split-keyboard controls. Player 1 (blue) uses WASD+E, Player 2 (red) uses Arrows+Space. Both needed throughout.

2. **3 Mystery Rooms** — Library (dark academia), Lab (chemical evidence), Office (digital trail). Each with unique walls, interactable objects, and connecting doors.

3. **9 Clues (3 Co-op)** — Regular clues found by any player. Co-op clues require BOTH players standing near the object simultaneously to reveal it.

4. **Case Narrative** — "The Missing Thesis" — Professor Chen's groundbreaking research vanishes. Clues lead to the janitor who planned to sell it. Coffee stains, USB drives, and access logs paint the picture.

5. **Deduction System** — After finding 5+ clues, players open the deduction screen with 4 multiple-choice suspects. Correct answer wins, wrong answer loses.

6. **Noir Aesthetic** — Dark campus vibes with moody tile-based rooms, colored player circles, object highlighting, and evidence sidebar.

## Tech Decisions

- **C99 + Raylib** — Minimal dependencies, fast compilation, native performance
- **No framework/engine** — Pure game loop with state machine
- **Split architecture** — player/room/clue/game/ui modules cleanly separated
- **Tests without rendering** — Game logic tested independently of Raylib window

## Stats

- **67 tests** passing (clue system, rooms, game state, player)
- **12 source files** (6 .c + 6 .h)
- **~1,312 LOC** (C)
- **Build time**: ~2 seconds

## Potential Next Steps

1. **More cases** — Loadable case files with different mysteries
2. **Sound effects** — Footsteps, clue discovery chimes, door sounds
3. **Pixel art sprites** — Replace circles with animated detective characters
4. **Online multiplayer** — Network play via sockets
5. **Procedural generation** — Randomly generated room layouts and clue placements
