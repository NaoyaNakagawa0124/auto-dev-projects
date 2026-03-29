# IkiFuku - Summary

## What Was Built

A beautiful 5-minute breathing exercise web app with generative art visuals. Each breath creates expanding ripples and particles on a dark canvas. Four breathing patterns, real-time session progress, and a downloadable breath art image at the end. Designed for busy parents who need a quick stress-relief break.

## Core Features

1. **4 Breathing Patterns** - リラックス (4-7-8), バランス (4-4-4), エナジー (4-2-6), カーム (5-5-5)
2. **Generative Breath Art** - Canvas ripples, particles, and glowing orb respond to inhale/hold/exhale
3. **5 Color Palette Rotation** - Colors advance each phase change for rainbow variety
4. **Session HUD** - Phase label, timer, session + phase progress bars, pause/resume
5. **Completion Screen** - Stats (cycles, minutes, pattern) + PNG download of your breath art

## Tech Decisions

- **Canvas 2D + requestAnimationFrame** - Smooth 60fps generative art with zero dependencies
- **8KB bundle** - Ultra-lightweight, loads instantly
- **Glassmorphism UI** - Beautiful semi-transparent panels over dark canvas art
- **toBlob() export** - One-click save of the canvas art as PNG

## Potential Next Steps

1. Audio guide with ambient sounds (rain, waves)
2. History of past sessions with saved artworks
3. Custom breathing pattern creator
