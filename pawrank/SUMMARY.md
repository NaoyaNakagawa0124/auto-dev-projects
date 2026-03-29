# PawRank — Build Summary

## What Was Built

A Jupyter notebook that turns dog ownership into a competition. 24 sample dogs ranked across 8 categories with Plotly visualizations. Leaderboards, radar charts, heatmaps, head-to-head comparisons, and a trophy room. Add your own dog and see where they rank.

## Features

1. **24 Dogs, 8 Categories** — Activity, Tricks, Obedience, Cuteness, Friendliness, Bravery, Intelligence, Fluffiness. All scored 1-100.
2. **Overall Champion Podium** — Gold/silver/bronze bar chart of top dogs by average score
3. **Category Leaderboards** — Horizontal bar charts for each category's top 10
4. **Radar Comparisons** — Spider charts comparing any set of dogs
5. **Head-to-Head** — Detailed side-by-side comparison with win/loss count
6. **Full Heatmap** — All dogs x all categories in one view
7. **Trophy Room** — Winners in every category
8. **Add Your Dog** — Input your dog's stats, see their rank and percentile

## Tech Decisions

- **Plotly** for interactive charts (dark theme, hover tooltips)
- **pandas** for data manipulation and ranking
- **Dataclasses** for the Dog model
- **No database** — all data embedded in Python, notebook-ready

## Stats

- **605 tests** passing (data integrity, rankings, head-to-head, percentiles)
- **8 Python files** (3 library + notebook + tests)
- **~950 LOC**

## Potential Next Steps

1. Upload dog photos and display in charts
2. Live multi-user leaderboard via shared Google Sheet
3. Breed-average comparison (how does your dog compare to breed standard)
