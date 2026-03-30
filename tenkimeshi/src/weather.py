"""テンキメシ — 天気取得モジュール (OpenMeteo API)"""

import urllib.request
import json

WEATHER_DESCRIPTIONS = {
    0: "快晴 ☀️",
    1: "晴れ 🌤️",
    2: "くもり ⛅",
    3: "曇天 ☁️",
    45: "霧 🌫️",
    48: "霧氷 🌫️",
    51: "小雨 🌦️",
    53: "雨 🌧️",
    55: "大雨 🌧️",
    61: "小雨 🌦️",
    63: "雨 🌧️",
    65: "大雨 🌧️",
    67: "凍雨 🌧️",
    71: "小雪 🌨️",
    73: "雪 ❄️",
    75: "大雪 ❄️",
    77: "霧雪 ❄️",
    80: "にわか雨 🌦️",
    81: "にわか雨 🌧️",
    82: "土砂降り 🌧️",
    85: "にわか雪 🌨️",
    86: "にわか大雪 ❄️",
    95: "雷雨 ⛈️",
    96: "雷雨+雹 ⛈️",
    99: "雷雨+大雹 ⛈️",
}


def get_weather_description(weather_code: int) -> str:
    """天気コードから日本語の天気説明を返す。"""
    return WEATHER_DESCRIPTIONS.get(weather_code, f"不明 ({weather_code})")


def fetch_weather(lat: float = 35.6762, lon: float = 139.6503) -> dict:
    """OpenMeteo APIから現在の天気を取得する。"""
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m"
        f"&timezone=Asia/Tokyo"
    )
    response = urllib.request.urlopen(url, timeout=10)
    data = json.loads(response.read().decode("utf-8"))
    current = data["current"]
    return {
        "temp": current["temperature_2m"],
        "weather_code": current["weather_code"],
        "wind_speed": current["wind_speed_10m"],
        "humidity": current["relative_humidity_2m"],
    }


def parse_weather_response(data: dict) -> dict:
    """APIレスポンスのJSONをパースして天気情報を返す。"""
    current = data["current"]
    return {
        "temp": current["temperature_2m"],
        "weather_code": current["weather_code"],
        "wind_speed": current["wind_speed_10m"],
        "humidity": current["relative_humidity_2m"],
    }
