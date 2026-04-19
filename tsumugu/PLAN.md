# Implementation Plan

## Phase 1: Microseason Database
- Complete 72 microseasons data with dates, names, readings, meanings
- 24 solar terms (二十四節気) as grouping
- Season colors for visual theming
- Date calculation logic (solar longitude based approximation)

## Phase 2: Craft Suggestions System
- Craft database tied to seasons/months
- Categories: つまみ細工, 水引, 刺し子, 草木染め, 折り紙, ちりめん細工, etc.
- Difficulty levels and material lists
- Seasonal appropriateness mapping

## Phase 3: CLI Interface
- Standalone CLI for testing without Discord
- Commands: today, next, crafts, search, list
- Colorful terminal output with box drawing
- Japanese text formatting

## Phase 4: Discord Bot
- discord.js v14 integration
- Slash commands registration
- Beautiful embed builder with seasonal colors
- Error handling and graceful degradation

## Phase 5: Tests & Polish
- Unit tests for date calculations
- Tests for microseason lookup
- Tests for craft suggestions
- Integration tests for CLI
