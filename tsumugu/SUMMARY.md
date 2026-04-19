# 紡ぐ (Tsumugu) — Summary

## What Was Built

A Discord bot + CLI tool that maps Japan's 72 traditional microseasons (七十二候) to seasonal Japanese craft suggestions. Each of the 72 five-day periods has a poetic name and is paired with relevant traditional crafts like tsumami-zaiku, mizuhiki, sashiko, and kusakizome.

## Features

- **Complete 72 Microseason Database** — All 72 kou with names, readings, meanings, dates, grouped by 24 solar terms
- **36 Craft Suggestions** — 3 per month, spanning 12 categories (つまみ細工, 水引, 刺し子, 草木染め, etc.)
- **Date-Aware Lookup** — Automatically determines current microseason from system date
- **Search** — Find kou by name, reading, or meaning; find crafts by keyword
- **Discord Embeds** — Beautiful season-colored embed messages for Discord
- **Standalone CLI** — Full-featured terminal interface with box-drawing and ANSI colors
- **Seasonal Color Theming** — Each season and solar term has its own color palette

## Tech Stack

- Node.js with ES modules
- discord.js v14 (optional — bot works in CLI-only mode)
- Zero runtime dependencies for CLI mode

## Key Files

```
tsumugu/
├── src/
│   ├── seasons.js   — 72 microseasons + 24 solar terms database
│   ├── crafts.js    — 36 craft suggestions by month/season
│   ├── embeds.js    — Discord embed builder
│   ├── cli.js       — Terminal interface
│   └── bot.js       — Discord bot entry point
├── tests/
│   └── run.js       — 115 tests
└── package.json
```

## Potential Next Steps

- Daily scheduled posting (cron-based auto-post each microseason change)
- Weather API integration (match crafts to real weather)
- Image generation for each microseason
- LINE bot version for Japanese audience
