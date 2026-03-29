# MadoriMystery - Summary (App #50!)

## What Was Built

A floor plan mystery generator where you design a room layout and the app creates a murder mystery within it. Place rooms on a grid, click "generate," and the app spawns suspects, weapons, clues, and a crime scene. Then investigate each room to find evidence and accuse the culprit. Perfect content for mystery YouTubers.

## Core Features

1. **Floor Plan Editor** - Grid-based room placement with 8 room types (リビング, 寝室, キッチン, 浴室, 書斎, 物置, 廊下, 庭)
2. **Mystery Generator** - Seeded random algorithm generates culprit, weapon, motive, crime scene, 4+ clues, and red herring
3. **Investigation Mode** - Click rooms to discover clues, view found/hidden clue list
4. **Accusation System** - Select from 4 suspects with alibis, requires 2+ clues before accusing
5. **Deterministic Generation** - Same floor plan always produces same mystery (reproducible for content)
6. **4 Suspects** - Each with name, role, alibi, and emoji

## Tech Decisions

- **10KB bundle** - Canvas 2D rendering, zero dependencies
- **Seeded RNG** - Deterministic mystery from floor plan layout
- **Overlap detection** - Grid-based collision for room placement
- **Red herring system** - One fake clue per mystery for added depth

## Potential Next Steps

1. Multiple mystery scenarios per floor plan (different seeds)
2. Difficulty levels (more suspects, harder clues)
3. Export floor plan mystery as shareable image
4. Timer mode for speed investigation
