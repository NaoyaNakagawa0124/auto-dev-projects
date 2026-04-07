"""Main Textual TUI application for tokineko."""
from __future__ import annotations

import asyncio
from textual.app import App, ComposeResult
from textual.containers import Container, Horizontal, Vertical, ScrollableContainer
from textual.widgets import (
    Header, Footer, Static, Button, Label, ProgressBar,
    Input, RichLog, TabbedContent, TabPane,
)
from textual.css.query import NoMatches
from textual.reactive import reactive
from textual.timer import Timer
from rich.text import Text
from rich.panel import Panel
from rich.table import Table
from rich.align import Align

from .game import Game
from .eras import get_era_index, ERA_ORDER


class CatDisplay(Static):
    """Displays the cat ASCII art and era info."""

    def __init__(self, game: Game, **kwargs):
        super().__init__(**kwargs)
        self.game = game

    def render(self):
        era = self.game.current_era
        cat_art = "\n".join(era.cat_art)
        era_num, era_total = self.game.era_progress

        content = Text()
        content.append(f"━━━ {era.name} ━━━\n", style=f"bold {era.color}")
        content.append(f"  {era.year_label}\n\n", style="dim")
        content.append(cat_art + "\n\n", style=era.color)
        content.append(f"  🐱 {self.game.state.cat_name}\n", style="bold")
        content.append(f"  📍 {era.name}（{era_num}/{era_total}）\n\n", style="dim")
        content.append(f"  {era.ambient_text}\n", style="italic dim")

        return Panel(
            Align.center(content),
            border_style=era.color,
            title=f"🕐 {era.name}",
            subtitle=f"ポモドーロ: {self.game.state.pomodoro_count}回",
        )


class StatsDisplay(Static):
    """Displays cat stats as progress bars."""

    def __init__(self, game: Game, **kwargs):
        super().__init__(**kwargs)
        self.game = game

    def render(self):
        stats = self.game.state.stats
        era = self.game.current_era

        def bar(value: int, label: str, emoji: str, color: str) -> str:
            filled = value // 5
            empty = 20 - filled
            bar_str = "█" * filled + "░" * empty
            return f"  {emoji} {label}: [{color}]{bar_str}[/] {value}%"

        content = Text.from_markup(
            f"[bold]━━━ ステータス ━━━[/]\n\n"
            f"{bar(stats.happiness, '幸福度', '😊', 'yellow')}\n"
            f"{bar(stats.energy, 'エネルギー', '⚡', 'green')}\n"
            f"{bar(stats.curiosity, '好奇心', '🔍', 'cyan')}\n\n"
            f"  📊 ポモドーロ: [bold]{self.game.state.pomodoro_count}[/] 回\n"
            f"  ⏱️  作業時間: [bold]{self.game.state.total_work_seconds // 3600}[/]時間"
            f"[bold]{(self.game.state.total_work_seconds % 3600) // 60}[/]分\n"
            f"  🗺️  訪問時代: [bold]{len(self.game.state.visited_eras)}[/]/{len(ERA_ORDER)}\n"
            f"  📦 アイテム: [bold]{len(self.game.state.collected_items)}[/]個\n"
        )

        return Panel(content, border_style=era.color, title="📊 ステータス")


class PomodoroTimer(Static):
    """Pomodoro timer widget."""

    is_running: reactive[bool] = reactive(False)
    remaining_seconds: reactive[int] = reactive(25 * 60)
    is_break: reactive[bool] = reactive(False)

    def __init__(self, game: Game, **kwargs):
        super().__init__(**kwargs)
        self.game = game
        self._timer: Timer | None = None

    def render(self):
        minutes = self.remaining_seconds // 60
        seconds = self.remaining_seconds % 60
        era = self.game.current_era

        if self.is_break:
            mode = "☕ 休憩中"
            mode_color = "green"
        elif self.is_running:
            mode = "🔥 集中モード"
            mode_color = "red"
        else:
            mode = "⏸️  待機中"
            mode_color = "dim"

        # Progress bar
        if self.is_break:
            total = 5 * 60
        else:
            total = 25 * 60
        elapsed = total - self.remaining_seconds
        pct = elapsed / total if total > 0 else 0
        bar_len = 30
        filled = int(pct * bar_len)
        bar = "▓" * filled + "░" * (bar_len - filled)

        content = Text.from_markup(
            f"[bold]━━━ ポモドーロタイマー ━━━[/]\n\n"
            f"  [{mode_color}]{mode}[/]\n\n"
            f"  [bold {era.color}]{minutes:02d}:{seconds:02d}[/]\n\n"
            f"  [{era.color}]{bar}[/] {int(pct * 100)}%\n"
        )

        return Panel(content, border_style=era.color, title="🍅 ポモドーロ")

    def start_pomodoro(self):
        if self.is_running:
            return
        self.is_running = True
        self.is_break = False
        self.remaining_seconds = 25 * 60
        self._start_tick()

    def start_break(self):
        self.is_running = True
        self.is_break = True
        self.remaining_seconds = 5 * 60
        self._start_tick()

    def stop_timer(self):
        self.is_running = False
        self._stop_tick()

    def reset_timer(self):
        self.stop_timer()
        self.is_break = False
        self.remaining_seconds = 25 * 60

    def _start_tick(self):
        self._stop_tick()
        self._timer = self.set_interval(1.0, self._tick)

    def _stop_tick(self):
        if self._timer:
            self._timer.stop()
            self._timer = None

    def _tick(self):
        if self.remaining_seconds > 0:
            self.remaining_seconds -= 1
            self.refresh()
        else:
            self._stop_tick()
            self.is_running = False
            if self.is_break:
                self.is_break = False
                self.remaining_seconds = 25 * 60
                self.app.notify("☕ 休憩終了！次のポモドーロを始めましょう", title="時猫")
            else:
                self.app.post_message(PomodoroComplete())

    def skip_timer(self):
        """Skip remaining time (for testing/demo)."""
        self.remaining_seconds = 0


class PomodoroComplete:
    """Message sent when a pomodoro is complete."""
    pass


class MessageLog(RichLog):
    """Game message log."""
    pass


class TokinekoApp(App):
    """時猫 - Time-traveling cat companion."""

    CSS = """
    Screen {
        layout: grid;
        grid-size: 2 2;
        grid-columns: 1fr 1fr;
        grid-rows: 1fr auto;
    }

    #left-panel {
        row-span: 1;
        height: 100%;
    }

    #right-panel {
        row-span: 1;
        height: 100%;
    }

    #bottom-panel {
        column-span: 2;
        height: auto;
        max-height: 16;
    }

    #cat-display {
        height: auto;
        min-height: 16;
    }

    #stats-display {
        height: auto;
        min-height: 14;
    }

    #pomodoro-timer {
        height: auto;
        min-height: 10;
    }

    .action-buttons {
        height: auto;
        padding: 1;
        layout: horizontal;
    }

    .action-buttons Button {
        margin: 0 1;
        min-width: 14;
    }

    #btn-start {
        background: $success;
    }

    #btn-stop {
        background: $error;
    }

    #btn-pet {
        background: $warning;
    }

    #btn-play {
        background: $accent;
    }

    #btn-treat {
        background: $success;
    }

    #message-log {
        height: 100%;
        min-height: 8;
        border: solid $primary;
    }

    TabPane {
        padding: 0;
    }

    #tab-content {
        height: 100%;
    }

    #collection-view {
        height: 100%;
    }

    #era-list {
        height: 100%;
    }

    .era-button {
        width: 100%;
        margin: 0 0 1 0;
    }

    .era-button-locked {
        width: 100%;
        margin: 0 0 1 0;
        opacity: 0.4;
    }
    """

    TITLE = "時猫（tokineko）"
    SUB_TITLE = "時間旅行する猫のコンパニオン"

    BINDINGS = [
        ("p", "start_pomodoro", "ポモドーロ開始"),
        ("s", "stop_timer", "停止"),
        ("1", "pet_cat", "なでる"),
        ("2", "play_cat", "遊ぶ"),
        ("3", "treat_cat", "おやつ"),
        ("c", "show_collection", "コレクション"),
        ("e", "show_eras", "時代一覧"),
        ("a", "show_achievements", "実績"),
        ("q", "quit", "終了"),
    ]

    def __init__(self):
        super().__init__()
        self.game = Game()
        self._decay_timer: Timer | None = None

    def compose(self) -> ComposeResult:
        yield Header()

        with Vertical(id="left-panel"):
            yield CatDisplay(self.game, id="cat-display")
            yield StatsDisplay(self.game, id="stats-display")

        with Vertical(id="right-panel"):
            yield PomodoroTimer(self.game, id="pomodoro-timer")
            with Horizontal(classes="action-buttons"):
                yield Button("🍅 開始", id="btn-start", variant="success")
                yield Button("⏹ 停止", id="btn-stop", variant="error")
            with Horizontal(classes="action-buttons"):
                yield Button("🐱 なでる", id="btn-pet", variant="warning")
                yield Button("🎮 遊ぶ", id="btn-play", variant="primary")
                yield Button("🍖 おやつ", id="btn-treat", variant="success")
            yield MessageLog(id="message-log", markup=True, wrap=True, min_width=30)

        with Horizontal(id="bottom-panel"):
            with TabbedContent(id="tab-content"):
                with TabPane("📦 コレクション", id="tab-collection"):
                    yield Static(id="collection-view")
                with TabPane("🕐 時代一覧", id="tab-eras"):
                    yield Static(id="era-list")
                with TabPane("🏆 実績", id="tab-achievements"):
                    yield Static(id="achievement-view")

        yield Footer()

    def on_mount(self) -> None:
        self._log_message(f"🐱 {self.game.state.cat_name}が目を覚ました！")
        self._log_message(f"📍 現在地: {self.game.current_era.name}（{self.game.current_era.year_label}）")
        self._log_message("🍅 ポモドーロを始めて、時間旅行しよう！")
        self._update_tabs()
        self._decay_timer = self.set_interval(60.0, self._periodic_decay)

    def _log_message(self, msg: str):
        try:
            log = self.query_one("#message-log", MessageLog)
            log.write(msg)
        except NoMatches:
            pass

    def _refresh_displays(self):
        try:
            self.query_one("#cat-display", CatDisplay).refresh()
            self.query_one("#stats-display", StatsDisplay).refresh()
            self.query_one("#pomodoro-timer", PomodoroTimer).refresh()
        except NoMatches:
            pass

    def _update_tabs(self):
        self._update_collection()
        self._update_eras()
        self._update_achievements()

    def _update_collection(self):
        try:
            view = self.query_one("#collection-view", Static)
        except NoMatches:
            return

        items = self.game.get_all_items_with_status()
        stats = self.game.get_collection_stats()

        table = Table(title=f"コレクション（{stats['collected']}/{stats['total']} - {stats['percentage']}%）")
        table.add_column("アイテム", style="bold")
        table.add_column("時代")
        table.add_column("レア度")
        table.add_column("状態")
        table.add_column("説明")

        rarity_style = {"common": "white", "rare": "cyan", "legendary": "yellow bold"}
        rarity_label = {"common": "★", "rare": "★★", "legendary": "★★★"}

        for entry in items:
            item = entry["item"]
            era = entry["era"]
            collected = entry["collected"]
            if collected:
                name = f"{item.emoji} {item.name}"
                status = "[green]✓ 収集済み[/]"
                desc = item.description
            else:
                name = f"  ？？？"
                status = "[dim]未発見[/]"
                desc = "???"
            table.add_row(
                name,
                era.name,
                f"[{rarity_style[item.rarity]}]{rarity_label[item.rarity]}[/]",
                status,
                desc,
            )

        view.update(table)

    def _update_eras(self):
        try:
            view = self.query_one("#era-list", Static)
        except NoMatches:
            return

        table = Table(title="時代一覧")
        table.add_column("#", style="dim")
        table.add_column("時代", style="bold")
        table.add_column("年代")
        table.add_column("状態")
        table.add_column("アイテム")

        from .eras import ERA_ORDER, get_era_by_id
        for i, era_id in enumerate(ERA_ORDER, 1):
            era = get_era_by_id(self.game.eras, era_id)
            if era is None:
                continue
            visited = era_id in self.game.state.visited_eras
            is_current = era_id == self.game.state.current_era_id

            if is_current:
                status = f"[bold {era.color}]📍 現在地[/]"
            elif visited:
                status = "[green]✓ 訪問済み[/]"
            else:
                status = "[dim]🔒 未到達[/]"

            collected = sum(
                1 for item in era.items
                if item.id in self.game.state.collected_items
            )
            total = len(era.items)

            table.add_row(
                str(i),
                f"[{era.color}]{era.name}[/]",
                era.year_label,
                status,
                f"{collected}/{total}",
            )

        view.update(table)

    def _update_achievements(self):
        try:
            view = self.query_one("#achievement-view", Static)
        except NoMatches:
            return

        table = Table(title="実績")
        table.add_column("実績", style="bold")
        table.add_column("説明")
        table.add_column("状態")

        for ach in self.game.achievement_defs:
            unlocked = ach["id"] in self.game.state.unlocked_achievements
            if unlocked:
                status = "[green]🏆 解除済み[/]"
                name = f"[bold yellow]{ach['name']}[/]"
            else:
                status = "[dim]🔒 未解除[/]"
                name = f"[dim]{ach['name']}[/]"
            table.add_row(name, ach["description"], status)

        view.update(table)

    def on_button_pressed(self, event: Button.Pressed) -> None:
        btn_id = event.button.id
        if btn_id == "btn-start":
            self.action_start_pomodoro()
        elif btn_id == "btn-stop":
            self.action_stop_timer()
        elif btn_id == "btn-pet":
            self.action_pet_cat()
        elif btn_id == "btn-play":
            self.action_play_cat()
        elif btn_id == "btn-treat":
            self.action_treat_cat()

    def action_start_pomodoro(self):
        timer = self.query_one("#pomodoro-timer", PomodoroTimer)
        if timer.is_running:
            self._log_message("⚠️ タイマーは既に動いています")
            return
        timer.start_pomodoro()
        self._log_message("🍅 ポモドーロ開始！25分間集中しましょう")
        self._refresh_displays()

    def action_stop_timer(self):
        timer = self.query_one("#pomodoro-timer", PomodoroTimer)
        timer.reset_timer()
        self._log_message("⏹ タイマーを停止しました")
        self._refresh_displays()

    def action_pet_cat(self):
        msg = self.game.pet_cat()
        self._log_message(f"🐱 {msg}")
        self._refresh_displays()
        self._update_achievements()

    def action_play_cat(self):
        if self.game.state.stats.energy < 10:
            self._log_message("😴 猫が疲れています...おやつをあげて休ませましょう")
            return
        msg = self.game.play_with_cat()
        self._log_message(f"🎮 {msg}")
        self._refresh_displays()

    def action_treat_cat(self):
        msg = self.game.give_treat()
        self._log_message(f"🍖 {msg}")
        self._refresh_displays()

    def action_show_collection(self):
        self._update_collection()
        try:
            tabs = self.query_one("#tab-content", TabbedContent)
            tabs.active = "tab-collection"
        except NoMatches:
            pass

    def action_show_eras(self):
        self._update_eras()
        try:
            tabs = self.query_one("#tab-content", TabbedContent)
            tabs.active = "tab-eras"
        except NoMatches:
            pass

    def action_show_achievements(self):
        self._update_achievements()
        try:
            tabs = self.query_one("#tab-content", TabbedContent)
            tabs.active = "tab-achievements"
        except NoMatches:
            pass

    def action_quit(self):
        self.game.save()
        self._log_message("💤 猫が眠りにつきました...また会おうね")
        self.exit()

    def on_pomodoro_complete(self):
        """Handle the custom PomodoroComplete message via message_pump."""
        pass

    def _periodic_decay(self):
        self.game.decay_stats()
        self._refresh_displays()

    def check_message_queue(self):
        pass

    def watch_pomodoro_timer_remaining_seconds(self):
        pass


# Override the message handling to catch PomodoroComplete
_original_on_mount = TokinekoApp.on_mount


def _patched_on_mount(self):
    _original_on_mount(self)
    self._check_timer = self.set_interval(1.0, self._check_pomodoro_complete)


def _check_pomodoro_complete(self):
    try:
        timer = self.query_one("#pomodoro-timer", PomodoroTimer)
    except NoMatches:
        return
    if not timer.is_running and timer.remaining_seconds == 0 and not timer.is_break:
        timer.remaining_seconds = -1  # prevent re-trigger
        result = self.game.complete_pomodoro()

        self._log_message(f"🎉 ポモドーロ完了！（通算{result['pomodoro_count']}回目）")

        if result["item_found"]:
            item = result["item_found"]
            rarity_label = {"common": "", "rare": "【レア】", "legendary": "【伝説】"}
            self._log_message(
                f"✨ アイテム発見！{rarity_label[item.rarity]}"
                f"{item.emoji} {item.name} - {item.description}"
            )

        if result["time_traveled"] and result["new_era"]:
            new_era = result["new_era"]
            self._log_message(f"🌀 時空の扉が開いた！{new_era.name}（{new_era.year_label}）へ旅立った！")
            self.notify(
                f"🌀 {new_era.name}へタイムトラベル！",
                title="時猫",
            )

        for ach in result["achievements"]:
            self._log_message(f"🏆 実績解除！「{ach['name']}」- {ach['description']}")
            self.notify(f"🏆 {ach['name']}", title="実績解除！")

        self._refresh_displays()
        self._update_tabs()

        # Start break
        self._log_message("☕ 5分間の休憩です。猫と遊んであげましょう")
        timer.start_break()


TokinekoApp.on_mount = _patched_on_mount
TokinekoApp._check_pomodoro_complete = _check_pomodoro_complete


def main():
    app = TokinekoApp()
    app.run()


if __name__ == "__main__":
    main()
