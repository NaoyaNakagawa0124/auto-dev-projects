# NocheCalma

Your midnight sanctuary. An Electron desktop app for overworked parents that only works between midnight and 6am. Inspired by Mexico's Spring Equinox tradition of recharging energy at Teotihuacán.

## The Concept

Parents' only quiet time is often after midnight. NocheCalma embraces this: it's locked outside midnight-6am, showing a beautiful "the sanctuary sleeps" screen. When the world is quiet, it opens — offering 5-minute micro-rituals to recharge your energy.

## Features

- **Time Gate**: Only opens midnight-6am. Beautiful locked screen with countdown outside those hours.
- **5 Micro-Rituals**: Breathing (5 patterns), Gratitude journal, Release journal, Soundscapes, Intentions. Each 1-5 minutes.
- **Energy Recharge Meter**: Builds as you complete rituals (Dark → Dim → Warm → Glowing → Radiant). Decays between nights.
- **Streak Tracking**: Consecutive nights visited, milestones at 1/3/7/14/30/60/100/200/365 nights.
- **Gratitude Prompts**: 20 rotating prompts, one per day.

## Tech Stack

Electron / HTML / CSS / Vanilla JS / localStorage

## Run

```bash
# With Electron:
npm install && npm start

# Without Electron (browser):
open src/index.html
# or
python3 -m http.server 8080 -d src

# Tests:
node tests/test.js
```
