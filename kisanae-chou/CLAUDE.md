# kisanae-chou — Conventions

## トーン
- 「美しさ で 殴る」 — 強い 言葉、 数字 で の 評価、 採点 を 出さ ない
- 季節 と アニメ の 静か な 重なり を 主役 に、 メタ 解説 を 入れ 過ぎ ない
- BANNED_WORDS: 「神 アニメ」 「クソ アニメ」 「神 回」 「ランキング」 「TOP」 「最強」 「ダメ」 「お前」

## 図 の デザイン
- 色: 月 ごと に パレット (1 月 = 雪 グレー / 2 月 = 梅 ピンク / 3 月 = 桃 / 4 月 = 桜 / 5 月 = 若葉 / 6 月 = あじさい 紫 / 7 月 = 朝顔 青 / 8 月 = 向日葵 黄 / 9 月 = 萩 / 10 月 = 金木犀 / 11 月 = 紅葉 / 12 月 = 雪 白)
- 全体 トーン は 淡 め、 アルファ 0.5-0.7 を 多用
- フォント: matplotlib デフォルト (DejaVu) + 日本語 は `Hiragino Sans` / `Yu Gothic` / `Noto Sans CJK JP` の フォール バック
- 余白 (margin) は たっぷり、 主役 (季節 帯) と 副 (アニメ 円) の 比率 を 守る
- 線 は 細め (linewidth 0.8-1.5)、 円 は r=4 程度
- 背景 は 紙 風 #faf6ee、 罫線 薄く

## データ
```python
@dataclass
class AnimeShow:
    title: str
    start: date         # 放映 開始
    end: date           # 放映 終了
    episodes: int
    genre: str          # action/drama/slice_of_life/mystery/fantasy/comedy/horror

@dataclass
class SeasonalEvent:
    name: str           # "桜 開花" "梅雨 入り"
    start: date
    end: date
    category: str       # "節気" / "花" / "野菜" / "魚介" / "果物"
    color: str          # hex
```

## 純ロジック と 描画 の 分離
- `data.py` — サンプル データ のみ、 計算 ロジック を 含まない
- `palette.py` — 月 ごと の 色 マップ、 ジャンル の 色
- `layout.py` — 「アニメ を 月 ごと に bucket 化」 等 の 純関数、 matplotlib に 依存 し ない
- `plots.py` — matplotlib に 触る 唯一 の 場所、 Figure を 返す
- `compose.py` — PIL で 4 枚 を 縦 結合
- `run.py` — エントリ ポイント、 PNG を `out/` に 書き出す
- テスト は data.py / palette.py / layout.py を 重点 的 に、 plots.py は 「Figure が 作れる」 「保存 が 失敗 しない」 の smoke

## 出力 サイズ
- year_timeline: 1800×900 (SNS 横 投稿 想定)
- month_card: 1200×1200 (Insta 正方形)
- season_scroll: 1200×4800 (1 季 1200×1200 を 4 段)
- palette_year: 1200×400 (帯)

## やら ない こと
- アニメ の 評価 / レーティング (Intent 1 で 採点 系 は NG)
- ランキング (10 位 や TOP 5 は 一切 出さ ない)
- 自分 の 視聴 した 「本数 が 多い 月」 を 強調 (中立 に 並べる だけ)
- 各 アニメ の 写真 / ロゴ (著作 権 を 考え、 タイトル 文字 だけ)
