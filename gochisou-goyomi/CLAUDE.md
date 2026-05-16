# gochisou-goyomi — プロジェクトコンベンション

- Python 3.10+ (Textual 8.x の要件)
- 全 UI 日本語。料理名は日本語＋現地名 (英・現地語) を併記
- カラー: paper #f1ead2, ink #3b2f23, accent #c8804a, gold #d4a955, leaf #5e8c4e
- 永続化: `~/.gochisou-goyomi/state.json` (JSON、人読み可能)
- データは `gochisou_goyomi/holidays.py` の Python リテラルで管理 (JSON より型補完が利く)
- 食事ログは絶対に破棄しない (この記録は一年積み重ねる価値がある)
- Textual の Color / Style は ANSI 互換を意識
