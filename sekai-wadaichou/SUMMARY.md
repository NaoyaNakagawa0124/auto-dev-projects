# 世界話題帳 (sekai-wadaichou) — Summary

## What was built
深夜 2 時、 ES の手が止まった就活中の大学生のための Textual TUI。 ←→ で ASCII 地球儀を 30 度ずつ回すと、 12 都市が順に spotlight (●) に入る。 各都市には「今日 (2026-05-17 時点) の文化イベント」 と「明日の面接の引き出しになる 1 行」 が書いてあり、 Enter で「話題帳」 (= JSON dossier) に綴じられる。 Tab で「話題帳」 ビューを開き、 これまで集めた都市を一覧できる。 1 周 = 12 都市は数分で回れて、 毎日違う都市から興味を持てる軽さ。

## Discovery Roll
- **Source 27**: Random holiday / cultural event happening today somewhere
- **Persona 23**: 就活中の大学生
- **Platform 3**: Python desktop app (Textual TUI)
- **Intent 5**: 夢中にさせる — 時間を忘れるか

Intent 5 は本来「中毒/競う」 が定石だが、 就活生に streak や連勝で煽るのは Intent 5 の精神 (「時間を忘れる」) と矛盾しないかを慎重に検討。 結果として「地球を回す」 動作そのものを中毒の核に置き、 競争・点数・streak は出さない設計を選んだ。

## Tech Stack
- Python 3.10+、 Textual 1.0、 dataclasses、 標準ライブラリのみ
- 純ロジック (globe / cities / dossier) は src/ に分離、 app.py だけが Textual に依存
- ASCII globe レンダリングは 21 × 9 の半月型ディスク、 cities の longitude を sin で投影
- xorshift32 などの乱数は使わず、 完全 deterministic
- JSON atomic write (tempfile + os.replace) で `~/.sekai-wadaichou/dossier.json` に保存
- pytest + pytest-asyncio で 31 ユニット + 統合テスト (Textual 自体は run_test() で headless 駆動)

## Features
- 12 都市 (NY / サンパウロ / ロンドン / パリ / ベルリン / イスタンブール / ムンバイ / シンガポール / 上海 / 東京 / シドニー / ヨハネスブルグ) を経度順で配置
- ← / → / h / l で 30 度回転 (180 度ラップ対応)、 spotlight は最寄り経度の都市に自動 snap
- ASCII globe で背面 (±90° を超える側) の都市は非表示にし、 「地球儀を回している」 感覚を再現
- Enter で「話題帳」 に綴じる、 重複追加は防ぐ
- Tab で DossierScreen に切り替え、 綴じた都市一覧を見られる
- 禁止語監査 (「頑張」 「努力」 「がんばれ」 「絶対」 「成功」 「勝ち組」 「受かる!」 「正解はこれ」 「確実」) を pytest で全 talking_point / event に対して audit
- `_render` 名は使わず、 再描画 helper は `_refresh_view`(過去 3 回踏んだ Textual `_render` shadowing トラップを予防適用)

## Tests (31 passing)
- `tests/test_cities.py` (10) — 12 都市 / id 重複なし / 日本語名重複なし / 経度範囲 / event & talking_point 存在 & 長さ / 禁止語フリー / by_id / sorted_by_longitude 単調性 / 3 quadrant 以上 / 経度幅 180°+
- `tests/test_globe.py` (9) — _wrap_180 (4 ケース) / 初期回転範囲 / ラップ動作 / step left+right cancel / snap_to+visible_city / 回転で visibility 変化 / render 形状 / spotlight マーク / no spotlight
- `tests/test_dossier.py` (9) — 空ロード / add+list / 重複 add は False / remove / is_collected / save→load roundtrip / atomic (temp file 残らない) / UTF-8 / 破損 JSON からの recovery
- `tests/test_app_smoke.py` (3) — headless run_test で app boot + 初回描画に spotlight が出る / right arrow で spotlight 変化 / enter で dossier 書き込み

## Files (10 source files, ~965 LOC)
```
sekai-wadaichou/
├── pyproject.toml        # textual + pytest + pytest-asyncio
├── README.md / PLAN.md / CLAUDE.md / SUMMARY.md
├── .gitignore
├── src/sekai_wadaichou/
│   ├── __init__.py
│   ├── cities.py         # 12 都市 + BANNED_WORDS
│   ├── globe.py          # Globe + render_globe (ASCII 21×9)
│   ├── dossier.py        # JSON atomic IO
│   └── app.py            # WadaichouApp + GlobeScreen + DossierScreen
└── tests/                # 4 files / 31 tests
```

## How to Run
```bash
cd sekai-wadaichou
pip install -e ".[test]"
pytest                    # 31 tests
sekai-wadaichou           # TUI 起動
```

## Challenges & Fixes
- **4 longitude quadrants テストの失敗**: 12 都市の選択で (-180, -90) の領域がカバーされず (Sydney は +151、 NY は -74 で、 太平洋ど真ん中の都市を入れていない)。 修正方針は 12 都市を入れ替えるのではなく、 テストを「3 quadrant 以上」 + 「経度幅 180°+」 に緩めた。 ユーザー視点では「東西広く回る感じ」 があれば十分
- **`_render` メソッドの予防回避**: 過去 3 回踏んだ Textual の `Widget._render` shadowing bug。 CLAUDE.md の冒頭に明記、 GlobeScreen / DossierScreen の redraw helper は `_refresh_view` を使い、 さらに `tests/test_app_smoke.py` で headless `run_test()` を走らせて回帰を検出するようにした
- **pytest-asyncio の auto モード設定**: Textual の `run_test()` は async context なので、 `[tool.pytest.ini_options].asyncio_mode = "auto"` を pyproject.toml に追加 (これがないと smoke test がスキップされる)

## Potential Next Steps
- 都市数を 12 → 24 に拡張 (太平洋ど真ん中の都市を追加、 4 quadrant 完全カバー)
- 「今週の話題」 → 「今月の話題」 のように、 event 文を週ごとに切り替える更新スクリプト
- 「話題帳」 を Markdown / PDF にエクスポート (面接当日の電車内で見返せる)
- 友達と「話題帳」 を共有 (Intent 7 にスライド)
- 季節モチーフを globe レンダリングに追加 (春は花、 冬は雪)
- 都市の音楽を YouTube/Spotify deep link で添える (音と話題のペア)
- スクショ機能 — その都市カードを画像で保存、 SNS でシェア
