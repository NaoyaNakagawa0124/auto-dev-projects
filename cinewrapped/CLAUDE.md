# CineWrapped - CLAUDE.md

## Project Overview
Streamlit web app that generates beautiful, shareable movie watching statistics and visualizations.

## Tech Stack
- Python 3.10+, Streamlit, Plotly, Pandas, Pillow

## Running
```bash
pip install -r requirements.txt
streamlit run app.py
```

## Testing
```bash
python -m pytest tests/ -v
```

## Conventions
- Python files use snake_case
- Streamlit components in app.py, logic in lib/
- Charts use Plotly with dark theme (plotly_dark template)
- Color palette: #E50914 (red), #FFD700 (gold), #00D4AA (teal), #FF6B6B (coral), #A855F7 (purple)
