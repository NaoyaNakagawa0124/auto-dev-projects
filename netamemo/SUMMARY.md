# Netamemo (ネタメモ) — Summary

## What Was Built

A Chrome extension for aspiring YouTubers/TikTokers to collect, organize, and collaboratively vote on content ideas. Right-click any webpage to save it as a "ネタ" (content idea), rate it on 3 axes, share your idea board with friends via codes, and vote on the best ideas together.

## Features

- **Right-click clipping**: Save any webpage as a content idea with one click
- **6 categories**: Tutorial, Review, Vlog, Short, Collab, Other — each with emoji + color
- **3-axis rating**: Potential, Effort, Trend score (1-5 each)
- **Collaboration**: Export/import idea boards via Base64 sharing codes
- **Voting**: Thumbs up/down per idea with vote count display
- **Side panel**: Browse-integrated idea management
- **Search/filter/sort**: Full text search, category filter, 4 sort modes

## Tech Decisions

- **Manifest V3**: Modern Chrome extension standard
- **No framework**: Vanilla JS for minimal footprint and instant load
- **chrome.storage.local**: Persistent across browser restarts
- **Base64 sharing**: No backend needed for collaboration
- **Glassmorphism UI**: Warm creative palette (coral/amber/teal)

## Potential Next Steps

- WebRTC peer-to-peer real-time board sync
- Thumbnail preview cards using og:image
- AI-powered idea scoring based on current trends
- Export to YouTube Studio / TikTok drafts
