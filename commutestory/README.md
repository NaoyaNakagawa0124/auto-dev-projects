# CommuteStory

A Jupyter notebook that tells the narrative story of a daily train commute through infrastructure engineering. 8 stations, 8 chapters, 19.8 km of tunnels, bridges, viaducts, smart stations, and living walls — all backed by real engineering data and beautiful Plotly visualizations.

## Features

- Elevation profile showing underground tunnels and elevated bridges
- 8 narrative chapters (one per station) with engineering facts
- Harbor Bridge deep dive with cable-stayed engineering data
- BRT vs Rail cost comparison ($45M vs $400M)
- Daily passenger heatmap across stations
- Sustainability metrics (solar, air filtration, rainwater)
- Construction timeline

## Run

```bash
pip install plotly pandas jupyter && jupyter notebook commutestory.ipynb
```

## Test

```bash
python3 tests/test_engine.py
```
