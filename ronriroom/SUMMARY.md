# RonriRoom - Summary

## What Was Built

A logic puzzle escape game in C with Raylib where a new employee solves 5 different puzzle types to escape office rooms. Each room features a distinct puzzle mechanic inspired by academic CS/math concepts.

## 5 Puzzle Types

1. **Pattern Recognition** (Room 1) - Complete a Latin square pattern in a 4x4 grid
2. **Number Sequence** (Room 2) - Identify and complete a Fibonacci sequence
3. **Linked Switches** (Room 3) - Toggle switches with linked dependencies to match a target state
4. **Maze Navigation** (Room 4) - Navigate a 5x5 grid from start to goal avoiding walls
5. **Caesar Cipher** (Room 5) - Decrypt a shifted message

## Tech Decisions

- **C99 + Raylib** - Fast compile, clean 2D rendering, no runtime dependencies
- **Pure logic in puzzles.c** - All puzzle logic is testable without Raylib (compiled with -DTEST_MODE)
- **State machine** - Clean game flow: Title → Story → Playing → Solved → Complete
- **Separated UI** - Drawing code in ui.c, logic in puzzles.c, flow in game.c

## Potential Next Steps

1. More puzzle types (Sudoku, Tower of Hanoi, binary conversion)
2. Randomized puzzle parameters for replayability
3. Japanese font rendering via Raylib font loading (currently ASCII/romaji)
4. Leaderboard with time/mistake tracking
