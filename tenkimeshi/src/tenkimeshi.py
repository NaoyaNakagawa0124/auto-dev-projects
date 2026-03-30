#!/usr/bin/env python3
"""テンキメシ — 天気で決める今日のごはん

Raspberry Pi IoT デバイス用のメインエントリーポイント。
天気情報を取得し、食べ物を推薦し、レストランのフロアプランを表示する。
"""

import sys
import time

from weather import fetch_weather, get_weather_description
from recommender import recommend
from floorplan import generate_floorplan
from display import render_display
from config import DEFAULT_CONFIG, DEMO_WEATHER


def run_once(config: dict, demo: bool = False) -> str:
    """1回分の表示を生成して返す。"""
    if demo:
        weather = DEMO_WEATHER.copy()
    else:
        weather = fetch_weather(config["latitude"], config["longitude"])

    food = recommend(
        weather["temp"],
        weather["weather_code"],
        weather["wind_speed"],
        weather["humidity"],
    )
    weather_desc = get_weather_description(weather["weather_code"])
    floor_plan = generate_floorplan(food["name"], config["display_width"])

    return render_display(
        city=config["city_name"],
        weather=weather,
        weather_desc=weather_desc,
        food=food,
        floor_plan=floor_plan,
        width=config["display_width"],
    )


def main():
    """メインループ。"""
    config = DEFAULT_CONFIG.copy()
    demo = "--demo" in sys.argv

    if demo:
        print("\033[33m[デモモード] ネットワーク不要のモック天気データを使用\033[0m\n")

    print("\033[2J\033[H")  # 画面クリア

    while True:
        try:
            output = run_once(config, demo=demo)
            print("\033[H")  # カーソルを先頭に移動
            print(output)

            if "--once" in sys.argv:
                break

            time.sleep(config["refresh_interval"])
        except KeyboardInterrupt:
            print("\n👋 また明日！いいごはんを！")
            break
        except Exception as e:
            print(f"\033[31mエラー: {e}\033[0m")
            if "--once" in sys.argv:
                break
            time.sleep(60)


if __name__ == "__main__":
    main()
