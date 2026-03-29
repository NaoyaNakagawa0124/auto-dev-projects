# WreckHouse - Summary

## What Was Built

WreckHouse is a terminal-based C# game — the anti-House Flipper. You play as a bored teenager forced to help with home renovation. Every action triggers chain-reaction disasters across 5 rooms with 30 destructible objects. Score points for creative destruction while your parent's patience drains.

## Key Features

- **5 rooms**: Kitchen, Bathroom, Bedroom, Garage, Living Room (6 objects each)
- **8 tools**: Hammer, Paint Roller, Drill, Blowtorch, Wrench, Sledgehammer, Garden Hose, Duct Tape (triple score bonus!)
- **Chain reactions**: Objects have vulnerabilities and chain effects — breaking a pipe floods the oven, which fires the fridge, which electrocutes the light
- **Cross-room spread**: Major disasters can spread to adjacent rooms
- **Patience meter**: Parent reacts with escalating fury (Calm → Annoyed → Furious → Volcanic → Gone)
- **Fake social media**: Big disasters generate viral posts on WreckTok, Instagroan, FailTube with likes, shares, and comments
- **Scoring**: Combos, streaks, depth bonuses, cross-room bonuses, duct tape triple multiplier
- **Deterministic replay**: Fixed-seed support for reproducible games

## Tech Decisions

- **Mono (mcs/mono)** instead of .NET SDK — lighter, available on the system, sufficient for terminal game
- **No external dependencies** — pure C# standard library
- **Separated game logic from UI** — all game classes testable independently, Program.cs is just I/O
- **Custom test runner** — lightweight, no NUnit/xUnit dependency needed

## Architecture

```
src/
  Room.cs       - Room/object model with 5 room factories, ASCII rendering
  Tool.cs       - 8 tool definitions with effects and disaster chances
  Chain.cs      - Chain reaction engine with depth-limited propagation
  Score.cs      - Scoring with combos, streaks, ranks
  Patience.cs   - Parent patience meter with mood and reactions
  Social.cs     - Fake social media post generator
  Game.cs       - Game state machine tying everything together
  Program.cs    - Terminal UI and input handling
tests/
  TestRunner.cs - Lightweight assertion framework
  Tests.cs      - 167 unit + integration tests
```

## Potential Next Steps

- Color ANSI output for damage types (red for fire, blue for water, etc.)
- Save high scores to file
- Achievement system (e.g., "Flood the entire house", "Destroy everything with duct tape")
- Multiple parent personalities with different patience curves
- Sound effects via terminal bell codes
