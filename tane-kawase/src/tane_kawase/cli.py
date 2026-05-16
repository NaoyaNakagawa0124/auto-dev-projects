"""CLI entry for tane-kawase."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from rich.console import Console

from . import render
from .models import Field, Packet, Seed
from .storage import default_field_path, load_field, read_packet, save_field, write_packet
from .topics import TOPICS, get


def _cmd_field(args, console: Console, field: Field) -> int:
    console.print(render.render_field(field))
    return 0


def _cmd_stats(args, console: Console, field: Field) -> int:
    console.print(render.render_stats(field))
    return 0


def _cmd_open(args, console: Console, field: Field) -> int:
    path = Path(args.path)
    if not path.exists():
        console.print(f"[#c45663]ファイルが見つかりません: {path}[/]")
        return 2
    try:
        packet = read_packet(path)
    except (ValueError, KeyError) as e:
        console.print(f"[#c45663]包の中身がおかしい: {e}[/]")
        return 2
    console.print(render.render_packet(packet))
    return 0


def _cmd_plant(args, console: Console, field: Field, fpath: Path) -> int:
    path = Path(args.path)
    if not path.exists():
        console.print(f"[#c45663]ファイルが見つかりません: {path}[/]")
        return 2
    try:
        packet = read_packet(path)
    except (ValueError, KeyError) as e:
        console.print(f"[#c45663]包の中身がおかしい: {e}[/]")
        return 2
    field.plant(packet)
    save_field(field, fpath)
    console.print(render.render_packet(packet))
    console.print(
        f"\n  [#d4b06a]畑に植えました[/]: {packet.size} 種が"
        f" [{render.DIM}]({packet.name})[/] に追加されました\n"
    )
    return 0


def _cmd_send(args, console: Console, field: Field, fpath: Path) -> int:
    """Build a packet from --seed args (one-shot) and write it as JSON."""
    topic = get(args.topic)
    if topic is None:
        console.print(f"[#c45663]トピックが不明です: {args.topic}[/]")
        console.print(f"使えるのは: {', '.join(t.key for t in TOPICS)}")
        return 2
    seeds: list[Seed] = []
    for raw in args.seed or []:
        parts = [p.strip() for p in raw.split("|", 4)]
        # term | gloss | reading | example | note
        if not parts or not parts[0]:
            continue
        seeds.append(Seed(
            term=parts[0],
            gloss=parts[1] if len(parts) > 1 else "",
            reading=parts[2] if len(parts) > 2 else "",
            example=parts[3] if len(parts) > 3 else "",
            note=parts[4] if len(parts) > 4 else "",
        ))
    if not seeds:
        console.print("[#c45663]種が 1 つもありません[/]  (--seed を指定してください)")
        return 2
    packet = Packet(
        name=args.name,
        topic=topic.key,
        sender=args.sender or field.my_name,
        receiver=args.receiver,
        language=args.language,
        seeds=seeds,
        letter=args.letter or "",
    )
    out_path = Path(args.out)
    write_packet(packet, out_path)
    field.record_sent(packet)
    save_field(field, fpath)
    console.print(render.render_packet(packet))
    console.print(
        f"\n  [#d4b06a]包を書き出しました[/]: {out_path}\n"
        f"  [#6b6458]これを LINE / メール / USB で渡してください[/]\n"
    )
    return 0


def _cmd_pack(args, console: Console, field: Field, fpath: Path) -> int:
    """Interactive packet creation. For non-interactive use, prefer `send`."""
    console.print("\n  [bold #d4b06a]ひと包 を作ります[/]\n")
    console.print("  [#6b6458]途中で抜けるには Ctrl+C[/]\n")
    name = console.input("  包の名前 (例: 秋の慣用句) > ").strip()
    if not name:
        console.print("[#c45663]名前は必須です[/]")
        return 2
    console.print("\n  トピックを選んでください:")
    for i, t in enumerate(TOPICS, 1):
        console.print(f"    [{t.color}]{i}. {t.name}[/]  [#6b6458]({t.blurb})[/]")
    choice = console.input("\n  番号 > ").strip()
    try:
        idx = int(choice) - 1
        topic = TOPICS[idx]
    except (ValueError, IndexError):
        console.print("[#c45663]番号が不正です[/]")
        return 2
    sender = console.input(f"  送り主 (あなたの名前, 既定: {field.my_name or 'なし'}) > ").strip() or field.my_name
    receiver = console.input("  受け取り手 > ").strip()
    language = console.input("  言語コード (en/fr/ko/...) > ").strip()
    letter = console.input("  ひとこと手紙 (任意) > ").strip()

    seeds: list[Seed] = []
    console.print("\n  [#d4b06a]種を 5-10 個入れてください[/]")
    console.print("  [#6b6458]term | gloss | reading | example | note   (空 Enter で終了)[/]")
    while True:
        raw = console.input(f"  種 {len(seeds)+1} > ").strip()
        if not raw:
            break
        parts = [p.strip() for p in raw.split("|", 4)]
        try:
            s = Seed(
                term=parts[0],
                gloss=parts[1] if len(parts) > 1 else "",
                reading=parts[2] if len(parts) > 2 else "",
                example=parts[3] if len(parts) > 3 else "",
                note=parts[4] if len(parts) > 4 else "",
            )
            seeds.append(s)
        except ValueError as e:
            console.print(f"[#c45663]無視: {e}[/]")
            continue
        if len(seeds) >= 10:
            break

    if not seeds:
        console.print("[#c45663]種が 1 つもありません。 中止します。[/]")
        return 2

    packet = Packet(
        name=name, topic=topic.key, sender=sender, receiver=receiver,
        language=language, seeds=seeds, letter=letter,
    )
    out_path = Path(args.out) if args.out else Path(f"./{name}.json")
    write_packet(packet, out_path)
    field.record_sent(packet)
    save_field(field, fpath)
    console.print(render.render_packet(packet))
    console.print(f"\n  [#d4b06a]包を書き出しました[/]: {out_path}\n")
    return 0


def _cmd_harvest(args, console: Console, field: Field, fpath: Path) -> int:
    sid = args.seed_id
    found = field.find_seed(sid)
    if not found:
        console.print(f"[#c45663]その種が見つかりません: {sid}[/]")
        return 2
    if field.harvest(sid):
        save_field(field, fpath)
        packet, seed = found
        console.print(
            f"\n  [#d4b06a]収穫[/]: 「{seed.term}」 ({packet.name}) を収穫しました\n"
        )
    else:
        console.print(f"[#6b6458]すでに収穫済みです[/]")
    return 0


def _cmd_demo(args, console: Console, field: Field, fpath: Path) -> int:
    """Seed a sample field so a user (or test) can see what the field looks like."""
    if field.my_name == "":
        field.my_name = args.name or "わたし"

    samples = [
        Packet(
            name="春の挨拶",
            topic="haru_na",
            sender="さくら",
            receiver=field.my_name,
            language="en",
            letter="3月によく聞く表現を 5 個!",
            seeds=[
                Seed(term="spring fever", gloss="春の浮き足立ち", example="I've got spring fever again."),
                Seed(term="bloom", gloss="花開く", example="The cherry trees bloom in late March."),
                Seed(term="kick off", gloss="始める", example="Let's kick off the new project."),
                Seed(term="thaw", gloss="(雪が)溶ける", example="The river is starting to thaw."),
                Seed(term="brand new", gloss="新品同様", example="She's wearing brand new shoes."),
            ],
        ),
        Packet(
            name="夏の動詞",
            topic="natsu_yasai",
            sender="たくみ",
            receiver=field.my_name,
            language="en",
            letter="夏らしい動きの単語",
            seeds=[
                Seed(term="splash", gloss="水しぶき", example="The kids splashed in the pool."),
                Seed(term="grill", gloss="網焼きにする", example="Let's grill some corn tonight."),
                Seed(term="doze off", gloss="うとうと", example="I dozed off on the porch."),
            ],
        ),
        Packet(
            name="秋の慣用句",
            topic="aki_koku",
            sender="たくみ",
            receiver=field.my_name,
            language="en",
            seeds=[
                Seed(term="harvest the rewards", gloss="努力が実る"),
                Seed(term="turn over a new leaf", gloss="心機一転", example="He turned over a new leaf after the move."),
                Seed(term="when the chips are down", gloss="苦しい時に"),
                Seed(term="in the same boat", gloss="同じ境遇"),
                Seed(term="bite the bullet", gloss="腹をくくる"),
                Seed(term="hit the books", gloss="勉強に集中する"),
            ],
        ),
        Packet(
            name="お便り風の言い回し",
            topic="kusabana",
            sender="さくら",
            receiver=field.my_name,
            language="en",
            seeds=[
                Seed(term="hit me up", gloss="連絡して", note="カジュアル"),
            ],
        ),
    ]
    for p in samples:
        field.plant(p)
    # sent log
    field.record_sent(Packet(
        name="夏のスラング", topic="kusabana", sender=field.my_name, receiver="さくら",
        language="ja",
        seeds=[Seed(term="ガチ", gloss="really / for real")],
    ))
    save_field(field, fpath)
    console.print(render.render_field(field))
    console.print(f"\n  [#d4b06a]デモ畑を作りました[/]: {fpath}\n")
    return 0


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(
        prog="tane-kawase",
        description="語学を勉強中の二人がことばの種を交わす CLI",
    )
    p.add_argument("--field", type=Path, default=None,
                   help=f"畑ファイル (既定: {default_field_path()})")
    sub = p.add_subparsers(dest="command", required=False)

    sub.add_parser("field", help="あなたの畑を表示")
    sub.add_parser("stats", help="数字で振り返る")

    po = sub.add_parser("open", help="包をプレビュー (植えない)")
    po.add_argument("path")

    pp = sub.add_parser("plant", help="包を畑に植える")
    pp.add_argument("path")

    ps = sub.add_parser("send", help="一行で包を書き出す")
    ps.add_argument("--name", required=True, help="包の名前")
    ps.add_argument("--topic", required=True,
                    help="haru_na / natsu_yasai / aki_koku / fuyu_ne / kusabana")
    ps.add_argument("--out", required=True, help="書き出し先 (.json)")
    ps.add_argument("--sender", default="")
    ps.add_argument("--receiver", default="")
    ps.add_argument("--language", default="")
    ps.add_argument("--letter", default="")
    ps.add_argument("--seed", action="append",
                    help='term | gloss | reading | example | note')

    pk = sub.add_parser("pack", help="対話形式で包を作る")
    pk.add_argument("--out", default=None)

    ph = sub.add_parser("harvest", help="ことばを収穫済みにする")
    ph.add_argument("seed_id")

    pd = sub.add_parser("demo", help="サンプル畑を作る")
    pd.add_argument("--name", default="わたし")

    args = p.parse_args(argv)

    fpath = args.field or default_field_path()
    field = load_field(fpath)
    console = Console()

    if args.command is None:
        # Default: show field
        console.print(render.render_field(field))
        if field.total_seeds() == 0:
            console.print("\n  [#6b6458]畑はまだ空っぽです。 "
                          "[#d4b06a]tane-kawase demo[/] でサンプルを灯せます。[/]\n")
        return 0

    if args.command == "field":   return _cmd_field(args, console, field)
    if args.command == "stats":   return _cmd_stats(args, console, field)
    if args.command == "open":    return _cmd_open(args, console, field)
    if args.command == "plant":   return _cmd_plant(args, console, field, fpath)
    if args.command == "send":    return _cmd_send(args, console, field, fpath)
    if args.command == "pack":    return _cmd_pack(args, console, field, fpath)
    if args.command == "harvest": return _cmd_harvest(args, console, field, fpath)
    if args.command == "demo":    return _cmd_demo(args, console, field, fpath)

    p.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
