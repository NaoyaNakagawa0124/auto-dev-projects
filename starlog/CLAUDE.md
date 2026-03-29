# StarLog

Swift Package Manager project. Library in Sources/StarLogLib, CLI in Sources/starlog.

## Build & Test
```bash
swift build
swift test
```

## Conventions
- All game logic in StarLogLib (testable)
- CLI is thin wrapper in Sources/starlog/main.swift
- Use Sendable-safe types (Swift 6 concurrency)
