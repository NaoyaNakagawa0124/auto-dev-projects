# CivicSky

> Your daily regulatory weather forecast — a Chrome extension that turns government policy news into an intuitive weather experience.

## What is CivicSky?

CivicSky replaces your new-tab page with an animated weather scene that reflects the current regulatory climate. Sunny skies mean smooth sailing; gathering storms mean major new laws or policy changes are on the horizon.

Instead of reading dense legal text, you get:
- An **animated weather scene** that shifts based on regulatory intensity
- **Bite-sized policy cards** summarizing laws that affect you
- A **5-day regulatory forecast** showing upcoming changes
- **Category filters** (tax, labor, healthcare, housing, tech)
- **State-aware personalization** so you only see what matters

## Who is this for?

Commuters, busy professionals, and anyone who wants to stay informed about government policy without reading legal documents. Open a new tab, glance at the sky, and know where you stand.

## Tech Stack

- **Platform:** Chrome Extension (Manifest V3)
- **Frontend:** Vanilla HTML/CSS/JavaScript
- **Animations:** CSS animations + HTML5 Canvas
- **Data:** RSS/API feeds from government sources, cached locally
- **Storage:** Chrome Storage API for user preferences

## Features

1. **Weather Scene** — Animated sky (sun, clouds, rain, storms, snow) driven by regulatory intensity score
2. **Policy Cards** — Swipeable cards with plain-English summaries of new laws
3. **5-Day Forecast** — Upcoming regulation changes shown as weather icons
4. **Category Filters** — Toggle tax, labor, healthcare, housing, tech/AI, transportation
5. **State Selector** — Personalize to your state for relevant local laws
6. **Severity Indicators** — Color-coded impact levels (mild breeze to hurricane)

## Installation

```bash
# Development
cd civicsky
# Load as unpacked extension in Chrome:
# 1. Open chrome://extensions
# 2. Enable Developer Mode
# 3. Click "Load unpacked"
# 4. Select this directory
```

## License

MIT
