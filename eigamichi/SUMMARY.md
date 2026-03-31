# Eigamichi - Summary

## What Was Built

**映画道 (Eigamichi)** is a visual-novel style movie recommender. Answer branching mood questions through 3 layers of choices and arrive at a curated film recommendation. 45 unique movies across 5 mood branches (exciting, emotional, think, laugh, thrill), each with detailed Japanese descriptions, ratings, and director info. Your "cinema path" is visualized as a branching tree.

## Key Features

- **66-node decision tree**: 21 branch nodes + 45 movie leaf nodes
- **5 mood branches**: ワクワク / 泣きたい / 考えたい / 笑いたい / ゾクゾク
- **3-step journeys**: Every path is exactly 3 choices deep
- **45 curated movies**: From 1952 (生きる) to 2019 (パラサイト), each with Japanese title, original title, year, director, rating, genre, and detailed 100+ character description
- **Path visualization**: Branching tree showing your choices and destination
- **Persistent stats**: Tracks total paths taken and genre preferences in localStorage
- **Beautiful dark UI**: Gradient background, glassmorphism cards, hover animations
- **Back/reset navigation**: Can go back to previous choice or restart
- **Japanese throughout**: All UI text, movie titles, descriptions in Japanese

## Tech Stack

- Single HTML file (~700 LOC)
- Vanilla JS / CSS3
- No dependencies, no build step
- localStorage for stats persistence

## Potential Next Steps

- More movies (expand to 100+)
- Deeper trees (4-5 levels)
- "Similar movies" suggestions after result
- Share your path as image
