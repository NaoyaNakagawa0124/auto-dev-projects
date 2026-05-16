"""Textual TUI for ごちそう暦."""

from __future__ import annotations

from datetime import date, timedelta

from rich.markup import escape
from rich.panel import Panel
from rich.table import Table
from rich.text import Text
from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Horizontal, Vertical
from textual.reactive import reactive
from textual.screen import Screen
from textual.widgets import Footer, Header, Input, Static, RichLog

from .calendar import month_summary, todays_pick
from .holidays import HOLIDAYS, Holiday, by_id, DIFFICULTY_LABEL
from .state import MealEntry, Store


def fmt_date_jp(d: date) -> str:
    return d.strftime("%Y年 %m月 %d日")


def holiday_card(h: Holiday, offset: int) -> Panel:
    title = Text()
    title.append(f"{h.country_flag} ", style="bold")
    title.append(h.country_jp, style="bold yellow")
    title.append("  /  ")
    title.append(h.holiday_jp, style="bold")
    if offset != 0:
        title.append(f"  ({offset:+d} 日)", style="dim")

    inner = Text()
    inner.append("おすすめ料理\n", style="bold dim")
    inner.append(f"  {h.dish_jp}", style="bold")
    inner.append(f"  / {h.dish_native}\n", style="italic dim")
    inner.append("\n")
    inner.append("入手難度  ", style="bold dim")
    inner.append(DIFFICULTY_LABEL[h.where] + "\n\n", style="cyan")
    inner.append("由来 ", style="bold dim")
    inner.append(h.blurb, style="white")

    return Panel(inner, title=title, border_style="orange3", padding=(1, 2))


class TodayScreen(Screen):
    BINDINGS = [
        Binding("ctrl+c", "go_calendar", "暦", priority=True),
        Binding("c", "go_calendar", "暦"),
        Binding("ctrl+s", "go_stats", "統計", priority=True),
        Binding("s", "go_stats", "統計"),
        Binding("o", "ate_suggested", "提案を食べた"),
        Binding("x", "ate_other", "別の物を食べた"),
        Binding("ctrl+1", "rate_1", "1★", priority=True, show=False),
        Binding("ctrl+2", "rate_2", "2★", priority=True, show=False),
        Binding("ctrl+3", "rate_3", "3★", priority=True, show=False),
        Binding("ctrl+4", "rate_4", "4★", priority=True, show=False),
        Binding("ctrl+5", "rate_5", "5★", priority=True, show=False),
        Binding("1", "rate_1", "1★", show=False),
        Binding("2", "rate_2", "2★", show=False),
        Binding("3", "rate_3", "3★", show=False),
        Binding("4", "rate_4", "4★", show=False),
        Binding("5", "rate_5", "5★", show=False),
        Binding("q", "quit", "終了", priority=True),
    ]

    def __init__(self, app_store: Store, today_d: date) -> None:
        super().__init__()
        self.store = app_store
        self.today = today_d
        recent = app_store.recent_holiday_ids(today_d)
        self.holiday, self.day_offset = todays_pick(today_d, recent_ids=recent)

    def compose(self) -> ComposeResult:
        yield Header(show_clock=True)
        with Vertical(id="today-main"):
            yield Static(id="today-header")
            yield Static(id="today-card")
            with Horizontal(id="log-row"):
                yield Input(placeholder="食べた料理を一言で…", id="log-dish")
                yield Static(id="today-help")
            yield Static(id="today-status")
        yield Footer()

    def on_mount(self) -> None:
        self.query_one("#today-header", Static).update(self._render_header())
        self.query_one("#today-card", Static).update(self._render_card())
        self.query_one("#today-help", Static).update(self._render_help())
        self.query_one("#today-status", Static).update(self._render_status())

    def _render_header(self) -> Panel:
        today_jp = fmt_date_jp(self.today)
        entry = self.store.find_for_date(self.today.isoformat())
        countries = len(self.store.countries_this_year(self.today.year))
        streak = self.store.streak_ending(self.today)
        body = Text()
        body.append(today_jp, style="bold yellow")
        body.append(f"   踏破国 {countries}  /  連続記録 {streak} 日", style="dim")
        if entry:
            body.append("\n本日 ", style="dim")
            body.append("記録済", style="bold green")
            body.append(f"  「{escape(entry.dish)}」  ", style="dim")
            body.append("★" * entry.rating + "☆" * (5 - entry.rating), style="yellow")
        return Panel(body, border_style="dim")

    def _render_card(self) -> Panel:
        if not self.holiday:
            return Panel("今日のおすすめが見つかりませんでした。", border_style="red")
        return holiday_card(self.holiday, self.day_offset)

    def _render_help(self) -> Panel:
        body = Text()
        body.append("O ", style="bold green")
        body.append("提案を食べた\n", style="dim")
        body.append("X ", style="bold red")
        body.append("別の物を食べた\n", style="dim")
        body.append("1〜5 ", style="bold yellow")
        body.append("評価して記録", style="dim")
        return Panel(body, border_style="dim", title="操作")

    def _render_status(self) -> Panel:
        body = Text()
        body.append("ヒント: ", style="dim")
        body.append("料理名を入力 → ", style="white")
        body.append("1〜5 で評価", style="bold yellow")
        body.append("。料理名を空のままにすると提案料理が自動で入ります。", style="dim")
        return Panel(body, border_style="dim")

    # ============ actions ============

    def _record(self, ate_suggested: bool, rating: int) -> None:
        dish_input = self.query_one("#log-dish", Input).value.strip()
        if not dish_input and self.holiday:
            dish_input = self.holiday.dish_jp
        if not dish_input:
            self._flash("料理名を入力してください")
            return
        entry = MealEntry(
            date=self.today.isoformat(),
            holiday_id=self.holiday.id if self.holiday else None,
            ate_suggested=ate_suggested,
            dish=dish_input,
            rating=rating,
            note="",
        )
        self.store.log(entry)
        self.store.save()
        self._flash(f"記録しました — {entry.dish}  ({'★' * rating})")
        self.query_one("#today-header", Static).update(self._render_header())

    def _flash(self, msg: str) -> None:
        body = Text(msg, style="bold green")
        self.query_one("#today-status", Static).update(Panel(body, border_style="green"))

    def action_ate_suggested(self) -> None:
        if not self.holiday:
            self._flash("提案がない日は対象外です")
            return
        self.query_one("#log-dish", Input).value = self.holiday.dish_jp

    def action_ate_other(self) -> None:
        self.query_one("#log-dish", Input).value = ""
        self.query_one("#log-dish", Input).focus()

    def action_rate_1(self) -> None: self._record(True, 1)
    def action_rate_2(self) -> None: self._record(True, 2)
    def action_rate_3(self) -> None: self._record(True, 3)
    def action_rate_4(self) -> None: self._record(True, 4)
    def action_rate_5(self) -> None: self._record(True, 5)

    def action_go_calendar(self) -> None:
        self.app.push_screen(CalendarScreen(self.store, self.today))

    def action_go_stats(self) -> None:
        self.app.push_screen(StatsScreen(self.store, self.today))

    def action_quit(self) -> None:
        self.app.exit()


class CalendarScreen(Screen):
    BINDINGS = [
        Binding("escape,b", "back", "戻る"),
        Binding("left,h", "prev_month", "前月"),
        Binding("right,l", "next_month", "翌月"),
        Binding("q", "quit", "終了"),
    ]

    def __init__(self, app_store: Store, today_d: date) -> None:
        super().__init__()
        self.store = app_store
        self.today = today_d
        self.cursor_month = (today_d.year, today_d.month)

    def _refresh_body(self) -> None:
        try:
            self.query_one("#cal-body", Static).update(self._build_panel())
        except Exception:
            pass

    def compose(self) -> ComposeResult:
        yield Header()
        yield Static(id="cal-body")
        yield Footer()

    def on_mount(self) -> None:
        self.query_one("#cal-body", Static).update(self._build_panel())

    def _build_panel(self) -> Panel:
        year, month = self.cursor_month
        days = month_summary(year, month)

        table = Table(show_header=True, expand=True, padding=(0, 1))
        table.add_column("日付", style="dim", width=6)
        table.add_column("国", width=10)
        table.add_column("行事", width=24)
        table.add_column("おすすめ料理", width=24)
        table.add_column("記録")

        for i, holidays in enumerate(days, start=1):
            dstr = f"{month:02d}/{i:02d}"
            iso = f"{year}-{month:02d}-{i:02d}"
            entry = self.store.find_for_date(iso)
            rating_str = ("★" * entry.rating + "☆" * (5 - entry.rating)) if entry else ""
            if holidays:
                h = holidays[0]
                table.add_row(
                    dstr,
                    f"{h.country_flag} {h.country_jp}",
                    h.holiday_jp,
                    h.dish_jp,
                    rating_str or "",
                )
            else:
                table.add_row(dstr, "—", "", "", rating_str)
        title = Text(f"{year}年 {month}月", style="bold yellow")
        return Panel(table, title=title, border_style="orange3", padding=(0, 1))

    def action_prev_month(self) -> None:
        y, m = self.cursor_month
        m -= 1
        if m < 1:
            y -= 1
            m = 12
        self.cursor_month = (y, m)
        self._refresh_body()

    def action_next_month(self) -> None:
        y, m = self.cursor_month
        m += 1
        if m > 12:
            y += 1
            m = 1
        self.cursor_month = (y, m)
        self._refresh_body()

    def action_back(self) -> None:
        self.app.pop_screen()

    def action_quit(self) -> None:
        self.app.exit()


class StatsScreen(Screen):
    BINDINGS = [
        Binding("escape,b", "back", "戻る"),
        Binding("q", "quit", "終了"),
    ]

    def __init__(self, app_store: Store, today_d: date) -> None:
        super().__init__()
        self.store = app_store
        self.today = today_d

    def compose(self) -> ComposeResult:
        yield Header()
        yield Static(id="stats-body")
        yield Footer()

    def on_mount(self) -> None:
        self.query_one("#stats-body", Static).update(self._build_panel())

    def _build_panel(self) -> Panel:
        year = self.today.year
        countries = self.store.countries_this_year(year)
        streak = self.store.streak_ending(self.today)
        total = self.store.total_logged()
        avg = self.store.average_rating()
        top = self.store.top_countries(year, k=8)

        table = Table(show_header=False, expand=True, padding=(0, 2))
        table.add_column(style="dim", width=18)
        table.add_column(style="bold")
        table.add_row("今年の踏破国", f"{len(countries)} / {len(set(h.country_jp for h in HOLIDAYS))}")
        table.add_row("総記録数", str(total))
        table.add_row("平均★", f"{avg:.2f}")
        table.add_row("連続記録", f"{streak} 日")

        rank = Table(show_header=True, expand=True, padding=(0, 2))
        rank.add_column("# ", style="dim", width=3)
        rank.add_column("国", style="yellow")
        rank.add_column("記録数", justify="right")
        for i, (c, n) in enumerate(top, start=1):
            rank.add_row(str(i), c, str(n))
        if not top:
            rank.add_row("—", "まだ記録がありません", "")

        body = Table.grid(expand=True)
        body.add_column(ratio=1)
        body.add_column(ratio=1)
        body.add_row(
            Panel(table, title="今年の総括", border_style="orange3"),
            Panel(rank, title="国別ランキング", border_style="orange3"),
        )
        return Panel(body, title=f"{year} 年の食卓統計", border_style="dim", padding=(1, 2))

    def action_back(self) -> None:
        self.app.pop_screen()

    def action_quit(self) -> None:
        self.app.exit()


class GochisouGoyomiApp(App):
    CSS = """
    Screen { background: #1c1b1a; }
    Header { background: #c8804a; color: #1c1b1a; }
    Footer { background: #2a2722; color: #f1ead2; }
    #today-main { padding: 1 2; }
    #today-card { margin-bottom: 1; }
    #log-row { height: 7; margin-top: 1; }
    Input { background: #2a2722; color: #f1ead2; border: round #c8804a; height: 5; }
    """

    TITLE = "ごちそう暦"
    SUB_TITLE = "毎日の食卓を、世界の祝祭で旅する"

    def __init__(self) -> None:
        super().__init__()
        self.store = Store.load()
        self.today_d = date.today()

    def on_mount(self) -> None:
        self.push_screen(TodayScreen(self.store, self.today_d))


def run() -> None:
    GochisouGoyomiApp().run()
