## Game data definitions for niwacraft
## Contains all item types, seasons, growth stages, and food education tips
class_name GameData

# ========== Seasons ==========
enum Season { SPRING, SUMMER, AUTUMN, WINTER }

const SEASON_NAMES := {
	Season.SPRING: "春",
	Season.SUMMER: "夏",
	Season.AUTUMN: "秋",
	Season.WINTER: "冬",
}

const SEASON_COLORS := {
	Season.SPRING: Color(0.85, 0.95, 0.85),  # Soft green
	Season.SUMMER: Color(0.95, 0.95, 0.80),  # Warm yellow
	Season.AUTUMN: Color(0.95, 0.85, 0.75),  # Orange tint
	Season.WINTER: Color(0.90, 0.92, 0.96),  # Cool blue-white
}

const SEASON_DURATION := 30.0  # seconds per season (for gameplay)

# ========== Item Categories ==========
enum Category { CROP, FLOWER, TREE, PATH, STRUCTURE, WATER }

const CATEGORY_NAMES := {
	Category.CROP: "作物",
	Category.FLOWER: "花",
	Category.TREE: "木",
	Category.PATH: "小道",
	Category.STRUCTURE: "建物",
	Category.WATER: "水場",
}

# ========== Growth Stages ==========
enum GrowthStage { SEED, SPROUT, GROWN, HARVEST, NONE }

const GROWTH_STAGE_NAMES := {
	GrowthStage.SEED: "種",
	GrowthStage.SPROUT: "芽",
	GrowthStage.GROWN: "成長",
	GrowthStage.HARVEST: "収穫",
	GrowthStage.NONE: "",
}

# ========== Item Definitions ==========
# Each item: { name, category, color, grow_seasons, growth_time, tip, harvestable }

const ITEMS := {
	# === Crops ===
	"tomato": {
		"name": "トマト",
		"category": Category.CROP,
		"colors": [Color(0.6, 0.4, 0.2), Color(0.3, 0.6, 0.2), Color(0.2, 0.7, 0.2), Color(0.9, 0.2, 0.1)],
		"grow_seasons": [Season.SPRING, Season.SUMMER],
		"growth_time": 3,
		"harvestable": true,
		"tip": "トマトはビタミンCが豊富！リコピンは加熱すると吸収率がアップするよ。",
	},
	"carrot": {
		"name": "にんじん",
		"category": Category.CROP,
		"colors": [Color(0.6, 0.4, 0.2), Color(0.3, 0.6, 0.2), Color(0.2, 0.7, 0.2), Color(0.9, 0.5, 0.1)],
		"grow_seasons": [Season.SPRING, Season.AUTUMN],
		"growth_time": 3,
		"harvestable": true,
		"tip": "にんじんのβカロテンは目の健康に良いよ。オレンジ色が濃いほど栄養たっぷり！",
	},
	"cabbage": {
		"name": "キャベツ",
		"category": Category.CROP,
		"colors": [Color(0.6, 0.4, 0.2), Color(0.4, 0.6, 0.3), Color(0.5, 0.8, 0.4), Color(0.4, 0.7, 0.3)],
		"grow_seasons": [Season.SPRING, Season.AUTUMN],
		"growth_time": 4,
		"harvestable": true,
		"tip": "キャベツは胃腸に優しい野菜。ビタミンUが胃の粘膜を守ってくれるんだ。",
	},
	"corn": {
		"name": "とうもろこし",
		"category": Category.CROP,
		"colors": [Color(0.6, 0.4, 0.2), Color(0.3, 0.6, 0.2), Color(0.3, 0.7, 0.2), Color(0.95, 0.85, 0.3)],
		"grow_seasons": [Season.SUMMER],
		"growth_time": 4,
		"harvestable": true,
		"tip": "とうもろこしは世界三大穀物の一つ。食物繊維がたっぷりでお腹の調子を整えるよ。",
	},
	"daikon": {
		"name": "大根",
		"category": Category.CROP,
		"colors": [Color(0.6, 0.4, 0.2), Color(0.3, 0.6, 0.2), Color(0.3, 0.7, 0.3), Color(0.95, 0.95, 0.9)],
		"grow_seasons": [Season.AUTUMN, Season.WINTER],
		"growth_time": 3,
		"harvestable": true,
		"tip": "大根おろしの辛味成分イソチオシアネートには殺菌作用があるよ。冬の定番野菜！",
	},
	"strawberry": {
		"name": "いちご",
		"category": Category.CROP,
		"colors": [Color(0.6, 0.4, 0.2), Color(0.3, 0.5, 0.2), Color(0.2, 0.6, 0.2), Color(0.9, 0.15, 0.15)],
		"grow_seasons": [Season.SPRING],
		"growth_time": 4,
		"harvestable": true,
		"tip": "いちごはビタミンCの王様！みかんの約2倍のビタミンCが含まれているよ。",
	},

	# === Flowers ===
	"sunflower": {
		"name": "ひまわり",
		"category": Category.FLOWER,
		"colors": [Color(0.5, 0.4, 0.2), Color(0.3, 0.5, 0.2), Color(0.2, 0.6, 0.2), Color(0.95, 0.8, 0.1)],
		"grow_seasons": [Season.SUMMER],
		"growth_time": 3,
		"harvestable": false,
		"tip": "ひまわりの種はリスや鳥の大好物。太陽を追いかけるのは若い時だけなんだよ。",
	},
	"tulip": {
		"name": "チューリップ",
		"category": Category.FLOWER,
		"colors": [Color(0.5, 0.4, 0.2), Color(0.3, 0.5, 0.2), Color(0.2, 0.6, 0.2), Color(0.9, 0.3, 0.4)],
		"grow_seasons": [Season.SPRING],
		"growth_time": 2,
		"harvestable": false,
		"tip": "チューリップはオランダの国花。球根から育つ多年草で、毎年花を咲かせるよ。",
	},
	"cosmos": {
		"name": "コスモス",
		"category": Category.FLOWER,
		"colors": [Color(0.5, 0.4, 0.2), Color(0.3, 0.5, 0.2), Color(0.2, 0.6, 0.2), Color(0.9, 0.6, 0.7)],
		"grow_seasons": [Season.AUTUMN],
		"growth_time": 2,
		"harvestable": false,
		"tip": "コスモスは「秋桜」とも書くよ。ギリシャ語で「秩序・調和」という意味なんだ。",
	},

	# === Trees ===
	"sakura": {
		"name": "桜の木",
		"category": Category.TREE,
		"colors": [Color(0.5, 0.35, 0.2), Color(0.4, 0.5, 0.3), Color(0.3, 0.6, 0.3), Color(0.95, 0.75, 0.8)],
		"grow_seasons": [Season.SPRING, Season.SUMMER, Season.AUTUMN, Season.WINTER],
		"growth_time": 6,
		"harvestable": false,
		"tip": "桜は日本の国花。春に咲く花は約2週間で散ってしまう、はかない美しさ。",
	},
	"apple_tree": {
		"name": "りんごの木",
		"category": Category.TREE,
		"colors": [Color(0.5, 0.35, 0.2), Color(0.4, 0.5, 0.3), Color(0.3, 0.6, 0.3), Color(0.8, 0.2, 0.15)],
		"grow_seasons": [Season.SPRING, Season.SUMMER, Season.AUTUMN],
		"growth_time": 8,
		"harvestable": true,
		"tip": "りんごは世界で約7,500品種もあるよ。「1日1個のりんごで医者いらず」と言われるね。",
	},

	# === Paths ===
	"stone_path": {
		"name": "石畳の小道",
		"category": Category.PATH,
		"colors": [Color(0.65, 0.63, 0.6)],
		"grow_seasons": [],
		"growth_time": 0,
		"harvestable": false,
		"tip": "小道を作ると庭が歩きやすくなるよ。日本庭園では飛び石が使われるんだ。",
	},
	"wood_path": {
		"name": "木の小道",
		"category": Category.PATH,
		"colors": [Color(0.6, 0.45, 0.25)],
		"grow_seasons": [],
		"growth_time": 0,
		"harvestable": false,
		"tip": "ウッドチップの小道は雨でも滑りにくく、土に還るからエコだよ。",
	},
	"grass_path": {
		"name": "芝生",
		"category": Category.PATH,
		"colors": [Color(0.45, 0.7, 0.35)],
		"grow_seasons": [],
		"growth_time": 0,
		"harvestable": false,
		"tip": "芝生は二酸化炭素を吸収して酸素を出すよ。地面の温度も下げてくれるんだ。",
	},

	# === Structures ===
	"fence": {
		"name": "柵",
		"category": Category.STRUCTURE,
		"colors": [Color(0.55, 0.4, 0.2)],
		"grow_seasons": [],
		"growth_time": 0,
		"harvestable": false,
		"tip": "柵は動物から作物を守るために使われるよ。木の柵はナチュラルな雰囲気。",
	},
	"bench": {
		"name": "ベンチ",
		"category": Category.STRUCTURE,
		"colors": [Color(0.5, 0.35, 0.2)],
		"grow_seasons": [],
		"growth_time": 0,
		"harvestable": false,
		"tip": "庭にベンチがあると、育てた植物を眺めてゆっくり休めるね。",
	},
	"scarecrow": {
		"name": "かかし",
		"category": Category.STRUCTURE,
		"colors": [Color(0.7, 0.55, 0.3)],
		"grow_seasons": [],
		"growth_time": 0,
		"harvestable": false,
		"tip": "かかしは鳥から作物を守るために置くよ。日本では田んぼの守り神なんだ。",
	},
	"birdhouse": {
		"name": "巣箱",
		"category": Category.STRUCTURE,
		"colors": [Color(0.6, 0.45, 0.25)],
		"grow_seasons": [],
		"growth_time": 0,
		"harvestable": false,
		"tip": "巣箱を置くと鳥が来てくれるよ。鳥は害虫を食べてくれる庭の味方！",
	},

	# === Water ===
	"pond": {
		"name": "池",
		"category": Category.WATER,
		"colors": [Color(0.3, 0.55, 0.75)],
		"grow_seasons": [],
		"growth_time": 0,
		"harvestable": false,
		"tip": "庭に池があるとカエルやトンボが来るよ。小さな生態系が生まれるんだ。",
	},
	"well": {
		"name": "井戸",
		"category": Category.WATER,
		"colors": [Color(0.5, 0.5, 0.5)],
		"grow_seasons": [],
		"growth_time": 0,
		"harvestable": false,
		"tip": "井戸の水は地下水。昔は家庭の大切な水源だったんだよ。",
	},
}

# Get items by category
static func get_items_by_category(cat: Category) -> Array:
	var result := []
	for key in ITEMS:
		if ITEMS[key]["category"] == cat:
			result.append(key)
	return result

# Get all item keys
static func get_all_item_keys() -> Array:
	return ITEMS.keys()

# Get item data
static func get_item(key: String) -> Dictionary:
	if ITEMS.has(key):
		return ITEMS[key]
	return {}

# Check if item can grow in season
static func can_grow_in_season(key: String, season: Season) -> bool:
	var item = get_item(key)
	if item.is_empty():
		return false
	return season in item.get("grow_seasons", [])

# Get season color for background
static func get_season_bg_color(season: Season) -> Color:
	return SEASON_COLORS.get(season, Color.WHITE)
