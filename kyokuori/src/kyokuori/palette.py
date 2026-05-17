"""Map a Track to a 16-color palette in HSL, deterministic."""

from __future__ import annotations

import colorsys
import math

from .tracks import Track


PALETTE_SIZE = 16


def hsl_to_rgb(h: float, s: float, l: float) -> tuple[float, float, float]:
    """h in [0, 1] (we divide by 360), s and l in [0, 1].  Returns RGB in [0, 1]."""
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return (r, g, b)


def palette_for(track: Track) -> list[tuple[float, float, float]]:
    """16-color palette derived deterministically from a Track's features."""
    # Base hue from key (12 semitones around a circle), tilted by mode (major +0°, minor +15°)
    base_hue_deg = (track.key * 30.0 + (15.0 if track.mode == 0 else 0.0)) % 360.0
    saturation = 0.30 + track.valence * 0.60     # 0.30 – 0.90
    lightness  = 0.30 + track.energy  * 0.45     # 0.30 – 0.75

    # Spread 16 colors across ±60° around base, with dance-driven jitter.
    spread_deg = 60.0
    palette: list[tuple[float, float, float]] = []
    for i in range(PALETTE_SIZE):
        # Interpolate hue around the base.
        t = i / (PALETTE_SIZE - 1)               # 0..1
        offset = (t - 0.5) * 2.0 * spread_deg    # -spread..+spread
        # Slight wobble seeded by danceability — keeps the variations interesting.
        wobble = math.sin((i + 1) * 1.7 * (0.4 + track.danceability)) * 6.0
        hue_deg = (base_hue_deg + offset + wobble) % 360.0
        # Saturation & lightness modulate gently per index.
        s = max(0.15, min(0.95, saturation + (math.sin(i * 0.6) * 0.05)))
        l = max(0.20, min(0.90, lightness  + (math.cos(i * 0.4) * 0.08)))
        palette.append(hsl_to_rgb(hue_deg / 360.0, s, l))
    return palette
