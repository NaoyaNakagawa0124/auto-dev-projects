# RunwayRise - Summary

## What Was Built

RunwayRise is a Chrome extension RPG where real-world workouts fuel your rise from fashion intern to creative director at Maison Lumiere. A 7-chapter narrative with Spring 2026 fashion aesthetics (cobalt, cherry red, canary yellow, violet) creates emotional stakes that keep fitness beginners from quitting.

## Key Features

- **7-chapter fashion narrative**: Intern → Assistant → Stylist → Designer → Lead → Director → Legend, each with multi-line story text
- **10 workout types** with per-type XP rates and flavor text (HIIT: 3.0 XP/min, Walking: 1.0 XP/min)
- **Duration bonuses**: 30+ min gets 1.2x, 60+ min gets 1.5x
- **Streak tracking**: consecutive days with warning when about to break
- **Character wardrobe** that evolves per chapter (4 outfit pieces each)
- **15 achievements** including early bird, night owl, variety, and chapter milestones
- **XP-to-level system** with progressive scaling
- **Spring 2026 color palette** UI with dark mode, gradient accents

## Tech Decisions

- **Chrome Extension Manifest V3** with fallback to localStorage for standalone testing
- **Vanilla JS** — zero dependencies, fast popup load
- **Separated data (story.js) from logic (engine.js) from UI (app.js)** — testable architecture
- **UTC hours** for early/late workout detection consistency across timezones

## Potential Next Steps

- Animated character avatar (CSS or Canvas)
- Weekly workout summary notifications
- Social sharing of chapter completions
- Branching story paths based on workout type preferences
