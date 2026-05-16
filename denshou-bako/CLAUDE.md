# denshou-bako — Conventions

## Tone (絶対)
- ノスタルジー / 説教 / 「教えてあげる」 風はゼロ
- 問いは丁寧体 + 短く + 開かれた問い (yes/no で答えにくい形)
- TTS で読み上げるので、 漢字より平易な表記を選ぶ
- カテゴリ名 + 問い番号は内部用、 ユーザーには見せない

## Visual (CLI)
- 配色: 鈍金 #b8945b、 墨 #2b2820、 dim #6b6458、 強調 #c47b76
- 配線図は dim な ASCII で、 emoji なし

## Data
- 録音 1 件 = `YYYY-MM-DD.wav` + `YYYY-MM-DD.json`
- json schema: `{ date, question_id, category, question_text, duration_s, skipped (bool) }`
- アーカイブは折りたたまない (1 年 1 フォルダではなく、 全部フラット)

## Hardware abstraction
- `Backend` interface: `speak(text)` + `wait_for_press()` + `record(out_path, max_s) → seconds_actual`
- 実装は subprocess とライブラリの thin wrapper
- `MockBackend` は test 用、 dev 用にも使える (キーボード入力で代用)
- `PiBackend` は GPIO/arecord/espeak、 import は lazy

## Tests
- pytest only
- 録音テストは MockBackend + tmp_path で完結
- 実機テストは別途 RUNNING.md でチェックリスト化
