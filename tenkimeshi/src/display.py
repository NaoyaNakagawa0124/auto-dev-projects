"""テンキメシ — ターミナル表示フォーマッター"""

import datetime


RESET = "\033[0m"
BOLD = "\033[1m"
DIM = "\033[2m"
CYAN = "\033[36m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
WHITE = "\033[37m"
MAGENTA = "\033[35m"


def _pad_line(text: str, width: int) -> str:
    """行をボックス幅に合わせてパディングする（可視文字幅ベース）。"""
    # ANSIエスケープシーケンスを除いた表示幅を計算
    import re
    visible = re.sub(r'\033\[[0-9;]*m', '', text)
    # 全角文字を考慮した表示幅計算
    vis_len = 0
    for ch in visible:
        if ord(ch) > 0x7F:
            vis_len += 2
        else:
            vis_len += 1
    padding = max(0, width - 2 - vis_len)
    return f"║  {text}{' ' * padding}║"


def render_display(city: str, weather: dict, weather_desc: str,
                   food: dict, floor_plan: str, width: int = 44) -> str:
    """テンキメシのメイン表示を生成する。

    Args:
        city: 都市名
        weather: 天気データ辞書
        weather_desc: 天気の日本語説明
        food: 食べ物カテゴリ辞書
        floor_plan: ASCIIフロアプラン
        width: 表示幅

    Returns:
        ANSI色付きの表示文字列
    """
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    inner = width - 2

    lines = []

    # ヘッダー
    lines.append(f"{CYAN}╔{'═' * inner}╗{RESET}")
    lines.append(f"{CYAN}║{BOLD}{WHITE}       🌤️  テンキメシ  🍽️               {RESET}{CYAN}║{RESET}")
    lines.append(f"{CYAN}║{DIM}{WHITE}       天気で決める今日のごはん           {RESET}{CYAN}║{RESET}")
    lines.append(f"{CYAN}╠{'═' * inner}╣{RESET}")

    # 空行
    lines.append(f"{CYAN}║{' ' * inner}║{RESET}")

    # 位置情報と日時
    lines.append(f"{CYAN}║  {GREEN}📍 {city} | {now}              {RESET}{CYAN}║{RESET}")
    lines.append(f"{CYAN}║{' ' * inner}║{RESET}")

    # 天気情報
    lines.append(f"{CYAN}║  {YELLOW}🌡️ 気温: {weather['temp']}°C                     {RESET}{CYAN}║{RESET}")
    lines.append(f"{CYAN}║  {YELLOW}🌧️ 天気: {weather_desc}               {RESET}{CYAN}║{RESET}")
    lines.append(f"{CYAN}║  {YELLOW}💨 風速: {weather['wind_speed']} km/h                {RESET}{CYAN}║{RESET}")
    lines.append(f"{CYAN}║  {YELLOW}💧 湿度: {weather['humidity']}%                     {RESET}{CYAN}║{RESET}")
    lines.append(f"{CYAN}║{' ' * inner}║{RESET}")

    # 区切り
    lines.append(f"{CYAN}╠{'═' * inner}╣{RESET}")
    lines.append(f"{CYAN}║{' ' * inner}║{RESET}")

    # おすすめ
    food_color = food.get("color", "")
    lines.append(f"{CYAN}║  {food_color}{BOLD}{food['emoji']} 今日のおすすめ: {food['name']}            {RESET}{CYAN}║{RESET}")
    lines.append(f"{CYAN}║{' ' * inner}║{RESET}")
    lines.append(f"{CYAN}║  {WHITE}{food['description']}       {RESET}{CYAN}║{RESET}")
    lines.append(f"{CYAN}║{' ' * inner}║{RESET}")

    # おすすめメニュー（最大3つ）
    lines.append(f"{CYAN}║  {MAGENTA}おすすめメニュー:                       {RESET}{CYAN}║{RESET}")
    for item in food["examples"][:3]:
        lines.append(f"{CYAN}║   {WHITE}● {item}                               {RESET}{CYAN}║{RESET}")
    lines.append(f"{CYAN}║{' ' * inner}║{RESET}")

    # フロアプラン区切り
    lines.append(f"{CYAN}╠{'═' * inner}╣{RESET}")
    lines.append(f"{CYAN}║  {GREEN}理想のお店レイアウト:                   {RESET}{CYAN}║{RESET}")
    lines.append(f"{CYAN}║{' ' * inner}║{RESET}")

    # フロアプラン
    for fp_line in floor_plan.split("\n"):
        lines.append(f"{CYAN}║{DIM}  {fp_line}{RESET}{CYAN}║{RESET}")

    lines.append(f"{CYAN}║{' ' * inner}║{RESET}")

    # フッター
    lines.append(f"{CYAN}╠{'═' * inner}╣{RESET}")
    lines.append(f"{CYAN}║  {DIM}次の更新: 30分後 | Ctrl+C で終了       {RESET}{CYAN}║{RESET}")
    lines.append(f"{CYAN}╚{'═' * inner}╝{RESET}")

    return "\n".join(lines)


def render_compact(city: str, weather: dict, weather_desc: str,
                   food: dict) -> str:
    """コンパクト表示（フロアプランなし）。"""
    now = datetime.datetime.now().strftime("%H:%M")
    return (
        f"{BOLD}{food['emoji']} テンキメシ — {city} {now}{RESET}\n"
        f"  🌡️ {weather['temp']}°C | {weather_desc}\n"
        f"  💨 {weather['wind_speed']} km/h | 💧 {weather['humidity']}%\n"
        f"  → {food['color']}{BOLD}{food['name']}{RESET}: {food['description']}\n"
        f"  メニュー: {', '.join(food['examples'][:3])}"
    )
