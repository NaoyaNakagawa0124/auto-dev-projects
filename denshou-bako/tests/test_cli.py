from pathlib import Path

from denshou_bako.cli import main


def test_no_args_shows_today_question(capsys):
    rc = main([])
    out = capsys.readouterr().out
    assert rc == 0
    assert "今日の問い" in out


def test_play_today_with_explicit_date(capsys):
    rc = main(["play-today", "2026-05-17"])
    out = capsys.readouterr().out
    assert rc == 0
    assert "2026-05-17" in out


def test_demo_creates_files(capsys, tmp_path: Path):
    out = tmp_path / "demo"
    rc = main(["demo", "--out", str(out), "--days", "5"])
    captured = capsys.readouterr().out
    assert rc == 0
    files = list(out.glob("*.json"))
    assert len(files) == 5


def test_record_with_mock_backend(capsys, tmp_path: Path):
    out = tmp_path / "rec"
    rc = main([
        "record", "--backend", "mock", "--out", str(out),
        "--target", "2026-05-17",
        "--timeout-s", "0.01",
    ])
    captured = capsys.readouterr().out
    assert rc == 0
    files = list(out.glob("*.json"))
    assert len(files) == 1  # one session recorded (or skipped)


def test_book_stdout_default(capsys, tmp_path: Path):
    # Seed a small archive
    main(["demo", "--out", str(tmp_path / "x"), "--days", "3"])
    capsys.readouterr()
    rc = main(["book", str(tmp_path / "x")])
    out = capsys.readouterr().out
    assert rc == 0
    assert "伝承箱" in out


def test_book_html_to_file(capsys, tmp_path: Path):
    main(["demo", "--out", str(tmp_path / "x"), "--days", "3"])
    capsys.readouterr()
    out_html = tmp_path / "book.html"
    rc = main(["book", str(tmp_path / "x"), "--html", "--out", str(out_html)])
    assert rc == 0
    assert out_html.exists()
    text = out_html.read_text(encoding="utf-8")
    assert "<!doctype html>" in text


def test_parts_shows_bom(capsys):
    rc = main(["parts"])
    out = capsys.readouterr().out
    assert rc == 0
    assert "部品表" in out
    assert "Raspberry Pi" in out
    assert "合計概算" in out


def test_wiring_shows_schematic(capsys):
    rc = main(["wiring"])
    out = capsys.readouterr().out
    assert rc == 0
    assert "Raspberry Pi" in out
    assert "GPIO" in out


def test_wiring_systemd_includes_unit_file(capsys):
    rc = main(["wiring", "--systemd"])
    out = capsys.readouterr().out
    assert rc == 0
    assert "[Service]" in out
    assert "ExecStart" in out
