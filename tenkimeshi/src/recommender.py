"""テンキメシ — 天気→食べ物レコメンドエンジン"""

FOOD_CATEGORIES = {
    "cold_noodle": {
        "name": "冷たい麺",
        "emoji": "🍜",
        "examples": ["冷やし中華", "ざるそば", "冷やしうどん", "そうめん", "冷麺"],
        "description": "暑い日は冷たい麺でさっぱり！",
        "color": "\033[36m",
    },
    "hot_nabe": {
        "name": "鍋物",
        "emoji": "🍲",
        "examples": ["しゃぶしゃぶ", "すき焼き", "もつ鍋", "キムチ鍋", "水炊き"],
        "description": "寒い日はみんなで鍋を囲もう！",
        "color": "\033[31m",
    },
    "ramen": {
        "name": "ラーメン",
        "emoji": "🍜",
        "examples": ["味噌ラーメン", "豚骨ラーメン", "醤油ラーメン", "塩ラーメン", "つけ麺"],
        "description": "雨の日はラーメンで温まろう！",
        "color": "\033[33m",
    },
    "curry": {
        "name": "カレー",
        "emoji": "🍛",
        "examples": ["バターチキン", "スパイスカレー", "カツカレー", "グリーンカレー", "欧風カレー"],
        "description": "じめじめした日にはスパイシーなカレー！",
        "color": "\033[33;1m",
    },
    "bbq": {
        "name": "焼肉・BBQ",
        "emoji": "🥩",
        "examples": ["焼肉", "ホルモン", "BBQ", "ジンギスカン", "サムギョプサル"],
        "description": "晴れた日は外で焼肉！気分も上がる！",
        "color": "\033[31;1m",
    },
    "sushi": {
        "name": "寿司・海鮮",
        "emoji": "🍣",
        "examples": ["回転寿司", "海鮮丼", "刺身定食", "ちらし寿司", "手巻き寿司"],
        "description": "穏やかな日は新鮮な魚を楽しもう！",
        "color": "\033[34m",
    },
    "cafe": {
        "name": "カフェ・軽食",
        "emoji": "☕",
        "examples": ["パンケーキ", "サンドイッチ", "パスタ", "スープセット", "ケーキ"],
        "description": "のんびりした天気にはカフェでまったり。",
        "color": "\033[35m",
    },
    "izakaya": {
        "name": "居酒屋",
        "emoji": "🍺",
        "examples": ["焼き鳥", "おでん", "唐揚げ", "枝豆", "刺身盛り合わせ"],
        "description": "風が強い日は居酒屋で一杯！",
        "color": "\033[32m",
    },
    "chinese": {
        "name": "中華料理",
        "emoji": "🥟",
        "examples": ["餃子", "チャーハン", "麻婆豆腐", "酢豚", "エビチリ"],
        "description": "曇りの日にはパワフルな中華！",
        "color": "\033[31m",
    },
    "yoshoku": {
        "name": "洋食",
        "emoji": "🍽️",
        "examples": ["ハンバーグ", "オムライス", "ナポリタン", "クリームシチュー", "エビフライ"],
        "description": "肌寒い日は懐かしの洋食で心もお腹も満たそう。",
        "color": "\033[33m",
    },
}

REQUIRED_FIELDS = ["name", "emoji", "examples", "description", "color"]


def recommend(temp_c: float, weather_code: int, wind_speed: float, humidity: float) -> dict:
    """天気情報から食べ物カテゴリを推薦する。"""
    if temp_c >= 30:
        return FOOD_CATEGORIES["cold_noodle"]
    elif temp_c <= 5:
        return FOOD_CATEGORIES["hot_nabe"]
    elif weather_code >= 61:
        return FOOD_CATEGORIES["ramen"]
    elif weather_code >= 45 and humidity > 80:
        return FOOD_CATEGORIES["curry"]
    elif weather_code == 0 and temp_c >= 20:
        return FOOD_CATEGORIES["bbq"]
    elif weather_code == 0 and temp_c >= 10:
        return FOOD_CATEGORIES["sushi"]
    elif weather_code <= 3 and wind_speed > 20:
        return FOOD_CATEGORIES["izakaya"]
    elif weather_code >= 2 and weather_code <= 3:
        return FOOD_CATEGORIES["chinese"]
    elif temp_c < 15:
        return FOOD_CATEGORIES["yoshoku"]
    else:
        return FOOD_CATEGORIES["cafe"]


def get_all_categories() -> dict:
    """全カテゴリを返す。"""
    return FOOD_CATEGORIES


def get_category_by_key(key: str) -> dict:
    """キーからカテゴリを取得する。"""
    return FOOD_CATEGORIES.get(key)
