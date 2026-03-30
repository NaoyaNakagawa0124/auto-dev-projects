# Neon Reader (ネオンリーダー) — Summary

## What Was Built

A Chrome extension that transforms any webpage into a clean, high-contrast, cyberpunk-styled reading experience designed for seniors. Neon text on dark backgrounds provides genuinely excellent readability while making browsing feel cool and futuristic. Features include a reading guide, HUD overlay, scanline effects, and typewriter title animation.

## Features

- One-click reader mode with multi-strategy text extraction
- 4 neon color themes (green, cyan, amber, white)
- Large configurable fonts (20-32px), line height, letter spacing
- Reading guide band that follows mouse position
- HUD overlay: character count, reading time, scroll progress
- Subtle scanline CRT effect (pure CSS, 0.015 opacity)
- Typewriter effect on article title
- Alt+R keyboard shortcut
- All settings persist via chrome.storage

## Tech Decisions

- **On-demand injection**: Content scripts injected via chrome.scripting (not auto-injected) for efficiency
- **Multi-strategy extraction**: article tag → role=main → most-paragraphs heuristic → body fallback
- **Pure CSS effects**: Scanlines, glow, reading guide — no canvas or WebGL needed
- **Senior-first defaults**: 24px font, 2.0 line height, high contrast neon green theme

## Potential Next Steps

- Text-to-speech integration for articles
- Auto-detect and simplify complex vocabulary
- Furigana addition for difficult kanji
- Night mode scheduling (auto-activate at certain hours)
