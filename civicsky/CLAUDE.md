# CLAUDE.md — CivicSky

## Project Overview
Chrome extension (Manifest V3) that replaces the new-tab page with an animated regulatory weather forecast.

## Architecture
- Pure vanilla HTML/CSS/JS — no build tools, no frameworks
- Canvas for weather animations, DOM for UI elements
- Chrome Storage API for persistence
- Modular JS files: weather-engine.js, policy-data.js, cards.js, forecast.js, settings.js

## Conventions
- camelCase for variables and functions
- PascalCase for classes
- Files: lowercase-with-hyphens.js
- No external dependencies — everything is self-contained
- ES modules where Chrome extension context allows

## Testing
- Tests run with Node.js (no browser required for unit tests)
- Test files: tests/*.test.js
- Run: `node tests/run-all.js`

## Key Decisions
- Manifest V3 (required for new Chrome extensions)
- No framework to keep the extension lightweight (<100KB)
- Sample data embedded rather than live API calls (MVP scope)
- Weather intensity mapped 0-100 from policy severity scores
