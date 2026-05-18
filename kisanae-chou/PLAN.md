# kisanae-chou — 実装 計画

## Phase 1: Scaffold
- pyproject.toml
- README / CLAUDE / PLAN / .gitignore

## Phase 2: データ + 純ロジック
- `kisanae_chou/data.py` — 40 本 の アニメ + 30 件 の 季節 event + 24 節気
- `kisanae_chou/palette.py` — 月 12 色 + ジャンル 7 色
- `kisanae_chou/layout.py` — month_bucket / season_split / overlap 検出
- `kisanae_chou/banned.py` — 監査

## Phase 3: 描画
- `kisanae_chou/plots.py` — Figure 4 関数: year_timeline / month_card / season_scroll / palette_year
- `kisanae_chou/compose.py` — PIL 縦 結合
- `kisanae_chou/run.py` — エントリ、 out/ に 全 PNG

## Phase 4: notebook.ipynb
- 上 から 順 に: タイトル → year_timeline → month_card 12 枚 → season_scroll → palette_year
- マークダウン セル で 各 図 の 説明 を 1 段落 ずつ

## Phase 5: Tests
- `tests/test_data.py` — 40 本、 ジャンル enum、 重複 なし、 日付 妥当
- `tests/test_layout.py` — bucketing、 overlap、 季節 分割
- `tests/test_palette.py` — 12 月、 ジャンル 全 色
- `tests/test_plots.py` — Figure 生成 smoke、 PNG 保存 (tmp_path)
- `tests/test_banned.py` — 全 文字列 監査

## Phase 6: Verify
- `pytest` 全 PASS
- `python -m kisanae_chou.run` で out/ に 5 種 の PNG (year, 12 month, scroll, palette)
- notebook.ipynb の セル 構造 を 検証 (実行 はしない、 構造 だけ)

## Phase 7: Polish + commit
- BANNED 監査
- 親 dashboard 更新 + commit + push
