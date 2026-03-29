"""KuizuNote puzzle definitions and scoring logic."""
import random

PUZZLES = [
    {
        "id": 1,
        "type": "pattern",
        "title": "パターン認識",
        "question": "次の数列の？に入る数字は？\n2, 4, 8, 16, ?, 64",
        "answer": 32,
        "hint": "各数字は前の数字の2倍です",
        "explanation": "2の累乗の数列です。16 × 2 = 32",
    },
    {
        "id": 2,
        "type": "sequence",
        "title": "フィボナッチ",
        "question": "次の数列の？に入る数字は？\n1, 1, 2, 3, 5, 8, ?",
        "answer": 13,
        "hint": "前の2つの数字を足してみましょう",
        "explanation": "フィボナッチ数列です。5 + 8 = 13",
    },
    {
        "id": 3,
        "type": "logic",
        "title": "論理パズル",
        "question": "AはBより背が高い。CはAより背が高い。\n一番背が低いのは？ (A=1, B=2, C=3)",
        "answer": 2,
        "hint": "順番に並べてみましょう: C > A > B",
        "explanation": "C > A > B なので、Bが一番背が低いです",
    },
    {
        "id": 4,
        "type": "pattern",
        "title": "図形パターン",
        "question": "グラフに表示される図形のパターンを見て、\n次に来る色の番号を答えてください\n(赤=1, 青=2, 緑=3, 黄=4)",
        "answer": 1,
        "hint": "色の順番は赤→青→緑→黄→赤→...の繰り返しです",
        "explanation": "赤→青→緑→黄→赤 の4色の繰り返しパターン",
    },
    {
        "id": 5,
        "type": "chart",
        "title": "グラフ読解",
        "question": "棒グラフを見て、一番人気のある趣味の番号を答えてください\n(1=散歩, 2=読書, 3=園芸, 4=料理, 5=旅行)",
        "answer": 5,
        "hint": "一番高い棒を探してください",
        "explanation": "旅行(85人)が一番人気でした",
    },
    {
        "id": 6,
        "type": "sequence",
        "title": "規則性",
        "question": "次の数列の？に入る数字は？\n3, 6, 9, 12, ?, 18",
        "answer": 15,
        "hint": "各数字の差を見てください",
        "explanation": "3ずつ増える等差数列です。12 + 3 = 15",
    },
    {
        "id": 7,
        "type": "logic",
        "title": "曜日パズル",
        "question": "今日が水曜日なら、5日後は何曜日？\n(月=1, 火=2, 水=3, 木=4, 金=5, 土=6, 日=7)",
        "answer": 1,
        "hint": "水曜日から5日数えてみましょう",
        "explanation": "水→木→金→土→日→月。5日後は月曜日です",
    },
    {
        "id": 8,
        "type": "chart",
        "title": "円グラフ読解",
        "question": "円グラフを見て、2番目に大きい割合の季節の番号を答えてください\n(1=春, 2=夏, 3=秋, 4=冬)",
        "answer": 3,
        "hint": "一番大きいのは春(35%)。次に大きいのは？",
        "explanation": "春35%、秋25%、夏22%、冬18%。2番目は秋(25%)",
    },
    {
        "id": 9,
        "type": "pattern",
        "title": "鏡パターン",
        "question": "数列の？に入る数字は？\n1, 2, 3, 4, 5, 4, 3, 2, ?",
        "answer": 1,
        "hint": "上がって、下がるパターンです",
        "explanation": "山型のパターン。5をピークに1まで下がります",
    },
    {
        "id": 10,
        "type": "logic",
        "title": "年齢パズル",
        "question": "太郎は花子の2倍の年齢です。花子は30歳です。\n太郎の年齢は？",
        "answer": 60,
        "hint": "花子の年齢を2倍してください",
        "explanation": "30 × 2 = 60歳",
    },
]

BRAIN_TYPES = [
    {"min_score": 90, "type": "天才脳 🧠✨", "desc": "あなたの脳は超一流！どんな問題もスイスイ解けます。"},
    {"min_score": 70, "type": "分析脳 🔍", "desc": "論理的思考が得意！パターンを見抜く力が素晴らしい。"},
    {"min_score": 50, "type": "直感脳 💡", "desc": "ひらめきの達人！直感的にパッと答えが出るタイプ。"},
    {"min_score": 30, "type": "のんびり脳 🌿", "desc": "マイペースで着実。じっくり考えるのが好きなタイプ。"},
    {"min_score": 0, "type": "冒険脳 🗺️", "desc": "挑戦することが大事！間違えても楽しむのがあなたの強み。"},
]


def get_puzzle(puzzle_id):
    """Get puzzle by ID (1-indexed)."""
    for p in PUZZLES:
        if p["id"] == puzzle_id:
            return p
    return None


def check_answer(puzzle_id, user_answer):
    """Check if the user's answer is correct."""
    puzzle = get_puzzle(puzzle_id)
    if puzzle is None:
        return False
    try:
        return int(user_answer) == puzzle["answer"]
    except (ValueError, TypeError):
        return False


def calculate_score(correct_count, total=10):
    """Calculate percentage score."""
    return round(correct_count / total * 100)


def get_brain_type(score):
    """Determine brain type based on score."""
    for bt in BRAIN_TYPES:
        if score >= bt["min_score"]:
            return bt
    return BRAIN_TYPES[-1]


def puzzle_count():
    """Return total number of puzzles."""
    return len(PUZZLES)


def get_chart_data(puzzle_id):
    """Return data for chart-based puzzles."""
    if puzzle_id == 5:
        # Bar chart: hobby popularity
        return {
            "type": "bar",
            "labels": ["散歩", "読書", "園芸", "料理", "旅行"],
            "values": [62, 58, 45, 70, 85],
            "title": "シニアに人気の趣味（人）",
            "colors": ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#6c5ce7"],
        }
    elif puzzle_id == 8:
        # Pie chart: favorite season
        return {
            "type": "pie",
            "labels": ["春", "夏", "秋", "冬"],
            "values": [35, 22, 25, 18],
            "title": "好きな季節アンケート（%）",
            "colors": ["#ff9ff3", "#feca57", "#ff6348", "#54a0ff"],
        }
    elif puzzle_id == 4:
        # Color pattern for visual puzzle
        return {
            "type": "color_pattern",
            "colors": ["red", "blue", "green", "gold", "red", "blue", "green", "gold"],
            "next_answer": "red",
            "title": "色のパターン — 次は何色？",
        }
    return None
