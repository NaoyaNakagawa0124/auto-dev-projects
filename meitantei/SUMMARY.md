# MeiTantei - Summary

## What Was Built

A web-based detective investigation game where a job-hunting student examines procedurally drawn crime scenes. Click on evidence to discover clues, then accuse the right suspect with sufficient evidence. 3 cases with increasing difficulty, each with unique scenarios tied to university life.

## Core Features

1. **Crime Scene Investigation** - Canvas-rendered scenes with clickable hotspots, hover effects, vignette
2. **Clue Discovery** - Click evidence to reveal detailed descriptions, tracked in clue panel
3. **Accusation System** - Select a suspect, game validates both culprit correctness and required evidence
4. **3 Cases** - 消えた内定通知 (初級), サークル棟の怪文書 (中級), 研究データの改竄 (上級)
5. **Progress Persistence** - Completed cases saved to localStorage

## Tech Decisions

- **Vanilla JS + Canvas** - Zero framework overhead, 15KB bundle
- **Procedural scenes** - No image assets needed, scenes drawn with Canvas API
- **Solution validation** - Requires both correct culprit AND sufficient evidence clues
- **Dark mystery aesthetic** - Vignette, noir grid, gold accent colors

## Potential Next Steps

1. More cases with procedurally generated clue placement
2. Timed investigation mode (solve before time runs out)
3. Evidence board where you drag and connect clues
4. Sound effects and ambient mystery music
