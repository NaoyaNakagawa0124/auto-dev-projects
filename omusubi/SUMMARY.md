# おむすび — Summary

## What Was Built

A Dart CLI + web app for long-distance couples to share meal logs, with a cute rice ball mascot character (おむすび) that reacts to foods. Tracks "一緒にごはん" streaks when both partners eat within a 2-hour window, and suggests recipes they can cook simultaneously.

## Features

- **Mascot System** — おむすび character with 4 moods, ASCII art, 13+ food-specific reactions
- **Meal Logging** — Per-person meal entries with time-of-day labels (朝食/昼食/おやつ/夕食/夜食)
- **Together Detection** — Finds meals where both partners ate within 2 hours
- **Streak Tracking** — Consecutive days with together meals
- **Recipe Suggestions** — 8 simple recipes with tips for cooking as a couple
- **Web UI** — Warm pink/blue split view, mascot animations, localStorage persistence
- **Dart CLI** — Terminal interface with ANSI colors and ASCII mascot art

## Tech Stack

- Dart 3.11 (core logic, CLI, tests)
- HTML/CSS/JS (web frontend)
- LocalStorage (web persistence)

## Potential Next Steps

- Photo sharing (meal photos)
- Push notifications when partner logs a meal
- Meal matching game (guess what your partner ate)
- Calendar heatmap view
