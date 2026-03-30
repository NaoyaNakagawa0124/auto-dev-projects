# Nyantokashite (にゃんとかして) — Summary

## What Was Built

A Sokoban-style puzzle game where a mischievous cat has knocked items off shelves and you must push them back. The cat roams around the level every 3 moves, dynamically blocking paths and creating an extra puzzle layer. 20 handcrafted levels across 4 rooms with star ratings.

## Features

- 20 levels: 4 rooms × 5 levels, progressive difficulty
- Dynamic cat AI that moves every 3 player moves
- Full undo system and restart
- Star rating (par-based scoring)
- Pixel-art characters drawn programmatically (no image files)
- Particle effects on correct item placement
- Web Audio sound effects (7 types)
- Title screen with animated cat, instructions, level select
- Mobile touch controls with virtual d-pad
- localStorage progress persistence

## Tech Decisions

- **Single HTML file**: Zero dependencies, instant playability
- **Canvas 2D pixel art**: All sprites drawn with code, no assets needed
- **Dynamic cat AI**: Simple but effective — moves to random adjacent tile every 3 turns
- **Handcrafted levels**: Every level verified solvable with balanced difficulty curve

## Potential Next Steps

- Level editor for user-created puzzles
- More room themes (bathroom, garden, attic)
- Cat personality types (lazy cat moves less, active cat moves every move)
- Online level sharing via URL encoding
