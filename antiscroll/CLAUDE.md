# CLAUDE.md — AntiScroll

## Project Overview
Anti-doomscroll endless runner built with C and Raylib.

## Architecture
- `src/main.c` — Entry point, game loop
- `src/runner.c/h` — Player, movement, lanes
- `src/spawner.c/h` — Obstacle/paper spawning and lifecycle
- `src/papers.c/h` — ArXiv paper dataset
- `src/scoring.c/h` — Score, anti-difficulty curve
- `src/ui.c/h` — HUD, menus, game over screen

## Build
```bash
make        # Build
make clean  # Clean
make test   # Run tests
```

## Conventions
- C99, snake_case, UPPER_SNAKE_CASE for constants
- Logic separated from rendering
- Tests in tests/test_main.c
