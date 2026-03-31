# Oshizora - Summary

## What Was Built

**推し空 (Oshizora)** is a living sky web app that blends your oshi's representative color with real weather data, time of day, and season. Every time you open it, the sky looks different. Cherry blossom petals fall in spring, fireflies glow in summer evenings, autumn leaves drift down, and snow falls tinted in your oshi's color in winter.

## Key Features

- **Dynamic sky rendering**: Canvas-based gradient sky with sun/moon, stars, clouds
- **Oshi color blending**: Your chosen color subtly tints every element (sky, particles, stars, clouds)
- **Real weather integration**: OpenMeteo API for live weather conditions + geolocation
- **Time-of-day shifts**: Dawn, day, dusk, night — smooth natural transitions
- **Seasonal particles**: Cherry blossoms (spring), fireflies (summer), falling leaves (autumn), snow (winter)
- **Weather effects**: Rain streaks, snow particles, cloud density based on actual weather
- **Ambient messages**: Rotating oshi-themed messages that change with weather/time
- **Setup modal**: Name your oshi, pick their color (10 presets + custom picker)
- **Persistent config**: Saved to localStorage

## Tech Stack

- HTML5 Canvas for all rendering
- Vanilla JS (~500 LOC)
- OpenMeteo API (free, no key)
- Geolocation API
- Google Fonts (Zen Maru Gothic)
- CSS glassmorphism for modal

## Potential Next Steps

- Multiple oshi profiles with swipe-to-switch
- Screenshot/wallpaper export button
- Background music that changes with weather
- Sharing "my sky right now" as image
