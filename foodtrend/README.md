# FoodTrend

A one-hand-friendly Jupyter notebook that visualizes food TikTok content strategy. Just Shift+Enter through cells — beautiful Plotly charts, zero typing needed.

## Features

- Engagement heatmap: best days/hours to post food content
- Trending food category growth rates (Air Fryer +35%, Viral Challenges +30%)
- Hashtag analysis with competition levels and growth
- Competitor landscape scatter plot (followers vs engagement)
- Content gap finder: underserved niches with high growth
- 12-month follower growth projection with viral month markers
- Text strategy summary with actionable tips

## Run

```bash
pip install plotly pandas jupyter
jupyter notebook foodtrend.ipynb
```

## Test

```bash
python3 tests/test_engine.py
```
