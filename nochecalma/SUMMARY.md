# NocheCalma - Summary

## What Was Built

An Electron desktop app that only works between midnight and 6am — a sanctuary for overworked parents. Inspired by Mexico's Spring Equinox tradition of recharging energy at Teotihuacán. 5 micro-rituals, breathing exercises, gratitude journal, energy recharge meter.

## Key Features

- **Time gate**: Locked screen with moon animation outside midnight-6am
- **5 breathing patterns**: 4-7-8, Box, Moonlight, Equinox Reset, Quick Calm (45-60 seconds each)
- **Gratitude + Release journaling**: 20 rotating prompts, localStorage persistence, capped at 100 entries
- **Energy meter**: Builds with rituals, decays 20 points between nights (Dark → Radiant)
- **Night streak tracking**: Milestones at 1/3/7/14/30/60/100/200/365 nights

## Tech Decisions

- **Electron wrapper + standalone HTML**: Works with `npm start` (Electron) or directly in browser
- **Vanilla JS**: Zero dependencies for the app itself, fast load in the midnight quiet
- **localStorage**: No server, no accounts, fully private — important for a journal app
- **Mexican-inspired design**: Dark palette with warm gold accents, serif fonts for calm

## Potential Next Steps

- Ambient audio playback for soundscapes (Web Audio API)
- Export journal entries to markdown
- Push notification at midnight ("The sanctuary is open")
- Partner mode for couples doing rituals together
