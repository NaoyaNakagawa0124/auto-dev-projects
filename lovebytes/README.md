# LoveBytes

> A 90s-themed digital scrapbook for long-distance couples. Under construction since 1999.

## What is LoveBytes?

LoveBytes is a mobile PWA that looks and feels like a GeoCities homepage from 2001. Tiled backgrounds, visitor counters, marquee text, star cursors, animated GIF hearts, and "under construction" banners — all wrapped around a couples' shared journal.

Each day, a world news headline becomes a **couples prompt**. Both partners write a short response. Over time, you build a shared scrapbook of your relationship through the lens of the world happening around you.

## Features

1. **Retro Homepage** — Full GeoCities/Angelfire aesthetic with visitor counter, guestbook, and webrings
2. **Daily Prompt** — News headline of the day → both partners respond
3. **Scrapbook** — Browse past entries, each styled with randomized 90s page elements
4. **Guestbook** — Leave messages for each other with customizable fonts and colors
5. **PWA** — Install on your phone, works offline, syncs via localStorage

## Tech

- Vanilla HTML/CSS/JS
- Service Worker for offline/installability
- localStorage for persistence
- Zero dependencies, maximum nostalgia

## Try It

```bash
cd lovebytes
python3 -m http.server 8080
# Open http://localhost:8080 on your phone
```

## License

MIT | Best viewed in Netscape Navigator 4.0
