# Tenaoshi - Project Conventions

## Build
```bash
make        # build
./tenaoshi  # run
make clean  # clean
```

## Code Style
- C11 standard
- Single-file architecture (main.c) with inline helper functions
- Constants in SCREAMING_SNAKE_CASE
- Functions in PascalCase (Raylib convention)
- All UI text in Japanese

## Raylib
- Installed via Homebrew at /opt/homebrew/Cellar/raylib/5.5
- Link with: -lraylib -framework OpenGL -framework Cocoa -framework IOKit -framework CoreAudio -framework CoreVideo
