"""CLI entry point for kotoba-mado."""

from __future__ import annotations

import argparse
import csv
import random
import sys
from datetime import date, timedelta
from pathlib import Path

from rich.console import Console

from . import render
from .aggregate import streak
from .categories import CATEGORIES, CATEGORY_KEYS, normalize_key
from .models import Log, Session
from .storage import default_data_path, load, save


def _parse_date(s: str | None) -> date:
    if not s:
        return date.today()
    return date.fromisoformat(s)


def _parse_year_month(s: str | None) -> tuple[int, int]:
    today = date.today()
    if not s:
        return today.year, today.month
    parts = s.split("-")
    if len(parts) != 2:
        raise SystemExit(f"月の指定は YYYY-MM で書いてください (例: 2026-05) — {s!r}")
    return int(parts[0]), int(parts[1])


def _cmd_year(args, console: Console, log: Log) -> int:
    year = int(args.year) if args.year else date.today().year
    console.print(render.render_year(log, year))
    return 0


def _cmd_month(args, console: Console, log: Log) -> int:
    if args.target:
        y, m = _parse_year_month(args.target)
    else:
        today = date.today()
        y, m = today.year, today.month
    console.print(render.render_month(log, y, m))
    return 0


def _cmd_today(args, console: Console, log: Log) -> int:
    target = _parse_date(args.target)
    console.print(render.render_today(log, target))
    return 0


def _cmd_streak(args, console: Console, log: Log) -> int:
    console.print(render.render_streak(log))
    return 0


def _cmd_add(args, console: Console, log: Log, path: Path) -> int:
    cat = normalize_key(args.category) if args.category else None
    if cat is None:
        # interactive
        console.print("[bold #e8d6b3]今日の学習を一枚、窓に[/]\n")
        for i, c in enumerate(CATEGORIES, 1):
            console.print(f"  [{c.color}]{i}.[/] {c.label}  [dim]({c.key})[/]")
        choice = console.input("\n  カテゴリ番号 [1-6] > ").strip()
        try:
            idx = int(choice) - 1
            cat = CATEGORIES[idx].key
        except (ValueError, IndexError):
            console.print("[red]不正な選択です[/]")
            return 2
        minutes_raw = console.input(f"  {cat} を何分? > ").strip()
        try:
            minutes = int(minutes_raw)
        except ValueError:
            console.print("[red]分数は整数で[/]")
            return 2
        language = console.input("  言語 (例: en, ja, ko) > ").strip() or "??"
        note = console.input("  ひと言メモ (省略可) > ").strip()
        d = date.today()
    else:
        try:
            minutes = int(args.minutes)
        except (TypeError, ValueError):
            console.print("[red]minutes は整数で[/]")
            return 2
        language = (args.language or "??").lower()
        note = args.note or ""
        d = _parse_date(args.date)

    session = Session(
        date=d.isoformat(),
        language=language,
        category=cat,
        minutes=minutes,
        note=note,
    )
    log.add(session)
    save(log, path)
    console.print(
        f"\n  [#d49a3f]灯した[/]: {d.isoformat()} · "
        f"[{[c.color for c in CATEGORIES if c.key == cat][0]}]{cat}[/] · {minutes} 分\n"
    )
    console.print(render.render_today(log, d))
    return 0


def _cmd_import(args, console: Console, log: Log, path: Path) -> int:
    csv_path = Path(args.csv)
    if not csv_path.exists():
        console.print(f"[red]ファイルが見つかりません: {csv_path}[/]")
        return 2
    added = 0
    with csv_path.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                cat = normalize_key(row.get("category", ""))
                if not cat:
                    continue
                s = Session(
                    date=row["date"],
                    language=row.get("language", "").lower(),
                    category=cat,
                    minutes=int(row.get("minutes", 0)),
                    note=row.get("note", ""),
                )
                log.add(s)
                added += 1
            except (ValueError, KeyError):
                continue
    save(log, path)
    console.print(f"\n  [#4a7d5a]取り込み完了[/]: {added} 件追加\n")
    return 0


def _cmd_demo(args, console: Console, log: Log, path: Path) -> int:
    """Fill the year with sample data so the visual sings."""
    rng = random.Random(args.seed)
    today = date.today()
    start = today - timedelta(days=270)
    cats = list(CATEGORY_KEYS)
    while start <= today:
        # Skip ~25% of days
        if rng.random() > 0.25:
            n_sessions = rng.choices([1, 2, 3], weights=[6, 3, 1])[0]
            for _ in range(n_sessions):
                cat = rng.choice(cats)
                mins = rng.choices([10, 20, 30, 45, 60, 90], weights=[3, 4, 3, 2, 2, 1])[0]
                log.add(Session(
                    date=start.isoformat(),
                    language=rng.choice(["en", "ja", "ko", "zh", "fr", "es"]),
                    category=cat,
                    minutes=mins,
                    note="",
                ))
        start += timedelta(days=1)
    save(log, path)
    console.print(f"\n  [#d49a3f]デモデータを灯した[/]: {len(log.sessions)} セッション\n")
    return 0


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(
        prog="kotoba-mado",
        description="365 日の語学旅をターミナルのステンドグラスとして眺める",
    )
    p.add_argument("--data", type=Path, default=None,
                   help=f"データファイル (既定: {default_data_path()})")
    sub = p.add_subparsers(dest="command", required=False)

    pyr = sub.add_parser("year", help="一年分のステンドグラスを表示")
    pyr.add_argument("--year", type=int, default=None)

    pm = sub.add_parser("month", help="ひと月を大きく表示")
    pm.add_argument("target", nargs="?", default=None, help="YYYY-MM")

    pt = sub.add_parser("today", help="一日の窓をクローズアップ")
    pt.add_argument("target", nargs="?", default=None, help="YYYY-MM-DD")

    sub.add_parser("streak", help="連続学習日数")

    pa = sub.add_parser("add", help="学習を記録 (引数なしで対話)")
    pa.add_argument("category", nargs="?", default=None)
    pa.add_argument("minutes", nargs="?", default=None)
    pa.add_argument("language", nargs="?", default=None)
    pa.add_argument("--note", default="")
    pa.add_argument("--date", default=None)

    pi = sub.add_parser("import", help="CSV からの取り込み")
    pi.add_argument("csv")

    pd = sub.add_parser("demo", help="サンプルデータを書き込む")
    pd.add_argument("--seed", type=int, default=42)

    args = p.parse_args(argv)
    if args.command is None:
        # Default: show year
        args.command = "year"
        args.year = None

    path = args.data or default_data_path()
    log = load(path)
    console = Console()

    if args.command == "year":
        return _cmd_year(args, console, log)
    if args.command == "month":
        return _cmd_month(args, console, log)
    if args.command == "today":
        return _cmd_today(args, console, log)
    if args.command == "streak":
        return _cmd_streak(args, console, log)
    if args.command == "add":
        return _cmd_add(args, console, log, path)
    if args.command == "import":
        return _cmd_import(args, console, log, path)
    if args.command == "demo":
        return _cmd_demo(args, console, log, path)
    p.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
