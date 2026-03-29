# GigRank - Build Summary

## What Was Built
A collaborative web app where concert-going friends create groups, add gigs, and rate shows across 5 dimensions (energy, sound, setlist, crowd, vibes). Ratings sync in real-time and are visualized with comparison radar charts.

## Features Delivered
- Group creation with shareable 6-character join codes
- Member management with duplicate prevention
- Gig CRUD with date sorting
- 5-dimension rating system (1-10 scale per dimension)
- Rating upsert (update your rating anytime)
- Average score calculation across group
- WebSocket real-time sync for ratings and new gigs
- Chart.js radar chart comparing all members' ratings
- Responsive dark-mode UI
- SQLite persistence with constraint validation
- 46 passing tests

## Tech Decisions
- **Express + ws** over Socket.io: lighter weight, fewer deps
- **better-sqlite3** over PostgreSQL: zero-config, single-file, perfect for self-hosted
- **Chart.js radar** over Plotly: smaller bundle, built-in radar type
- **Vanilla frontend** over React: minimal complexity for a focused app

## Potential Next Steps
- Photo upload per gig
- Aggregate stats across all gigs (who rates highest, genre trends)
- Export group history as PDF
- OAuth login instead of username-only
- Mobile PWA manifest
