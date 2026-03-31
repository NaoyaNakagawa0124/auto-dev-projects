#!/usr/bin/env python3
"""
世界クエスト (Sekaiquest) - ASCII World Map TUI Explorer
Navigate the world, discover destinations, collect passport stamps.
"""

from textual.app import App, ComposeResult
from textual.widgets import Static, Header, Footer, Label
from textual.containers import Horizontal, Vertical, Container
from textual.binding import Binding
from textual.screen import ModalScreen
from textual import events
from rich.text import Text
from rich.panel import Panel
from rich.table import Table
from rich import box
import json
import os

# ─── Destination Data ────────────────────────────────
DESTINATIONS = [
    {"name": "東京", "country": "日本", "x": 67, "y": 6, "emoji": "🗼",
     "fact": "世界最大の都市圏。渋谷のスクランブル交差点は1回で最大3000人が渡る！",
     "trend": "2026年の人気: アニメ聖地巡礼ブーム継続中", "region": "アジア"},
    {"name": "京都", "country": "日本", "x": 66, "y": 7, "emoji": "⛩️",
     "fact": "1000年以上の歴史を持つ古都。2000以上の寺社がある。",
     "trend": "竹林の道と伏見稲荷が海外で大バズり", "region": "アジア"},
    {"name": "ソウル", "country": "韓国", "x": 64, "y": 7, "emoji": "🇰🇷",
     "fact": "K-POPの聖地。明洞の1日の来訪者は100万人超。",
     "trend": "K-POPファンの聖地巡礼が急増中", "region": "アジア"},
    {"name": "バンコク", "country": "タイ", "x": 59, "y": 10, "emoji": "🛕",
     "fact": "世界で最も訪問者が多い都市の一つ。屋台文化が世界遺産級。",
     "trend": "デジタルノマドの楽園として再注目", "region": "アジア"},
    {"name": "シンガポール", "country": "シンガポール", "x": 60, "y": 12, "emoji": "🦁",
     "fact": "面積は東京23区とほぼ同じ。でも世界一きれいな都市国家。",
     "trend": "マリーナベイのライトショーがSNSで爆発的人気", "region": "アジア"},
    {"name": "パリ", "country": "フランス", "x": 33, "y": 5, "emoji": "🗼",
     "fact": "エッフェル塔は毎年700万人が訪れる。夜のライトアップは著作権で保護されている！",
     "trend": "2024パリ五輪後のレガシー施設巡りが人気", "region": "ヨーロッパ"},
    {"name": "ロンドン", "country": "イギリス", "x": 32, "y": 4, "emoji": "🇬🇧",
     "fact": "地下鉄は1863年開業の世界最古。300以上の言語が話されている。",
     "trend": "ハリー・ポッタースタジオツアーが予約3ヶ月待ち", "region": "ヨーロッパ"},
    {"name": "ローマ", "country": "イタリア", "x": 35, "y": 6, "emoji": "🏛️",
     "fact": "コロッセオは5万人収容。トレビの泉には毎日3000ユーロの硬貨が投げ込まれる。",
     "trend": "ジェラート食べ歩きツアーがTikTokで大流行", "region": "ヨーロッパ"},
    {"name": "バルセロナ", "country": "スペイン", "x": 32, "y": 6, "emoji": "🏗️",
     "fact": "サグラダ・ファミリアは1882年着工、2026年完成予定！140年越しの完成。",
     "trend": "ついにサグラダ・ファミリア完成間近で世界中から注目", "region": "ヨーロッパ"},
    {"name": "イスタンブール", "country": "トルコ", "x": 41, "y": 6, "emoji": "🕌",
     "fact": "ヨーロッパとアジアにまたがる唯一の都市。グランドバザールには4000以上の店。",
     "trend": "トルコリラ安で超コスパの旅先として10代に人気", "region": "中東"},
    {"name": "ドバイ", "country": "UAE", "x": 46, "y": 8, "emoji": "🏙️",
     "fact": "ブルジュ・ハリファは828m。50年前はまだ砂漠の小さな町だった。",
     "trend": "未来都市体験が若者に大人気。砂漠サファリも定番", "region": "中東"},
    {"name": "ニューヨーク", "country": "アメリカ", "x": 17, "y": 6, "emoji": "🗽",
     "fact": "800以上の言語が話される世界一多様な都市。ピザ1切れ$1は伝統。",
     "trend": "ブロードウェイと自由の女神が不動の人気", "region": "北米"},
    {"name": "ロサンゼルス", "country": "アメリカ", "x": 10, "y": 7, "emoji": "🎬",
     "fact": "ハリウッドサインは元々不動産の広告だった。年間晴天日は約284日。",
     "trend": "K-POPコンサート会場として10代に大人気", "region": "北米"},
    {"name": "メキシコシティ", "country": "メキシコ", "x": 12, "y": 10, "emoji": "🌮",
     "fact": "標高2240m。アステカ帝国の首都の上に建てられた。タコスは国民食。",
     "trend": "メキシカン料理ブームで美食旅行先として急上昇", "region": "中南米"},
    {"name": "リオデジャネイロ", "country": "ブラジル", "x": 22, "y": 14, "emoji": "🎭",
     "fact": "コルコバードのキリスト像は高さ30m。カーニバルは世界最大のお祭り。",
     "trend": "カーニバル体験とビーチカルチャーが若者に人気", "region": "中南米"},
    {"name": "カイロ", "country": "エジプト", "x": 40, "y": 8, "emoji": "🐪",
     "fact": "ギザのピラミッドは4500年前に建てられた。街からピザハットが見える。",
     "trend": "大エジプト博物館オープンで世界中から注目", "region": "アフリカ"},
    {"name": "ケープタウン", "country": "南アフリカ", "x": 38, "y": 17, "emoji": "🦁",
     "fact": "テーブルマウンテンは3億年前の岩。ペンギンが暮らすビーチがある。",
     "trend": "サファリ×都市体験のハイブリッド旅行が人気", "region": "アフリカ"},
    {"name": "シドニー", "country": "オーストラリア", "x": 72, "y": 17, "emoji": "🦘",
     "fact": "オペラハウスの屋根は100万枚以上のタイルで覆われている。",
     "trend": "グレートバリアリーフとセットで若者に人気", "region": "オセアニア"},
    {"name": "レイキャビク", "country": "アイスランド", "x": 27, "y": 2, "emoji": "🌋",
     "fact": "世界最北の首都。夏は白夜で24時間明るい。温泉大国。",
     "trend": "オーロラツアーとブルーラグーンがSNS映え旅の定番", "region": "ヨーロッパ"},
    {"name": "マラケシュ", "country": "モロッコ", "x": 31, "y": 8, "emoji": "🐫",
     "fact": "ジャマ・エル・フナ広場は毎晩お祭り状態。迷路のようなスーク（市場）が名物。",
     "trend": "モロッカンインテリアブームで聖地巡礼する10代増加", "region": "アフリカ"},
    {"name": "バリ", "country": "インドネシア", "x": 63, "y": 13, "emoji": "🌺",
     "fact": "「神々の島」と呼ばれる。1万以上のヒンドゥー教寺院がある。",
     "trend": "デジタルノマド＆ヨガリトリートの聖地", "region": "アジア"},
    {"name": "ハノイ", "country": "ベトナム", "x": 61, "y": 9, "emoji": "🍜",
     "fact": "フォーは朝食の定番。旧市街の36通りはそれぞれ異なる商品を売る。",
     "trend": "コスパ最強の旅行先として学生に大人気", "region": "アジア"},
    {"name": "リスボン", "country": "ポルトガル", "x": 30, "y": 6, "emoji": "🚋",
     "fact": "ヨーロッパ最古の都市の一つ。エッグタルト（パステル・デ・ナタ）発祥の地。",
     "trend": "ヨーロッパで最もコスパが良い首都として急上昇", "region": "ヨーロッパ"},
    {"name": "台北", "country": "台湾", "x": 63, "y": 8, "emoji": "🧋",
     "fact": "タピオカミルクティー発祥の地。夜市文化は世界一。",
     "trend": "夜市グルメ巡りと九份がアニメファンに人気", "region": "アジア"},
    {"name": "オスロ", "country": "ノルウェー", "x": 34, "y": 3, "emoji": "❄️",
     "fact": "フィヨルドに囲まれた美しい首都。冬は午後3時に日が沈む。",
     "trend": "北欧デザイン巡りとオーロラ体験が人気", "region": "ヨーロッパ"},
]

# ─── ASCII World Map ─────────────────────────────────
# Simplified world map (80x20 grid)
WORLD_MAP = [
    "                                                                                ",  # 0
    "          .                    ___                                               ",  # 1
    "         / \\    ___        .-'   '-.  o               ___                        ",  # 2
    "        /   \\  /   \\      /  EUROPE \\.  .___         /   \\                       ",  # 3
    "   ___./     \\/     \\    |          ||    __\\       /     \\                      ",  # 4
    "  / NORTH    .'      |   |          ||  .' __'.   |  ASIA  |                     ",  # 5
    " | AMERICA  /        |    \\        / |  |  |  |   |        |\\                    ",  # 6
    "  \\       .'   .'    /     '------'  |  |__|  |    \\      / |                    ",  # 7
    "   '-.  .'   .'     /    AFRICA      |       /      '----'  |                    ",  # 8
    "      ''   .'      /     /          /   .---'                |                    ",  # 9
    "          /       /     /     .----'   /                     |                    ",  # 10
    "         / CENTRAL     /     /        /                      |                    ",  # 11
    "        / AMERICA     /     /        /                .      |                    ",  # 12
    "       /             /      \\       /                  \\     |                    ",  # 13
    "      /   SOUTH     /        \\     /                    \\    |                    ",  # 14
    "     /   AMERICA   /          \\   /                      |   |                    ",  # 15
    "    /             /            \\ /                        |   |                    ",  # 16
    "   /             /              V        OCEANIA         /    |                    ",  # 17
    "  '-----.------.'                                 .----'     |                    ",  # 18
    "                                                                                ",  # 19
]

MAP_WIDTH = 80
MAP_HEIGHT = 20


class PassportScreen(ModalScreen):
    """パスポート表示画面"""

    BINDINGS = [Binding("escape", "dismiss", "閉じる")]

    def __init__(self, visited, destinations):
        super().__init__()
        self.visited = visited
        self.destinations = destinations

    def compose(self) -> ComposeResult:
        table = Table(title="🛂 パスポート — 訪問記録", box=box.ROUNDED,
                      border_style="cyan", title_style="bold cyan")
        table.add_column("#", style="dim", width=3)
        table.add_column("都市", style="bold")
        table.add_column("国", style="green")
        table.add_column("地域", style="yellow")
        table.add_column("スタンプ", justify="center")

        for i, dest in enumerate(self.destinations):
            stamp = "✅" if dest["name"] in self.visited else "⬜"
            table.add_row(str(i + 1), dest["name"], dest["country"], dest["region"], stamp)

        pct = len(self.visited) / len(self.destinations) * 100 if self.destinations else 0
        footer = f"\n📊 訪問率: {len(self.visited)}/{len(self.destinations)} ({pct:.0f}%)"

        yield Container(
            Static(Panel(table, subtitle=footer, border_style="cyan"), classes="passport-content"),
            id="passport-modal"
        )

    def on_key(self, event: events.Key):
        if event.key in ("escape", "tab", "q"):
            self.dismiss()


class SekaiQuestApp(App):
    """世界クエスト — ASCII世界地図エクスプローラー"""

    CSS = """
    Screen {
        background: #0a0a1a;
    }

    #main-container {
        height: 100%;
    }

    #map-panel {
        height: 22;
        border: round #2a4a6a;
        background: #0a1a2a;
        padding: 0 1;
    }

    #info-panel {
        height: 1fr;
        min-height: 8;
    }

    #dest-info {
        border: round #2a6a4a;
        background: #0a1a15;
        padding: 1 2;
        height: 100%;
    }

    #stats-bar {
        height: 3;
        border: round #4a4a2a;
        background: #1a1a0a;
        padding: 0 2;
    }

    .passport-content {
        width: 100%;
        height: auto;
    }

    #passport-modal {
        align: center middle;
        background: #0a0a2a;
        border: thick #3a3a8a;
        padding: 2;
        width: 70;
        max-height: 80%;
    }

    Header {
        background: #1a1a3a;
    }

    Footer {
        background: #1a1a3a;
    }
    """

    BINDINGS = [
        Binding("q", "quit", "終了"),
        Binding("tab", "passport", "パスポート"),
        Binding("r", "reset", "リセット"),
    ]

    TITLE = "世界クエスト"
    SUB_TITLE = "ASCII世界地図エクスプローラー"

    def __init__(self):
        super().__init__()
        self.cursor_x = 35  # Start in Europe area
        self.cursor_y = 6
        self.visited = set()
        self.selected_dest = None
        self.load_state()

    def compose(self) -> ComposeResult:
        yield Header()
        with Vertical(id="main-container"):
            yield Static(id="map-panel")
            with Horizontal(id="info-panel"):
                yield Static(id="dest-info")
            yield Static(id="stats-bar")
        yield Footer()

    def on_mount(self):
        self.update_display()

    def on_key(self, event: events.Key):
        dx, dy = 0, 0
        if event.key in ("up", "w"):
            dy = -1
        elif event.key in ("down", "s"):
            dy = 1
        elif event.key in ("left", "a"):
            dx = -1
        elif event.key in ("right", "d"):
            dx = 1
        elif event.key == "enter":
            self.visit_current()
            return
        elif event.key == "tab":
            self.action_passport()
            return
        else:
            return

        # Move cursor
        self.cursor_x = max(0, min(MAP_WIDTH - 1, self.cursor_x + dx))
        self.cursor_y = max(0, min(MAP_HEIGHT - 1, self.cursor_y + dy))

        # Check nearby destination
        self.selected_dest = self.find_nearby_dest()
        self.update_display()

    def find_nearby_dest(self):
        for dest in DESTINATIONS:
            if abs(dest["x"] - self.cursor_x) <= 1 and abs(dest["y"] - self.cursor_y) <= 1:
                return dest
        return None

    def visit_current(self):
        if self.selected_dest:
            self.visited.add(self.selected_dest["name"])
            self.save_state()
            self.update_display()

    def render_map(self) -> Text:
        text = Text()

        # Build map with destinations and cursor
        dest_positions = {}
        for d in DESTINATIONS:
            dest_positions[(d["x"], d["y"])] = d

        for y in range(MAP_HEIGHT):
            for x in range(MAP_WIDTH):
                is_cursor = (x == self.cursor_x and y == self.cursor_y)
                dest = dest_positions.get((x, y))

                if is_cursor:
                    text.append("█", style="bold bright_yellow")
                elif dest:
                    visited = dest["name"] in self.visited
                    if visited:
                        text.append("●", style="bold bright_green")
                    elif self.selected_dest and dest["name"] == self.selected_dest["name"]:
                        text.append("◉", style="bold bright_cyan blink")
                    else:
                        text.append("○", style="bright_red")
                elif y < len(WORLD_MAP) and x < len(WORLD_MAP[y]):
                    ch = WORLD_MAP[y][x]
                    if ch in ('/', '\\', '|', '-', '.', "'", '_', 'V'):
                        text.append(ch, style="dim cyan")
                    elif ch.isalpha():
                        text.append(ch, style="dim white")
                    else:
                        text.append(ch, style="dim blue")
                else:
                    text.append(" ")
            text.append("\n")

        return text

    def render_info(self) -> Text:
        if self.selected_dest:
            d = self.selected_dest
            visited = d["name"] in self.visited
            stamp = "✅ 訪問済み" if visited else "⬜ 未訪問 — Enterで訪問"

            text = Text()
            text.append(f"{d['emoji']} {d['name']}", style="bold bright_white")
            text.append(f" ({d['country']})\n", style="dim")
            text.append(f"🌍 {d['region']}\n", style="yellow")
            text.append(f"📌 {stamp}\n\n", style="green" if visited else "dim")
            text.append(f"💡 豆知識: ", style="bold cyan")
            text.append(f"{d['fact']}\n\n", style="white")
            text.append(f"🔥 トレンド: ", style="bold bright_magenta")
            text.append(f"{d['trend']}", style="white")
            return text
        else:
            text = Text()
            text.append("🗺️ 世界クエスト\n\n", style="bold cyan")
            text.append("矢印キーで地図を移動して、\n", style="dim")
            text.append("○ マークの都市に近づこう！\n\n", style="dim")
            text.append("● = 訪問済み  ", style="bright_green")
            text.append("○ = 未訪問  ", style="bright_red")
            text.append("█ = あなた", style="bright_yellow")
            return text

    def render_stats(self) -> Text:
        total = len(DESTINATIONS)
        visited = len(self.visited)
        pct = visited / total * 100 if total > 0 else 0

        # Progress bar
        bar_width = 20
        filled = int(bar_width * pct / 100)
        bar = "█" * filled + "░" * (bar_width - filled)

        text = Text()
        text.append(f"🛂 パスポート: {visited}/{total} ", style="bold")
        text.append(f"[{bar}] ", style="bright_cyan")
        text.append(f"{pct:.0f}%  ", style="bold bright_green" if pct > 50 else "yellow")

        # Regions visited
        regions = set()
        for d in DESTINATIONS:
            if d["name"] in self.visited:
                regions.add(d["region"])
        text.append(f"| 🌍 地域: {len(regions)}/6  ", style="dim")
        text.append(f"| 座標: ({self.cursor_x},{self.cursor_y})", style="dim")

        return text

    def update_display(self):
        self.query_one("#map-panel", Static).update(
            Panel(self.render_map(), title="🗺️ 世界地図", border_style="blue", subtitle="矢印キーで移動 • Enterで訪問")
        )
        self.query_one("#dest-info", Static).update(
            Panel(self.render_info(), title="📍 目的地情報", border_style="green")
        )
        self.query_one("#stats-bar", Static).update(self.render_stats())

    def action_passport(self):
        self.push_screen(PassportScreen(self.visited, DESTINATIONS))

    def action_reset(self):
        self.visited.clear()
        self.save_state()
        self.update_display()

    def save_state(self):
        state = {"visited": list(self.visited)}
        try:
            path = os.path.join(os.path.dirname(__file__) or ".", ".sekaiquest_save.json")
            with open(path, "w", encoding="utf-8") as f:
                json.dump(state, f, ensure_ascii=False)
        except Exception:
            pass

    def load_state(self):
        try:
            path = os.path.join(os.path.dirname(__file__) or ".", ".sekaiquest_save.json")
            with open(path, "r", encoding="utf-8") as f:
                state = json.load(f)
                self.visited = set(state.get("visited", []))
        except Exception:
            self.visited = set()


if __name__ == "__main__":
    app = SekaiQuestApp()
    app.run()
