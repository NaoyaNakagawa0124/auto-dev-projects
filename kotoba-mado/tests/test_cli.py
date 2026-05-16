"""CLI smoke tests — argparse subcommands."""

import json
from pathlib import Path

import pytest

from kotoba_mado.cli import main
from kotoba_mado.storage import load


def test_default_command_is_year(capsys, tmp_path: Path):
    p = tmp_path / "log.json"
    rc = main(["--data", str(p)])
    out = capsys.readouterr().out
    assert rc == 0
    assert "言 葉 の 窓" in out


def test_year_subcommand_with_year_flag(capsys, tmp_path: Path):
    p = tmp_path / "log.json"
    rc = main(["--data", str(p), "year", "--year", "2025"])
    out = capsys.readouterr().out
    assert rc == 0
    assert "2025" in out


def test_month_subcommand(capsys, tmp_path: Path):
    p = tmp_path / "log.json"
    rc = main(["--data", str(p), "month", "2026-05"])
    out = capsys.readouterr().out
    assert rc == 0
    assert "2026" in out
    assert "5 月" in out


def test_today_subcommand_no_data(capsys, tmp_path: Path):
    p = tmp_path / "log.json"
    rc = main(["--data", str(p), "today", "2026-05-17"])
    out = capsys.readouterr().out
    assert rc == 0
    assert "2026-05-17" in out
    assert "まだ今日の窓" in out


def test_streak_subcommand(capsys, tmp_path: Path):
    p = tmp_path / "log.json"
    rc = main(["--data", str(p), "streak"])
    out = capsys.readouterr().out
    assert rc == 0
    # empty log → invitation message
    assert "明日の窓" in out


def test_add_one_shot_writes_to_disk(capsys, tmp_path: Path):
    p = tmp_path / "log.json"
    rc = main(["--data", str(p), "add", "read", "30", "ja", "--note", "Murakami", "--date", "2026-05-17"])
    out = capsys.readouterr().out
    assert rc == 0
    assert "灯した" in out
    log = load(p)
    assert len(log.sessions) == 1
    assert log.sessions[0].minutes == 30
    assert log.sessions[0].note == "Murakami"
    assert log.sessions[0].category == "read"


def test_add_with_japanese_category(capsys, tmp_path: Path):
    p = tmp_path / "log.json"
    rc = main(["--data", str(p), "add", "読む", "20", "ja", "--date", "2026-05-17"])
    out = capsys.readouterr().out
    assert rc == 0
    log = load(p)
    assert log.sessions[0].category == "read"


def test_import_csv(capsys, tmp_path: Path):
    csv = tmp_path / "in.csv"
    csv.write_text(
        "date,language,category,minutes,note\n"
        "2026-05-15,ja,read,30,first\n"
        "2026-05-16,ja,listen,45,podcast\n"
        "2026-05-17,en,vocab,15,\n",
        encoding="utf-8",
    )
    p = tmp_path / "log.json"
    rc = main(["--data", str(p), "import", str(csv)])
    out = capsys.readouterr().out
    assert rc == 0
    assert "3 件追加" in out
    log = load(p)
    assert len(log.sessions) == 3


def test_demo_writes_many_sessions(capsys, tmp_path: Path):
    p = tmp_path / "log.json"
    rc = main(["--data", str(p), "demo", "--seed", "7"])
    out = capsys.readouterr().out
    assert rc == 0
    log = load(p)
    assert len(log.sessions) > 100  # ~270 days * ~75% * average sessions


def test_demo_then_year(capsys, tmp_path: Path):
    p = tmp_path / "log.json"
    main(["--data", str(p), "demo", "--seed", "7"])
    capsys.readouterr()  # clear
    rc = main(["--data", str(p), "year"])
    out = capsys.readouterr().out
    assert rc == 0
    assert "言 葉 の 窓" in out
    # at least some cells should be filled (block chars present)
    assert "▓" in out or "░" in out or "▒" in out or "█" in out or "▌" in out


def test_import_bad_file_returns_error(capsys, tmp_path: Path):
    p = tmp_path / "log.json"
    rc = main(["--data", str(p), "import", str(tmp_path / "nope.csv")])
    out = capsys.readouterr().out
    assert rc == 2
    assert "見つかりません" in out
