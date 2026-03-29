# CLAUDE.md — SleepCraft

## Overview
Dart package: sleep tracker that secretly teaches CBT-I techniques.

## Architecture
- `lib/src/models.dart` — Sleep log, breathing exercise, lesson models
- `lib/src/breathing.dart` — Breathing exercise engine (4-7-8, box, etc.)
- `lib/src/lessons.dart` — CBT-I micro-lesson database
- `lib/src/scoring.dart` — Sleep score and streak calculations
- `lib/src/sleep_window.dart` — Sleep restriction therapy logic
- `lib/sleepcraft.dart` — Public API barrel export
- `test/` — Unit tests

## Conventions
- Dart 3.x, lowerCamelCase
- Immutable models where possible
- Tests in test/ directory, run with `dart test`
