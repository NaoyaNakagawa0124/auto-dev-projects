from datetime import date
from pathlib import Path

from denshou_bako.audio import MockBackend
from denshou_bako.book import discover, render_html, render_markdown
from denshou_bako.session import run_session


def _seed(tmp_path: Path, days: int = 7) -> Path:
    b = MockBackend()
    for offset in range(days - 1, -1, -1):
        if offset % 3 == 0:
            b.queue_press("long")   # skipped
        else:
            b.queue_press("press")
        d = date.today().fromordinal(date.today().toordinal() - offset)
        run_session(b, tmp_path, day=d, max_record_s=30)
    return tmp_path


def test_discover_returns_records_in_date_order(tmp_path: Path):
    _seed(tmp_path, days=5)
    records = discover(tmp_path)
    assert len(records) == 5
    dates = [r.date_iso for r in records]
    assert dates == sorted(dates)


def test_discover_handles_missing_folder(tmp_path: Path):
    assert discover(tmp_path / "does-not-exist") == []


def test_render_markdown_includes_title_and_entries(tmp_path: Path):
    _seed(tmp_path, days=3)
    md = render_markdown(discover(tmp_path))
    assert "伝承箱" in md
    assert "知恵の帳" in md
    assert "## " in md
    assert "カテゴリ別" in md


def test_render_markdown_empty_folder(tmp_path: Path):
    md = render_markdown(discover(tmp_path))
    assert "まだ録音がありません" in md


def test_render_html_is_valid_html(tmp_path: Path):
    _seed(tmp_path, days=3)
    html = render_html(discover(tmp_path))
    assert html.lstrip().startswith("<!doctype html>")
    assert "</body></html>" in html
    assert "伝承箱" in html


def test_render_marks_skipped_days(tmp_path: Path):
    _seed(tmp_path, days=7)
    md = render_markdown(discover(tmp_path))
    assert "飛ばしました" in md or "飛ばした" in md
