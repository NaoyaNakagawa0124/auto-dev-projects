# niwacraft（庭クラフト）- Summary

## What Was Built

A cozy 2D garden building simulation game in Godot 4.x. Parents and children can design their dream garden together on a 16x12 grid, placing crops, flowers, trees, paths, structures, and water features. Seasons cycle automatically, and plants grow through 4 stages (seed → sprout → grown → harvest). Each item includes a food education tip in Japanese.

## Key Features

- **Grid-based garden editor**: 16x12 cell grid with click-to-place, right-click-to-remove
- **20 unique items** across 6 categories: crops (6), flowers (3), trees (2), paths (3), structures (4), water (2)
- **Seasonal cycle**: Spring → Summer → Autumn → Winter with visual changes
- **Plant growth system**: 4 stages with season-based growth requirements
- **Food education tips**: Every item has a 食育 trivia fact
- **Harvest system**: Collect ripe crops and fruit
- **Custom drawing**: All visuals rendered via GDScript draw calls (no external assets)

## Tech Decisions

- **Godot 4.x + GDScript**: Best open-source game engine for 2D grid games
- **Custom drawing**: Used `_draw()` calls instead of sprites to keep the project self-contained
- **Data-driven**: All items, seasons, and growth rules defined in `game_data.gd`
- **No external assets**: Everything is procedurally drawn - no image files needed

## Test Results

45 tests across 2 test files covering game data integrity and grid logic.

## Potential Next Steps

1. Weather system affecting plant growth
2. Animal visitors (butterflies, birds)
3. Recipes using harvested crops
4. Garden sharing / export as image
5. Sound effects (rain, birds, wind)
