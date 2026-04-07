"""Era and item database for tokineko."""
from __future__ import annotations

from typing import Optional, List

from .models import Era, Item

# Cat ASCII art per era - each is a list of strings
CAT_ART_PREHISTORIC = [
    "    ╱|、    ",
    "   (˚ˎ 。7   ",
    "    |、˜〵   ",
    "    じしˍ,)ノ ",
    "  🦴 🌿 🦕  ",
]

CAT_ART_EGYPT = [
    "    /\\_/\\    ",
    "   ( ◎.◎ )   ",
    "    > 𓂀 <    ",
    "   /|   |\\   ",
    "  (_|   |_)  ",
    "  🏺 𓃠 🐍  ",
]

CAT_ART_MEDIEVAL = [
    "   ∧___∧    ",
    "  ( ⚔️•ω•)   ",
    "  /    つ🏰  ",
    " (    /     ",
    "  ∪ ∪      ",
    "  ⚔️ 🛡️ 🏹  ",
]

CAT_ART_SENGOKU = [
    "   ∧＿∧     ",
    "  (｀・ω・)⚔  ",
    "  /  　 ﾉ    ",
    " しーーJ    ",
    "  🏯 ⚔️ 🎌  ",
]

CAT_ART_EDO = [
    "    ∧,,,∧    ",
    "  （ =・ω・=）  ",
    "  ～(     )～ ",
    "    uu‐‐uu   ",
    "  🎋 🍡 🌸  ",
]

CAT_ART_MEIJI = [
    "   ＿＿∧     ",
    "  ( =^・^)🎩 ",
    "   |  つ📖  ",
    "   しーJ     ",
    "  🚂 📰 ⛽  ",
]

CAT_ART_SHOWA = [
    "   ∧∧       ",
    "  (=^-^=)📺  ",
    "  ( u u)     ",
    "   ∪∪       ",
    "  📻 🍜 🎬  ",
]

CAT_ART_MODERN = [
    "   ∧_∧      ",
    "  (=^・ω・^=)💻",
    "  /    \\     ",
    "  |    |     ",
    "   UU UU     ",
    "  💻 📱 ☕  ",
]

CAT_ART_FUTURE = [
    "   /\\_/\\     ",
    "  ( ◉.◉ )🛸  ",
    "  / ⚡️  \\   ",
    "  \\  ∞  /   ",
    "   \\___/     ",
    "  🚀 🤖 🌌  ",
]


def build_eras() -> list[Era]:
    return [
        Era(
            id="prehistoric",
            name="先史時代",
            year_label="紀元前10000年",
            description="マンモスが歩き、洞窟に壁画が描かれた太古の世界。猫の祖先はサーベルタイガーの影に隠れていた。",
            color="#8B7355",
            cat_art=CAT_ART_PREHISTORIC,
            ambient_text="風が草原を渡り、遠くでマンモスの鳴き声が聞こえる...",
            items=[
                Item("bone_flute", "骨の笛", "古代人が作った動物の骨の笛。不思議な音色がする", "prehistoric", "common", "🦴"),
                Item("cave_painting", "洞窟壁画の欠片", "猫らしき動物が描かれた岩の破片", "prehistoric", "rare", "🎨"),
                Item("amber_bug", "琥珀に閉じ込められた虫", "太古の昆虫が完璧に保存されている", "prehistoric", "legendary", "💎"),
            ],
        ),
        Era(
            id="egypt",
            name="古代エジプト",
            year_label="紀元前3000年",
            description="猫は神として崇められた黄金の時代。ピラミッドの影でファラオに愛された。",
            color="#DAA520",
            cat_art=CAT_ART_EGYPT,
            ambient_text="ナイル川のせせらぎと、神殿の祈りの声が響く...",
            items=[
                Item("scarab", "スカラベの護符", "幸運をもたらすとされる黄金の虫の護符", "egypt", "common", "🪲"),
                Item("bastet_statue", "バステト像", "猫の女神バステトの小さな像", "egypt", "rare", "🐱"),
                Item("pharaoh_collar", "ファラオの首輪", "宝石が散りばめられた猫用の首輪", "egypt", "legendary", "👑"),
            ],
        ),
        Era(
            id="medieval",
            name="中世ヨーロッパ",
            year_label="1200年",
            description="騎士と城の時代。猫はネズミ退治の名手として城に住んでいた。",
            color="#4A6741",
            cat_art=CAT_ART_MEDIEVAL,
            ambient_text="城の塔から鐘が鳴り、騎士たちの剣がぶつかる音...",
            items=[
                Item("mouse_trophy", "ネズミの勲章", "ネズミ退治の功績を称える小さな勲章", "medieval", "common", "🏅"),
                Item("knight_helmet", "騎士の兜（猫用）", "猫のために特注された小さな兜", "medieval", "rare", "⚔️"),
                Item("holy_yarn", "聖なる毛糸玉", "修道院で祝福された特別な毛糸玉", "medieval", "legendary", "✨"),
            ],
        ),
        Era(
            id="sengoku",
            name="戦国時代",
            year_label="1560年",
            description="群雄割拠の日本。猫は武将たちの傍らで戦乱の世を見守っていた。",
            color="#8B0000",
            cat_art=CAT_ART_SENGOKU,
            ambient_text="合戦の太鼓が鳴り響き、馬蹄の音が近づく...",
            items=[
                Item("war_fan", "軍配うちわ", "武将が使った采配用の扇。猫の肉球の跡がある", "sengoku", "common", "🪭"),
                Item("samurai_armor", "猫武者の鎧", "猫サイズの精巧な甲冑", "sengoku", "rare", "🛡️"),
                Item("nobunaga_letter", "信長の密書", "猫に宛てた信長の手紙。「猫御前殿」と書かれている", "sengoku", "legendary", "📜"),
            ],
        ),
        Era(
            id="edo",
            name="江戸時代",
            year_label="1700年",
            description="平和な日本の文化が花開いた時代。招き猫が生まれ、浮世絵に猫が描かれた。",
            color="#FF69B4",
            cat_art=CAT_ART_EDO,
            ambient_text="三味線の音色と、花魁道中の下駄の音...",
            items=[
                Item("maneki_neko", "招き猫", "商売繁盛を願う縁起物の猫の置物", "edo", "common", "🎎"),
                Item("ukiyoe_cat", "猫の浮世絵", "歌川国芳が描いた猫の浮世絵", "edo", "rare", "🖼️"),
                Item("edo_sushi", "江戸前寿司", "当時の屋台で出された猫も大好きな寿司", "edo", "legendary", "🍣"),
            ],
        ),
        Era(
            id="meiji",
            name="明治時代",
            year_label="1880年",
            description="文明開化の波。西洋文化が流入し、猫も洋服を着せられるようになった。",
            color="#4169E1",
            cat_art=CAT_ART_MEIJI,
            ambient_text="蒸気機関車の汽笛と、ガス灯の灯る街角...",
            items=[
                Item("top_hat", "シルクハット", "紳士的な猫のための小さなシルクハット", "meiji", "common", "🎩"),
                Item("soseki_book", "吾輩は猫である（初版）", "夏目漱石の名著の初版本", "meiji", "rare", "📖"),
                Item("steam_toy", "蒸気仕掛けのネズミ", "蒸気で動く機械仕掛けのおもちゃ", "meiji", "legendary", "⚙️"),
            ],
        ),
        Era(
            id="showa",
            name="昭和時代",
            year_label="1965年",
            description="高度経済成長期の日本。テレビが普及し、猫もお茶の間のアイドルに。",
            color="#FF8C00",
            cat_art=CAT_ART_SHOWA,
            ambient_text="テレビから力道山の試合中継、台所からカレーの匂い...",
            items=[
                Item("tv_antenna", "テレビアンテナ", "屋根の上で猫が遊んだVHFアンテナ", "showa", "common", "📡"),
                Item("retro_camera", "レトロカメラ", "猫を撮るために買ったフィルムカメラ", "showa", "rare", "📷"),
                Item("ramen_bowl", "昭和のラーメン丼", "チャーシューの匂いに猫が寄ってくる", "showa", "legendary", "🍜"),
            ],
        ),
        Era(
            id="modern",
            name="現代",
            year_label="2026年",
            description="インターネット時代。猫は世界で最も検索される動物になった。",
            color="#00CED1",
            cat_art=CAT_ART_MODERN,
            ambient_text="キーボードを打つ音、Slackの通知音、コーヒーマシンの音...",
            items=[
                Item("keyboard", "猫が踏んだキーボード", "asdfghjklと入力された形跡がある", "modern", "common", "⌨️"),
                Item("viral_photo", "バズった猫写真", "100万いいねを達成した奇跡の一枚", "modern", "rare", "📱"),
                Item("youtube_plaque", "猫チャンネルの銀盾", "登録者10万人達成の銀の盾", "modern", "legendary", "🏆"),
            ],
        ),
        Era(
            id="future",
            name="未来",
            year_label="2200年",
            description="宇宙時代。猫は人類と共に星々を旅する最初の動物コンパニオンとなった。",
            color="#9370DB",
            cat_art=CAT_ART_FUTURE,
            ambient_text="宇宙船のエンジン音と、無重力でふわふわ浮かぶ猫...",
            items=[
                Item("space_helmet", "猫用宇宙ヘルメット", "特注の猫用EVAヘルメット。耳の部分が膨らんでいる", "future", "common", "🪖"),
                Item("quantum_yarn", "量子もつれ毛糸玉", "触ると別次元の毛糸玉も同時に動く", "future", "rare", "🔮"),
                Item("time_collar", "時間の首輪", "すべての時代を自由に行き来できる伝説の首輪", "future", "legendary", "⏳"),
            ],
        ),
    ]


def build_achievements() -> list[dict]:
    return [
        {"id": "first_pomodoro", "name": "はじめの一歩", "description": "最初のポモドーロを完了した", "condition": "pomodoro_1"},
        {"id": "pomodoro_5", "name": "集中の達人", "description": "ポモドーロを5回完了した", "condition": "pomodoro_5"},
        {"id": "pomodoro_25", "name": "時の旅人", "description": "ポモドーロを25回完了した", "condition": "pomodoro_25"},
        {"id": "visit_3_eras", "name": "時代を超えて", "description": "3つの時代を訪れた", "condition": "visit_3"},
        {"id": "visit_all_eras", "name": "全時代制覇", "description": "すべての時代を訪れた", "condition": "visit_all"},
        {"id": "collect_5", "name": "コレクター見習い", "description": "アイテムを5つ集めた", "condition": "collect_5"},
        {"id": "collect_all", "name": "時の守護者", "description": "すべてのアイテムを集めた", "condition": "collect_all"},
        {"id": "max_happiness", "name": "至福の時", "description": "猫の幸福度を100にした", "condition": "happiness_100"},
        {"id": "pet_10", "name": "なでなで名人", "description": "猫を10回なでた", "condition": "pet_10"},
        {"id": "first_legendary", "name": "伝説の発見", "description": "レジェンダリーアイテムを見つけた", "condition": "legendary_1"},
    ]


ERA_ORDER = [
    "prehistoric", "egypt", "medieval", "sengoku",
    "edo", "meiji", "showa", "modern", "future",
]


def get_era_by_id(eras: List[Era], era_id: str) -> Optional[Era]:
    for era in eras:
        if era.id == era_id:
            return era
    return None


def get_next_era_id(current_id: str) -> Optional[str]:
    try:
        idx = ERA_ORDER.index(current_id)
        if idx < len(ERA_ORDER) - 1:
            return ERA_ORDER[idx + 1]
    except ValueError:
        pass
    return None


def get_era_index(era_id: str) -> int:
    try:
        return ERA_ORDER.index(era_id)
    except ValueError:
        return 0
