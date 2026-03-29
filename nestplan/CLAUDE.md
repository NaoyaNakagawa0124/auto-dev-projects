# CLAUDE.md — NestPlan

## Project Overview
Python Textual TUI app for couples planning their future shared home together.

## Architecture
- `nestplan/models.py` — Data classes (Plan, Room, Project, Partner, Vote)
- `nestplan/storage.py` — JSON file I/O
- `nestplan/budget.py` — Budget calculations
- `nestplan/app.py` — Main Textual application
- `nestplan/widgets/` — Custom TUI widgets
- `nestplan/__main__.py` — CLI entry point

## Conventions
- Python 3.10+ with type hints
- snake_case for everything
- dataclasses for models
- Tests in `tests/` directory
- Run tests: `python -m pytest tests/ -v` or `python tests/run_all.py`

## Key Decisions
- Textual framework for rich TUI
- JSON for persistence (no database, portable files)
- Two-partner model (not multi-user server)
- Star voting (1-5) for priority consensus
