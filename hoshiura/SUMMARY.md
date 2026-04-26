# 星占 (Hoshiura) — Summary

## What Was Built

A photo color analysis × constellation fortune-telling app in Dart. Upload a photo, the app extracts dominant colors, matches them to one of 12 constellations via RGB color distance, and generates a cosmic fortune reading. Features both a Dart CLI and a beautiful space-themed web frontend.

## Features

- **12 Constellation Color Profiles** — Each zodiac sign has primary/secondary RGB colors, traits, elements
- **Color Distance Matching** — Weighted Euclidean distance in RGB space with primary/secondary blending
- **Deterministic Fortune Generation** — Seed-based PRNG for reproducible results per color+day
- **5-Category Luck System** — Overall, love, work, money, health (each 1-5 stars)
- **Web Photo Upload** — Drag-and-drop with Canvas-based color extraction (saturation-weighted average)
- **Star Background Animation** — Twinkling star canvas with parallax motion
- **Dart CLI** — Terminal fortune with ANSI colors and 256-color swatch

## Tech Stack

- Dart 3.11 (core logic, CLI, tests)
- HTML/CSS/JS (web frontend)
- Canvas API (photo analysis, star background)
- Glassmorphism + cosmic gradient UI

## Potential Next Steps

- Camera capture (mobile PWA)
- Share fortune as image (OGP card)
- Daily fortune history
- Constellation compatibility checker
