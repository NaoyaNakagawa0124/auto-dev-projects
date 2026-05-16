"""Globe rotation state and braille-style ASCII rendering.

The globe is a horizontal strip of 12 cities arranged west-to-east. The state
is a single rotation degree in -180..+180. The "spotlight" is the city whose
longitude is closest to the current rotation degree (mod 360).
"""

from __future__ import annotations

import math

from .cities import CITIES, City, sorted_by_longitude


def _wrap_180(deg: float) -> float:
    """Wrap a degree value into (-180, +180]."""
    d = ((deg + 180.0) % 360.0) - 180.0
    if d == -180.0:
        d = 180.0
    return d


def _angular_distance(a: float, b: float) -> float:
    """Smallest angular distance between two longitudes."""
    d = abs(_wrap_180(a - b))
    return d


class Globe:
    """Rotation state. step_deg controls how much one ←/→ press rotates."""

    def __init__(self, rotation_deg: float = 139.7, step_deg: float = 30.0) -> None:
        self.rotation_deg: float = _wrap_180(rotation_deg)
        self.step_deg: float = float(step_deg)

    def rotate(self, deg: float) -> None:
        self.rotation_deg = _wrap_180(self.rotation_deg + deg)

    def step_left(self) -> None:
        self.rotate(-self.step_deg)

    def step_right(self) -> None:
        self.rotate(+self.step_deg)

    def visible_city(self) -> City:
        """City whose longitude is closest to current rotation."""
        return min(CITIES, key=lambda c: _angular_distance(c.lon, self.rotation_deg))

    def snap_to(self, city: City) -> None:
        self.rotation_deg = _wrap_180(city.lon)


# --- Rendering ---------------------------------------------------------------

GLOBE_HEIGHT = 9
GLOBE_WIDTH = 21


def render_globe(spotlight: City | None = None) -> str:
    """Render an ASCII globe with the spotlight city marked.

    Returns a multi-line string. The shape is a circle drawn with `·` for
    empty cells, `:` for hemisphere ridges, `●` for the spotlight, and ` `
    for cells outside the globe disc. Width × height is fixed.
    """
    cx = (GLOBE_WIDTH - 1) / 2
    cy = (GLOBE_HEIGHT - 1) / 2
    radius_x = cx
    radius_y = cy

    cities = sorted_by_longitude()
    # Map each city to (col, row) by projecting longitude onto the disc.
    # Cities near the spotlight get plotted near (cx, cy); others fade to the
    # disc edge using sine of relative longitude.
    spot_lon = spotlight.lon if spotlight else 0.0

    placements: dict[tuple[int, int], str] = {}
    for c in cities:
        d = _wrap_180(c.lon - spot_lon)  # -180..180
        # Front of globe = within ±90°, back = beyond.
        if abs(d) > 90.0:
            continue  # On the far side of the globe — not visible.
        # Project: x = sin(d), y = slightly offset to spread cities vertically.
        rad = math.radians(d)
        x_offset = math.sin(rad) * radius_x * 0.9
        # Vertical placement: hash city id to a stable but varied y.
        y_offset = ((hash(c.id) % 5) - 2) * 0.9
        col = int(round(cx + x_offset))
        row = int(round(cy + y_offset))
        col = max(0, min(GLOBE_WIDTH - 1, col))
        row = max(0, min(GLOBE_HEIGHT - 1, row))
        if spotlight and c.id == spotlight.id:
            placements[(col, row)] = "●"
        else:
            placements.setdefault((col, row), "·")

    lines: list[str] = []
    for r in range(GLOBE_HEIGHT):
        row_chars: list[str] = []
        for col in range(GLOBE_WIDTH):
            # Disc check: ellipse equation.
            nx = (col - cx) / radius_x
            ny = (r - cy) / radius_y
            inside = nx * nx + ny * ny <= 1.02
            if not inside:
                row_chars.append(" ")
                continue
            if (col, r) in placements:
                row_chars.append(placements[(col, r)])
            else:
                # Hemisphere ridges every 3 rows.
                if r == 0 or r == GLOBE_HEIGHT - 1:
                    row_chars.append("·")
                elif r == GLOBE_HEIGHT // 2:
                    row_chars.append(":")
                else:
                    row_chars.append(" ")
        lines.append("".join(row_chars).rstrip())
    return "\n".join(lines)
