"""Entry point for the `futari-yoho` console script."""

from __future__ import annotations

import argparse
import sys
from datetime import date, timedelta
from pathlib import Path

from .app import FutariYohoApp
from .models import CheckIn, State
from .storage import default_data_path, save


def _seed_demo(state: State, end: date | None = None) -> State:
    """Fill in a sample week so the dashboard has something to render."""
    end = end or date.today()
    samples = [
        ("a", 0, CheckIn(mood=4, energy=4, solo_want=2, note="プレゼン無事終わり")),
        ("b", 0, CheckIn(mood=5, energy=4, solo_want=2, note="お茶のみたい")),
        ("a", 1, CheckIn(mood=3, energy=2, solo_want=4, note="つかれた…")),
        ("b", 1, CheckIn(mood=2, energy=2, solo_want=3, note="")),
        ("a", 2, CheckIn(mood=3, energy=3, solo_want=3, note="")),
        ("b", 2, CheckIn(mood=4, energy=4, solo_want=2, note="散歩したい")),
        ("a", 3, CheckIn(mood=5, energy=5, solo_want=2, note="")),
        ("b", 3, CheckIn(mood=5, energy=4, solo_want=2, note="一緒にごはん")),
        ("a", 4, CheckIn(mood=3, energy=3, solo_want=5, note="部屋にこもる夜")),
        ("b", 4, CheckIn(mood=3, energy=2, solo_want=5, note="ひとりで本")),
        ("a", 5, CheckIn(mood=2, energy=2, solo_want=2, note="")),
        ("b", 5, CheckIn(mood=2, energy=2, solo_want=2, note="並んで居たい")),
    ]
    for pid, days_ago, check in samples:
        d = end - timedelta(days=days_ago)
        state.record(pid, d, check)
    return state


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="futari-yoho",
        description="共働き夫婦のための、判定しない気分予報",
    )
    parser.add_argument(
        "--demo",
        action="store_true",
        help="サンプル週間データを書き込んでから起動",
    )
    parser.add_argument(
        "--data",
        type=Path,
        default=None,
        help=f"データファイルのパス (既定: {default_data_path()})",
    )
    parser.add_argument(
        "--no-tui",
        action="store_true",
        help="TUI を起動せずに、今日の二人を一行で出力 (cron 等で使うとき用)",
    )
    args = parser.parse_args(argv)

    data_path = args.data or default_data_path()

    if args.demo:
        from .storage import load
        s = _seed_demo(load(data_path))
        save(s, data_path)

    if args.no_tui:
        from .storage import load
        from .weather import paired_weather

        s = load(data_path)
        today = s.day(date.today())
        cw = paired_weather(today.a, today.b)
        print(f"{cw.icon_pair[0]} {cw.icon_pair[1]}  {cw.label} — {cw.whisper}")
        return 0

    app = FutariYohoApp(data_path=data_path)
    app.run()
    return 0


if __name__ == "__main__":
    sys.exit(main())
