# CLAUDE.md — MealRoll

## Overview
Chrome extension new-tab recipe roulette. Exactly 3 features: spin, filter, favorites.

## Architecture
- `js/recipes.js` — Recipe database and filtering
- `js/favorites.js` — Favorites persistence
- `js/spin.js` — Spin animation logic
- `js/app.js` — Main entry point
- `newtab.html` — New-tab page
- `styles/main.css` — All styles

## Conventions
- Vanilla JS, no frameworks, no build tools
- camelCase, self-contained, <50KB total
