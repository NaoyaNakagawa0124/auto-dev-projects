# ごちそう暦 (gochisou-goyomi) — SUMMARY

## 何を作ったか

毎日外食するフーディーの「今日何食べる？」を、世界の文化暦から提案する Textual TUI。

起動するたびに、今日 (または近隣日) に祝祭を持つ国を 1 つ提示し、その国の伝統食をおすすめします。実食ログを 5 段階で記録すると、今年の踏破国数・ストリーク・国別ランキングが統計画面で見られます。

例: 5/17 起動 → 🇳🇴 ノルウェー憲法記念日 → **ホットドッグ・イ・ロンペ** (薄焼きパンに茹でソーセージ)。

## 技術スタック

- **Python 3.10+** / **Textual 8.2** (modern TUI) / **Rich 13** (renderables)
- **永続化**: `~/.gochisou-goyomi/state.json` (JSON、人読み可能)
- **データ**: 81 件の文化暦エントリを Python リテラルで管理 (`holidays.py`)
- **テスト**: pytest 15 件 (データ整合性 / 暦ロジック / 永続化)

## 技術的判断

| 課題 | 解決 |
|---|---|
| Textual 8.x で Rich Panel を Static に渡すと描画失敗 | `compose()` で `Static(id=…)` を空で yield、`on_mount` で `update(panel)` を呼ぶパターンに統一 |
| `_render` メソッド名が Textual Widget の内部メソッドを上書きしてクラッシュ | 描画ヘルパを `_build_panel()` にリネーム |
| Input 入力中に screen の binding が効かない | 重要キー (c/s/1-5/q) に `ctrl+` 修飾 + `priority=True` を付けて常時有効化 |
| 「同じ日に複数の祝日」を毎日異なるものに | 14 日以内に使った `holiday_id` を除外する recent フィルタ |
| 該当日がない日のフォールバック | ±3 日まで広げて探索、それでもなければ "見つかりませんでした" を表示 |
| 食事ログを失わない | 同日 commit は上書き、ログは時系列ソート、JSON は ensure_ascii=False で人読み可能に |

## ファイル構成

```
gochisou-goyomi/
├── pyproject.toml          (textual>=8, rich>=13)
├── README.md, PLAN.md, CLAUDE.md, SUMMARY.md
├── src/gochisou_goyomi/
│   ├── __init__.py, __main__.py
│   ├── holidays.py          81 件の文化暦データ
│   ├── calendar.py          today_pick / month_summary / ±3 日探索
│   ├── state.py             Store / MealEntry / 統計
│   └── app.py               Textual TUI (TodayScreen / CalendarScreen / StatsScreen)
└── tests/test_calendar.py   15 件のユニットテスト
```

## 動かし方

```bash
cd gochisou-goyomi
pip install -e .
gochisou-goyomi               # コンソールスクリプト

# あるいは
python3 -m gochisou_goyomi

# テスト
pytest                        # 15 passing
```

## 操作

| キー | 操作 |
|---|---|
| Ctrl+C / C | 暦画面 |
| Ctrl+S / S | 統計画面 |
| O | 提案料理を Input にセット |
| X | Input をクリアして別の料理を入力 |
| Ctrl+1〜5 / 1〜5 | 評価して記録 |
| Esc | 前画面に戻る |
| Q | 終了 |

## 数値

- **テスト**: 15 / 15 passing
- **文化暦エントリ**: 81 件 (50+ 国)
- **コード**: Python 約 600 行
- **依存ライブラリ**: 2 つ (textual, rich)

## 次のステップ案

- 動的祝日 (旧正月など) 計算 — 現状は固定 MM-DD
- API 連動 (Holidays API / Google Calendar) で実際の祝日日付を更新
- 「最寄りの飲食店検索」連携 — 提案料理を出してくれる店を地図で
- ベジタリアン / アレルギー対応モード
- 友人と踏破国を比較するシェアモード
- ノートエントリを追加し、文字列の食事ログをマルチライン化
