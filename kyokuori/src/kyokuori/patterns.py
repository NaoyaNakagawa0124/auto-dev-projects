"""Render a Track as 5 different 16x16 craft patterns.

All five return ndarrays of shape (16, 16, 3) with float values in [0, 1].
"""

from __future__ import annotations

import numpy as np

from .palette import palette_for, PALETTE_SIZE
from .tracks import Track


GRID = 16


def _seed_for(track: Track, salt: int) -> int:
    # Stable mix of features; produces same seed across runs.
    return abs(int(track.bpm) * 73 + track.key * 17 + track.mode * 11 + int(track.chart_rank) * 5 + salt) % (2**31)


def _palette_arr(track: Track) -> np.ndarray:
    pal = palette_for(track)
    return np.array(pal, dtype=np.float32)


def cross_stitch(track: Track) -> np.ndarray:
    """Cross-stitch: each cell gets one palette color, indexed by (key + valence diagonals)."""
    pal = _palette_arr(track)
    img = np.zeros((GRID, GRID, 3), dtype=np.float32)
    for r in range(GRID):
        for c in range(GRID):
            # Diagonal stripes anchored on the key shift.
            idx = (r + c + track.key) % PALETTE_SIZE
            img[r, c] = pal[idx]
    return img


def knit(track: Track) -> np.ndarray:
    """Knit rows: each horizontal row is a single palette color, valence shifts the row index."""
    pal = _palette_arr(track)
    img = np.zeros((GRID, GRID, 3), dtype=np.float32)
    shift = int(round(track.valence * (PALETTE_SIZE - 1)))
    for r in range(GRID):
        color = pal[(r + shift) % PALETTE_SIZE]
        # Faint horizontal banding to suggest knit/purl rows.
        band = 0.92 if (r % 2 == 0) else 1.0
        img[r, :] = color * band
    return img


def quilt(track: Track) -> np.ndarray:
    """Quilt: 4x4 blocks each filled with two alternating palette colors (triangles)."""
    pal = _palette_arr(track)
    img = np.zeros((GRID, GRID, 3), dtype=np.float32)
    block = 4
    for br in range(GRID // block):
        for bc in range(GRID // block):
            base_idx  = (br * 5 + bc * 3 + track.key) % PALETTE_SIZE
            alt_idx   = (base_idx + 7) % PALETTE_SIZE
            for dr in range(block):
                for dc in range(block):
                    # Diagonal split inside each 4x4 block.
                    color = pal[base_idx] if (dr + dc) < block else pal[alt_idx]
                    img[br * block + dr, bc * block + dc] = color
    return img


def mosaic(track: Track) -> np.ndarray:
    """Mosaic: pseudo-Voronoi tiling using deterministic seeded jitter."""
    pal = _palette_arr(track)
    rng = np.random.default_rng(_seed_for(track, salt=1))
    # Pick 12 anchor points and assign palette indices.
    n_anchors = 12
    anchors = rng.integers(low=0, high=GRID, size=(n_anchors, 2))
    anchor_idx = rng.integers(low=0, high=PALETTE_SIZE, size=n_anchors)
    img = np.zeros((GRID, GRID, 3), dtype=np.float32)
    for r in range(GRID):
        for c in range(GRID):
            # Nearest anchor (squared distance, no need for sqrt).
            best = 0
            best_d2 = float("inf")
            for i in range(n_anchors):
                dr = anchors[i, 0] - r
                dc = anchors[i, 1] - c
                d2 = dr * dr + dc * dc
                if d2 < best_d2:
                    best_d2 = d2
                    best = i
            img[r, c] = pal[anchor_idx[best]]
    return img


def beading(track: Track) -> np.ndarray:
    """Beading: hex-style offset rows + circular bead suggestion (color only here)."""
    pal = _palette_arr(track)
    img = np.zeros((GRID, GRID, 3), dtype=np.float32)
    # Offset every other row by half a column index for a hex feel; palette index
    # depends on the offset position so the grid reads diagonally.
    for r in range(GRID):
        offset = 0 if (r % 2 == 0) else 1
        for c in range(GRID):
            idx = (c + offset + (r // 2) * 3 + track.key * 2) % PALETTE_SIZE
            img[r, c] = pal[idx]
    return img


ALL_PATTERN_NAMES = ("cross_stitch", "knit", "quilt", "mosaic", "beading")


def all_patterns(track: Track) -> dict[str, np.ndarray]:
    return {
        "cross_stitch": cross_stitch(track),
        "knit": knit(track),
        "quilt": quilt(track),
        "mosaic": mosaic(track),
        "beading": beading(track),
    }
