# SnapJudge - Summary

## What Was Built

A speed photo-culling game in Godot 4 where players rapidly judge procedurally generated "photos" by their quality attributes (sharpness, exposure, composition). Swipe right to keep, left to delete, up to star. Score is based on speed + accuracy with combo multipliers.

## Core Features (3 only, per Wildcard constraint)

1. **判定 (Judge)** - Swipe/keyboard to sort photos into keep/delete/star
2. **スコア (Score)** - Points from speed, accuracy, star bonuses, and combo streaks
3. **結果 (Results)** - End-of-round stats with grade (S-F), high score tracking

## Tech Decisions

- **Godot 4 / GDScript** - Native game engine with rich 2D rendering and tween animations
- **Procedural photo generation** - No external assets needed; quality attributes drive the visual
- **Swipe + keyboard input** - Touch and keyboard support for mobile and desktop
- **Node.js test suite** - Since Godot isn't installed, tests validate game logic by reimplementing core math in JS, plus file structure and Japanese text validation

## Potential Next Steps

1. Add real photo datasets (public domain images) for more realistic training
2. Difficulty levels (Easy: more time/clearer quality, Hard: faster/subtler differences)
3. Photo editing mini-game between culling rounds
