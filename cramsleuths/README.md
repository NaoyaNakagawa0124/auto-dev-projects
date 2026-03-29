# CramSleuths

> A 2D co-op detective puzzle game for two players — solve the campus mystery at 2am.

## What is CramSleuths?

CramSleuths is a local co-op mystery game built with Raylib and C. Two student detectives investigate a campus crime across interconnected rooms. Find clues, solve puzzles, and crack the case — together.

## Controls

| Action | Player 1 (Blue) | Player 2 (Red) |
|--------|-----------------|-----------------|
| Move | WASD | Arrow Keys |
| Interact | E | Space |
| Combine clues | Tab (shared) | Tab (shared) |

## Features

1. **Two-Player Co-op** — Local split-keyboard play. Both detectives needed to solve the case.
2. **3 Mystery Rooms** — Library, Lab, Office — each with unique clues and puzzles
3. **Clue System** — Find objects, examine evidence, piece together the mystery
4. **Co-op Puzzles** — Some clues require both players to be in specific positions
5. **Noir Aesthetic** — Dark, moody pixel art with late-night campus vibes
6. **Case Deduction** — Combine collected clues to form the solution

## Tech Stack

- **Language:** C (C99)
- **Graphics:** Raylib 5.5
- **Platform:** macOS, Linux, Windows (cross-platform via Raylib)

## Build & Run

```bash
cd cramsleuths
make
./cramsleuths
```

## Requirements

- C compiler (gcc or clang)
- Raylib 5.5+ (`brew install raylib` on macOS)

## License

MIT
