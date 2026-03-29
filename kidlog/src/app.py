"""KidLog - SNS-style family milestone tracker TUI."""
from textual.app import App, ComposeResult
from textual.widgets import Header, Footer, Static, Input, Button, Label, ListView, ListItem, RichLog
from textual.containers import Vertical, Horizontal, Container
from textual.binding import Binding
from textual.screen import Screen, ModalScreen
from textual import on
from rich.text import Text
from rich.panel import Panel
from rich.table import Table
from datetime import datetime

from store import (
    load_data, save_data, add_entry, add_reaction, delete_entry,
    get_stats, CATEGORIES, REACTIONS, get_category,
)


class EntryCard(Static):
    """A single entry displayed as an SNS-style card."""

    def __init__(self, entry: dict, **kwargs):
        super().__init__(**kwargs)
        self.entry = entry

    def compose(self) -> ComposeResult:
        cat = get_category(self.entry.get("category", "other"))
        dt = self.entry.get("created_at", "")
        try:
            time_str = datetime.fromisoformat(dt).strftime("%Y/%m/%d %H:%M")
        except (ValueError, TypeError):
            time_str = dt[:16] if dt else ""

        child = self.entry.get("child_name", "")
        header_text = f"{cat['emoji']} {cat['name']}"
        if child:
            header_text += f"  👶 {child}"

        reactions = self.entry.get("reactions", [])
        reaction_str = " ".join(reactions) if reactions else ""

        yield Static(
            f"[bold]{header_text}[/bold]  [dim]{time_str}[/dim]\n"
            f"\n{self.entry.get('text', '')}\n"
            f"\n[dim]{reaction_str}[/dim]",
            classes="entry-body",
        )


class NewEntryScreen(ModalScreen[dict | None]):
    """Modal screen for adding a new entry."""

    CSS = """
    NewEntryScreen {
        align: center middle;
    }
    #new-entry-dialog {
        width: 60;
        height: auto;
        max-height: 30;
        border: thick $accent;
        background: $surface;
        padding: 1 2;
    }
    #new-entry-dialog Label {
        margin-bottom: 1;
    }
    #new-entry-dialog Input {
        margin-bottom: 1;
    }
    .cat-row {
        height: 3;
        margin-bottom: 1;
    }
    .cat-btn {
        min-width: 12;
        margin-right: 1;
    }
    .cat-btn.-selected {
        background: $accent;
        color: $text;
    }
    """

    BINDINGS = [Binding("escape", "cancel", "キャンセル")]

    def __init__(self):
        super().__init__()
        self.selected_cat = "other"

    def compose(self) -> ComposeResult:
        with Vertical(id="new-entry-dialog"):
            yield Label("📝 新しい記録")
            yield Input(placeholder="何があった？（例: 初めて「ママ」と言った！）", id="entry-text")
            yield Input(placeholder="子どもの名前（任意）", id="child-name")
            yield Label("カテゴリ:")
            with Horizontal(classes="cat-row"):
                for cat in CATEGORIES[:5]:
                    yield Button(f"{cat['emoji']} {cat['name']}", id=f"cat-{cat['id']}", classes="cat-btn")
            with Horizontal(classes="cat-row"):
                for cat in CATEGORIES[5:]:
                    yield Button(f"{cat['emoji']} {cat['name']}", id=f"cat-{cat['id']}", classes="cat-btn")
            yield Button("✨ 記録する", id="submit-btn", variant="primary")

    @on(Button.Pressed)
    def on_button(self, event: Button.Pressed) -> None:
        btn_id = event.button.id or ""
        if btn_id.startswith("cat-"):
            self.selected_cat = btn_id[4:]
            for btn in self.query(".cat-btn"):
                btn.remove_class("-selected")
            event.button.add_class("-selected")
        elif btn_id == "submit-btn":
            text_input = self.query_one("#entry-text", Input)
            name_input = self.query_one("#child-name", Input)
            if text_input.value.strip():
                self.dismiss({
                    "text": text_input.value.strip(),
                    "category": self.selected_cat,
                    "child_name": name_input.value.strip(),
                })

    def action_cancel(self) -> None:
        self.dismiss(None)


class StatsScreen(ModalScreen[None]):
    """Modal screen showing statistics."""

    CSS = """
    StatsScreen {
        align: center middle;
    }
    #stats-dialog {
        width: 60;
        height: auto;
        max-height: 35;
        border: thick $accent;
        background: $surface;
        padding: 1 2;
    }
    """

    BINDINGS = [Binding("escape", "close", "閉じる"), Binding("q", "close", "閉じる")]

    def __init__(self, data: dict):
        super().__init__()
        self.stats = get_stats(data)

    def compose(self) -> ComposeResult:
        s = self.stats
        with Vertical(id="stats-dialog"):
            yield Label("📊 統計")
            yield Static(
                f"[bold]総記録数:[/bold] {s['total']}\n"
                f"[bold]記録日数:[/bold] {s['days_active']}\n"
                f"[bold]連続記録:[/bold] 🔥 {s['streak']}日\n"
                f"[bold]最長連続:[/bold] 💪 {s['longest_streak']}日"
            )
            yield Label("")
            yield Label("🎨 カテゴリ別")
            cat_text = ""
            for cat_id, count in sorted(s["category_counts"].items(), key=lambda x: -x[1]):
                cat = get_category(cat_id)
                bar = "█" * min(count, 20) + f" {count}"
                cat_text += f"  {cat['emoji']} {cat['name']}: {bar}\n"
            yield Static(cat_text or "  データなし")

            if s["reaction_counts"]:
                yield Label("💬 リアクション")
                react_text = "  " + "  ".join(
                    f"{r} ×{c}" for r, c in sorted(s["reaction_counts"].items(), key=lambda x: -x[1])
                )
                yield Static(react_text)

            yield Button("閉じる", id="close-btn")

    @on(Button.Pressed, "#close-btn")
    def close(self) -> None:
        self.dismiss(None)

    def action_close(self) -> None:
        self.dismiss(None)


class ReactionScreen(ModalScreen[str | None]):
    """Modal for picking a reaction."""

    CSS = """
    ReactionScreen {
        align: center middle;
    }
    #reaction-dialog {
        width: 40;
        height: auto;
        border: thick $accent;
        background: $surface;
        padding: 1 2;
    }
    .react-btn {
        min-width: 8;
        margin: 0 1;
    }
    """

    BINDINGS = [Binding("escape", "cancel", "キャンセル")]

    def compose(self) -> ComposeResult:
        with Vertical(id="reaction-dialog"):
            yield Label("リアクションを選択:")
            with Horizontal():
                for r in REACTIONS:
                    yield Button(r, id=f"react-{r}", classes="react-btn")

    @on(Button.Pressed)
    def on_react(self, event: Button.Pressed) -> None:
        btn_id = event.button.id or ""
        if btn_id.startswith("react-"):
            self.dismiss(btn_id[6:])

    def action_cancel(self) -> None:
        self.dismiss(None)


class KidLogApp(App):
    """KidLog - Family milestone tracker."""

    CSS = """
    Screen {
        background: $background;
    }
    #main-container {
        height: 1fr;
    }
    #sidebar {
        width: 24;
        border-right: thick $primary-background;
        padding: 1;
    }
    #sidebar Label {
        margin-bottom: 1;
    }
    .streak-display {
        text-align: center;
        margin: 1 0;
    }
    #feed {
        width: 1fr;
        padding: 0 1;
    }
    .entry-body {
        margin: 0 0 1 0;
        padding: 1;
        border: round $primary;
        height: auto;
    }
    #empty-state {
        text-align: center;
        margin-top: 5;
        color: $text-muted;
    }
    """

    TITLE = "キッズログ"
    SUB_TITLE = "ターミナルで育児記録"

    BINDINGS = [
        Binding("n", "new_entry", "新しい記録"),
        Binding("s", "show_stats", "統計"),
        Binding("r", "add_reaction", "リアクション"),
        Binding("q", "quit", "終了"),
    ]

    def __init__(self):
        super().__init__()
        self.data = load_data()
        self.selected_entry_idx = 0

    def compose(self) -> ComposeResult:
        yield Header()
        with Horizontal(id="main-container"):
            with Vertical(id="sidebar"):
                yield Label("[bold]キッズログ[/bold]")
                yield Static(id="streak-widget", classes="streak-display")
                yield Static(id="quick-stats")
                yield Label("[dim]────────────[/dim]")
                yield Label("[dim]n[/dim] 新しい記録")
                yield Label("[dim]s[/dim] 統計")
                yield Label("[dim]r[/dim] リアクション")
                yield Label("[dim]q[/dim] 終了")
            with Vertical(id="feed"):
                yield Static(id="feed-content")
        yield Footer()

    def on_mount(self) -> None:
        self._refresh_ui()

    def _refresh_ui(self) -> None:
        # Update streak
        streak_widget = self.query_one("#streak-widget", Static)
        streak = self.data.get("streak_count", 0)
        if streak > 0:
            streak_widget.update(f"🔥 {streak}日連続")
        else:
            streak_widget.update("[dim]記録を始めよう[/dim]")

        # Update quick stats
        stats_widget = self.query_one("#quick-stats", Static)
        total = len(self.data.get("entries", []))
        stats_widget.update(f"[bold]{total}[/bold] 件の記録")

        # Update feed
        feed = self.query_one("#feed-content", Static)
        entries = self.data.get("entries", [])

        if not entries:
            feed.update(
                "\n\n\n"
                "  [bold]まだ記録がありません[/bold]\n\n"
                "  [dim]「n」キーを押して最初の記録を追加しよう！[/dim]\n\n"
                "  [dim]👶 子どもの成長を記録して、\n"
                "     素敵な思い出のタイムラインを作ろう[/dim]"
            )
            return

        lines = []
        for i, entry in enumerate(entries[:50]):  # Show last 50
            cat = get_category(entry.get("category", "other"))
            dt = entry.get("created_at", "")
            try:
                time_str = datetime.fromisoformat(dt).strftime("%m/%d %H:%M")
            except (ValueError, TypeError):
                time_str = ""

            child = entry.get("child_name", "")
            child_str = f" 👶{child}" if child else ""

            selected = ">" if i == self.selected_entry_idx else " "
            reactions = " ".join(entry.get("reactions", []))

            lines.append(
                f"{selected} ┌─ {cat['emoji']} {cat['name']}{child_str}  [dim]{time_str}[/dim]\n"
                f"  │ {entry.get('text', '')}\n"
                f"  └─ {reactions if reactions else '[dim]リアクションなし[/dim]'}\n"
            )

        feed.update("\n".join(lines))

    def action_new_entry(self) -> None:
        self.push_screen(NewEntryScreen(), self._on_entry_created)

    def _on_entry_created(self, result: dict | None) -> None:
        if result:
            add_entry(self.data, result["text"], result["category"], result["child_name"])
            save_data(self.data)
            self.selected_entry_idx = 0
            self._refresh_ui()
            self.notify("✨ 記録しました！")

    def action_show_stats(self) -> None:
        self.push_screen(StatsScreen(self.data))

    def action_add_reaction(self) -> None:
        entries = self.data.get("entries", [])
        if not entries or self.selected_entry_idx >= len(entries):
            self.notify("記録がありません", severity="warning")
            return
        self.push_screen(ReactionScreen(), self._on_reaction_picked)

    def _on_reaction_picked(self, result: str | None) -> None:
        if result:
            entries = self.data.get("entries", [])
            if self.selected_entry_idx < len(entries):
                entry = entries[self.selected_entry_idx]
                add_reaction(self.data, entry["id"], result)
                save_data(self.data)
                self._refresh_ui()
                self.notify(f"{result} を追加しました")

    def on_key(self, event) -> None:
        entries = self.data.get("entries", [])
        if event.key == "up" or event.key == "k":
            if self.selected_entry_idx > 0:
                self.selected_entry_idx -= 1
                self._refresh_ui()
        elif event.key == "down" or event.key == "j":
            if self.selected_entry_idx < len(entries) - 1:
                self.selected_entry_idx += 1
                self._refresh_ui()


def main():
    app = KidLogApp()
    app.run()


if __name__ == "__main__":
    main()
