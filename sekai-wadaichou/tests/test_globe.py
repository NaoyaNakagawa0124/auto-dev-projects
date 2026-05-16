from __future__ import annotations

from sekai_wadaichou.cities import CITIES, by_id
from sekai_wadaichou.globe import Globe, render_globe, _wrap_180, GLOBE_HEIGHT, GLOBE_WIDTH


def test_wrap_180_basic():
    assert _wrap_180(0.0) == 0.0
    assert _wrap_180(180.0) == 180.0
    assert _wrap_180(-180.0) == 180.0
    assert _wrap_180(190.0) == -170.0
    assert _wrap_180(-190.0) == 170.0


def test_globe_initial_rotation_in_range():
    g = Globe(rotation_deg=139.7)
    assert -180.0 < g.rotation_deg <= 180.0


def test_rotation_wraps_around():
    g = Globe(rotation_deg=170.0, step_deg=30.0)
    g.step_right()  # 170 + 30 = 200 → wraps to -160
    assert g.rotation_deg == -160.0


def test_step_left_and_right_cancel():
    g = Globe(rotation_deg=0.0, step_deg=15.0)
    g.step_right()
    g.step_left()
    assert abs(g.rotation_deg) < 1e-9


def test_visible_city_matches_snap():
    """After snap_to(city), visible_city should return that same city."""
    for c in CITIES:
        g = Globe()
        g.snap_to(c)
        assert g.visible_city().id == c.id


def test_visible_city_changes_with_rotation():
    g = Globe()
    g.snap_to(by_id("tokyo"))
    assert g.visible_city().id == "tokyo"
    # Rotate far enough to pass to the next-east city.
    g.rotate(15.0)
    after = g.visible_city().id
    # After enough rotation it shouldn't still be tokyo.
    g.rotate(60.0)
    far_after = g.visible_city().id
    assert far_after != "tokyo"


def test_render_globe_shape():
    out = render_globe(spotlight=by_id("tokyo"))
    lines = out.splitlines()
    assert len(lines) == GLOBE_HEIGHT
    for line in lines:
        # Each line should be <= GLOBE_WIDTH chars (we strip right).
        assert len(line) <= GLOBE_WIDTH


def test_render_globe_marks_spotlight():
    out = render_globe(spotlight=by_id("tokyo"))
    assert "●" in out


def test_render_globe_without_spotlight():
    out = render_globe(spotlight=None)
    # No spotlight char should appear when there is no spotlight.
    assert "●" not in out
