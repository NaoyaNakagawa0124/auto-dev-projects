# WasureNote - Summary

## What Was Built

The anti-diary. Instead of preserving memories, you write down worries and the app ceremonially destroys them with particle animations. 3 destruction modes (burn, melt, wind), farewell messages, and intentionally zero data persistence. "Garbage collection for your mind."

## Core Features

1. **3 Destruction Modes** - 燃やす (fire particles rise), 溶かす (drip downward), 風に飛ばす (scatter right)
2. **Character-level Particles** - Each character becomes an independent particle with physics
3. **Farewell Messages** - Random therapeutic message after each destruction, including dev humor ("ガベージコレクション完了")
4. **Zero Persistence** - Tests verify NO localStorage/sessionStorage/IndexedDB/cookies are used
5. **Session Counter** - Counts destructions this session only (resets on page reload)

## Tech Decisions

- **5KB bundle** - Lightest app in the collection
- **No persistence by design** - The anti-pattern IS the feature
- **Canvas particle system** - Each text character gets unique physics based on destruction mode
- **Developer humor** - "Garbage collection" metaphor bridges dev tools and mental health
