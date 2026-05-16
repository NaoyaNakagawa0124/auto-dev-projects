"""Entry point for `meme-fuda` CLI."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .app import MemeFudaApp
from .storage import default_data_path


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(
        prog="meme-fuda",
        description="シニアと家族が二人で作る思い出ミーム札",
    )
    p.add_argument("--data", type=Path, default=None,
                   help=f"デッキファイル (既定: {default_data_path()})")
    p.add_argument("--speaker", default="", help="話す人の名前 (起動画面をスキップする時に)")
    p.add_argument("--writer", default="", help="書く人の名前 (同上)")
    args = p.parse_args(argv)

    app = MemeFudaApp(
        data_path=args.data or default_data_path(),
        initial_speaker=args.speaker,
        initial_writer=args.writer,
    )
    app.run()
    return 0


if __name__ == "__main__":
    sys.exit(main())
