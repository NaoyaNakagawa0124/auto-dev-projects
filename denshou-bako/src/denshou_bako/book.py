"""Archive → wisdom book renderer (Markdown / HTML)."""

from __future__ import annotations

import html
from datetime import date
from pathlib import Path
from typing import Iterable

from .categories import BY_KEY
from .session import SessionResult, read_meta


def discover(folder: Path) -> list[SessionResult]:
    folder = Path(folder)
    if not folder.exists():
        return []
    out: list[SessionResult] = []
    for meta_file in sorted(folder.glob("*.json")):
        try:
            out.append(read_meta(meta_file))
        except (ValueError, KeyError, OSError):
            continue
    return out


# ---- Markdown ---------------------------------------------------------------


def render_markdown(records: Iterable[SessionResult], *, title: str = "伝承箱 — 知恵の帳") -> str:
    records = list(records)
    lines: list[str] = []
    lines.append(f"# {title}\n")
    if records:
        first = records[0].date_iso
        last = records[-1].date_iso
        lines.append(f"_{first} 〜 {last}  ／  全 {len(records)} 件_\n")
    else:
        lines.append("_まだ録音がありません。_\n")
        return "\n".join(lines) + "\n"

    # Stats
    by_cat: dict[str, int] = {}
    skipped = 0
    total_min = 0.0
    for r in records:
        if r.skipped:
            skipped += 1
            continue
        by_cat[r.category] = by_cat.get(r.category, 0) + 1
        total_min += r.duration_s / 60.0
    lines.append("## カテゴリ別")
    lines.append("")
    lines.append("| カテゴリ | 件数 |")
    lines.append("|---|---:|")
    for key, c in BY_KEY.items():
        n = by_cat.get(key, 0)
        if n > 0:
            lines.append(f"| {c.glyph} {c.name} | {n} |")
    if skipped:
        lines.append(f"| (飛ばした日) | {skipped} |")
    lines.append("")
    lines.append(f"合計録音時間: 約 **{total_min:.1f} 分**")
    lines.append("")

    # Entries
    lines.append("---\n")
    for r in records:
        cat = BY_KEY.get(r.category)
        cat_name = cat.name if cat else r.category
        cat_glyph = cat.glyph if cat else ""
        lines.append(f"## {r.date_iso}  ─  {cat_glyph} {cat_name}")
        lines.append("")
        lines.append(f"> {r.question_text}")
        lines.append("")
        if r.skipped:
            lines.append("_(この日は飛ばしました)_")
        else:
            audio = r.audio_path or ""
            dur_m = r.duration_s / 60.0
            lines.append(f"録音: `{audio}`  ／  約 {dur_m:.1f} 分")
            lines.append("")
            lines.append("> _書き起こし: ここに書き起こしを貼ってください。_")
        lines.append("")
    return "\n".join(lines) + "\n"


# ---- HTML -------------------------------------------------------------------


_HTML_STYLE = """\
<style>
  :root {
    --paper:   #1a1810;
    --ink:     #ebe2c8;
    --gold:    #b8945b;
    --rouge:   #c47b76;
    --indigo:  #5b6f8c;
    --moon:    #c8b4d6;
    --dim:     #7a7466;
  }
  html, body {
    background: var(--paper); color: var(--ink); margin: 0;
    font: 16px/1.7 -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic UI", system-ui, sans-serif;
  }
  .wrap { max-width: 720px; margin: 0 auto; padding: 80px 28px 120px; }
  h1 { font-size: 28px; letter-spacing: 0.2em; margin: 0 0 4px; color: var(--gold); }
  h1::before { content: "─ "; color: var(--dim); }
  h1::after  { content: " ─"; color: var(--dim); }
  .sub { color: var(--dim); letter-spacing: 0.1em; font-size: 12px; margin-bottom: 48px; }
  .stats { border: 1px dashed var(--dim); padding: 16px 20px; border-radius: 12px; margin-bottom: 40px; }
  .stats table { border-collapse: collapse; width: 100%; }
  .stats td { padding: 6px 0; font-size: 13px; }
  .stats td.right { text-align: right; color: var(--gold); font-variant-numeric: tabular-nums; }
  .entry { padding: 28px 0; border-top: 1px dashed var(--dim); }
  .entry .date { color: var(--dim); letter-spacing: 0.08em; font-size: 11px; }
  .entry .cat { color: var(--gold); letter-spacing: 0.16em; font-size: 12px; margin-left: 6px; }
  .entry .q   { font-size: 18px; line-height: 1.6; margin: 12px 0 16px; color: var(--ink); }
  .entry .audio { color: var(--dim); font-size: 12px; }
  .entry .transcript { margin-top: 18px; color: var(--dim); font-style: italic; }
  .footer { text-align: center; color: var(--dim); font-size: 11px; margin-top: 56px; letter-spacing: 0.1em; }
</style>
"""


def render_html(records: Iterable[SessionResult], *, title: str = "伝承箱 — 知恵の帳") -> str:
    records = list(records)
    parts: list[str] = []
    parts.append("<!doctype html><html lang='ja'><head><meta charset='utf-8'>")
    parts.append(f"<title>{html.escape(title)}</title>")
    parts.append(_HTML_STYLE)
    parts.append("</head><body><div class='wrap'>")
    parts.append(f"<h1>{html.escape(title)}</h1>")
    if records:
        sub = f"{records[0].date_iso} 〜 {records[-1].date_iso}  ／  全 {len(records)} 件"
        parts.append(f"<div class='sub'>{html.escape(sub)}</div>")
    else:
        parts.append("<div class='sub'>まだ録音がありません。</div>")
        parts.append("</div></body></html>")
        return "".join(parts)

    # Stats
    by_cat: dict[str, int] = {}
    skipped = 0
    total_min = 0.0
    for r in records:
        if r.skipped:
            skipped += 1
            continue
        by_cat[r.category] = by_cat.get(r.category, 0) + 1
        total_min += r.duration_s / 60.0
    parts.append("<div class='stats'><table>")
    for key, c in BY_KEY.items():
        n = by_cat.get(key, 0)
        if n == 0:
            continue
        parts.append(f"<tr><td>{html.escape(c.glyph + ' ' + c.name)}</td>"
                     f"<td class='right'>{n}</td></tr>")
    if skipped:
        parts.append(f"<tr><td>(飛ばした日)</td><td class='right'>{skipped}</td></tr>")
    parts.append(f"<tr><td>合計録音時間</td><td class='right'>{total_min:.1f} 分</td></tr>")
    parts.append("</table></div>")

    for r in records:
        cat = BY_KEY.get(r.category)
        cat_name = (cat.name if cat else r.category)
        cat_glyph = (cat.glyph if cat else "")
        parts.append("<div class='entry'>")
        parts.append(f"<span class='date'>{html.escape(r.date_iso)}</span>")
        parts.append(f"<span class='cat'>{html.escape(cat_glyph + ' ' + cat_name)}</span>")
        parts.append(f"<div class='q'>{html.escape(r.question_text)}</div>")
        if r.skipped:
            parts.append("<div class='transcript'>(この日は飛ばしました)</div>")
        else:
            dur_m = r.duration_s / 60.0
            audio = r.audio_path or ""
            parts.append(f"<div class='audio'>録音: <code>{html.escape(audio)}</code>  ／  約 {dur_m:.1f} 分</div>")
            parts.append("<div class='transcript'>書き起こし: ここに書き起こしを貼ってください。</div>")
        parts.append("</div>")

    parts.append("<div class='footer'>伝承箱 (denshou-bako)  ─  10 年後の誰かのために</div>")
    parts.append("</div></body></html>")
    return "".join(parts)
