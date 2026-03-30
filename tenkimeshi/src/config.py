"""テンキメシ — 設定モジュール"""

DEFAULT_CONFIG = {
    "latitude": 35.6762,
    "longitude": 139.6503,
    "city_name": "東京",
    "refresh_interval": 1800,  # 30分
    "display_width": 44,
}

# デモ用モック天気データ
DEMO_WEATHER = {
    "temp": 18.5,
    "weather_code": 61,
    "wind_speed": 12.3,
    "humidity": 72,
}
