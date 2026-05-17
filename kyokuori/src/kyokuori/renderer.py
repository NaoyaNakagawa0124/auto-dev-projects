"""matplotlib helpers — render a Track as a 'plate' of 5 craft patterns."""

from __future__ import annotations

import matplotlib.pyplot as plt
import numpy as np

from .patterns import all_patterns, ALL_PATTERN_NAMES
from .palette import palette_for
from .tracks import Track


PATTERN_LABELS = {
    "cross_stitch": "Cross stitch",
    "knit":         "Knit",
    "quilt":        "Quilt",
    "mosaic":       "Mosaic",
    "beading":      "Beading",
}


def plate(track: Track, *, figsize=(13, 3.4)):
    """One figure with 5 horizontal subplots — one per craft pattern."""
    patterns = all_patterns(track)
    fig, axes = plt.subplots(1, 5, figsize=figsize)
    fig.patch.set_facecolor("#faf6ee")
    for ax, name in zip(axes, ALL_PATTERN_NAMES):
        img = patterns[name]
        ax.imshow(np.clip(img, 0.0, 1.0), interpolation="nearest")
        ax.set_title(PATTERN_LABELS[name], fontsize=10, color="#2a2520", pad=8)
        ax.set_xticks([])
        ax.set_yticks([])
        for spine in ax.spines.values():
            spine.set_color("#b8945b")
            spine.set_linewidth(0.8)
    fig.suptitle(
        f"{track.title}  /  {track.artist}",
        fontsize=12, color="#2a2520", y=1.02,
    )
    fig.tight_layout()
    return fig


def palette_strip(track: Track, *, figsize=(10, 1.0)):
    """A single horizontal strip showing the 16 palette colors of a track."""
    pal = palette_for(track)
    arr = np.array(pal, dtype=np.float32).reshape(1, len(pal), 3)
    fig, ax = plt.subplots(1, 1, figsize=figsize)
    fig.patch.set_facecolor("#faf6ee")
    ax.imshow(np.clip(arr, 0.0, 1.0), aspect="auto", interpolation="nearest")
    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_title(
        f"Palette  ·  {track.title} / {track.artist}",
        fontsize=10, color="#2a2520", pad=6,
    )
    for spine in ax.spines.values():
        spine.set_color("#b8945b")
        spine.set_linewidth(0.8)
    fig.tight_layout()
    return fig
