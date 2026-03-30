# Hoshifumi (星文) — Summary

## What Was Built

A Three.js generative art typing game inspired by Van Gogh's birthday (March 30, 1853). Players type Japanese sentences at speed; each correct keystroke spawns a glowing star in a Starry Night-inspired 3D sky. Completed sentences form constellations that drift through space. A combo system (×1 → ×16) rewards accuracy with brighter, larger stars.

## Features

- **Typing Game**: 15 Japanese sentences across 3 difficulty levels (5/10/15 sentences)
- **Constellation Generation**: Typed characters become stars connected by golden constellation lines
- **Combo System**: ×1 → ×2 → ×4 → ×8 → ×16 multiplier with visual/audio feedback
- **Letter Mode**: Free-type messages that become constellations
- **Three.js Scene**: 2000 twinkling stars, 8 nebula clouds, 600 swirling particles, custom GLSL shaders
- **Gamified Stats**: WPM, accuracy, score, max combo, stars created, elapsed time
- **Audio**: Web Audio API synthesized hit, miss, combo up, and constellation sounds

## Tech Decisions

- **Single-file architecture**: One index.html for maximum portability
- **Three.js via CDN importmap**: No build step required
- **Custom GLSL shaders**: For star glow, twinkle, and burst effects
- **Additive blending**: Creates authentic glowing star effect
- **Web Audio API**: Synthesized sounds (no external audio files)
- **Glassmorphism UI**: backdrop-filter blur for modern panel design

## Potential Next Steps

- Online leaderboard with server-side WPM/score persistence
- More sentence sets (poetry, news, custom text upload)
- Share constellation screenshots (html2canvas integration)
- Progressive difficulty (sentences get longer as you play)
- Constellation gallery mode (browse all created constellations)
