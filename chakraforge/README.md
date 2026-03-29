# ChakraForge

**Anime-style energy effect generator with narrative skill progression.**

Create stunning anime-inspired visual effects — auras, energy beams, particle storms, and elemental techniques. Unlock new powers as you progress through the skill tree. Perfect for content creators who need unique visuals for thumbnails, intros, and TikTok/YouTube content.

## Features

- **5 Elemental Techniques** - Flame, Lightning, Void, Sakura, and Cosmic effects
- **Skill Tree Progression** - Start as Apprentice, unlock techniques as you experiment
- **Real-time Controls** - Adjust intensity, color, speed, and particle count
- **Screen Capture** - Save frames as PNG for thumbnails and overlays
- **Dark Canvas** - Designed for content that pops on dark backgrounds
- **Interactive** - Mouse position controls effect origin and direction

## Tech Stack

- **p5.js** - Creative coding framework
- **Vanilla HTML/CSS/JS** - Zero dependencies beyond p5.js
- **LocalStorage** - Persist skill tree progress

## Quick Start

Open `index.html` in a browser. No build step required.

Or serve locally:
```bash
npx serve .
```

## Controls

| Key | Action |
|-----|--------|
| 1-5 | Switch technique (if unlocked) |
| Space | Toggle pause |
| S | Save current frame as PNG |
| R | Reset skill tree |
| Mouse | Control effect origin |
| Scroll | Adjust intensity |

## Skill Tree

```
Apprentice (start)
  └─ Flame (create 10 effects)
      └─ Lightning (create 25 effects)
          └─ Void (create 50 effects)
              └─ Sakura (create 80 effects)
                  └─ Cosmic (create 120 effects) → Master
```

## License

MIT
