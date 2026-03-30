# Book Cosmos (ブックコスモス) — Summary

## What Was Built

A Three.js physics simulation that transforms a reader's library into a living cosmos. Each book is a glowing celestial body with real n-body gravitational physics — books of similar genres gravitationally attract each other, forming beautiful genre clusters. Adding a massive book (500+ pages) triggers a supernova with particle burst, shockwave, and audio. Inspired by Artemis II and JWST galaxy discoveries.

## Features

- 4000-star twinkling background with GLSL shaders and nebula clouds
- N-body gravity simulation with genre affinity (3x same-genre attraction)
- 12 genres with distinct colors, 24 pre-populated demo books
- Supernova effect: camera zoom, flash, 200 particles, shockwave, Web Audio
- Constellation lines connecting same-author books
- Add/search/filter/delete books, clickable star rating
- Statistics panel with genre distribution bars
- Export/import JSON, localStorage persistence
- OrbitControls with auto-rotate

## Tech Decisions

- **Single HTML file**: Maximum portability, Three.js via CDN importmap
- **Euler integration**: Simple, stable enough for visual simulation
- **Velocity damping + central attraction**: Keeps the system bounded and beautiful
- **GLSL star shaders**: Core + glow + outer ring for realistic celestial bodies
- **Web Audio API**: Synthesized supernova sound (no external files)

## Potential Next Steps

- Reading timeline animation (watch your cosmos grow over time)
- Goodreads CSV import
- Book recommendation based on genre cluster analysis
- Multiplayer: compare cosmos with friends
