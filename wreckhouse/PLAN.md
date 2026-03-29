# WreckHouse - Implementation Plan

## Phase 1: Core Data Model
- Room class with objects, damage states, and ASCII rendering
- Tool class with disaster probabilities and effect types
- ChainReaction engine that propagates damage between objects

## Phase 2: Game Logic
- Score system with combos and multipliers
- Patience meter with parent reactions
- Turn system: pick room -> pick tool -> pick target -> resolve chain

## Phase 3: Terminal UI
- ANSI color rendering for rooms
- ASCII art for each room type
- HUD with score, patience, turn count
- Animated chain reaction display

## Phase 4: Social & Endgame
- Fake social media posts for disasters
- Game over screen with stats
- High score persistence

## Phase 5: Testing
- Unit tests for all game logic
- Chain reaction determinism tests
- Score calculation tests
