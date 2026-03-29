# LumiLink - Summary

## What Was Built

A Godot 4 local co-op puzzle game where two light orbs must synchronize to illuminate dark paths. Based on ArXiv research showing synchronous activities strengthen relationship bonds. Deliberately limited to exactly 3 features by wildcard constraint.

## Key Features (exactly 3)

1. **Sync Movement**: Grid-based movement for two players (WASD + Arrows), with collision detection and blocked tiles
2. **Resonance Meter**: Builds when players are adjacent (manhattan distance <= 1), decays proportionally to distance. Must reach 50% threshold to light tiles
3. **Light Paths**: 10 hand-crafted levels from "First Light" to "Together", each a unique tile pattern

## Tech Decisions

- **Godot 4.3 project** with complete .tscn scenes and GDScript
- **Python test harness** mirrors GDScript game logic for testing without Godot engine
- **Pure data separation**: GameData (constants + levels) and GameState (mutable state) are separate, testable classes
- **Text-based .tscn**: All scenes in Godot's text format, no binary dependencies

## Level Design

10 levels tell a relationship story: starting apart (First Light), meeting (Crossroads), navigating obstacles (Two Paths, Labyrinth), forming a heart (Heart), and walking together (Together). The resonance mechanic means players must stay close — like a real relationship.

## Potential Next Steps

- Online multiplayer via Godot's networking for actual LDR couples
- Particle effects for resonance glow
- Music that harmonizes when resonance is high
- Custom level editor
