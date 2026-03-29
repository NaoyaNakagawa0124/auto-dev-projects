# EigaSketch - Summary

## What Was Built

A Godot 4 movie quiz game with hand-drawn sketch-style visuals. The game progressively draws wobbly sketch hints about famous movies, and players guess the correct title from 4 choices. 30 movies across 6 genres, speed scoring with hint penalties, and S-F grading.

## Core Features

1. **30 Movies** - 5 per genre (Action, SF, Horror, Romance, Anime, Fantasy) with 4 visual hints each
2. **Sketch-Style Drawing** - Wobbly circles, rectangles, lines, stars, and waves on a paper-grid background
3. **Progressive Hints** - Hints auto-reveal over time; answering faster = more points
4. **Quiz Modes** - Quick 10-question round or full 30-question challenge
5. **Speed + Hint Scoring** - Base points + speed bonus - penalty per hint revealed

## Tech Decisions

- **Godot 4 / GDScript** - Native drawing API ideal for sketch-style procedural art
- **Wobbly drawing functions** - sin-based wobble on all shapes for hand-drawn feel
- **Node.js test suite** - 71 tests validating movie data, quiz logic, sketch drawer, and Japanese text
- **6 hint types** - circle, rect, line, text_hint, star, wave — each with unique wobble rendering

## Potential Next Steps

1. User-contributed movie databases
2. Multiplayer mode (who guesses faster?)
3. Actual freehand drawing mode (player draws, AI guesses)
