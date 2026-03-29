"""PawRank — Visualization functions using Plotly and Matplotlib."""

from __future__ import annotations
from typing import Optional
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
from .dogs import CATEGORIES, CATEGORY_EMOJI, Dog, dogs_to_dataframe


def radar_chart(dogs: list[Dog], dog_names: list[str], title: str = "Dog Comparison") -> go.Figure:
    """Create a radar/spider chart comparing dogs across all categories."""
    df = dogs_to_dataframe(dogs)
    fig = go.Figure()

    colors = px.colors.qualitative.Set2
    for i, name in enumerate(dog_names):
        row = df[df["name"] == name]
        if row.empty:
            continue
        values = [int(row[cat].values[0]) for cat in CATEGORIES]
        values.append(values[0])  # close the polygon
        cats = [f"{CATEGORY_EMOJI.get(c, '')} {c.title()}" for c in CATEGORIES]
        cats.append(cats[0])

        fig.add_trace(go.Scatterpolar(
            r=values,
            theta=cats,
            fill='toself',
            name=name,
            line_color=colors[i % len(colors)],
            opacity=0.7,
        ))

    fig.update_layout(
        polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
        showlegend=True,
        title=title,
        template="plotly_dark",
        height=500,
    )
    return fig


def leaderboard_bar(dogs: list[Dog], category: str, top_n: int = 10) -> go.Figure:
    """Horizontal bar chart for a category leaderboard."""
    df = dogs_to_dataframe(dogs)
    df = df.sort_values(category, ascending=True).tail(top_n)
    emoji = CATEGORY_EMOJI.get(category, "")

    fig = go.Figure(go.Bar(
        x=df[category],
        y=df["name"],
        orientation='h',
        marker_color=px.colors.sequential.Sunset[:top_n],
        text=df[category],
        textposition='outside',
    ))

    fig.update_layout(
        title=f"{emoji} {category.title()} Leaderboard",
        xaxis_title="Score",
        yaxis_title="",
        template="plotly_dark",
        height=400,
        xaxis=dict(range=[0, 110]),
    )
    return fig


def overall_podium(dogs: list[Dog], top_n: int = 5) -> go.Figure:
    """Bar chart of overall top dogs."""
    df = dogs_to_dataframe(dogs)
    df["overall"] = df[CATEGORIES].mean(axis=1).round(1)
    df = df.sort_values("overall", ascending=False).head(top_n)

    medals = ["\U0001f947", "\U0001f948", "\U0001f949", "4th", "5th", "6th", "7th", "8th"]

    fig = go.Figure(go.Bar(
        x=[f"{medals[i]} {row['name']}" for i, (_, row) in enumerate(df.iterrows())],
        y=df["overall"],
        marker_color=["#FFD700", "#C0C0C0", "#CD7F32"] + ["#666"] * (top_n - 3),
        text=df["overall"],
        textposition='outside',
    ))

    fig.update_layout(
        title="\U0001f3c6 Overall Champion Podium",
        yaxis_title="Average Score",
        template="plotly_dark",
        height=400,
        yaxis=dict(range=[0, 100]),
    )
    return fig


def category_heatmap(dogs: list[Dog]) -> go.Figure:
    """Heatmap of all dogs across all categories."""
    df = dogs_to_dataframe(dogs)
    df = df.set_index("name")[CATEGORIES]

    fig = go.Figure(go.Heatmap(
        z=df.values,
        x=[f"{CATEGORY_EMOJI.get(c, '')} {c.title()}" for c in CATEGORIES],
        y=df.index.tolist(),
        colorscale="YlOrRd",
        text=df.values,
        texttemplate="%{text}",
        textfont={"size": 10},
    ))

    fig.update_layout(
        title="\U0001f4ca Full Scoreboard Heatmap",
        template="plotly_dark",
        height=max(400, len(df) * 25),
    )
    return fig


def head_to_head_chart(h2h: dict) -> go.Figure:
    """Grouped bar chart comparing two dogs."""
    cats = list(h2h["categories"].keys())
    scores1 = [h2h["categories"][c]["score1"] for c in cats]
    scores2 = [h2h["categories"][c]["score2"] for c in cats]
    labels = [f"{CATEGORY_EMOJI.get(c, '')} {c.title()}" for c in cats]

    fig = go.Figure()
    fig.add_trace(go.Bar(name=h2h["dog1"], x=labels, y=scores1, marker_color="#4ecdc4"))
    fig.add_trace(go.Bar(name=h2h["dog2"], x=labels, y=scores2, marker_color="#ff6b6b"))

    fig.update_layout(
        barmode='group',
        title=f"\u2694\ufe0f {h2h['dog1']} vs {h2h['dog2']} ({h2h['wins1']}-{h2h['wins2']})",
        template="plotly_dark",
        height=400,
        yaxis=dict(range=[0, 110]),
    )
    return fig
