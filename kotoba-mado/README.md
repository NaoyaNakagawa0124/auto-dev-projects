# 言葉の窓 (kotoba-mado)

> 365 日の語学旅を、ターミナルに咲くステンドグラスとして眺める。

CLI で動く。 `kotoba-mado year` と打つと、あなたの 1 年分の語学学習が
12 × 31 のジュエルトーンのモザイクとなって出力される。Listen は琥珀、
Read は深い藍、Speak は朱、Write は翠、Vocab は紫、Grammar は金。
スクリーンショットを撮って人に見せたくなる、それを目指したダッシュボード。

```
            言 葉 の 窓
       〜  2026 年の語学旅  〜

      1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月
  1   ▒▒  ░░  ▓▓  ▓▓  ──  ──  ──  ──  ──  ──   ──   ──
  2   ▓▓  ▒▒  ░░  ▓▓  ──  ──  ──  ──  ──  ──   ──   ──
  ...
```

## Why a CLI?

- スクショして SNS に貼れる
- `kotoba-mado year > today.txt` でファイルに残せる
- ターミナルの fixed-width フォントは、モザイク表現と相性が良い
- 学習記録の入力は `kotoba-mado add` で 5 秒。継続する障壁を下げる

## What

- 学習セッション 1 件 = (日付, 言語, カテゴリ, 分数, 任意のメモ)
- カテゴリ: read / listen / speak / write / vocab / grammar
- データは `~/.kotoba-mado/log.json` に保存
- 描画は全部 stdout (Rich でカラー、TUI ではない)

## Commands

```bash
kotoba-mado year              # 12×31 のステンドグラス全年表示
kotoba-mado month             # 今月だけを大きく表示
kotoba-mado month 2026-05     # 任意の月を指定
kotoba-mado today             # 今日の窓を 1 枚クローズアップ
kotoba-mado streak            # 連続学習日数 + 焚火アスキー
kotoba-mado add               # 対話的に今日の学習を記録
kotoba-mado add read 30 en --note "Murakami"  # ワンライナーで記録
kotoba-mado import sessions.csv  # CSV から一括取り込み
kotoba-mado demo              # 1 年分のサンプルデータを書き込み
```

## Tech Stack

- Python 3.10+
- Rich (色、テキスト、レイアウト)
- argparse (CLI)
- JSON 永続化 (atomic write)
- pytest + capsys でスナップショット
