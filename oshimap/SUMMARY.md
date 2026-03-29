# OshiMap - Summary

## What Was Built

A Rust+WASM web app where oshi fans map their idol's tour locations across Japan's 47 prefectures. Events are plotted as glowing dots on a canvas map, connected by route lines. Stats track coverage percentage, total events, and distance traveled. All geography computation runs in WASM for performance.

## Core Features

1. **47 Prefecture Map** - Canvas-rendered Japan map with lat/lng projection
2. **Event Tracking** - Add concerts, events, pilgrimages with date and notes
3. **Route Visualization** - Lines connecting events chronologically with distance calculation
4. **Coverage Stats** - Visited prefectures count, coverage %, total distance in km
5. **Haversine Distance** - Accurate great-circle distance calculation in Rust
6. **Import/Export** - Save/load events to localStorage, exportable as JSON

## Tech Decisions

- **Rust + wasm-bindgen** - Type-safe WASM with zero-copy JS interop
- **Canvas 2D** - Lightweight map rendering without heavy map library
- **serde_json** - Serialize/deserialize between Rust structs and JS
- **11 Rust tests** - Full coverage of state management, distance, routing

## Potential Next Steps

1. Real SVG map of Japan with prefecture boundaries
2. Photo attachment per event
3. Share map as image or URL
