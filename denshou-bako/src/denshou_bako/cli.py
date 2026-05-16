"""CLI entry for denshou-bako."""

from __future__ import annotations

import argparse
import sys
from datetime import date, timedelta
from pathlib import Path

from rich.console import Console
from rich.panel import Panel
from rich.text import Text

from .audio import MockBackend, detect_backend, make_backend
from .book import discover, render_html, render_markdown
from .categories import BY_KEY
from .questions import question_for, total
from .session import run_session
from .wiring import PARTS, PINOUT, SCHEMATIC, SYSTEMD_UNIT


GOLD = "#b8945b"
DIM = "#6b6458"
INK = "#dccba6"
ROUGE = "#c47b76"


# ---- play-today ----


def _cmd_play_today(args, console: Console) -> int:
    d = _parse_date(args.target)
    q = question_for(d)
    cat = BY_KEY.get(q.category)
    cat_name = cat.name if cat else q.category
    cat_glyph = cat.glyph if cat else "·"

    body = Text()
    body.append(f"\n  {cat_glyph}  ", style=f"bold {cat.color if cat else GOLD}")
    body.append(f"{cat_name}\n", style=cat.color if cat else GOLD)
    body.append(f"  {d.isoformat()}\n\n", style=DIM)
    body.append(f"  {q.text}\n\n", style=f"bold {INK}")
    console.print(Panel(
        body,
        title=Text(" 今日の問い ", style=f"bold {GOLD}"),
        border_style=DIM,
        padding=(0, 2),
    ))
    if args.speak:
        backend = make_backend(args.backend or detect_backend())
        backend.speak(f"今日の問いです。{q.text}")
        try:
            backend.close()
        except Exception:
            pass
    return 0


# ---- record (one or loop) ----


def _cmd_record(args, console: Console) -> int:
    name = args.backend or detect_backend()
    console.print(f"\n  [{DIM}]backend:[/] [{GOLD}]{name}[/]")
    backend = make_backend(name)
    out_dir = Path(args.out).expanduser()
    try:
        if args.loop:
            console.print(f"  [{DIM}]ループ受付モード。 Ctrl+C で停止。[/]\n")
            try:
                while True:
                    result = run_session(backend, out_dir,
                                         day=date.today(),
                                         max_record_s=args.max_seconds,
                                         press_timeout_s=None)
                    _print_session_summary(console, result)
                    if name == "mock":
                        # Mock has no real button → exit after 1 iteration
                        break
            except KeyboardInterrupt:
                console.print(f"\n  [{DIM}]終了します。[/]\n")
        else:
            result = run_session(backend, out_dir,
                                 day=_parse_date(args.target),
                                 max_record_s=args.max_seconds,
                                 press_timeout_s=args.timeout_s)
            _print_session_summary(console, result)
    finally:
        try:
            backend.close()
        except Exception:
            pass
    return 0


def _print_session_summary(console: Console, result) -> None:
    cat = BY_KEY.get(result.category)
    cat_name = cat.name if cat else result.category
    if result.skipped:
        console.print(
            f"\n  [{DIM}]飛ばしました[/]: {result.date_iso} ─ "
            f"[{cat.color if cat else GOLD}]{cat_name}[/]\n"
        )
        return
    dur_m = result.duration_s / 60.0
    console.print(
        f"\n  [{GOLD}]録音できました[/]: {result.date_iso} ─ "
        f"[{cat.color if cat else GOLD}]{cat_name}[/]  "
        f"[{DIM}]({dur_m:.1f} 分)[/]\n"
    )


# ---- book ----


def _cmd_book(args, console: Console) -> int:
    folder = Path(args.folder).expanduser()
    records = discover(folder)
    if args.out:
        out = Path(args.out).expanduser()
        if args.html:
            out.write_text(render_html(records), encoding="utf-8")
        else:
            out.write_text(render_markdown(records), encoding="utf-8")
        console.print(f"\n  [{GOLD}]書き出しました[/]: {out}  ({len(records)} 件)\n")
    else:
        text = render_html(records) if args.html else render_markdown(records)
        sys.stdout.write(text)
    return 0


# ---- demo ----


def _cmd_demo(args, console: Console) -> int:
    out_dir = Path(args.out).expanduser()
    out_dir.mkdir(parents=True, exist_ok=True)
    backend = MockBackend()
    today = date.today()
    n = args.days
    for offset in range(n - 1, -1, -1):
        d = today - timedelta(days=offset)
        # randomize: skip every 4th day
        if offset % 4 == 0:
            backend.queue_press("long")
        else:
            backend.queue_press("press")
        run_session(backend, out_dir, day=d, max_record_s=60)
    console.print(
        f"\n  [{GOLD}]デモアーカイブを作りました[/]: {out_dir}\n"
        f"  [{DIM}]{n} 日分の録音 + メタを生成。 `denshou book {out_dir}` で開いてください。[/]\n"
    )
    return 0


# ---- parts / wiring ----


def _cmd_parts(args, console: Console) -> int:
    total_yen = 0
    console.print()
    console.print(f"  [bold {GOLD}]部品表 (BOM)[/]\n")
    console.print(f"  [{DIM}]部品                                          概算 (円)[/]")
    console.print(f"  [{DIM}]─────────────────────────────────────────────────────────[/]")
    for name, model, yen, note in PARTS:
        total_yen += yen
        line = f"  {name:<40}  ¥{yen:>6,}"
        console.print(f"  [{INK}]{name:<40}[/]  [{GOLD}]¥{yen:>6,}[/]")
        if note:
            console.print(f"    [{DIM}]{note}[/]")
        if model:
            console.print(f"    [{DIM}]例: {model}[/]")
    console.print(f"  [{DIM}]─────────────────────────────────────────────────────────[/]")
    console.print(f"  [bold {GOLD}]合計概算 ¥{total_yen:,}[/]\n")
    return 0


def _cmd_wiring(args, console: Console) -> int:
    console.print()
    console.print(f"[bold {GOLD}]配線図[/]")
    console.print(f"[{INK}]{SCHEMATIC}[/]")
    console.print(f"[bold {GOLD}]ピン配置[/]")
    console.print(f"[{INK}]{PINOUT}[/]")
    if args.systemd:
        console.print(f"[bold {GOLD}]systemd unit (/etc/systemd/system/denshou.service):[/]")
        console.print(f"[{DIM}]{SYSTEMD_UNIT}[/]")
    return 0


# ---- args / main ----


def _parse_date(s: str | None) -> date:
    if not s:
        return date.today()
    return date.fromisoformat(s)


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(
        prog="denshou",
        description="伝承箱 — シニアの仕事の知恵を 1 日 1 問ずつ録音する",
    )
    sub = p.add_subparsers(dest="command", required=False)

    pt = sub.add_parser("play-today", help="今日の問いを表示 (任意で読み上げ)")
    pt.add_argument("target", nargs="?", default=None, help="YYYY-MM-DD")
    pt.add_argument("--speak", action="store_true", help="TTS でも読み上げる")
    pt.add_argument("--backend", default=None, help="mock / mac / pi")

    pr = sub.add_parser("record", help="ボタン待ちで 1 回 or ループ録音")
    pr.add_argument("--out", default="./recordings", help="保存先フォルダ")
    pr.add_argument("--backend", default=None, help="mock / mac / pi")
    pr.add_argument("--max-seconds", type=float, default=120.0)
    pr.add_argument("--loop", action="store_true", help="ボタン待ちを繰り返す (systemd 向け)")
    pr.add_argument("--timeout-s", type=float, default=None, help="ボタン待ちタイムアウト")
    pr.add_argument("--target", default=None, help="日付の上書き (YYYY-MM-DD)")

    pb = sub.add_parser("book", help="フォルダから知恵帳 (Markdown / HTML) を作る")
    pb.add_argument("folder")
    pb.add_argument("--html", action="store_true", help="HTML で出力")
    pb.add_argument("--out", default=None, help="出力先 (省略で stdout)")

    pd = sub.add_parser("demo", help="サンプルアーカイブを生成")
    pd.add_argument("--out", default="./demo-recordings")
    pd.add_argument("--days", type=int, default=14)

    sub.add_parser("parts", help="部品表 (BOM) を表示")
    pw = sub.add_parser("wiring", help="配線図を表示")
    pw.add_argument("--systemd", action="store_true", help="systemd unit も表示")

    args = p.parse_args(argv)
    console = Console()

    if args.command is None:
        # Default: show today's question (info only)
        from types import SimpleNamespace
        return _cmd_play_today(SimpleNamespace(target=None, speak=False, backend=None), console)

    if args.command == "play-today": return _cmd_play_today(args, console)
    if args.command == "record":     return _cmd_record(args, console)
    if args.command == "book":       return _cmd_book(args, console)
    if args.command == "demo":       return _cmd_demo(args, console)
    if args.command == "parts":      return _cmd_parts(args, console)
    if args.command == "wiring":     return _cmd_wiring(args, console)

    p.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
