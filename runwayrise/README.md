# RunwayRise

A Chrome extension RPG where your real-world workouts fuel your character's journey from fashion intern to creative director. Every workout advances the story, unlocks outfits, and evolves your style. Skip workouts? Stay stuck in basic sweats.

## Concept

Fitness beginners quit because workouts feel disconnected from any larger purpose. RunwayRise creates emotional stakes: your character is living a fashion career narrative with 7 chapters, and the only way to progress is by working out. The Spring 2026 color palette (cobalt, cherry red, canary yellow, violet) drives the visual design.

## Features

- 7-chapter fashion career storyline (Intern → Assistant → Stylist → Designer → Lead → Director → Legend)
- Workout logging with type selection and duration
- Character wardrobe that visually evolves with each chapter
- Style XP system with level progression
- Streak tracking with decay warning
- Achievement badges for milestones
- Spring 2026 fashion color palette UI

## Tech Stack

Chrome Extension (Manifest V3) / Vanilla HTML/CSS/JS / Chrome Storage API

## How to Install

1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click "Load unpacked" → select `runwayrise/`
4. Click the extension icon to start your journey

## How to Test

```bash
node tests/test.js
```
