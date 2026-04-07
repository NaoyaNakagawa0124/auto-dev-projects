# Implementation Plan

## Phase 1: Project Setup + Data Models
- pyproject.toml with dependencies
- Data models: Cat, Era, Item, GameState
- Era database with 9 historical periods
- Item database per era
- JSON save/load utility

## Phase 2: Core Game Logic
- Cat state management (happiness, energy, curiosity)
- Pomodoro timer logic (25min work / 5min break)
- Time travel mechanics (era progression)
- Item discovery system
- Achievement tracking

## Phase 3: TUI - Main Screen
- Textual app structure
- Cat ASCII art display (changes per era)
- Era background/description panel
- Cat stats display
- Navigation between screens

## Phase 4: TUI - Pomodoro + Interactions
- Pomodoro timer widget with countdown
- Cat interaction buttons (なでる, 遊ぶ, おやつ)
- Item collection display
- Achievement list screen
- Era selection/history screen

## Phase 5: Polish + Tests
- All text in Japanese
- Color theming per era
- Animations/transitions
- Tests for game logic
- Final quality check
