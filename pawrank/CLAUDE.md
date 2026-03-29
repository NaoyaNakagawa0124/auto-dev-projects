# CLAUDE.md — PawRank

## Overview
Jupyter notebook with competitive dog stats leaderboards and visualizations.

## Architecture
- `pawrank/dogs.py` — Dog data model and sample database
- `pawrank/rankings.py` — Scoring, ranking, leaderboard logic
- `pawrank/charts.py` — Plotly/Matplotlib visualization functions
- `pawrank.ipynb` — Main notebook
- `tests/` — Unit tests

## Conventions
- Python 3.10+, snake_case
- Plotly for interactive charts, Matplotlib for static
- pandas DataFrames for data manipulation
