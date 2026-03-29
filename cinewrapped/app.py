"""CineWrapped - Your movie watching habits, beautifully visualized."""

import streamlit as st
from datetime import date

from lib.parsers import detect_and_parse
from lib.stats import compute_stats
from lib.demo_data import DEMO_MOVIES
from lib.models import Movie
from lib import charts


st.set_page_config(
    page_title="CineWrapped",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom CSS for beautiful cards
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

    .main { font-family: 'Inter', sans-serif; }

    .stat-card {
        background: linear-gradient(135deg, #1A1A2E 0%, #16213E 100%);
        border-radius: 16px;
        padding: 24px;
        text-align: center;
        border: 1px solid #2A2A3E;
        transition: transform 0.2s;
    }
    .stat-card:hover { transform: translateY(-2px); }

    .stat-number {
        font-size: 48px;
        font-weight: 900;
        background: linear-gradient(135deg, #E50914, #FFD700);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1.2;
    }
    .stat-label {
        font-size: 14px;
        color: #8B8B8B;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-top: 4px;
    }

    .personality-card {
        background: linear-gradient(135deg, #E50914 0%, #A855F7 100%);
        border-radius: 20px;
        padding: 32px;
        text-align: center;
        margin: 20px 0;
    }
    .personality-name {
        font-size: 36px;
        font-weight: 900;
        color: white;
        margin-bottom: 8px;
    }
    .personality-desc {
        font-size: 16px;
        color: rgba(255,255,255,0.85);
    }

    .hero-title {
        font-size: 64px;
        font-weight: 900;
        text-align: center;
        background: linear-gradient(135deg, #E50914, #FFD700, #00D4AA);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0;
    }
    .hero-subtitle {
        text-align: center;
        color: #8B8B8B;
        font-size: 18px;
        margin-top: 0;
    }

    .section-title {
        font-size: 28px;
        font-weight: 700;
        margin: 32px 0 16px 0;
        color: white;
    }

    div[data-testid="stFileUploader"] {
        border: 2px dashed #2A2A3E;
        border-radius: 12px;
        padding: 12px;
    }
</style>
""", unsafe_allow_html=True)


def init_session_state():
    if "movies" not in st.session_state:
        st.session_state.movies = []
    if "source" not in st.session_state:
        st.session_state.source = None


def render_sidebar():
    with st.sidebar:
        st.markdown("## 📁 Load Your Data")

        tab_upload, tab_manual, tab_demo = st.tabs(["Upload CSV", "Add Movie", "Demo Data"])

        with tab_upload:
            uploaded = st.file_uploader(
                "Upload Letterboxd or IMDb CSV",
                type=["csv"],
                help="Export from Letterboxd (diary.csv) or IMDb (ratings.csv)"
            )
            if uploaded:
                content = uploaded.read().decode("utf-8")
                movies, source = detect_and_parse(content)
                if movies:
                    st.session_state.movies = movies
                    st.session_state.source = source
                    st.success(f"Loaded {len(movies)} movies from {source}")
                else:
                    st.error("No movies found in the CSV. Check the format.")

        with tab_manual:
            with st.form("add_movie", clear_on_submit=True):
                title = st.text_input("Title")
                col1, col2 = st.columns(2)
                with col1:
                    watched_date = st.date_input("Date Watched", value=date.today())
                with col2:
                    rating = st.slider("Rating", 0.0, 10.0, 7.0, 0.5)
                genres_input = st.text_input("Genres (comma-separated)", placeholder="Action, Sci-Fi")
                director = st.text_input("Director", placeholder="Christopher Nolan")

                if st.form_submit_button("Add Movie"):
                    if title:
                        genres = [g.strip() for g in genres_input.split(",") if g.strip()]
                        movie = Movie(
                            title=title,
                            date_watched=watched_date,
                            rating=rating,
                            genres=genres,
                            director=director or None,
                        )
                        st.session_state.movies.append(movie)
                        st.session_state.source = "Manual"
                        st.success(f"Added: {title}")

        with tab_demo:
            if st.button("Load Demo Data (20 movies)", use_container_width=True):
                st.session_state.movies = DEMO_MOVIES
                st.session_state.source = "Demo"
                st.rerun()

        if st.session_state.movies:
            st.divider()
            st.metric("Movies Loaded", len(st.session_state.movies))
            if st.session_state.source:
                st.caption(f"Source: {st.session_state.source}")
            if st.button("Clear Data", use_container_width=True):
                st.session_state.movies = []
                st.session_state.source = None
                st.rerun()


def render_hero():
    st.markdown('<p class="hero-title">CineWrapped</p>', unsafe_allow_html=True)
    st.markdown('<p class="hero-subtitle">Your movie watching habits, beautifully visualized</p>', unsafe_allow_html=True)


def render_stat_card(number: str, label: str):
    st.markdown(f"""
    <div class="stat-card">
        <div class="stat-number">{number}</div>
        <div class="stat-label">{label}</div>
    </div>
    """, unsafe_allow_html=True)


def render_stats(stats: dict):
    # Key metrics row
    st.markdown('<div class="section-title">📊 Your Numbers</div>', unsafe_allow_html=True)
    cols = st.columns(4)
    with cols[0]:
        render_stat_card(str(stats["total_movies"]), "Movies Watched")
    with cols[1]:
        render_stat_card(str(stats["total_hours"]) + "h" if stats["total_hours"] else "—", "Total Watch Time")
    with cols[2]:
        render_stat_card(str(stats["avg_rating"]) if stats["avg_rating"] else "—", "Avg Rating")
    with cols[3]:
        render_stat_card(str(stats["unique_genres"]), "Genres Explored")

    # Personality card
    if stats.get("personality"):
        p = stats["personality"]
        st.markdown(f"""
        <div class="personality-card">
            <div class="personality-name">{p["name"]}</div>
            <div class="personality-desc">{p["desc"]}</div>
        </div>
        """, unsafe_allow_html=True)

    # Charts
    col_left, col_right = st.columns(2)

    with col_left:
        if stats.get("genre_counts") and len(stats["genre_counts"]) >= 3:
            st.plotly_chart(charts.genre_radar(stats["genre_counts"]), use_container_width=True)

        if stats.get("rating_distribution"):
            st.plotly_chart(charts.rating_histogram(stats["rating_distribution"]), use_container_width=True)

        if stats.get("decade_counts"):
            st.plotly_chart(charts.decade_donut(stats["decade_counts"]), use_container_width=True)

    with col_right:
        if stats.get("director_counts"):
            st.plotly_chart(charts.top_directors_bar(stats["director_counts"]), use_container_width=True)

        if stats.get("month_counts"):
            st.plotly_chart(charts.monthly_trend(stats["month_counts"]), use_container_width=True)

        if stats.get("day_of_week"):
            st.plotly_chart(charts.day_of_week_bar(stats["day_of_week"]), use_container_width=True)

    # Highlight card
    if stats.get("highest_rated"):
        hr = stats["highest_rated"]
        st.markdown(f"""
        <div class="stat-card" style="margin-top: 16px;">
            <div class="stat-label">YOUR TOP-RATED FILM</div>
            <div class="stat-number" style="font-size: 32px;">{hr["title"]}</div>
            <div class="stat-label">⭐ {hr["rating"]}/10</div>
        </div>
        """, unsafe_allow_html=True)

    if stats.get("busiest_month"):
        st.markdown(f"""
        <div class="stat-card" style="margin-top: 16px;">
            <div class="stat-label">YOUR BINGE MONTH</div>
            <div class="stat-number" style="font-size: 32px;">{stats["busiest_month"]}</div>
        </div>
        """, unsafe_allow_html=True)


def render_empty_state():
    st.markdown("""
    <div style="text-align: center; padding: 80px 20px;">
        <p style="font-size: 80px; margin-bottom: 0;">🎬</p>
        <p style="font-size: 24px; color: #8B8B8B; margin-top: 8px;">
            Upload your Letterboxd or IMDb export to get started
        </p>
        <p style="font-size: 16px; color: #555;">
            Or try the demo data from the sidebar →
        </p>
    </div>
    """, unsafe_allow_html=True)


def main():
    init_session_state()
    render_sidebar()
    render_hero()

    if not st.session_state.movies:
        render_empty_state()
    else:
        stats = compute_stats(st.session_state.movies)
        render_stats(stats)


if __name__ == "__main__":
    main()
