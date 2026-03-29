"""Beautiful chart generators for CineWrapped."""

import plotly.graph_objects as go
import plotly.express as px

# CineWrapped color palette
COLORS = {
    "red": "#E50914",
    "gold": "#FFD700",
    "teal": "#00D4AA",
    "coral": "#FF6B6B",
    "purple": "#A855F7",
    "blue": "#3B82F6",
    "pink": "#EC4899",
    "orange": "#F97316",
}

PALETTE = list(COLORS.values())
BG_COLOR = "#0E1117"
CARD_BG = "#1A1A2E"
TEXT_COLOR = "#FFFFFF"
MUTED_TEXT = "#8B8B8B"


def _base_layout(title: str = "", height: int = 400) -> dict:
    return dict(
        title=dict(text=title, font=dict(size=20, color=TEXT_COLOR, family="Arial Black")),
        paper_bgcolor=BG_COLOR,
        plot_bgcolor=BG_COLOR,
        font=dict(color=TEXT_COLOR, family="Arial"),
        height=height,
        margin=dict(l=40, r=40, t=60, b=40),
    )


def genre_radar(genre_counts: dict) -> go.Figure:
    """Radar chart of genre preferences."""
    genres = list(genre_counts.keys())[:10]
    values = [genre_counts[g] for g in genres]
    # Close the radar
    genres_closed = genres + [genres[0]]
    values_closed = values + [values[0]]

    fig = go.Figure()
    fig.add_trace(go.Scatterpolar(
        r=values_closed,
        theta=genres_closed,
        fill="toself",
        fillcolor=f"rgba(229, 9, 20, 0.3)",
        line=dict(color=COLORS["red"], width=2),
        marker=dict(size=6, color=COLORS["gold"]),
    ))
    fig.update_layout(
        **_base_layout("Your Genre DNA", 450),
        polar=dict(
            bgcolor=CARD_BG,
            radialaxis=dict(visible=True, color=MUTED_TEXT, gridcolor="#2A2A3E"),
            angularaxis=dict(color=TEXT_COLOR, gridcolor="#2A2A3E"),
        ),
    )
    return fig


def rating_histogram(rating_dist: dict) -> go.Figure:
    """Distribution of your ratings."""
    labels = [f"{k}-{k+1}" for k in sorted(rating_dist.keys())]
    values = [rating_dist[k] for k in sorted(rating_dist.keys())]

    fig = go.Figure()
    fig.add_trace(go.Bar(
        x=labels,
        y=values,
        marker=dict(
            color=values,
            colorscale=[[0, COLORS["purple"]], [0.5, COLORS["coral"]], [1, COLORS["gold"]]],
            line=dict(width=0),
            cornerradius=4,
        ),
        text=values,
        textposition="outside",
        textfont=dict(color=TEXT_COLOR, size=14),
    ))
    fig.update_layout(
        **_base_layout("Rating Distribution"),
        xaxis=dict(title="Rating Range", gridcolor="#2A2A3E", color=MUTED_TEXT),
        yaxis=dict(title="Movies", gridcolor="#2A2A3E", color=MUTED_TEXT),
    )
    return fig


def top_directors_bar(director_counts: dict) -> go.Figure:
    """Horizontal bar chart of most-watched directors."""
    directors = list(director_counts.keys())[:8]
    counts = [director_counts[d] for d in directors]
    directors.reverse()
    counts.reverse()

    fig = go.Figure()
    fig.add_trace(go.Bar(
        y=directors,
        x=counts,
        orientation="h",
        marker=dict(
            color=[PALETTE[i % len(PALETTE)] for i in range(len(directors))],
            line=dict(width=0),
            cornerradius=4,
        ),
        text=counts,
        textposition="outside",
        textfont=dict(color=TEXT_COLOR, size=14),
    ))
    fig.update_layout(
        **_base_layout("Top Directors", 350),
        xaxis=dict(gridcolor="#2A2A3E", color=MUTED_TEXT),
        yaxis=dict(color=TEXT_COLOR),
    )
    return fig


def monthly_trend(month_counts: dict) -> go.Figure:
    """Line chart of movies watched per month."""
    month_order = ["January", "February", "March", "April", "May", "June",
                   "July", "August", "September", "October", "November", "December"]
    months = [m for m in month_order if m in month_counts]
    values = [month_counts[m] for m in months]

    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=months,
        y=values,
        mode="lines+markers+text",
        line=dict(color=COLORS["teal"], width=3, shape="spline"),
        marker=dict(size=10, color=COLORS["gold"], line=dict(width=2, color=COLORS["teal"])),
        text=values,
        textposition="top center",
        textfont=dict(color=TEXT_COLOR, size=12),
        fill="tozeroy",
        fillcolor="rgba(0, 212, 170, 0.1)",
    ))
    fig.update_layout(
        **_base_layout("Movies Per Month"),
        xaxis=dict(gridcolor="#2A2A3E", color=MUTED_TEXT),
        yaxis=dict(gridcolor="#2A2A3E", color=MUTED_TEXT),
    )
    return fig


def day_of_week_bar(dow_counts: dict) -> go.Figure:
    """Bar chart of watching habits by day."""
    day_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    days = [d for d in day_order if d in dow_counts]
    values = [dow_counts[d] for d in days]

    colors = [COLORS["blue"] if d in ("Saturday", "Sunday") else COLORS["purple"] for d in days]

    fig = go.Figure()
    fig.add_trace(go.Bar(
        x=[d[:3] for d in days],
        y=values,
        marker=dict(color=colors, line=dict(width=0), cornerradius=4),
        text=values,
        textposition="outside",
        textfont=dict(color=TEXT_COLOR, size=14),
    ))
    fig.update_layout(
        **_base_layout("Watch Days"),
        xaxis=dict(gridcolor="#2A2A3E", color=MUTED_TEXT),
        yaxis=dict(gridcolor="#2A2A3E", color=MUTED_TEXT),
    )
    return fig


def decade_donut(decade_counts: dict) -> go.Figure:
    """Donut chart of movies by decade."""
    labels = list(decade_counts.keys())
    values = list(decade_counts.values())

    fig = go.Figure()
    fig.add_trace(go.Pie(
        labels=labels,
        values=values,
        hole=0.55,
        marker=dict(colors=PALETTE[:len(labels)], line=dict(color=BG_COLOR, width=2)),
        textinfo="label+percent",
        textfont=dict(size=13),
        insidetextorientation="radial",
    ))
    fig.update_layout(**_base_layout("Movies by Decade", 400))
    return fig
