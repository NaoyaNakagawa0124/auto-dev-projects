# NijiLog - Summary

## What Was Built

A generative art diary where emotions flow as colored particle streams. Built with p5.js for real-time particle visualization and vanilla JS for a lightweight, beautiful journaling experience.

## Core Features

1. **Mood Color Picker** - 8 mood options (喜び, 穏やか, 元気, 愛, 悲しみ, 怒り, 不安, ふつう) each with a distinct color
2. **Generative Flow Canvas** - p5.js particle streams rising from the bottom, one stream per diary entry, colored by mood
3. **Supply Chain Breaks** - Skipped days create visible gaps (dashed lines) in the flow, motivating consistency
4. **Calendar View** - Color-coded month view showing mood per day at a glance
5. **Entry List** - Chronological list with mood colors, emojis, and text
6. **Stats Dashboard** - Streak counter, mood distribution bars, gap count, motivational messages
7. **Streak Tracking** - Current streak, longest streak, milestone celebrations (3/7/14/30 days)

## Tech Decisions

- **p5.js** for generative art - HSL color mode, particle physics, bezier curves for flow connections
- **Vanilla JS** - no framework overhead for a visual-first experience
- **M PLUS Rounded 1c** font - soft, friendly Japanese typography
- **localStorage** - offline-first, no backend needed
- **Dark theme** - makes the colorful particles pop against the background

## Potential Next Steps

1. Export flow visualization as shareable image/video
2. Mood keyword detection from text (auto-suggest mood based on what you write)
3. Weekly/monthly review with AI-generated insights
4. Ambient background music that changes with mood
5. PWA manifest for installable mobile experience
