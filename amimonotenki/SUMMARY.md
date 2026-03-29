# AmimonoTenki - Summary

## What Was Built

A p5.js temperature scarf pattern generator that uses the OpenMeteo weather API. Enter a city, and it fetches 1 year of daily temperature data, then visualizes it as a knitting pattern where each row = 1 day, colored by temperature. A real craft concept that produces printable patterns.

## Core Features

1. **City Search** - OpenMeteo geocoding API with Japanese support
2. **Temperature Scarf** - p5.js canvas rendering each day as a knitting row
3. **11 Color Ranges** - From deep blue (-20°C) to red (35°C+) with Japanese yarn names
4. **Statistics Dashboard** - Min/max/avg temperature, range, day count
5. **Scrollable Pattern** - Mouse wheel scrolling through the full year
6. **Knit Texture** - Subtle stitch pattern overlay for realism

## Tech Decisions

- **OpenMeteo API** - Free, no API key required, supports historical data
- **p5.js** - HSL color mode, smooth rendering, built-in scroll handling
- **11 temp ranges** - Contiguous from -20 to 45°C, covering all climates
- **Fringe decoration** - Procedural scarf fringe at top and bottom

## Potential Next Steps

1. Print/export as PDF with yarn shopping list
2. Multiple scarf widths (narrow/wide) with different stitch patterns
3. Compare two cities side-by-side
4. Month separator markers in the pattern
