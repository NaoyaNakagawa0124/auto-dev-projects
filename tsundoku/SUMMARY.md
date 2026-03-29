# TsunDoku - Summary

## What Was Built

A Tetris-style book stacking puzzle game in C/Raylib. Book-shaped pieces of 7 types (文庫本, 単行本, 漫画セット, 百科事典, 画集, 新書, BOXセット) fall and must be stacked efficiently on shelves. 3-round tournament mode with cumulative scoring.

## Core Features

1. **7 Book-Shaped Pieces** - Each representing a different book format with unique shapes
2. **7 Genre Colors** - Fiction, Science, History, Fantasy, Mystery, Romance, Philosophy
3. **Line Clearing** - Fill a row to clear it, with multiplied scoring for combos
4. **3-Round Tournament** - Play 3 rounds, grade based on total score (S-F)
5. **Level Progression** - Drop speed increases every 10 lines cleared
6. **Ghost Piece Preview** - See where the current piece will land

## Tech Decisions

- **C99 + Raylib** - Fast, lightweight, zero dependencies beyond raylib
- **Separated logic** - piece.c, board.c, game.c all testable without Raylib
- **Wall kick rotation** - Pieces try to shift when rotation would cause collision

## Potential Next Steps

1. Hold piece mechanic (swap current for saved piece)
2. Online leaderboard
3. Custom shelf layouts (the architecture twist)
