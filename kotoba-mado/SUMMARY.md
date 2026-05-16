# 言葉の窓 (kotoba-mado) — Build Summary

## What was built
語学学習者のための CLI ダッシュボード。`kotoba-mado year` と打つと、自分の
1 年間の学習記録が **12 × 31 のステンドグラスのモザイク** として描画される。
intensity は分数の量、色相は活動カテゴリ (read=藍, listen=琥珀, speak=朱,
write=翠, vocab=紫, grammar=金)。GitHub のコントリビューションヒートマップに
影響されているが、目的が違う — 「美しさで殴る」ことだけが目的のダッシュボード。
スクショして SNS に貼れる、それが成功条件。

## Discovery Roll
- **Source: 40** データ分析・ダッシュボード系
- **Persona: 34** 語学を勉強中の人
- **Platform: 2** CLI / terminal tool (Python)
- **Intent: 1** 美しさで殴る — スクショ撮りたくなるか

## Features Built
- **`kotoba-mado year`** — 1 年 = 12 列 × 31 行のステンドグラスモザイク。鉛枠 (Unicode box drawing) + ジュエルトーン、合計分数・連続日数 + 凡例。
- **`kotoba-mado month [YYYY-MM]`** — ひと月を月火水木金土日のグリッドで大きく、各日の分数を併記。月の合計を底に。
- **`kotoba-mado today [YYYY-MM-DD]`** — 1 日を Rich Panel でクローズアップ。優勢カテゴリの 8×3 ブロック + カテゴリ別分数。
- **`kotoba-mado streak`** — 連続学習日数を ASCII の焚火で表現。1-7 日: 小、8-30: 中、31+: 大。色は深紅から金色まで段階的にグロー。
- **`kotoba-mado add`** — 引数なしで対話モード、`add read 30 ja --note "Murakami"` でワンショット。日本語カテゴリ名 (読む/聴く/...) も OK。
- **`kotoba-mado import file.csv`** — date,language,category,minutes,note の CSV から一括取り込み。
- **`kotoba-mado demo`** — 過去 270 日にランダムな学習データを書き込んでビジュアルをデモ可能に。
- **2 トーンセル** — その日の活動が複数カテゴリにまたがる場合、セルが半分ずつ違う色に分割される (▌ + ▐)。
- **intensity quantization** — 1-15分=薄、15-30=中、30-60=濃、60-120=濃、120+=ピーク。色はクリーム白とジュエル色のミックスで段階表現。

## Tech Stack
- Python 3.10+
- Rich 13.x (色・Text・Panel・Group)
- argparse でサブコマンド構成
- JSON 永続化 (atomic write、~/.kotoba-mado/log.json)
- pytest + Rich の `Console(record=True)` でテキスト出力を捕捉
- 完全に stdout だけ。 TUI なし。 `cat`, `>`, パイプ可。

## Key Files
```
kotoba-mado/
├── src/kotoba_mado/
│   ├── __init__.py
│   ├── cli.py            # argparse + 各サブコマンド
│   ├── render.py         # 純粋関数で Rich renderable を返す
│   ├── aggregate.py      # by_day / day_summary / year_summaries / streak / intensity_bucket
│   ├── models.py         # Session (frozen, validated), Log
│   ├── storage.py        # atomic JSON load/save
│   └── categories.py     # 6 カテゴリの順序・色・グリフ・normalize
├── tests/
│   ├── test_categories.py  # 6 tests
│   ├── test_models.py      # 7 tests
│   ├── test_storage.py     # 5 tests
│   ├── test_aggregate.py   # 9 tests
│   ├── test_render.py      # 11 tests
│   └── test_cli.py         # 11 tests
├── pyproject.toml
├── README.md / PLAN.md / CLAUDE.md
└── SUMMARY.md (this file)
```

## How to Run
```bash
cd kotoba-mado
pip install -e .

# サンプルでビジュアルを確認
kotoba-mado --data /tmp/demo.json demo
kotoba-mado --data /tmp/demo.json year
kotoba-mado --data /tmp/demo.json month 2026-05
kotoba-mado --data /tmp/demo.json today 2026-05-17
kotoba-mado --data /tmp/demo.json streak

# 自分のデータで使う (~/.kotoba-mado/log.json に保存)
kotoba-mado add 読む 30 ja --note "村上春樹"
kotoba-mado year

# テスト
pip install pytest
pytest -q                # 49 tests
```

## Tests
**49 passing** (categories 6 / models 7 / storage 5 / aggregate 9 / render 11 / cli 11)

## Challenges & Fixes
- **月ラベルの幅問題** — `1月` (3 visual cols, full-width 月) と `10月` (4 cols) が同じ Python `len` で計算され、 `:^4` ではうまく中央寄せできなかった。月番号を「1 桁/2 桁」で分岐して visual width を固定した。
- **streak の box が非対称** — 上部 frame が固定 17 ダッシュ、下部が `8 + len(str(s))` だったので幅不一致。 inner_width を visual width で計算して `bar = "─" * inner_width` で揃えた。
- **`force_terminal=False` でも色タグが残る** — テストでは `color_system=None` を渡して色を完全に剥がし、テキスト断片のアサートに専念。
- **対話モードでテストが固まる** — `add` サブコマンドで引数なしだと `console.input` を呼ぶので、 CLI テストでは必ず category 等を引数で渡すパスのみテスト。

## Potential Next Steps
- `kotoba-mado wall <YEAR>` — 12-月並び 4×3 グリッドの「壁画」レイアウト (より縦長な部屋向け)
- 言語別のフィルタ — `kotoba-mado year --lang ja` で日本語学習だけ
- SVG 出力 — terminal だけでなく `kotoba-mado year --svg out.svg` で SNS 貼り付け用
- 月の合計目標 — 「今月 1000 分目標」をプログレスバーとして上に重ねる (ただし 美しさで殴る を侵さない範囲で)
- Anki / Duolingo CSV からの直接 import
