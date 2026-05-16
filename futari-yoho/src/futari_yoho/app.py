"""Textual app for futari-yoho.

The visual goal is night-lamp-quiet: dim borders, generous whitespace,
single-glyph weather icons (not emoji), no progress bars, no judgements.
"""

from __future__ import annotations

from datetime import date
from pathlib import Path

from textual import on
from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Container, Horizontal, Vertical
from textual.screen import ModalScreen
from textual.widgets import Footer, Header, Static

from .dates import iso, week_dates
from .models import CheckIn, State
from .storage import load, save
from .weather import (
    CoupleWeather,
    Weather,
    paired_weather,
    palette_color,
    single_weather,
)


CSS = """
Screen {
    background: #1a2436;
    color: #e8d6b3;
}
Header {
    background: #1a2436;
    color: #c8b4d6;
    text-style: none;
}
Footer {
    background: #1a2436;
    color: #5a6470;
}
#root {
    padding: 1 2;
    height: 100%;
}
.card {
    background: #232f44;
    border: round #3a4660;
    padding: 1 2;
    margin: 0 0 1 0;
}
.label {
    color: #5a6470;
}
.partner-name {
    color: #c8b4d6;
    text-style: bold;
}
.icon-big {
    color: #f5c84a;
    text-style: bold;
    width: 6;
}
.note {
    color: #b8945b;
    text-style: italic;
}
.suggestion {
    background: #1a2436;
    border: round #5a6470;
    padding: 1 2;
    color: #e8d6b3;
}
.suggestion .label {
    color: #c8b4d6;
}
.sky-row {
    height: 3;
}
.sky-cell {
    width: 1fr;
    content-align: center middle;
    color: #a9b3c4;
}
.sky-date {
    color: #5a6470;
}
.month-line {
    color: #7f9bb8;
}
.unset {
    color: #5a6470;
    text-style: italic;
}
"""


# ---- Check-in modal ---------------------------------------------------------


class CheckInModal(ModalScreen[CheckIn | None]):
    """A small modal that walks through the 4 questions, arrow-key driven."""

    DEFAULT_CSS = """
    CheckInModal {
        align: center middle;
    }
    #panel {
        width: 56;
        height: 18;
        background: #1a2436;
        border: round #c8b4d6;
        padding: 1 2;
    }
    #title { color: #c8b4d6; text-style: bold; }
    #question { color: #e8d6b3; padding-top: 1; }
    #scale { color: #f5c84a; padding: 1 0; text-style: bold; }
    #hint { color: #5a6470; }
    #note { color: #b8945b; padding-top: 1; }
    """

    BINDINGS = [
        Binding("left", "dec", "下げる", show=True),
        Binding("right", "inc", "上げる", show=True),
        Binding("1,2,3,4,5", "pick", "数字で指定"),
        Binding("enter", "next", "次へ", show=True),
        Binding("backspace,delete", "edit_note", "メモ削除"),
        Binding("escape", "cancel", "中断", show=True),
    ]

    QUESTIONS = (
        ("気分", "今日の気持ちはどうだった?", "重い", "晴れ"),
        ("体力", "今、エネルギーは残ってる?", "空っぽ", "満ちてる"),
        ("距離", "今夜の一人時間が欲しい度", "一緒にいたい", "一人になりたい"),
    )

    def __init__(self, partner_name: str, existing: CheckIn | None = None):
        super().__init__()
        self.partner_name = partner_name
        self.step = 0  # 0=mood, 1=energy, 2=solo, 3=note
        self.values = [
            existing.mood if existing else 3,
            existing.energy if existing else 3,
            existing.solo_want if existing else 3,
        ]
        self.note = existing.note if existing else ""
        self._note_input: list[str] = list(self.note)

    def compose(self) -> ComposeResult:
        with Container(id="panel"):
            yield Static(f"[#c8b4d6 bold]{self.partner_name}[/] の今日", id="title")
            yield Static("", id="question")
            yield Static("", id="scale")
            yield Static("", id="hint")
            yield Static("", id="note")

    def on_mount(self) -> None:
        self._render_step()

    def _render_step(self) -> None:
        q = self.query_one("#question", Static)
        s = self.query_one("#scale", Static)
        h = self.query_one("#hint", Static)
        n = self.query_one("#note", Static)
        if self.step < 3:
            name, prompt, low, high = self.QUESTIONS[self.step]
            q.update(f"[#e8d6b3]{prompt}[/]")
            v = self.values[self.step]
            bar = " ".join(
                ("●" if (i + 1) == v else "○") for i in range(5)
            )
            s.update(f"[#f5c84a bold]{bar}[/]   [{name}]")
            h.update(f"[#5a6470]{low}  ←  1 2 3 4 5  →  {high}[/]\n"
                     f"[#5a6470]Enter で次へ / Esc で中断[/]")
            n.update("")
        else:
            q.update("[#e8d6b3]一言メモ (任意)[/]")
            s.update(f"[#b8945b]{''.join(self._note_input) or '〜'}[/]")
            h.update("[#5a6470]文字を入力 / Backspace で削除 / Enter で保存[/]")
            n.update("")

    def action_dec(self) -> None:
        if self.step < 3:
            self.values[self.step] = max(1, self.values[self.step] - 1)
            self._render_step()

    def action_inc(self) -> None:
        if self.step < 3:
            self.values[self.step] = min(5, self.values[self.step] + 1)
            self._render_step()

    def action_pick(self) -> None:
        # Bound to keys 1-5 via individual key handling
        pass

    async def on_key(self, event) -> None:
        if self.step < 3 and event.key in ("1", "2", "3", "4", "5"):
            self.values[self.step] = int(event.key)
            self._render_step()
            event.stop()
            return
        if self.step == 3:
            if event.key == "backspace":
                if self._note_input:
                    self._note_input.pop()
                self._render_step()
                event.stop()
                return
            ch = event.character
            if ch and ch.isprintable() and event.key != "enter":
                if len(self._note_input) < 140:
                    self._note_input.append(ch)
                self._render_step()
                event.stop()
                return

    def action_next(self) -> None:
        if self.step < 3:
            self.step += 1
            self._render_step()
        else:
            self.dismiss(
                CheckIn(
                    mood=self.values[0],
                    energy=self.values[1],
                    solo_want=self.values[2],
                    note="".join(self._note_input),
                )
            )

    def action_edit_note(self) -> None:
        # On the note step, backspace handled via on_key; this binding is a fallback
        if self.step == 3 and self._note_input:
            self._note_input.pop()
            self._render_step()

    def action_cancel(self) -> None:
        self.dismiss(None)


# ---- Main screen widgets ----------------------------------------------------


def _icon_block(w: Weather) -> str:
    return f"[{palette_color(w.palette)} bold]{w.icon}[/]"


def _format_check_card(name: str, check: CheckIn | None) -> str:
    w = single_weather(check)
    if check is None or not check.answered:
        return (
            f"[#c8b4d6 bold]{name}[/]\n"
            f"[#5a6470]   {w.icon}  まだ未記入[/]\n"
            f"[#5a6470 italic]   c で記入[/]"
        )
    bar_m = "●" * check.mood + "○" * (5 - check.mood)
    bar_e = "●" * check.energy + "○" * (5 - check.energy)
    bar_s = "●" * check.solo_want + "○" * (5 - check.solo_want)
    note = check.note.strip()
    note_line = f"\n   [#b8945b italic]『{note}』[/]" if note else ""
    return (
        f"[#c8b4d6 bold]{name}[/]\n"
        f"   [{palette_color(w.palette)} bold]{w.icon}[/]  "
        f"[{palette_color(w.palette)}]{w.label}[/]\n"
        f"   [#5a6470]気分[/] [#f5c84a]{bar_m}[/]   "
        f"[#5a6470]体力[/] [#f5c84a]{bar_e}[/]   "
        f"[#5a6470]距離[/] [#c8b4d6]{bar_s}[/]"
        f"{note_line}"
    )


def _format_couple_card(cw: CoupleWeather) -> str:
    color = palette_color(cw.palette)
    return (
        f"[#c8b4d6]今夜の二人[/]\n"
        f"   [{color} bold]{cw.icon_pair[0]}[/] "
        f"[#5a6470]＋[/] "
        f"[{color} bold]{cw.icon_pair[1]}[/]    "
        f"[{color} bold]{cw.label}[/]\n"
        f"   [#e8d6b3 italic]{cw.whisper}[/]"
    )


def _format_sky_grid(state: State, end: date | None = None) -> str:
    end = end or date.today()
    week = week_dates(end, 7)
    headers: list[str] = []
    icons_a: list[str] = []
    icons_b: list[str] = []
    labels: list[str] = []
    for d in week:
        day = state.days.get(iso(d))
        a = day.a if day else None
        b = day.b if day else None
        wa = single_weather(a)
        wb = single_weather(b)
        cw = paired_weather(a, b)
        headers.append(f"[#5a6470]{d.month:>2}/{d.day:<2}[/]")
        icons_a.append(f"[{palette_color(wa.palette)}]{wa.icon}[/]")
        icons_b.append(f"[{palette_color(wb.palette)}]{wb.icon}[/]")
        short = cw.label.replace("夜", "")[:3]
        labels.append(f"[{palette_color(cw.palette)}]{short:<3}[/]")
    sep = "   "
    return (
        f"[#c8b4d6]この一週間のふたり[/]\n"
        f"   {sep.join(headers)}\n"
        f"   {sep.join(icons_a)}\n"
        f"   {sep.join(icons_b)}\n"
        f"   {sep.join(labels)}"
    )


def _format_month_line(state: State, end: date | None = None) -> str:
    end = end or date.today()
    days = week_dates(end, 28)
    line_chars: list[str] = []
    for d in days:
        day = state.days.get(iso(d))
        a = day.a if day else None
        b = day.b if day else None
        cw = paired_weather(a, b)
        color = palette_color(cw.palette)
        ch = "·" if cw.palette == "dim" else "•"
        line_chars.append(f"[{color}]{ch}[/]")
    return (
        f"[#c8b4d6]月のふりかえり[/]\n"
        f"   {''.join(line_chars)}\n"
        f"   [#5a6470]← 4 週間 →[/]"
    )


# ---- App --------------------------------------------------------------------


class FutariYohoApp(App):
    CSS = CSS
    TITLE = "二人予報"
    SUB_TITLE = "判定しない気分予報"

    BINDINGS = [
        Binding("c", "checkin_a", "あ の記入", show=True),
        Binding("v", "checkin_b", "い の記入", show=True),
        Binding("r", "refresh_view", "更新", show=True),
        Binding("q", "quit", "終了", show=True),
    ]

    def __init__(self, data_path: Path | None = None):
        super().__init__()
        self.data_path = data_path
        self.state: State = load(data_path)

    def compose(self) -> ComposeResult:
        yield Header(show_clock=False)
        with Vertical(id="root"):
            with Horizontal(classes="row"):
                yield Static("", id="today-a", classes="card")
                yield Static("", id="today-b", classes="card")
            yield Static("", id="couple", classes="suggestion")
            yield Static("", id="sky", classes="card")
            yield Static("", id="month", classes="card")
        yield Footer()

    def on_mount(self) -> None:
        self._refresh()

    def _refresh(self) -> None:
        today = self.state.day(date.today())
        partner_a = self.state.partners["a"]
        partner_b = self.state.partners["b"]
        self.query_one("#today-a", Static).update(_format_check_card(partner_a.name, today.a))
        self.query_one("#today-b", Static).update(_format_check_card(partner_b.name, today.b))
        cw = paired_weather(today.a, today.b)
        self.query_one("#couple", Static).update(_format_couple_card(cw))
        self.query_one("#sky", Static).update(_format_sky_grid(self.state))
        self.query_one("#month", Static).update(_format_month_line(self.state))

    def _save(self) -> None:
        try:
            save(self.state, self.data_path)
        except OSError:
            self.bell()

    def action_refresh_view(self) -> None:
        self.state = load(self.data_path)
        self._refresh()

    def action_checkin_a(self) -> None:
        self._open_checkin("a")

    def action_checkin_b(self) -> None:
        self._open_checkin("b")

    def _open_checkin(self, partner_id: str) -> None:
        partner = self.state.partners[partner_id]
        existing = self.state.day(date.today()).get(partner_id)

        def _on_done(result: CheckIn | None) -> None:
            if isinstance(result, CheckIn) and result.answered:
                self.state.record(partner_id, date.today(), result)
                self._save()
                self._refresh()

        self.push_screen(CheckInModal(partner.name, existing), _on_done)
