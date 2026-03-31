# Otonoha - Summary

## What Was Built

**音の葉 (Otonoha)** is a generative flower garden where each bloom represents a song from the iTunes Japan music chart. Flower shape, color, and size are determined by genre, ranking, and mood. Uses the iTunes RSS API for real chart data, with a curated 25-song fallback. Peaceful, ambient experience for exploring music trends visually.

## Key Features

- **Real API integration**: iTunes Japan RSS top songs feed
- **Genre-based flower shapes**: Pop=round, Rock=spiky, Hip-Hop=angular, 7+ genre mappings
- **Rank-based sizing**: #1 song = largest flower, tallest stem
- **Growth animation**: Flowers bloom staggered from seed to full bloom
- **Wind simulation**: Stems, petals, and background grass sway naturally
- **Hover interaction**: Mouse over any flower to see song name, artist, rank
- **Floating petals**: Particle system for drifting petal particles
- **Controls**: Toggle wind, regrow animation, show/hide song names
- **25-song fallback**: Curated J-Pop/Pop/K-Pop data if API fails

## Tech Stack

- p5.js 1.9 (generative art)
- iTunes RSS API (real chart data)
- Vanilla JS / HTML / CSS
- Google Fonts (Zen Maru Gothic)
