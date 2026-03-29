# Laika's Journey - CLAUDE.md

## Project Overview
Discord bot game where you guide a space dog through the solar system, learning real astronomy.

## Tech Stack
- Node.js 18+, discord.js v14, better-sqlite3, dotenv

## Running
```bash
cp .env.example .env  # Add your bot token
npm install
node bot.js
```

## Testing
```bash
node tests/test.js
```

## Conventions
- camelCase for variables/functions
- Game logic in lib/, planet data in data/
- In-memory SQLite for tests via `setDb()`
