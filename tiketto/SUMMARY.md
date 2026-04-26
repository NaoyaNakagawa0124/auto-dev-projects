# 🎫 tiketto — Summary

## What Was Built

An Electron desktop app for collecting and visualizing concert ticket stubs. Features a DevTools-inspired dark UI with a ticket-stub card design, statistics dashboard with heatmap, and chronological timeline view.

## Features

- **Ticket Stub Cards** — CSS-art ticket design with color bar, date stub, and perforated edge
- **Collection Grid** — Responsive grid with search, sort (date/artist/venue), and color coding
- **Stats Dashboard** — Total shows, artist/venue rankings with bar charts, monthly heatmap
- **Timeline View** — Year-grouped chronological view of all concerts
- **CRUD Operations** — Add, edit, delete tickets via modal form
- **Star Rating** — 5-star rating for each concert
- **JSON Import/Export** — Full data backup and restore
- **Electron IPC** — Secure context-isolated communication between main and renderer

## Tech Stack

- Electron 33 (main + renderer + preload)
- Vanilla HTML/CSS/JS (zero framework dependencies)
- JSON file storage via custom Store class
- JetBrains Mono + Noto Sans JP fonts

## Potential Next Steps

- Setlist integration (setlist.fm API)
- Photo attachment for tickets
- Ticket stub image generator (share-ready PNG export)
- Concert calendar view
- Barcode/QR code scanner
