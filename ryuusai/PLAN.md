# Implementation Plan

## Phase 1: Core Fluid Simulation Engine
- Implement 2D fluid simulation using Navier-Stokes solver on a grid
- Density advection, velocity advection, diffusion, projection steps
- Render fluid density as color field with p5.js

## Phase 2: Ink Drop & Interaction System
- Click to drop ink with configurable color
- Drag to create velocity forces in the fluid
- Multiple ink colors that blend and swirl realistically
- Touch/mouse input handling

## Phase 3: UI & Color Palette System
- Toolbar with color palette selection (和色、モダン、カスタム)
- Canvas controls (clear, undo concept via snapshots)
- Responsive layout for desktop and mobile
- Beautiful glassmorphism UI design

## Phase 4: Export & Gallery
- High-resolution PNG export (up to 4K)
- Gallery view with localStorage persistence
- Download with metadata (palette, timestamp)
- Share-ready formatting

## Phase 5: Polish & Effects
- Background paper textures (和紙風)
- Ambient animation mode (自動生成)
- Sound effects for ink drops
- Performance optimization
