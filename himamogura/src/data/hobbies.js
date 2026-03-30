// Hobby database — 100+ hobbies across 5 categories

export const hobbies = [
  // ========== Creative (クリエイティブ) ==========
  { name: "水彩画", nameEn: "Watercolor", description: "水と色の出会いから生まれるアート。失敗も味になる不思議な画材。", category: "creative", difficulty: 2, cost: 2, indoor: 1, tags: ["art", "solo", "relaxing"] },
  { name: "折り紙", nameEn: "Origami", description: "一枚の紙から無限の形が生まれる。脳トレにもなるよ。", category: "creative", difficulty: 1, cost: 1, indoor: 1, tags: ["art", "solo", "cheap"] },
  { name: "編み物", nameEn: "Knitting", description: "毛糸とひたすら向き合う瞑想的な時間。完成したら実用的！", category: "creative", difficulty: 2, cost: 2, indoor: 1, tags: ["craft", "solo", "relaxing"] },
  { name: "レジンアクセサリー", nameEn: "Resin Crafts", description: "透明な樹脂に花や星を閉じ込める。SNS映えも抜群。", category: "creative", difficulty: 2, cost: 3, indoor: 1, tags: ["craft", "solo", "trendy"] },
  { name: "カリグラフィー", nameEn: "Calligraphy", description: "美しい文字を書く芸術。手紙が10倍素敵になるよ。", category: "creative", difficulty: 2, cost: 2, indoor: 1, tags: ["art", "solo", "relaxing"] },
  { name: "写真撮影", nameEn: "Photography", description: "日常に潜む美しさを切り取る。スマホでも始められる！", category: "creative", difficulty: 2, cost: 2, indoor: 0, tags: ["art", "solo", "outdoor"] },
  { name: "DIY家具", nameEn: "DIY Furniture", description: "自分だけの家具を作る達成感。100均材料でもOK。", category: "creative", difficulty: 3, cost: 3, indoor: 1, tags: ["craft", "solo", "practical"] },
  { name: "陶芸", nameEn: "Pottery", description: "土をこねて形にする原始的な喜び。自分だけの器を作ろう。", category: "creative", difficulty: 3, cost: 3, indoor: 1, tags: ["art", "solo", "relaxing"] },
  { name: "イラスト", nameEn: "Illustration", description: "頭の中のイメージを紙やデジタルで表現。練習あるのみ！", category: "creative", difficulty: 2, cost: 1, indoor: 1, tags: ["art", "solo", "digital"] },
  { name: "プログラミング", nameEn: "Programming", description: "コードで世界を変える。無料で始められる最強の趣味。", category: "creative", difficulty: 3, cost: 1, indoor: 1, tags: ["tech", "solo", "practical"] },
  { name: "作曲・DTM", nameEn: "Music Production", description: "パソコンで音楽を作る。GarageBandなら無料で始められる。", category: "creative", difficulty: 3, cost: 2, indoor: 1, tags: ["music", "solo", "digital"] },
  { name: "動画編集", nameEn: "Video Editing", description: "思い出をドラマチックに。YouTuberへの第一歩かも？", category: "creative", difficulty: 3, cost: 2, indoor: 1, tags: ["tech", "solo", "digital"] },
  { name: "革細工", nameEn: "Leathercraft", description: "革の質感と経年変化を楽しむ。財布やキーケースが作れる。", category: "creative", difficulty: 3, cost: 3, indoor: 1, tags: ["craft", "solo", "practical"] },
  { name: "盆栽", nameEn: "Bonsai", description: "小さな鉢に大自然を表現。意外と若い人にも人気上昇中。", category: "creative", difficulty: 3, cost: 2, indoor: 1, tags: ["nature", "solo", "relaxing"] },
  { name: "切り絵", nameEn: "Paper Cutting Art", description: "紙とカッターで生み出す繊細なアート。集中力MAX。", category: "creative", difficulty: 2, cost: 1, indoor: 1, tags: ["art", "solo", "cheap"] },
  { name: "刺繍", nameEn: "Embroidery", description: "布にカラフルな糸で描く。ワンポイントから始めよう。", category: "creative", difficulty: 2, cost: 1, indoor: 1, tags: ["craft", "solo", "relaxing"] },
  { name: "アクセサリー作り", nameEn: "Jewelry Making", description: "世界にひとつだけのアクセサリー。プレゼントにも最適。", category: "creative", difficulty: 2, cost: 2, indoor: 1, tags: ["craft", "solo", "practical"] },
  { name: "スクラップブッキング", nameEn: "Scrapbooking", description: "写真や切り抜きで思い出をデコレーション。記録と表現の融合。", category: "creative", difficulty: 1, cost: 2, indoor: 1, tags: ["art", "solo", "memory"] },
  { name: "3Dプリント", nameEn: "3D Printing", description: "デジタルデータを現実の物体に。未来の工作技術。", category: "creative", difficulty: 4, cost: 4, indoor: 1, tags: ["tech", "solo", "modern"] },
  { name: "ミニチュア制作", nameEn: "Miniature Crafts", description: "小さな世界を精密に作り上げる。ドールハウスやジオラマ。", category: "creative", difficulty: 3, cost: 3, indoor: 1, tags: ["craft", "solo", "detail"] },
  { name: "ハンドレタリング", nameEn: "Hand Lettering", description: "おしゃれな文字デザイン。カフェのメニューみたいなやつ！", category: "creative", difficulty: 2, cost: 1, indoor: 1, tags: ["art", "solo", "trendy"] },
  { name: "消しゴムはんこ", nameEn: "Eraser Stamps", description: "消しゴムを彫ってオリジナルスタンプ。年賀状にも活躍。", category: "creative", difficulty: 2, cost: 1, indoor: 1, tags: ["craft", "solo", "cheap"] },

  // ========== Physical (フィジカル) ==========
  { name: "ボルダリング", nameEn: "Bouldering", description: "壁を登るパズル。頭も体も使う最高のスポーツ。", category: "physical", difficulty: 3, cost: 3, indoor: 1, tags: ["sport", "social", "exciting"] },
  { name: "ジョギング", nameEn: "Jogging", description: "靴さえあれば今すぐ始められる。朝ランは最高に気持ちいい。", category: "physical", difficulty: 2, cost: 1, indoor: 0, tags: ["sport", "solo", "cheap"] },
  { name: "ヨガ", nameEn: "Yoga", description: "体と心を整える。YouTubeで無料レッスンが山ほどある。", category: "physical", difficulty: 2, cost: 1, indoor: 1, tags: ["wellness", "solo", "relaxing"] },
  { name: "ダンス", nameEn: "Dance", description: "音楽に合わせて体を動かす喜び。ジャンルは無限大。", category: "physical", difficulty: 3, cost: 2, indoor: 1, tags: ["sport", "social", "fun"] },
  { name: "水泳", nameEn: "Swimming", description: "全身運動の王様。浮かんでいるだけでも気持ちいい。", category: "physical", difficulty: 2, cost: 2, indoor: 1, tags: ["sport", "solo", "healthy"] },
  { name: "サイクリング", nameEn: "Cycling", description: "風を切って走る爽快感。通勤にも使えて一石二鳥。", category: "physical", difficulty: 2, cost: 3, indoor: 0, tags: ["sport", "solo", "outdoor"] },
  { name: "ハイキング", nameEn: "Hiking", description: "自然の中を歩く贅沢。山頂でのおにぎりは格別。", category: "physical", difficulty: 2, cost: 1, indoor: 0, tags: ["nature", "social", "outdoor"] },
  { name: "テニス", nameEn: "Tennis", description: "爽快なラリー。初心者同士でも楽しめるスポーツ。", category: "physical", difficulty: 3, cost: 3, indoor: 0, tags: ["sport", "social", "competitive"] },
  { name: "バドミントン", nameEn: "Badminton", description: "手軽に始められるラケットスポーツ。公園でもOK。", category: "physical", difficulty: 2, cost: 1, indoor: 0, tags: ["sport", "social", "fun"] },
  { name: "卓球", nameEn: "Table Tennis", description: "超高速のラリーが癖になる。温泉旅館でおなじみ。", category: "physical", difficulty: 2, cost: 2, indoor: 1, tags: ["sport", "social", "fun"] },
  { name: "スケートボード", nameEn: "Skateboarding", description: "ストリートカルチャーの象徴。転んで覚える青春の味。", category: "physical", difficulty: 4, cost: 3, indoor: 0, tags: ["sport", "solo", "exciting"] },
  { name: "サーフィン", nameEn: "Surfing", description: "波と一体になる究極の自然体験。一度ハマると抜けられない。", category: "physical", difficulty: 4, cost: 4, indoor: 0, tags: ["sport", "solo", "nature"] },
  { name: "キャンプ", nameEn: "Camping", description: "自然の中で過ごす非日常。焚き火の前で飲むコーヒーは最高。", category: "physical", difficulty: 2, cost: 3, indoor: 0, tags: ["nature", "social", "outdoor"] },
  { name: "釣り", nameEn: "Fishing", description: "待つ時間も楽しみのうち。釣れた時の興奮は言葉にできない。", category: "physical", difficulty: 2, cost: 3, indoor: 0, tags: ["nature", "solo", "relaxing"] },
  { name: "弓道", nameEn: "Kyudo", description: "日本古来の武道。精神統一と的に当たる快感。", category: "physical", difficulty: 3, cost: 3, indoor: 1, tags: ["martial_arts", "solo", "traditional"] },
  { name: "太極拳", nameEn: "Tai Chi", description: "ゆっくりした動きで心身を整える。公園で朝やるのが定番。", category: "physical", difficulty: 2, cost: 1, indoor: 0, tags: ["martial_arts", "solo", "relaxing"] },
  { name: "ストレッチ", nameEn: "Stretching", description: "体の柔軟性を取り戻す。寝る前の5分から始めよう。", category: "physical", difficulty: 1, cost: 1, indoor: 1, tags: ["wellness", "solo", "easy"] },
  { name: "筋トレ", nameEn: "Weight Training", description: "自分の限界に挑戦。自重トレーニングなら器具いらず。", category: "physical", difficulty: 3, cost: 1, indoor: 1, tags: ["sport", "solo", "healthy"] },
  { name: "ウォーキング", nameEn: "Walking", description: "歩くだけで健康に。知らない道を歩くのが意外と楽しい。", category: "physical", difficulty: 1, cost: 1, indoor: 0, tags: ["wellness", "solo", "easy"] },
  { name: "マラソン", nameEn: "Marathon", description: "42.195kmの挑戦。達成感は人生最高レベル。", category: "physical", difficulty: 5, cost: 2, indoor: 0, tags: ["sport", "solo", "challenge"] },
  { name: "縄跳び", nameEn: "Jump Rope", description: "子どもの頃を思い出す。実はめちゃくちゃいい全身運動。", category: "physical", difficulty: 2, cost: 1, indoor: 0, tags: ["sport", "solo", "cheap"] },
  { name: "フットサル", nameEn: "Futsal", description: "少人数でサッカーの楽しさを。社会人チームも多いよ。", category: "physical", difficulty: 3, cost: 2, indoor: 1, tags: ["sport", "social", "competitive"] },

  // ========== Social (ソーシャル) ==========
  { name: "ボードゲーム", nameEn: "Board Games", description: "画面の外にある本当の対戦。カタンから始めてみない？", category: "social", difficulty: 1, cost: 2, indoor: 1, tags: ["game", "group", "fun"] },
  { name: "料理パーティー", nameEn: "Cooking Party", description: "みんなで作って食べる幸せ。餃子パーティーがおすすめ。", category: "social", difficulty: 2, cost: 2, indoor: 1, tags: ["food", "group", "fun"] },
  { name: "読書会", nameEn: "Book Club", description: "同じ本を読んで語り合う。一人では気づかない発見がある。", category: "social", difficulty: 1, cost: 1, indoor: 1, tags: ["culture", "group", "intellectual"] },
  { name: "ボランティア", nameEn: "Volunteering", description: "誰かの役に立つ喜び。新しい出会いと視野が広がる。", category: "social", difficulty: 1, cost: 1, indoor: 0, tags: ["community", "group", "meaningful"] },
  { name: "合唱", nameEn: "Choir", description: "声を合わせる一体感。お風呂で歌う人なら素質あり。", category: "social", difficulty: 2, cost: 1, indoor: 1, tags: ["music", "group", "fun"] },
  { name: "即興劇", nameEn: "Improv Theater", description: "台本なしの演技。笑いとコミュニケーション力がアップ。", category: "social", difficulty: 3, cost: 2, indoor: 1, tags: ["performance", "group", "exciting"] },
  { name: "人狼ゲーム", nameEn: "Werewolf Game", description: "嘘を見抜け！心理戦の王様。友達との関係が深まる（か壊れる）。", category: "social", difficulty: 2, cost: 1, indoor: 1, tags: ["game", "group", "exciting"] },
  { name: "カラオケ", nameEn: "Karaoke", description: "歌って発散！上手い下手は関係ない、楽しんだもん勝ち。", category: "social", difficulty: 1, cost: 2, indoor: 1, tags: ["music", "group", "fun"] },
  { name: "フリーマーケット出店", nameEn: "Flea Market", description: "いらないものが誰かの宝物に。商売の楽しさも味わえる。", category: "social", difficulty: 2, cost: 1, indoor: 0, tags: ["community", "social", "practical"] },
  { name: "町歩きツアー", nameEn: "City Walking Tour", description: "ガイド付きで街を再発見。地元でも知らない場所がいっぱい。", category: "social", difficulty: 1, cost: 1, indoor: 0, tags: ["culture", "group", "outdoor"] },
  { name: "ワイン会", nameEn: "Wine Tasting", description: "大人の社交場。ワインの知識がなくても雰囲気を楽しもう。", category: "social", difficulty: 1, cost: 3, indoor: 1, tags: ["food", "group", "luxury"] },
  { name: "将棋クラブ", nameEn: "Shogi Club", description: "頭脳のぶつかり合い。近所の将棋クラブは意外とアットホーム。", category: "social", difficulty: 3, cost: 1, indoor: 1, tags: ["game", "social", "intellectual"] },
  { name: "麻雀", nameEn: "Mahjong", description: "運と実力のバランスが絶妙。4人揃えば卓を囲もう。", category: "social", difficulty: 3, cost: 2, indoor: 1, tags: ["game", "group", "strategic"] },
  { name: "ダーツ", nameEn: "Darts", description: "的を狙う集中力。バーで気軽に始められる大人の遊び。", category: "social", difficulty: 2, cost: 2, indoor: 1, tags: ["game", "social", "fun"] },
  { name: "ビリヤード", nameEn: "Billiards", description: "物理学と芸術の融合。かっこよく球を沈めたい。", category: "social", difficulty: 2, cost: 2, indoor: 1, tags: ["game", "social", "fun"] },
  { name: "クイズ大会", nameEn: "Quiz Competition", description: "知識を競い合う楽しさ。早押しの快感はやみつきに。", category: "social", difficulty: 2, cost: 1, indoor: 1, tags: ["game", "group", "intellectual"] },
  { name: "地域イベント参加", nameEn: "Community Events", description: "お祭りやマルシェに参加。地元の繋がりが広がる。", category: "social", difficulty: 1, cost: 1, indoor: 0, tags: ["community", "group", "fun"] },
  { name: "SNS発信", nameEn: "Social Media", description: "自分の好きなことを発信。同じ趣味の仲間が見つかるかも。", category: "social", difficulty: 1, cost: 1, indoor: 1, tags: ["digital", "solo", "modern"] },
  { name: "ポッドキャスト", nameEn: "Podcasting", description: "話すのが好きなら。スマホ一台で番組が作れる時代。", category: "social", difficulty: 2, cost: 1, indoor: 1, tags: ["digital", "social", "modern"] },
  { name: "TRPG", nameEn: "Tabletop RPG", description: "想像力で冒険する。ダイスを振って運命を決めよう。", category: "social", difficulty: 3, cost: 2, indoor: 1, tags: ["game", "group", "creative"] },
  { name: "謎解きイベント", nameEn: "Escape Room", description: "チームで謎に挑む。脱出できた時の達成感は格別。", category: "social", difficulty: 2, cost: 3, indoor: 1, tags: ["game", "group", "exciting"] },

  // ========== Learning (学び) ==========
  { name: "天体観測", nameEn: "Stargazing", description: "夜空を見上げるだけで宇宙旅行。スマホアプリで星座もすぐわかる。", category: "learning", difficulty: 1, cost: 1, indoor: 0, tags: ["science", "solo", "relaxing"] },
  { name: "語学学習", nameEn: "Language Learning", description: "新しい言語は新しい世界の扉。Duolingoなら無料で始められる。", category: "learning", difficulty: 3, cost: 1, indoor: 1, tags: ["education", "solo", "practical"] },
  { name: "歴史探索", nameEn: "History Exploration", description: "過去を知ると現在が面白くなる。お城巡りから始めてみない？", category: "learning", difficulty: 2, cost: 1, indoor: 0, tags: ["culture", "solo", "intellectual"] },
  { name: "哲学読書", nameEn: "Philosophy Reading", description: "人生の大きな問いを考える。ソクラテスから始めよう。", category: "learning", difficulty: 3, cost: 1, indoor: 1, tags: ["education", "solo", "intellectual"] },
  { name: "株式投資", nameEn: "Stock Investing", description: "経済と社会の仕組みを学ぶ。少額からの投資信託がおすすめ。", category: "learning", difficulty: 3, cost: 2, indoor: 1, tags: ["finance", "solo", "practical"] },
  { name: "数学パズル", nameEn: "Math Puzzles", description: "論理的思考力を鍛える。解けた時のアハ体験が快感。", category: "learning", difficulty: 3, cost: 1, indoor: 1, tags: ["education", "solo", "intellectual"] },
  { name: "資格取得", nameEn: "Certification Study", description: "目標があると勉強が楽しい。合格証書は最高のご褒美。", category: "learning", difficulty: 4, cost: 2, indoor: 1, tags: ["education", "solo", "practical"] },
  { name: "ドキュメンタリー鑑賞", nameEn: "Documentary Watching", description: "ソファで世界を冒険。NHKスペシャルの沼にハマろう。", category: "learning", difficulty: 1, cost: 1, indoor: 1, tags: ["culture", "solo", "easy"] },
  { name: "博物館巡り", nameEn: "Museum Visiting", description: "知の宝庫を歩く。企画展は毎回新しい発見がある。", category: "learning", difficulty: 1, cost: 2, indoor: 1, tags: ["culture", "solo", "intellectual"] },
  { name: "植物学", nameEn: "Botany", description: "道端の草花の名前を知るだけで散歩が10倍楽しくなる。", category: "learning", difficulty: 2, cost: 1, indoor: 0, tags: ["science", "solo", "nature"] },
  { name: "野鳥観察", nameEn: "Birdwatching", description: "双眼鏡片手に鳥を探す。意外と身近にレアな鳥がいる。", category: "learning", difficulty: 2, cost: 2, indoor: 0, tags: ["nature", "solo", "relaxing"] },
  { name: "楽器演奏", nameEn: "Musical Instrument", description: "音楽を聴くだけじゃない、奏でる喜び。ウクレレなら手軽。", category: "learning", difficulty: 3, cost: 3, indoor: 1, tags: ["music", "solo", "creative"] },
  { name: "書道", nameEn: "Shodo", description: "筆と墨で心を込めて書く。日本文化の奥深さを体感。", category: "learning", difficulty: 2, cost: 2, indoor: 1, tags: ["art", "solo", "traditional"] },
  { name: "将棋", nameEn: "Shogi", description: "日本のチェス。AIと対局すれば24時間練習できる。", category: "learning", difficulty: 3, cost: 1, indoor: 1, tags: ["game", "solo", "intellectual"] },
  { name: "囲碁", nameEn: "Go", description: "白と黒の石で宇宙を作る。シンプルなルールから無限の深さ。", category: "learning", difficulty: 4, cost: 1, indoor: 1, tags: ["game", "solo", "intellectual"] },
  { name: "チェス", nameEn: "Chess", description: "世界共通の頭脳スポーツ。chess.comで世界中と対局できる。", category: "learning", difficulty: 3, cost: 1, indoor: 1, tags: ["game", "solo", "intellectual"] },
  { name: "マインドマップ", nameEn: "Mind Mapping", description: "思考を可視化する技術。アイデア整理にも使える。", category: "learning", difficulty: 1, cost: 1, indoor: 1, tags: ["education", "solo", "practical"] },
  { name: "ジャーナリング", nameEn: "Journaling", description: "日記を超えた自己対話。書くことで心が整理される。", category: "learning", difficulty: 1, cost: 1, indoor: 1, tags: ["wellness", "solo", "relaxing"] },
  { name: "心理学", nameEn: "Psychology", description: "人間の心の仕組みを学ぶ。自分と他人の理解が深まる。", category: "learning", difficulty: 2, cost: 1, indoor: 1, tags: ["education", "solo", "intellectual"] },
  { name: "料理研究", nameEn: "Culinary Study", description: "レシピの科学を追求。なぜこの味になるのかを理解する。", category: "learning", difficulty: 2, cost: 2, indoor: 1, tags: ["food", "solo", "practical"] },
  { name: "地図読み", nameEn: "Map Reading", description: "地図を眺めるだけで旅気分。地形から歴史が見えてくる。", category: "learning", difficulty: 1, cost: 1, indoor: 1, tags: ["education", "solo", "relaxing"] },

  // ========== Relaxation (リラクゼーション) ==========
  { name: "アロマテラピー", nameEn: "Aromatherapy", description: "香りで癒される至福の時間。好きな香りを見つけるのも楽しい。", category: "relaxation", difficulty: 1, cost: 2, indoor: 1, tags: ["wellness", "solo", "relaxing"] },
  { name: "入浴剤作り", nameEn: "Bath Bomb Making", description: "自分だけのバスボムを作る。お風呂タイムが10倍楽しく。", category: "relaxation", difficulty: 1, cost: 2, indoor: 1, tags: ["craft", "solo", "relaxing"] },
  { name: "ジグソーパズル", nameEn: "Jigsaw Puzzle", description: "ピースを一つずつ埋めていく達成感。1000ピースに挑戦！", category: "relaxation", difficulty: 1, cost: 2, indoor: 1, tags: ["game", "solo", "relaxing"] },
  { name: "大人の塗り絵", nameEn: "Adult Coloring", description: "色を塗るだけで瞑想効果。無心になれる贅沢な時間。", category: "relaxation", difficulty: 1, cost: 1, indoor: 1, tags: ["art", "solo", "relaxing"] },
  { name: "観葉植物", nameEn: "Houseplants", description: "緑のある暮らし。育てる喜びと癒しを同時にゲット。", category: "relaxation", difficulty: 1, cost: 2, indoor: 1, tags: ["nature", "solo", "relaxing"] },
  { name: "コーヒー焙煎", nameEn: "Coffee Roasting", description: "自分で焙煎した豆で淹れるコーヒーは格別。沼が深い。", category: "relaxation", difficulty: 2, cost: 3, indoor: 1, tags: ["food", "solo", "luxury"] },
  { name: "紅茶", nameEn: "Tea Appreciation", description: "茶葉の世界は果てしなく広い。ティーポットでゆったりと。", category: "relaxation", difficulty: 1, cost: 2, indoor: 1, tags: ["food", "solo", "relaxing"] },
  { name: "お香", nameEn: "Incense", description: "煙の揺らぎに心が落ち着く。日本の伝統文化でもある。", category: "relaxation", difficulty: 1, cost: 2, indoor: 1, tags: ["wellness", "solo", "traditional"] },
  { name: "キャンドル作り", nameEn: "Candle Making", description: "炎の揺らぎは最高のリラクゼーション。手作りなら愛着も倍増。", category: "relaxation", difficulty: 2, cost: 2, indoor: 1, tags: ["craft", "solo", "relaxing"] },
  { name: "瞑想", nameEn: "Meditation", description: "何もしないことの豊かさ。5分から始めよう。アプリも便利。", category: "relaxation", difficulty: 1, cost: 1, indoor: 1, tags: ["wellness", "solo", "easy"] },
  { name: "自然散歩", nameEn: "Nature Walk", description: "目的なく自然の中を歩く。鳥の声、風の匂い、それだけで十分。", category: "relaxation", difficulty: 1, cost: 1, indoor: 0, tags: ["nature", "solo", "easy"] },
  { name: "温泉巡り", nameEn: "Hot Spring Touring", description: "日本に住んでるなら活用しないともったいない。極楽極楽。", category: "relaxation", difficulty: 1, cost: 2, indoor: 0, tags: ["wellness", "solo", "luxury"] },
  { name: "読書", nameEn: "Reading", description: "本を開けばどこへでも行ける。図書館なら無料で無限に。", category: "relaxation", difficulty: 1, cost: 1, indoor: 1, tags: ["culture", "solo", "easy"] },
  { name: "映画鑑賞", nameEn: "Movie Watching", description: "2時間で別世界を体験。サブスクで選び放題の贅沢。", category: "relaxation", difficulty: 1, cost: 1, indoor: 1, tags: ["culture", "solo", "easy"] },
  { name: "音楽鑑賞", nameEn: "Music Listening", description: "新しいジャンルを開拓してみない？レコードで聴くのも乙。", category: "relaxation", difficulty: 1, cost: 1, indoor: 1, tags: ["culture", "solo", "easy"] },
  { name: "ガーデニング", nameEn: "Gardening", description: "土いじりの癒し効果は科学的にも証明済み。ベランダでもOK。", category: "relaxation", difficulty: 2, cost: 2, indoor: 0, tags: ["nature", "solo", "relaxing"] },
  { name: "アクアリウム", nameEn: "Aquarium Keeping", description: "小さな水中世界を作る。魚が泳ぐ姿は永遠に見ていられる。", category: "relaxation", difficulty: 2, cost: 3, indoor: 1, tags: ["nature", "solo", "relaxing"] },
  { name: "ハンモック読書", nameEn: "Hammock Reading", description: "ゆらゆら揺れながら本を読む。これ以上の贅沢はない。", category: "relaxation", difficulty: 1, cost: 2, indoor: 0, tags: ["relaxing", "solo", "luxury"] },
  { name: "星空観察カフェ", nameEn: "Stargazing Cafe", description: "プラネタリウムカフェで星空を楽しむ。デートにも最適。", category: "relaxation", difficulty: 1, cost: 2, indoor: 1, tags: ["culture", "social", "relaxing"] },
  { name: "ぬいぐるみ収集", nameEn: "Plushie Collecting", description: "かわいいは正義。推しのぬいぐるみに囲まれる幸せ。", category: "relaxation", difficulty: 1, cost: 2, indoor: 1, tags: ["hobby", "solo", "fun"] },
  { name: "フォトアルバム整理", nameEn: "Photo Album", description: "思い出を振り返る穏やかな時間。デジタルでも紙でも。", category: "relaxation", difficulty: 1, cost: 1, indoor: 1, tags: ["memory", "solo", "relaxing"] },
  { name: "ヨガニドラ", nameEn: "Yoga Nidra", description: "寝ながらやるヨガ。究極のリラクゼーション体験。", category: "relaxation", difficulty: 1, cost: 1, indoor: 1, tags: ["wellness", "solo", "easy"] },
];

// Category metadata
export const COLORS = {
  creative: 0x9B59B6,
  physical: 0x2ECC71,
  social: 0xE67E22,
  learning: 0x3498DB,
  relaxation: 0xE91E63,
  default: 0x8B6914,
  gold: 0xFFD700,
  streak: 0xFF6B6B,
};

export const CATEGORY_EMOJI = {
  creative: "🎨",
  physical: "💪",
  social: "🤝",
  learning: "📚",
  relaxation: "🧘",
};

export const CATEGORY_NAME_JA = {
  creative: "クリエイティブ",
  physical: "フィジカル",
  social: "ソーシャル",
  learning: "学び",
  relaxation: "リラクゼーション",
};

// Get hobbies by category
export function getHobbiesByCategory(category) {
  return hobbies.filter((h) => h.category === category);
}

// Get a random hobby, optionally filtered
export function getRandomHobby(excludeIds = [], category = null) {
  let pool = hobbies.filter((_, i) => !excludeIds.includes(i + 1));
  if (category) {
    pool = pool.filter((h) => h.category === category);
  }
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Find hobby by name (partial match)
export function findHobbyByName(name) {
  return hobbies.find(
    (h) => h.name === name || h.nameEn.toLowerCase() === name.toLowerCase()
  );
}

// Get hobby index (1-based ID)
export function getHobbyId(hobby) {
  return hobbies.indexOf(hobby) + 1;
}
