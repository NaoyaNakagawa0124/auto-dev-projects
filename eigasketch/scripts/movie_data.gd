## Movie database with sketch hint definitions.
## Each movie has visual hints that are drawn progressively.
class_name MovieData
extends RefCounted

class Movie:
	var id: String
	var title: String          ## Japanese title
	var title_en: String       ## English title (for display)
	var genre: String
	var year: int
	var hints: Array[Dictionary]  ## Visual hints: {type, params}
	## Hint types: "circle", "rect", "line", "text_hint", "star", "wave"

	func _init(p_id: String, p_title: String, p_en: String,
			   p_genre: String, p_year: int, p_hints: Array[Dictionary]) -> void:
		id = p_id
		title = p_title
		title_en = p_en
		genre = p_genre
		year = p_year
		hints = p_hints

static var genres := {
	"action": {"name": "アクション", "color": Color(0.9, 0.3, 0.2)},
	"scifi": {"name": "SF", "color": Color(0.2, 0.6, 0.9)},
	"horror": {"name": "ホラー", "color": Color(0.5, 0.1, 0.5)},
	"romance": {"name": "ロマンス", "color": Color(0.9, 0.4, 0.6)},
	"anime": {"name": "アニメ", "color": Color(0.3, 0.8, 0.4)},
	"fantasy": {"name": "ファンタジー", "color": Color(0.7, 0.5, 0.9)},
}

static var movies: Array[Movie] = [
	# Action
	Movie.new("die_hard", "ダイ・ハード", "Die Hard", "action", 1988, [
		{"type": "rect", "x": 150, "y": 50, "w": 100, "h": 200, "hint": "高層ビル"},
		{"type": "circle", "x": 200, "y": 180, "r": 15, "hint": "爆発"},
		{"type": "line", "x1": 180, "y1": 100, "x2": 220, "y2": 80, "hint": "銃"},
		{"type": "text_hint", "text": "クリスマス・イブ", "x": 100, "y": 30},
	]),
	Movie.new("matrix", "マトリックス", "The Matrix", "action", 1999, [
		{"type": "line", "x1": 50, "y1": 20, "x2": 50, "y2": 250, "hint": "緑の文字列"},
		{"type": "circle", "x": 200, "y": 130, "r": 30, "hint": "赤い薬/青い薬"},
		{"type": "rect", "x": 160, "y": 80, "w": 80, "h": 50, "hint": "サングラス"},
		{"type": "text_hint", "text": "仮想現実", "x": 100, "y": 270},
	]),
	Movie.new("john_wick", "ジョン・ウィック", "John Wick", "action", 2014, [
		{"type": "circle", "x": 200, "y": 200, "r": 20, "hint": "犬"},
		{"type": "line", "x1": 190, "y1": 100, "x2": 210, "y2": 60, "hint": "鉛筆"},
		{"type": "rect", "x": 100, "y": 50, "w": 200, "h": 120, "hint": "クラブ"},
		{"type": "text_hint", "text": "復讐の殺し屋", "x": 100, "y": 270},
	]),
	Movie.new("mad_max", "マッドマックス 怒りのデスロード", "Mad Max Fury Road", "action", 2015, [
		{"type": "rect", "x": 50, "y": 150, "w": 250, "h": 40, "hint": "砂漠の道"},
		{"type": "circle", "x": 150, "y": 140, "r": 25, "hint": "トラック"},
		{"type": "circle", "x": 280, "y": 60, "r": 40, "hint": "砂嵐"},
		{"type": "text_hint", "text": "荒廃した世界", "x": 100, "y": 270},
	]),
	Movie.new("top_gun", "トップガン", "Top Gun", "action", 1986, [
		{"type": "line", "x1": 80, "y1": 150, "x2": 280, "y2": 100, "hint": "戦闘機"},
		{"type": "circle", "x": 200, "y": 40, "r": 35, "hint": "太陽"},
		{"type": "rect", "x": 150, "y": 200, "w": 60, "h": 30, "hint": "サングラス"},
		{"type": "text_hint", "text": "海軍パイロット", "x": 100, "y": 270},
	]),

	# Sci-Fi
	Movie.new("star_wars", "スター・ウォーズ", "Star Wars", "scifi", 1977, [
		{"type": "circle", "x": 300, "y": 50, "r": 30, "hint": "惑星"},
		{"type": "line", "x1": 150, "y1": 100, "x2": 150, "y2": 200, "hint": "ライトセーバー"},
		{"type": "star", "x": 100, "y": 40, "r": 8, "hint": "星"},
		{"type": "text_hint", "text": "遠い銀河系", "x": 100, "y": 270},
	]),
	Movie.new("blade_runner", "ブレードランナー", "Blade Runner", "scifi", 1982, [
		{"type": "rect", "x": 50, "y": 30, "w": 30, "h": 200, "hint": "高層ビル"},
		{"type": "circle", "x": 200, "y": 80, "r": 20, "hint": "ネオンサイン"},
		{"type": "line", "x1": 100, "y1": 250, "x2": 300, "y2": 250, "hint": "雨の街"},
		{"type": "text_hint", "text": "レプリカント", "x": 100, "y": 270},
	]),
	Movie.new("interstellar", "インターステラー", "Interstellar", "scifi", 2014, [
		{"type": "circle", "x": 200, "y": 120, "r": 50, "hint": "ブラックホール"},
		{"type": "rect", "x": 130, "y": 200, "w": 80, "h": 30, "hint": "宇宙船"},
		{"type": "wave", "x": 50, "y": 170, "w": 250, "hint": "巨大な波"},
		{"type": "text_hint", "text": "時間の歪み", "x": 100, "y": 270},
	]),
	Movie.new("et", "E.T.", "E.T.", "scifi", 1982, [
		{"type": "circle", "x": 200, "y": 60, "r": 40, "hint": "月"},
		{"type": "line", "x1": 180, "y1": 140, "x2": 220, "y2": 100, "hint": "自転車"},
		{"type": "circle", "x": 200, "y": 200, "r": 15, "hint": "光る指"},
		{"type": "text_hint", "text": "家に帰りたい", "x": 100, "y": 270},
	]),
	Movie.new("inception", "インセプション", "Inception", "scifi", 2010, [
		{"type": "rect", "x": 100, "y": 50, "w": 150, "h": 80, "hint": "折りたたまれる街"},
		{"type": "circle", "x": 200, "y": 200, "r": 20, "hint": "コマ(トーテム)"},
		{"type": "line", "x1": 50, "y1": 150, "x2": 300, "y2": 150, "hint": "階層"},
		{"type": "text_hint", "text": "夢の中の夢", "x": 100, "y": 270},
	]),

	# Horror
	Movie.new("shining", "シャイニング", "The Shining", "horror", 1980, [
		{"type": "rect", "x": 100, "y": 60, "w": 150, "h": 100, "hint": "ホテル"},
		{"type": "rect", "x": 160, "y": 190, "w": 40, "h": 60, "hint": "ドア"},
		{"type": "line", "x1": 60, "y1": 200, "x2": 120, "y2": 200, "hint": "斧"},
		{"type": "text_hint", "text": "Here's Johnny!", "x": 100, "y": 270},
	]),
	Movie.new("ring", "リング", "Ring", "horror", 1998, [
		{"type": "circle", "x": 200, "y": 130, "r": 50, "hint": "井戸"},
		{"type": "rect", "x": 120, "y": 30, "w": 120, "h": 80, "hint": "テレビ"},
		{"type": "line", "x1": 180, "y1": 100, "x2": 220, "y2": 60, "hint": "黒い髪"},
		{"type": "text_hint", "text": "7日後", "x": 100, "y": 270},
	]),
	Movie.new("jaws", "ジョーズ", "Jaws", "horror", 1975, [
		{"type": "wave", "x": 50, "y": 130, "w": 250, "hint": "海"},
		{"type": "line", "x1": 180, "y1": 180, "x2": 200, "y2": 140, "hint": "サメのヒレ"},
		{"type": "circle", "x": 150, "y": 100, "r": 15, "hint": "泳ぐ人"},
		{"type": "text_hint", "text": "ビーチに行くな", "x": 100, "y": 270},
	]),
	Movie.new("exorcist", "エクソシスト", "The Exorcist", "horror", 1973, [
		{"type": "rect", "x": 150, "y": 40, "w": 80, "h": 120, "hint": "家"},
		{"type": "circle", "x": 190, "y": 200, "r": 25, "hint": "窓の光"},
		{"type": "line", "x1": 170, "y1": 170, "x2": 210, "y2": 160, "hint": "階段"},
		{"type": "text_hint", "text": "悪魔祓い", "x": 100, "y": 270},
	]),
	Movie.new("psycho", "サイコ", "Psycho", "horror", 1960, [
		{"type": "rect", "x": 130, "y": 30, "w": 100, "h": 130, "hint": "モーテル"},
		{"type": "circle", "x": 200, "y": 200, "r": 30, "hint": "シャワーヘッド"},
		{"type": "line", "x1": 240, "y1": 180, "x2": 260, "y2": 220, "hint": "ナイフ"},
		{"type": "text_hint", "text": "母さん...", "x": 100, "y": 270},
	]),

	# Romance
	Movie.new("titanic", "タイタニック", "Titanic", "romance", 1997, [
		{"type": "rect", "x": 50, "y": 100, "w": 250, "h": 60, "hint": "巨大な船"},
		{"type": "circle", "x": 300, "y": 50, "r": 15, "hint": "氷山"},
		{"type": "line", "x1": 130, "y1": 80, "x2": 180, "y2": 40, "hint": "船首に立つ二人"},
		{"type": "text_hint", "text": "私は飛んでいる", "x": 100, "y": 270},
	]),
	Movie.new("notting_hill", "ノッティングヒルの恋人", "Notting Hill", "romance", 1999, [
		{"type": "rect", "x": 100, "y": 50, "w": 60, "h": 100, "hint": "本屋"},
		{"type": "circle", "x": 250, "y": 80, "r": 20, "hint": "オレンジジュース"},
		{"type": "rect", "x": 50, "y": 180, "w": 250, "h": 30, "hint": "ロンドンの通り"},
		{"type": "text_hint", "text": "有名女優と普通の男", "x": 100, "y": 270},
	]),
	Movie.new("your_name", "君の名は。", "Your Name", "romance", 2016, [
		{"type": "circle", "x": 250, "y": 60, "r": 25, "hint": "彗星"},
		{"type": "line", "x1": 100, "y1": 200, "x2": 250, "y2": 200, "hint": "電車"},
		{"type": "circle", "x": 150, "y": 130, "r": 15, "hint": "組紐"},
		{"type": "text_hint", "text": "入れ替わり", "x": 100, "y": 270},
	]),
	Movie.new("la_la_land", "ラ・ラ・ランド", "La La Land", "romance", 2016, [
		{"type": "star", "x": 200, "y": 50, "r": 15, "hint": "星空"},
		{"type": "rect", "x": 100, "y": 150, "w": 60, "h": 40, "hint": "ピアノ"},
		{"type": "circle", "x": 250, "y": 180, "r": 20, "hint": "ダンス"},
		{"type": "text_hint", "text": "夢と恋のミュージカル", "x": 100, "y": 270},
	]),
	Movie.new("roman_holiday", "ローマの休日", "Roman Holiday", "romance", 1953, [
		{"type": "circle", "x": 200, "y": 80, "r": 35, "hint": "コロセウム"},
		{"type": "rect", "x": 120, "y": 180, "w": 80, "h": 30, "hint": "ベスパ"},
		{"type": "circle", "x": 100, "y": 130, "r": 15, "hint": "アイスクリーム"},
		{"type": "text_hint", "text": "王女の一日", "x": 100, "y": 270},
	]),

	# Anime
	Movie.new("totoro", "となりのトトロ", "My Neighbor Totoro", "anime", 1988, [
		{"type": "circle", "x": 200, "y": 120, "r": 60, "hint": "大きなお腹"},
		{"type": "line", "x1": 160, "y1": 50, "x2": 240, "y2": 50, "hint": "傘"},
		{"type": "rect", "x": 50, "y": 200, "w": 100, "h": 30, "hint": "バス停"},
		{"type": "text_hint", "text": "森の精霊", "x": 100, "y": 270},
	]),
	Movie.new("spirited", "千と千尋の神隠し", "Spirited Away", "anime", 2001, [
		{"type": "rect", "x": 100, "y": 40, "w": 150, "h": 120, "hint": "油屋"},
		{"type": "circle", "x": 80, "y": 200, "r": 20, "hint": "カオナシ"},
		{"type": "wave", "x": 50, "y": 170, "w": 250, "hint": "海の上の線路"},
		{"type": "text_hint", "text": "名前を奪われた少女", "x": 100, "y": 270},
	]),
	Movie.new("akira", "AKIRA", "AKIRA", "anime", 1988, [
		{"type": "circle", "x": 200, "y": 100, "r": 50, "hint": "爆発"},
		{"type": "rect", "x": 80, "y": 180, "w": 100, "h": 30, "hint": "バイク"},
		{"type": "rect", "x": 50, "y": 30, "w": 250, "h": 50, "hint": "ネオ東京"},
		{"type": "text_hint", "text": "超能力少年", "x": 100, "y": 270},
	]),
	Movie.new("eva", "エヴァンゲリオン", "Evangelion", "anime", 1995, [
		{"type": "rect", "x": 170, "y": 30, "w": 30, "h": 180, "hint": "巨大ロボ"},
		{"type": "circle", "x": 100, "y": 200, "r": 30, "hint": "使徒"},
		{"type": "line", "x1": 50, "y1": 250, "x2": 300, "y2": 250, "hint": "第3新東京市"},
		{"type": "text_hint", "text": "逃げちゃダメだ", "x": 100, "y": 270},
	]),
	Movie.new("mononoke", "もののけ姫", "Princess Mononoke", "anime", 1997, [
		{"type": "circle", "x": 200, "y": 80, "r": 30, "hint": "シシ神"},
		{"type": "line", "x1": 80, "y1": 60, "x2": 120, "y2": 200, "hint": "矢"},
		{"type": "rect", "x": 50, "y": 150, "w": 250, "h": 60, "hint": "森"},
		{"type": "text_hint", "text": "人間と自然の戦い", "x": 100, "y": 270},
	]),

	# Fantasy
	Movie.new("lotr", "ロード・オブ・ザ・リング", "Lord of the Rings", "fantasy", 2001, [
		{"type": "circle", "x": 200, "y": 120, "r": 30, "hint": "指輪"},
		{"type": "rect", "x": 100, "y": 30, "w": 20, "h": 100, "hint": "塔"},
		{"type": "circle", "x": 280, "y": 50, "r": 25, "hint": "火の目"},
		{"type": "text_hint", "text": "一つの指輪", "x": 100, "y": 270},
	]),
	Movie.new("harry_potter", "ハリー・ポッター", "Harry Potter", "fantasy", 2001, [
		{"type": "rect", "x": 100, "y": 30, "w": 160, "h": 130, "hint": "城"},
		{"type": "circle", "x": 200, "y": 200, "r": 15, "hint": "メガネ"},
		{"type": "line", "x1": 150, "y1": 180, "x2": 170, "y2": 140, "hint": "杖"},
		{"type": "text_hint", "text": "魔法学校", "x": 100, "y": 270},
	]),
	Movie.new("wizard_oz", "オズの魔法使い", "The Wizard of Oz", "fantasy", 1939, [
		{"type": "line", "x1": 50, "y1": 200, "x2": 300, "y2": 200, "hint": "黄色いレンガの道"},
		{"type": "circle", "x": 250, "y": 80, "r": 30, "hint": "竜巻"},
		{"type": "rect", "x": 130, "y": 180, "w": 30, "h": 20, "hint": "赤い靴"},
		{"type": "text_hint", "text": "家に帰りたい", "x": 100, "y": 270},
	]),
	Movie.new("frozen", "アナと雪の女王", "Frozen", "fantasy", 2013, [
		{"type": "rect", "x": 130, "y": 30, "w": 100, "h": 140, "hint": "氷の城"},
		{"type": "circle", "x": 100, "y": 200, "r": 20, "hint": "雪だるま"},
		{"type": "star", "x": 250, "y": 80, "r": 15, "hint": "雪の結晶"},
		{"type": "text_hint", "text": "ありのままで", "x": 100, "y": 270},
	]),
	Movie.new("narnia", "ナルニア国物語", "Chronicles of Narnia", "fantasy", 2005, [
		{"type": "rect", "x": 130, "y": 50, "w": 80, "h": 130, "hint": "衣装タンス"},
		{"type": "circle", "x": 80, "y": 150, "r": 20, "hint": "ライオン"},
		{"type": "rect", "x": 50, "y": 200, "w": 250, "h": 30, "hint": "雪の国"},
		{"type": "text_hint", "text": "タンスの向こうの世界", "x": 100, "y": 270},
	]),
]

static func get_movie(id: String) -> Movie:
	for m in movies:
		if m.id == id:
			return m
	return null

static func get_movies_by_genre(genre: String) -> Array[Movie]:
	var result: Array[Movie] = []
	for m in movies:
		if m.genre == genre:
			result.append(m)
	return result

static func movie_count() -> int:
	return movies.size()

static func get_random_choices(correct_movie: Movie, count: int) -> Array[Movie]:
	## Return array with correct movie + (count-1) wrong choices
	var choices: Array[Movie] = [correct_movie]
	var pool: Array[Movie] = []
	for m in movies:
		if m.id != correct_movie.id:
			pool.append(m)
	pool.shuffle()
	for i in range(min(count - 1, pool.size())):
		choices.append(pool[i])
	choices.shuffle()
	return choices
