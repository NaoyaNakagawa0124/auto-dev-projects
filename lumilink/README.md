# LumiLink

A Godot 4 local co-op puzzle game for couples. Two light orbs must synchronize their movement to illuminate dark paths together. Inspired by ArXiv research on how synchronous play facilitates intimacy in long-distance relationships.

## The 3 Features (and nothing more)

1. **Sync Movement** - Two players (WASD + Arrows) control light orbs on a grid. Move close together to build resonance.
2. **Resonance Meter** - Tracks synchronization. When resonance >= 50%, your orbs can light dark tiles. Move apart and it decays.
3. **Light Paths** - 10 puzzle levels where you must illuminate all dark tiles together. Each level is a new pattern to synchronize through.

## How to Play

1. Open in Godot 4.3+
2. Player 1: WASD | Player 2: Arrow Keys
3. Move close together to build resonance (shown in the meter)
4. When resonance is high enough, step on dark tiles to light them
5. Light all tiles to complete the level
6. Press SPACE to advance

## Levels

1. First Light - Simple line
2. Crossroads - Meet in the middle
3. Two Paths - Stay close on parallel paths
4. Spiral - Trace together
5. Islands - Bridge the gaps
6. Labyrinth - Navigate as one
7. Heart - Light up the heart
8. Zigzag - Weave together
9. Constellation - Connect the stars
10. Together - The final path

## Tech Stack

Godot 4.3 / GDScript / Python test harness

## Test

```bash
python3 tests/test_game.py
```
