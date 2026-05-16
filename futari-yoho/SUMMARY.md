# 二人予報 (futari-yoho) — Build Summary

## What was built
共働き夫婦のための、判定しない気分予報を表示する Textual TUI。各パートナーが
1 日 30 秒だけ 4 つの質問 (気分 / 体力 / 一人時間欲しい度 / 一言メモ) に
答えると、ダッシュボードは二人の状態を「天気」として並べて見せる。
スコアもランキングも「もっと話そう」もない。「今夜の二人は並んでいる夜」と、
そっと呟くだけ。

夜の照明のような配色 (紺 #1a2436 / 砂 #e8d6b3 / 月光 #c8b4d6 / 鈍金 #b8945b)
と、絵文字ではなく単一 Unicode グリフ (☀ ⛅ ☁ ☂ ⚡ ☾ 〜) で「静か」を維持。

## Discovery Roll
- **Source: 40** データ分析・ダッシュボード系
- **Persona: 26** 共働き夫婦
- **Platform: 3** Python desktop app (Textual TUI)
- **Intent: 4** そっと寄り添う (癒し / メンタル / 静か)

## Features Built
- **30 秒の check-in** — 4 ステップのモーダル (mood / energy / solo / note)。
  矢印キー、数字キー 1-5、Enter のみで完結。
- **天気マッピング** — 単独 (sun/haze/cloud/rain/storm/moon/calm) と
  二人 (話す夜 / 並んでいる夜 / ひとりひとりの夜 / 静かな夜 / 片方だけ / 未記入)
  を pure 関数で計算。判定しない言葉だけを使用。
- **今日の二人** — 二枚並びカード + 二人の天気カードに一言の whisper を添える。
- **この一週間のふたり** — 7 日 × (日付 / a の天気 / b の天気 / 二人ラベル) のグリッド。
- **月のふりかえり** — 28 日のミニ点線。dim な日と色のついた日が穏やかに混ざる。
- **二人の不在を許す** — どちらかが check-in しなくても画面は壊れず、
  「片方だけの空」と表示。
- **`--demo`** で一週間ぶんのサンプルデータを書き込んでから起動。
- **`--no-tui`** で「今日の二人」を 1 行 stdout に出力 (cron / 通知用)。

## Tech Stack
- Python 3.10+
- Textual 1.0.x (TUI)
- Rich (色とコンポジット)
- JSON ファイル永続化 (`~/.futari-yoho/data.json`)、atomic write
- pytest + pytest-asyncio + Textual `run_test()` pilot

## Key Files
```
futari-yoho/
├── src/futari_yoho/
│   ├── __init__.py
│   ├── cli.py            # entry point + --demo + --no-tui
│   ├── app.py            # Textual app, CheckInModal, card formatters
│   ├── models.py         # CheckIn, Day, Partner, State (dataclasses + dict (de)serialize)
│   ├── storage.py        # atomic JSON read/write
│   ├── dates.py          # iso, parse_iso, week_dates
│   └── weather.py        # single_weather, paired_weather, month_trend
├── tests/
│   ├── test_models.py    # 9 tests
│   ├── test_dates.py     # 4 tests
│   ├── test_storage.py   # 5 tests
│   ├── test_weather.py   # 17 tests
│   └── test_app_smoke.py # 7 tests (Textual pilot)
├── pyproject.toml
├── README.md / PLAN.md / CLAUDE.md
└── SUMMARY.md (this file)
```

## How to Run
```bash
cd futari-yoho
pip install -e .
futari-yoho          # 起動 — c で「あ」、v で「い」の check-in
futari-yoho --demo   # 一週間ぶんのサンプルを書き込んでから起動
futari-yoho --no-tui # 「今日の二人」を 1 行 stdout に出力 (cron 向け)

# テスト
pip install pytest pytest-asyncio
pytest -q            # 42 tests
```

## Tests
**42 passing** (models 9 / dates 4 / storage 5 / weather 17 / app_smoke 7)

## Challenges & Fixes
- **`_render` 名前衝突** (gochisou-goyomi で踏んだのと同じバグ) → Textual の
  Widget._render とぶつかって CheckInModal がレンダリングできなかった。
  全ての `_render` を `_render_step` にリネームして解決。
- **`push_screen_wait` は worker 内のみ** → 1.0 の Textual では worker context が
  必要。代わりに `push_screen(modal, callback)` に書き換え、保存ロジックを
  callback に移動。
- **`pytest-asyncio` が config option を認識しない警告** →
  `asyncio_mode = "auto"` で十分。1 件の warning だが test は全部通る。
- **Python 3.10 互換** → `from __future__ import annotations` で `int | None`
  型注釈をすべて遅延評価にし、ランタイム評価される dict[str, X] 型ヒントも
  問題なし。`>=3.11` から `>=3.10` に下げた。
- **first-run UX** → データ無しでもクラッシュせず「まだ未記入」と表示し、
  hint 行で c / v を案内するように。

## Potential Next Steps
- パートナー名を options 画面で書き換え (今は JSON を直接 edit)
- 1 週間ごとの「ふりかえりノート」(過去の一言メモを並べて見る画面)
- リマインダー — `--no-tui` を OS の cron に登録するヘルパーコマンド
- 同期 — Dropbox / Google Drive に `data.json` を置く設定モード
- 月のふりかえりに気分の高低差グラフを薄く重ねる
- マスコット (i.e. 月の人) を導入する案 → 「指示しない」原則に反するので保留
