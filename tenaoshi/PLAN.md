# Implementation Plan - 手直し (Tenaoshi)

## Phase 1: Core Engine
- Raylib window setup (800x600)
- Tile-based map rendering (16x16 tiles, 32px each)
- Player character rendering and smooth movement
- Camera following player
- Basic game loop

## Phase 2: Map & World
- Design neighborhood tilemap (houses, roads, gardens, trees, fences)
- Multiple building states (broken → fixed)
- Tile collision detection
- Decorative elements (flowers, benches, streetlights)

## Phase 3: Interaction System
- Proximity detection (highlight interactable objects)
- Tool selection UI (hammer, paintbrush, shears, wrench)
- Repair animation/progress bar
- Tool-to-task matching (right tool = fast repair, wrong tool = no effect)
- Visual transformation on repair completion

## Phase 4: Game State & UI
- Town happiness meter
- Repair counter / completion percentage
- Japanese text rendering with custom font
- Title screen
- Simple menu (continue / new game)
- Neighbor dialogue bubbles
- Victory screen when all repairs done

## Phase 5: Polish
- Particle effects on repair completion
- Ambient color changes (morning/evening tint)
- Sound effects placeholder structure
- Quality polish pass (Japanese text, visual refinement)
- Final testing
