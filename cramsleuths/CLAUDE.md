# CLAUDE.md — CramSleuths

## Project Overview
2D co-op detective puzzle game built with C and Raylib.

## Architecture
- `src/main.c` — Entry point, game loop, state machine
- `src/player.c/h` — Player struct, movement, input
- `src/room.c/h` — Room data, rendering, collision
- `src/clue.c/h` — Clue system, inventory, deduction
- `src/game.c/h` — Game state, logic, win condition
- `src/ui.c/h` — HUD, menus, deduction screen

## Build
```bash
make        # Build
make clean  # Clean
make test   # Run tests
```

## Conventions
- C99 standard
- snake_case for everything
- Structs prefixed by module (Player, Room, Clue, Game)
- Constants in UPPER_SNAKE_CASE
- Raylib functions called only from rendering code, not logic
