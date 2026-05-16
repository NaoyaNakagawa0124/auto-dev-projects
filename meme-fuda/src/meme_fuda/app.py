"""Textual TUI for meme-fuda.

Flow:
  1. SetupScreen — 「話す人」「書く人」の名前を入力
  2. ComposeScreen — 札の作成 (テンプレ ← →、上下テキスト入力、保存)
  3. DeckScreen — 保存済み札のめくり
"""

from __future__ import annotations

from datetime import datetime
from pathlib import Path

from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Container, Horizontal, Vertical
from textual.screen import Screen
from textual.widgets import Footer, Header, Input, Static

from .models import Card, Deck
from .render import render_card, render_thumbnail
from .storage import load, save
from .templates import TEMPLATES, get_or_default


CSS = """
Screen {
    background: #1a1810;
    color: #ebe2c8;
}
Header {
    background: #1a1810;
    color: #c47b76;
}
Footer {
    background: #1a1810;
    color: #7a7466;
}

#root {
    padding: 1 2;
    height: 100%;
}

.title {
    color: #b8945b;
    text-style: bold;
}
.hint {
    color: #7a7466;
}
.paper {
    background: #1a1810;
    padding: 1 2;
    border: round #5a5240;
}

.btn {
    background: #2b2820;
    color: #b8945b;
    border: round #5a5240;
    padding: 0 2;
    text-style: bold;
    height: 3;
}
.btn-primary {
    background: #b8945b;
    color: #1a1810;
    border: round #b8945b;
}
.row {
    height: auto;
    align: center middle;
}

Input {
    background: #2b2820;
    color: #ebe2c8;
    border: round #5a5240;
}
Input:focus {
    border: round #b8945b;
}

.template-name {
    color: #b8945b;
    text-style: bold;
}
.template-counter {
    color: #7a7466;
}
.card-host {
    align: center middle;
    padding: 1 0;
    height: auto;
}
.thumb-line {
    height: 1;
}
.thumb-empty {
    color: #7a7466;
}
"""


# ---- Setup screen ---------------------------------------------------------


class SetupScreen(Screen):
    """First-run: ask who is the speaker, who is the writer."""

    BINDINGS = [
        Binding("escape", "skip", "とばす", show=True),
        Binding("enter", "submit", "次へ", show=True),
    ]

    def __init__(self, speaker: str = "", writer: str = ""):
        super().__init__()
        self._initial_speaker = speaker
        self._initial_writer = writer

    def compose(self) -> ComposeResult:
        yield Header(show_clock=False)
        with Vertical(id="root"):
            yield Static("ふたりで開いてくれた?", classes="title")
            yield Static("", classes="hint")
            yield Static("二人の名前を入れると、 作った札に「話: あなた / 書: 私」が記録されます。\n"
                         "一人で起動した場合は Esc で飛ばしてもOK。", classes="hint")
            yield Static("", classes="hint")
            yield Static("話す人 (例: おばあちゃん / 父 / 祖父)", classes="hint")
            yield Input(value=self._initial_speaker, id="inp-speaker",
                        placeholder="話す人の名前")
            yield Static("", classes="hint")
            yield Static("書く人 (例: 孫の名前 / 母)", classes="hint")
            yield Input(value=self._initial_writer, id="inp-writer",
                        placeholder="書く人の名前")
            yield Static("", classes="hint")
            yield Static("[Enter] 始める  [Esc] あとで", classes="hint")
        yield Footer()

    def on_mount(self) -> None:
        self.query_one("#inp-speaker", Input).focus()

    def action_submit(self) -> None:
        sp = self.query_one("#inp-speaker", Input).value.strip()
        wr = self.query_one("#inp-writer", Input).value.strip()
        self.app.set_pair(sp, wr)
        self.app.push_screen(ComposeScreen())

    def action_skip(self) -> None:
        self.app.set_pair("", "")
        self.app.push_screen(ComposeScreen())


# ---- Compose screen -------------------------------------------------------


class ComposeScreen(Screen):
    """The main 'making a card' screen."""

    BINDINGS = [
        Binding("ctrl+left", "prev_template", "← 前のテンプレ", show=True, priority=True),
        Binding("ctrl+right", "next_template", "次 → のテンプレ", show=True, priority=True),
        Binding("ctrl+s", "save_card", "保存", show=True, priority=True),
        Binding("ctrl+d", "open_deck", "札たば", show=True, priority=True),
        Binding("ctrl+q", "quit", "終わる", show=True, priority=True),
    ]

    def __init__(self):
        super().__init__()
        self.idx = 0

    def compose(self) -> ComposeResult:
        yield Header(show_clock=False)
        with Vertical(id="root"):
            with Horizontal(classes="row"):
                yield Static("← →", classes="template-counter")
                yield Static("", id="template-info", classes="template-name")
                yield Static("", id="template-counter", classes="template-counter")
            yield Static("", id="card-host", classes="card-host")
            yield Static("上の行 (どんな時?)", classes="hint")
            yield Input(id="inp-top", placeholder="例: 孫が遊びに来た", max_length=40)
            yield Static("下の行 (どうなった?)", classes="hint")
            yield Input(id="inp-bottom", placeholder="例: お茶うけ全部出しちゃう", max_length=40)
            yield Static("", id="status", classes="hint")
            yield Static("[Ctrl+S] 札にする  [Ctrl+D] 札たばを見る  [Ctrl+←  / Ctrl+→] テンプレ切替",
                         classes="hint")
        yield Footer()

    def on_mount(self) -> None:
        self.query_one("#inp-top", Input).focus()
        self._refresh_view()

    def _current_template(self):
        return TEMPLATES[self.idx % len(TEMPLATES)]

    def _build_preview_card(self) -> Card:
        t = self._current_template()
        return Card(
            template_id=t.id,
            top=self.query_one("#inp-top", Input).value,
            bottom=self.query_one("#inp-bottom", Input).value,
            speaker=self.app.pair_speaker,
            writer=self.app.pair_writer,
        )

    def _refresh_view(self) -> None:
        t = self._current_template()
        self.query_one("#template-info", Static).update(f"  {t.name}  ")
        self.query_one("#template-counter", Static).update(
            f"  ({self.idx % len(TEMPLATES) + 1}/{len(TEMPLATES)})"
        )
        card = self._build_preview_card()
        self.query_one("#card-host", Static).update(render_card(card, t))

    def on_input_changed(self, event: Input.Changed) -> None:
        self._refresh_view()

    def action_prev_template(self) -> None:
        self.idx = (self.idx - 1) % len(TEMPLATES)
        self._refresh_view()

    def action_next_template(self) -> None:
        self.idx = (self.idx + 1) % len(TEMPLATES)
        self._refresh_view()

    def action_save_card(self) -> None:
        t = self._current_template()
        top = self.query_one("#inp-top", Input).value.strip()
        bottom = self.query_one("#inp-bottom", Input).value.strip()
        if not top and not bottom:
            self.query_one("#status", Static).update(
                "[#c47b76]上か下、 どちらかは書いてね[/]"
            )
            return
        card = Card(
            template_id=t.id,
            top=top,
            bottom=bottom,
            speaker=self.app.pair_speaker,
            writer=self.app.pair_writer,
        )
        self.app.deck.add(card)
        save(self.app.deck, self.app.data_path)
        # reset inputs
        self.query_one("#inp-top", Input).value = ""
        self.query_one("#inp-bottom", Input).value = ""
        self.query_one("#status", Static).update(
            f"[#b8945b]札にしました ({len(self.app.deck.cards)} 枚目)[/]"
        )
        self._refresh_view()

    def action_open_deck(self) -> None:
        self.app.push_screen(DeckScreen())


# ---- Deck screen ---------------------------------------------------------


class DeckScreen(Screen):
    """Flip through saved cards one at a time."""

    BINDINGS = [
        Binding("left", "prev", "← 前", show=True),
        Binding("right", "next", "次 →", show=True),
        Binding("delete,d", "delete_card", "捨てる", show=True),
        Binding("escape", "close", "戻る", show=True),
    ]

    def __init__(self):
        super().__init__()
        self.idx = 0

    def compose(self) -> ComposeResult:
        yield Header(show_clock=False)
        with Vertical(id="root"):
            yield Static("", id="deck-info", classes="title")
            yield Static("", id="card-host", classes="card-host")
            yield Static("[← →] めくる  [Delete] 捨てる  [Esc] 戻る", classes="hint")
        yield Footer()

    def on_mount(self) -> None:
        self._refresh_view()

    def _refresh_view(self) -> None:
        info = self.query_one("#deck-info", Static)
        host = self.query_one("#card-host", Static)
        cards = self.app.deck.cards
        if not cards:
            info.update("札たばは空っぽです")
            host.update(
                "[#7a7466]まだ 1 枚も作っていません。\n"
                "[Esc] で戻って、 ふたりで 1 枚作ってみてください。[/]"
            )
            return
        self.idx = self.idx % len(cards)
        c = cards[self.idx]
        info.update(f"  {self.idx + 1} / {len(cards)} 枚")
        host.update(render_card(c))

    def action_next(self) -> None:
        if self.app.deck.cards:
            self.idx = (self.idx + 1) % len(self.app.deck.cards)
            self._refresh_view()

    def action_prev(self) -> None:
        if self.app.deck.cards:
            self.idx = (self.idx - 1) % len(self.app.deck.cards)
            self._refresh_view()

    def action_delete_card(self) -> None:
        cards = self.app.deck.cards
        if not cards:
            return
        c = cards[self.idx]
        self.app.deck.remove(c.id)
        save(self.app.deck, self.app.data_path)
        if not self.app.deck.cards:
            self.idx = 0
        else:
            self.idx = self.idx % len(self.app.deck.cards)
        self._refresh_view()

    def action_close(self) -> None:
        self.app.pop_screen()


# ---- Main App ------------------------------------------------------------


class MemeFudaApp(App):
    CSS = CSS
    TITLE = "ミーム札"
    SUB_TITLE = "ふたりで作る思い出"

    def __init__(self, data_path: Path | None = None,
                 initial_speaker: str = "",
                 initial_writer: str = ""):
        super().__init__()
        self.data_path = data_path
        self.deck: Deck = load(data_path)
        self.pair_speaker = initial_speaker
        self.pair_writer = initial_writer
        self._skip_setup = bool(initial_speaker or initial_writer)

    def set_pair(self, speaker: str, writer: str) -> None:
        self.pair_speaker = (speaker or "").strip()[:24]
        self.pair_writer = (writer or "").strip()[:24]

    def on_mount(self) -> None:
        if self._skip_setup:
            self.push_screen(ComposeScreen())
        else:
            self.push_screen(SetupScreen(self.pair_speaker, self.pair_writer))
