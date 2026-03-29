# CineWrapped 🎬

**Your movie watching habits, beautifully visualized.**

CineWrapped generates stunning, shareable "Wrapped-style" visual summaries from your movie watching data. Think Spotify Wrapped, but for films.

## Features

- **CSV Import** - Import your watch history from Letterboxd or IMDb exports
- **Manual Entry** - Add movies directly with title, date, rating, and genre
- **Beautiful Stats Cards** - Screenshot-ready summary cards with your top stats
- **Genre DNA** - Radar chart showing your genre preferences
- **Watch Timeline** - Heatmap of your watching patterns by day/month
- **Director & Actor Rankings** - Who you watch the most
- **Rating Distribution** - How generous (or harsh) a critic you are
- **Personality Type** - AI-generated movie personality based on your habits
- **Dark Mode** - Gorgeous dark theme optimized for screenshots

## Tech Stack

- **Python 3.10+**
- **Streamlit** - Web app framework
- **Plotly** - Interactive, beautiful charts
- **Pandas** - Data processing
- **Pillow** - Image generation for shareable cards

## Quick Start

```bash
pip install -r requirements.txt
streamlit run app.py
```

Then open http://localhost:8501 in your browser.

## Data Sources

### Letterboxd Export
1. Go to Letterboxd → Settings → Import & Export → Export Your Data
2. Upload the `diary.csv` file

### IMDb Export
1. Go to IMDb → Your Ratings → Export (three dots menu)
2. Upload the `ratings.csv` file

### Manual Entry
Use the built-in form to add movies one by one.

## Screenshots

*Beautiful, shareable movie stats cards generated from your watch history.*

## License

MIT
