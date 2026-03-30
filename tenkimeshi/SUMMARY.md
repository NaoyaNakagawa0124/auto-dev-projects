# Tenkimeshi (テンキメシ) — Summary

## What Was Built

A Raspberry Pi IoT project for foodies that recommends food based on current weather and generates ASCII restaurant floor plans. Uses the OpenMeteo API for real weather data. Includes a web-based device simulator and detailed wiring guides for OLED/e-Paper displays.

## Features

- 10 food categories mapped to weather conditions (temp, weather code, wind, humidity)
- 10 unique ASCII restaurant floor plans with Unicode box drawing
- Terminal display with ANSI colors simulating IoT screen
- Web simulator with dark IoT device frame aesthetic
- Wiring guides for SSD1306 OLED (I2C) and e-Paper (SPI)
- Bill of materials with Japanese pricing
- Demo mode for offline testing
- 72 Python tests (stdlib only, no deps)

## Tech Decisions

- **No external dependencies**: Uses only Python stdlib for maximum RPi compatibility
- **OpenMeteo API**: Free, no API key required, reliable
- **Single-file web simulator**: Self-contained HTML for easy deployment
- **ASCII floor plans**: Works on any terminal/display resolution

## Potential Next Steps

- Actual RPi display driver integration (SSD1306/e-Paper libraries)
- Restaurant search API integration (Google Places, Tabelog)
- Historical weather-food preference learning
- Multi-city support with saved favorites
