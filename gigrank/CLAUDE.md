# GigRank - CLAUDE.md

## Project Overview
Collaborative concert rating web app with real-time WebSocket sync and radar chart comparisons.

## Tech Stack
- Node.js, Express, WebSocket (ws), better-sqlite3, Chart.js

## Running
```bash
npm install
node server.js
# Open http://localhost:3000
```

## Testing
```bash
node tests/test.js
```

## Conventions
- camelCase for variables/functions
- API routes in server.js, DB logic in lib/database.js
- Frontend: vanilla HTML/CSS/JS in public/
