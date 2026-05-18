# 季重ね帖 (kisanae-chou) — Summary

## What was built
1 年 分 の アニメ 視聴 履歴 を、 日本 の 季節 カレンダー (24 節気 / 旬 の 野菜 / 桜 前線 / 花) に 「重ねる」 美 ノート。 Jupyter で 上 から セル を 走らせる か、 `python -m kisanae_chou.run` を 叩く と、 出力 ディレクトリ に 15 枚 の PNG が 並ぶ:

- `year_timeline.png` — 12 月 横並び の 重ね 表 (1800×900) — アニメ を 色 円 で、 旬 / 節気 / 花 を 帯 で
- `month_01.png` ... `month_12.png` — 月 別 拡大 カード (1200×1200) — Insta 投稿 サイズ
- `season_scroll.png` — 春夏秋冬 縦 巻物 (1200×4800)
- `palette_year.png` — 12 月 パレット 帯 (1200×400)

Persona 16 (アニメ / 漫画 視聴 管理 が 必要 な オタク) が 「2026 年 春 に 観た 7 本」 を 思い出す とき、 タイト ル の リスト で は な く 「4 月 は タケノコ と 桜 と あの 作品 が 一緒 だった」 と いう 季節 の 厚み で 振り返れる よう に。 Intent 1 (美しさ で 殴る) — スクリーン ショット を 撮って SNS に 投稿 し たく なる 仕上がり を 目指した。

## Discovery Roll
- **Source 21**: Agriculture, farming, or sustainability news
- **Persona 16**: アニメ / 漫画 視聴 管理 が 必要 な オタク
- **Platform 12**: Jupyter notebook / data visualization
- **Intent 1**: 美しさ で 殴る — アート / 表現 / 見惚れる 体験

「農業 ニュース」 と 「アニメ オタク」 を そのまま 接続 する の は 飛躍 だ が、 季節 = 旬 = アニメ クール の 3 つ が 「1 年 を 12 等 分 する カレンダー」 で 重なる 点 に 着目。 採点 / ランキング を 一切 出さ ない (CLAUDE.md で 明文 化)、 ただ 「重なり の 美 し さ」 を 並べる だけ の 設計 で Intent 1 を 守る。

## Tech Stack
- Python 3.10+ / matplotlib 3.10 / numpy 2.2 / PIL (Pillow 12)
- 純ロジック (data / palette / layout / banned) と matplotlib 描画 (plots) を 完全 分離
- 描画 は 5 関数 (year_timeline / month_card × 12 / season_scroll / palette_year)
- 紙 風 背景 #faf6ee + 月 ごと の 淡 い パレット 12 色 + ジャンル 色 7 色
- Hiragino Sans フォール バック で 日本語 描画
- Jupyter notebook は 純 .ipynb 形式、 起動 セット アップ 用 セル + 4 種 の 出力 セル
- pytest 41 件 で 純ロジック + smoke カバー、 PIL 出力 を tmp_path で 検証

## Features
- **5 種類 の 美術 出力 / 計 15 枚** — year_timeline / 12 月別 カード / season_scroll / palette_year
- **40 本 の サンプル アニメ** — 4 クール (winter/spring/summer/autumn) + 通年 4 本 + 短編 4 本、 ジャンル 7 種 (action / drama / slice_of_life / mystery / fantasy / comedy / horror)
- **30 件 の 季節 event** — 24 節気 (12)、 花 (8)、 野菜 (10)、 魚介 (6)、 果物 (4)
- **月 別 12 色 パレット** — 睦月 雪 グレー → 如月 梅 ピンク → 弥生 桃 → 卯月 桜 → 皐月 若葉 → … → 師走 雪 白
- **ジャンル 色** — action = 朱、 drama = 青、 slice_of_life = 抹茶、 mystery = 紫紺、 fantasy = 桜紫、 comedy = 山吹、 horror = 鉛
- **month_overlap_days / bucket_anime_by_month** — 月 を またぐ アニメ を 適切 に 各 月 へ 配分 (放映 期間 を 日割 り)
- **生成 物 は 著作 物 ゼロ** — アニメ タイトル / 季節 名 は 創作 / 一般 名詞、 著作 権 リスク 無し
- **CLI** — `python -m kisanae_chou.run --out out --year 2026` で 15 枚 全部
- **Jupyter** — `jupyter notebook notebook.ipynb` で セル 単位 に 確認
- **BANNED_WORDS 監査** — 「神 アニメ」 「クソ アニメ」 「神 回」 「ランキング」 「TOP」 「最強」 「ダメ」 「お前」 を pytest で 走査

## Tests (41 passing)
- `tests/test_data.py` (9) — 40 本、 ID unique、 ジャンル enum、 日付 妥当、 30 件 の event、 カテゴリ enum、 色 hex 形式、 各 月 に アニメ が ある
- `tests/test_layout.py` (12) — days_overlap (基本 / 重なり 無し / 同一)、 month_overlap (全月 / 部分 / なし)、 bucket (12 keys / 各月 entry / 単一 月 配置)、 count、 season_of_month、 months_in_season、 events_active_in_month
- `tests/test_palette.py` (8) — MONTH_PALETTE 12、 hex 戻り 値、 dark 違い、 ラベル 確認、 ジャンル 全 色、 fallback、 category、 year_palette
- `tests/test_plots.py` (6) — year_timeline / month_card × 12 / palette_year / season_scroll の 生成、 save_fig が PNG 出力、 render_all が 15 枚 全部
- `tests/test_banned.py` (5) — find hit / miss、 anime title 監査、 event 名 監査、 UI 文字列 監査

## Files (6 src + 5 test + 1 notebook, ~1,700 LOC)
```
kisanae-chou/
├── pyproject.toml
├── README.md / PLAN.md / CLAUDE.md / SUMMARY.md / .gitignore
├── notebook.ipynb              # 6 cell の Jupyter ノート
├── kisanae_chou/
│   ├── __init__.py
│   ├── data.py                 # 40 アニメ + 30 event
│   ├── palette.py              # 月 12 色 + ジャンル 7 色
│   ├── layout.py               # 純ロジック (overlap / bucket)
│   ├── plots.py                # matplotlib (4 種 の 図)
│   ├── run.py                  # CLI エントリ
│   └── banned.py
├── tests/                      # 5 files / 41 tests
└── out/                        # 出力 (gitignored、 .gitkeep のみ コミット)
```

## How to Run
```bash
cd kisanae-chou
pip install -e ".[dev]"
pytest                              # 41 tests
python -m kisanae_chou.run          # out/ に 15 枚
# または:
jupyter notebook notebook.ipynb     # セル 単位 で 実行
```

## Challenges & Fixes
- **Figure リーク**: render_all が 15 枚 順 に 生成 する とき、 matplotlib の 「20 figure 開い た まま」 警告 が 出た。 `save_fig` 内 で `plt.close(fig)` を 追加 し て 解決
- **「▣」 が Hiragino Sans に 無い グリフ 警告**: 月 別 カード の セクション マーカー で 装飾 文字 「▣」 を 使った が、 matplotlib の 日本語 フォント (Hiragino Sans) に 含まれて おらず 警告 が 出た。 「●」 に 変更 — 警告 ゼロ
- **アニメ の 月 跨ぎ**: 1 月 に 始まって 3 月 に 終わる 12 話 を どう 月 別 に 配分 する か。 純関数 `bucket_anime_by_month` で 放映 日数 を 月 ご と に 計算 し、 エピソード を 日割 り で 整数 化 (最小 1) する 設計
- **著作 権 リスク 回避**: 実在 の アニメ タイトル / 画像 は 一切 使わ ず、 季節 を 反映 し た 創作 タイトル (「夜 桜 食堂」 「枝豆 と 銀河」 等) を 40 本 用意。 ユーザー は data.py を 自分 の 視聴 履歴 で 上書き する 設計 (README に 明記)

## Potential Next Steps
- 視聴 履歴 を CSV / JSON で 取り込む CLI フラグ (`--anime-csv my.csv`)
- AniList / Anikore API 連携 — ユーザー の 視聴 履歴 を 直接 引く
- 月 別 カード を SNS 投稿 用 に 自動 リサイズ (Twitter 16:9 / Insta 1:1 / Story 9:16 を 一括)
- ジャンル × 旬 食材 の 相関 ヒート マップ (「アニメ ジャンル ↔ 旬 の カテゴリ」 の 共起)
- 過去 5 年 分 を 並べる 「アニメ 視聴 履歴 と 季節 の 5 年 巻物」 (バックログ 振り返り)
- ダーク モード パレット (深 い 夜空 系 12 色)
- 同 設計 で 別 テーマ (映画 視聴 × 公開 月 / 音楽 アルバム × リリース 月) の バリアント
