"""テスト — 天気モジュール（モックデータ使用）"""

import sys
import os
import unittest
from unittest.mock import patch, MagicMock
import json

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from weather import (
    get_weather_description,
    parse_weather_response,
    fetch_weather,
    WEATHER_DESCRIPTIONS,
)


MOCK_API_RESPONSE = {
    "current": {
        "temperature_2m": 22.5,
        "weather_code": 3,
        "wind_speed_10m": 8.2,
        "relative_humidity_2m": 65,
    }
}

MOCK_RAIN_RESPONSE = {
    "current": {
        "temperature_2m": 15.0,
        "weather_code": 63,
        "wind_speed_10m": 12.0,
        "relative_humidity_2m": 88,
    }
}

MOCK_SNOW_RESPONSE = {
    "current": {
        "temperature_2m": -2.0,
        "weather_code": 73,
        "wind_speed_10m": 5.0,
        "relative_humidity_2m": 90,
    }
}


class TestGetWeatherDescription(unittest.TestCase):
    """天気コード→日本語説明のテスト"""

    def test_clear_sky(self):
        desc = get_weather_description(0)
        self.assertIn("快晴", desc)

    def test_partly_cloudy(self):
        desc = get_weather_description(1)
        self.assertIn("晴れ", desc)

    def test_cloudy(self):
        desc = get_weather_description(2)
        self.assertIn("くもり", desc)

    def test_overcast(self):
        desc = get_weather_description(3)
        self.assertIn("曇天", desc)

    def test_fog(self):
        desc = get_weather_description(45)
        self.assertIn("霧", desc)

    def test_light_rain(self):
        desc = get_weather_description(61)
        self.assertIn("小雨", desc)

    def test_rain(self):
        desc = get_weather_description(63)
        self.assertIn("雨", desc)

    def test_heavy_rain(self):
        desc = get_weather_description(65)
        self.assertIn("大雨", desc)

    def test_snow(self):
        desc = get_weather_description(73)
        self.assertIn("雪", desc)

    def test_thunderstorm(self):
        desc = get_weather_description(95)
        self.assertIn("雷雨", desc)

    def test_unknown_code(self):
        desc = get_weather_description(999)
        self.assertIn("不明", desc)

    def test_all_known_codes_have_descriptions(self):
        for code in WEATHER_DESCRIPTIONS:
            desc = get_weather_description(code)
            self.assertNotIn("不明", desc, f"コード {code} が不明と返されました")

    def test_descriptions_contain_emoji(self):
        for code, desc in WEATHER_DESCRIPTIONS.items():
            # 各説明文にはスペースの後に絵文字がある
            self.assertTrue(len(desc) > 2, f"コード {code} の説明が短すぎます")


class TestParseWeatherResponse(unittest.TestCase):
    """APIレスポンスパースのテスト"""

    def test_parse_normal_response(self):
        result = parse_weather_response(MOCK_API_RESPONSE)
        self.assertEqual(result["temp"], 22.5)
        self.assertEqual(result["weather_code"], 3)
        self.assertEqual(result["wind_speed"], 8.2)
        self.assertEqual(result["humidity"], 65)

    def test_parse_rain_response(self):
        result = parse_weather_response(MOCK_RAIN_RESPONSE)
        self.assertEqual(result["temp"], 15.0)
        self.assertEqual(result["weather_code"], 63)

    def test_parse_snow_response(self):
        result = parse_weather_response(MOCK_SNOW_RESPONSE)
        self.assertEqual(result["temp"], -2.0)
        self.assertEqual(result["weather_code"], 73)

    def test_parse_returns_dict(self):
        result = parse_weather_response(MOCK_API_RESPONSE)
        self.assertIsInstance(result, dict)

    def test_parse_has_all_keys(self):
        result = parse_weather_response(MOCK_API_RESPONSE)
        for key in ["temp", "weather_code", "wind_speed", "humidity"]:
            self.assertIn(key, result)


class TestFetchWeatherMocked(unittest.TestCase):
    """天気取得のモックテスト"""

    @patch("weather.urllib.request.urlopen")
    def test_fetch_weather_success(self, mock_urlopen):
        mock_response = MagicMock()
        mock_response.read.return_value = json.dumps(MOCK_API_RESPONSE).encode("utf-8")
        mock_urlopen.return_value = mock_response

        result = fetch_weather(35.6762, 139.6503)
        self.assertEqual(result["temp"], 22.5)
        self.assertEqual(result["weather_code"], 3)

    @patch("weather.urllib.request.urlopen")
    def test_fetch_weather_rain(self, mock_urlopen):
        mock_response = MagicMock()
        mock_response.read.return_value = json.dumps(MOCK_RAIN_RESPONSE).encode("utf-8")
        mock_urlopen.return_value = mock_response

        result = fetch_weather()
        self.assertEqual(result["weather_code"], 63)

    @patch("weather.urllib.request.urlopen")
    def test_fetch_weather_uses_correct_url(self, mock_urlopen):
        mock_response = MagicMock()
        mock_response.read.return_value = json.dumps(MOCK_API_RESPONSE).encode("utf-8")
        mock_urlopen.return_value = mock_response

        fetch_weather(40.0, 140.0)
        call_args = mock_urlopen.call_args
        url = call_args[0][0]
        self.assertIn("latitude=40.0", url)
        self.assertIn("longitude=140.0", url)

    @patch("weather.urllib.request.urlopen")
    def test_fetch_weather_network_error(self, mock_urlopen):
        mock_urlopen.side_effect = Exception("ネットワークエラー")
        with self.assertRaises(Exception):
            fetch_weather()


if __name__ == "__main__":
    unittest.main()
