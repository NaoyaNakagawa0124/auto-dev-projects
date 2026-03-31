# Namioto - Summary

## What Was Built

**波音 (Namioto)** is a one-hand ocean meditation game built with Raylib. Hold spacebar to breathe in (waves rise), release to breathe out (waves fall). Steady, rhythmic breathing creates calm seas and clears the sky. Erratic input makes storms. A stress-relief experience for busy couples — 5 minute sessions with calm score tracking.

## Key Features

- **One-hand control**: Spacebar only — hold to inhale, release to exhale
- **Procedural ocean**: 3-layer wave system with foam, responsive to breath rhythm
- **Dynamic sky**: Storm/clear transitions based on calmness level
- **Breath rhythm scoring**: Measures cycle length, balance, and deviation from ideal 4s rhythm
- **Calm accumulation**: Tracks peaceful seconds, shows session rating
- **Bubbles**: Rise from the ocean during inhales
- **Birds**: Appear when sky is clear enough
- **Japanese font rendering**: Hiragino font with full CJK support
- **5-minute sessions**: Auto-ends with result summary and rating

## Tech Stack

- C11 / Raylib 5.5 / Makefile
- No external assets — all procedural graphics

## Potential Next Steps

- Two-player alternating mode for couples
- Background ocean wave audio generation
- Breathing pattern analysis over multiple sessions
- Different environments (forest, mountain, space)
