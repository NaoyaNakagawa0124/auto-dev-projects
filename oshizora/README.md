# 推し空 (Oshizora) - 推しの色に染まる空

A living sky web app that blends your oshi's representative color with real weather, time of day, and season. Every visit looks different.

## Features

- **推しカラー設定**: Choose your oshi's representative color and name
- **リアル天気連動**: Fetches real weather data via OpenMeteo API
- **時間帯で変化**: Dawn, day, dusk, night — the sky shifts naturally
- **四季の演出**: Cherry blossoms (spring), fireflies (summer), falling leaves (autumn), snow (winter)
- **天候エフェクト**: Rain, clouds, stars, sun/moon based on actual weather
- **フルスクリーン**: Ambient wallpaper-style fullscreen experience
- **推しメッセージ**: Gentle messages themed to weather/time ("推しも今、同じ空を見ているかも")

## Tech Stack

- Vanilla JS / HTML5 Canvas
- OpenMeteo API (free, no key required)
- CSS animations
- Geolocation API

## How to Run

```bash
# Any static server works
npx serve oshizora/
# or simply
open index.html
```
