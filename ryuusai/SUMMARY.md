# 流彩 (Ryuusai) — Summary

## What Was Built

A digital suminagashi (Japanese marbling) art generator powered by real-time fluid dynamics simulation. Users create beautiful abstract art by clicking to drop ink and dragging to create flow, then export high-resolution images for print-on-demand sales.

## Features

- **Navier-Stokes Fluid Simulation** — Real-time 2D fluid solver with diffusion, advection, and projection
- **Marangoni Effect** — Ink drops push outward like real surface tension
- **6 Color Palettes** — 侘寂, 桜, 海, 夕焼け, ネオン, 墨 (30 curated Japanese colors)
- **Interactive Controls** — Click to drop ink, drag to create flow, adjustable brush size and flow strength
- **Auto-Generation Mode** — Autonomous art creation with random ink drops and flows
- **High-Res Export** — Up to 4x resolution PNG with washi paper texture background
- **Gallery** — Save up to 50 artworks in localStorage
- **Responsive Design** — Works on desktop and mobile
- **Glassmorphism UI** — Modern dark theme with blur effects

## Tech Decisions

- **p5.js** for rendering — simple API, good for creative coding, handles canvas scaling
- **Jos Stam's Stable Fluids** — proven Navier-Stokes solver, stable at any timestep
- **Vanilla JS** — no build step, instant loading, zero dependencies beyond p5.js
- **Float32Array** — efficient memory usage for fluid grids
- **localStorage** — simple persistence without backend

## Architecture

```
ryuusai/
├── index.html      — App shell, UI structure
├── style.css       — Dark glassmorphism theme, responsive
├── fluid.js        — FluidSolver class (Navier-Stokes)
├── palettes.js     — Color palette definitions
├── gallery.js      — GalleryManager (localStorage)
├── app.js          — p5.js sketch, UI wiring, export
├── tests.js        — 80 Node.js tests
└── tests.html      — Browser test runner
```

## Potential Next Steps

- WebGL shader-based rendering for higher grid resolution
- SVG export for infinite scaling
- Sharing to social media with OGP preview
- Custom color picker beyond presets
- Undo/redo with simulation state snapshots
- Sound design (ink drop, water flow ambient)
