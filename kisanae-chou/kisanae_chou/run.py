"""Entry point: render all PNGs into out/."""
from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib
matplotlib.use("Agg")

from .data import SAMPLE_ANIME, SEASONAL_EVENTS
from .plots import (
    month_card_fig,
    palette_year_fig,
    save_fig,
    season_scroll_fig,
    year_timeline_fig,
)


def render_all(out_dir: Path, year: int = 2026) -> list[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    paths: list[Path] = []

    fig = year_timeline_fig(SAMPLE_ANIME, SEASONAL_EVENTS, year=year)
    p = out_dir / "year_timeline.png"
    save_fig(fig, str(p))
    paths.append(p)

    for m in range(1, 13):
        fig = month_card_fig(SAMPLE_ANIME, SEASONAL_EVENTS, year, m)
        p = out_dir / f"month_{m:02d}.png"
        save_fig(fig, str(p))
        paths.append(p)

    fig = season_scroll_fig(SAMPLE_ANIME, SEASONAL_EVENTS, year)
    p = out_dir / "season_scroll.png"
    save_fig(fig, str(p))
    paths.append(p)

    fig = palette_year_fig(year)
    p = out_dir / "palette_year.png"
    save_fig(fig, str(p))
    paths.append(p)

    return paths


def main() -> None:
    ap = argparse.ArgumentParser(description="季 重ね 帖 — render all PNGs to out/")
    ap.add_argument("--out", default="out", help="出力 ディレクトリ")
    ap.add_argument("--year", type=int, default=2026, help="対象 年")
    args = ap.parse_args()
    out = Path(args.out)
    paths = render_all(out, year=args.year)
    print(f"生成 完了 — {len(paths)} 枚 を {out}/ に 保存 し ました")
    for p in paths:
        print(f"  ▣ {p}")


if __name__ == "__main__":
    main()
