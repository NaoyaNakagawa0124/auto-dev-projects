"""Textual TUI — globe rotation + city card + dossier viewer.

IMPORTANT: do NOT define a method named `_render` on any Screen or Widget here.
Textual's Widget._render is internal and gets shadowed, producing blank
screens / `'NoneType' object has no attribute 'render_strips'` at frame time.
Use names like `_refresh_view` instead.
"""

from __future__ import annotations

from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Horizontal, Vertical
from textual.screen import Screen
from textual.widgets import Footer, Header, Static

from .cities import CITIES, by_id
from .dossier import Dossier
from .globe import Globe, render_globe


CSS = """
Screen {
    background: #faf6ee;
    color: #2a2520;
}
Header {
    background: #d77a3a;
    color: #faf6ee;
}
Footer {
    background: #faf6ee;
    color: #97a7a0;
}
#globe-pane {
    width: 1fr;
    padding: 1 2;
    border-right: dashed #97a7a0;
}
#card-pane {
    width: 1fr;
    padding: 1 2;
}
#globe-art {
    color: #2a2520;
    background: #f1ebdb;
    padding: 1 2;
    border: round #97a7a0;
    margin-bottom: 1;
}
.spotlight {
    color: #d77a3a;
    background: #f1ebdb;
    padding: 0 1;
    border: round #d77a3a;
    margin-bottom: 1;
}
.heading {
    color: #97a7a0;
    margin-top: 1;
}
.event-text {
    margin-top: 1;
    color: #2a2520;
}
.tip-text {
    color: #4d4538;
    margin-top: 1;
}
.collected-tag {
    color: #d77a3a;
    text-style: bold;
    margin-top: 1;
}
.collected-tag.hidden {
    color: #97a7a0;
    text-style: none;
}
#dossier-list {
    padding: 1 2;
    color: #2a2520;
}
"""


class GlobeScreen(Screen):
    BINDINGS = [
        Binding("left",  "rotate_left",  "← 西へ"),
        Binding("right", "rotate_right", "→ 東へ"),
        Binding("h",     "rotate_left",  "← 西へ", show=False),
        Binding("l",     "rotate_right", "→ 東へ", show=False),
        Binding("enter", "collect",      "話題帳に綴じる"),
        Binding("tab",   "open_dossier", "話題帳を開く"),
        Binding("q",     "quit",         "終了"),
    ]

    def __init__(self, dossier: Dossier) -> None:
        super().__init__()
        self.globe = Globe(rotation_deg=139.7, step_deg=30.0)
        self.dossier = dossier

    def compose(self) -> ComposeResult:
        yield Header(show_clock=False)
        with Horizontal():
            with Vertical(id="globe-pane"):
                yield Static("地球儀 ← → で回転", classes="heading")
                yield Static(id="globe-art")
                yield Static("", id="spotlight-name", classes="spotlight")
                yield Static("Tab で 話題帳 / Enter で 綴じる / q で 終了", classes="heading")
            with Vertical(id="card-pane"):
                yield Static("今日の話題", classes="heading")
                yield Static("", id="event-text",   classes="event-text")
                yield Static("面接の引き出し", classes="heading")
                yield Static("", id="tip-text",     classes="tip-text")
                yield Static("", id="collected-tag", classes="collected-tag hidden")
        yield Footer()

    def on_mount(self) -> None:
        self.sub_title = "地球を回して、 明日の面接の話題を集めよう"
        self._refresh_view()

    def _refresh_view(self) -> None:
        city = self.globe.visible_city()
        self.query_one("#globe-art", Static).update(render_globe(spotlight=city))
        self.query_one("#spotlight-name", Static).update(f"●  {city.jp}  ({city.id})")
        self.query_one("#event-text", Static).update(city.event)
        self.query_one("#tip-text", Static).update(city.talking_point)
        tag = self.query_one("#collected-tag", Static)
        if self.dossier.is_collected(city.id):
            tag.update("✓ すでに 話題帳 に 綴じてあります")
            tag.set_classes("collected-tag")
        else:
            tag.update("Enter で 話題帳 に 綴じる")
            tag.set_classes("collected-tag hidden")

    def action_rotate_left(self) -> None:
        self.globe.step_left()
        self._refresh_view()

    def action_rotate_right(self) -> None:
        self.globe.step_right()
        self._refresh_view()

    def action_collect(self) -> None:
        city = self.globe.visible_city()
        if self.dossier.add(city.id):
            self.dossier.save()
            self.notify(f"「{city.jp}」 を 話題帳 に 綴じました")
        else:
            self.notify(f"「{city.jp}」 は すでに 話題帳 に あります", severity="warning")
        self._refresh_view()

    def action_open_dossier(self) -> None:
        self.app.push_screen(DossierScreen(self.dossier))

    def action_quit(self) -> None:
        self.app.exit()


class DossierScreen(Screen):
    BINDINGS = [
        Binding("tab",   "close",  "← 戻る"),
        Binding("escape", "close", "← 戻る", show=False),
        Binding("q",     "quit",   "終了"),
    ]

    def __init__(self, dossier: Dossier) -> None:
        super().__init__()
        self.dossier = dossier

    def compose(self) -> ComposeResult:
        yield Header(show_clock=False)
        yield Static("話題帳 — これまで綴じた都市", classes="heading")
        yield Static("", id="dossier-list")
        yield Footer()

    def on_mount(self) -> None:
        self.sub_title = "綴じた都市の一覧"
        self._refresh_view()

    def _refresh_view(self) -> None:
        entries = self.dossier.list_collected()
        if not entries:
            text = "まだ 一枚 も 綴じて いません。 Tab で 地球儀 に 戻り、 Enter で 綴じてみよう。"
        else:
            lines = []
            for i, e in enumerate(entries, 1):
                city = by_id(e.city_id)
                if not city:
                    continue
                lines.append(f"{i:>2}.  {city.jp}  —  {city.event}")
                lines.append(f"      引き出し: {city.talking_point}")
                lines.append(f"      綴じた日: {e.collected_at}")
                lines.append("")
            text = "\n".join(lines)
        self.query_one("#dossier-list", Static).update(text)

    def action_close(self) -> None:
        self.app.pop_screen()

    def action_quit(self) -> None:
        self.app.exit()


class WadaichouApp(App):
    CSS = CSS
    TITLE = "世界話題帳"

    def __init__(self, dossier: Dossier | None = None) -> None:
        super().__init__()
        self.dossier = dossier or Dossier.load()

    def on_mount(self) -> None:
        self.push_screen(GlobeScreen(self.dossier))


def main() -> None:
    WadaichouApp().run()


if __name__ == "__main__":
    main()
