# kotoba-mado — Conventions

## Tone (絶対)
- 美しさ最優先。 出力は「人に見せられるレベル」 = スクショ撮りたくなる
- Rich の `Text` / `Panel` / `Console.print` のみ。Textual / interactive UI なし
- 出力はパイプ・ファイルにそのまま流せる (色は環境に応じて自動で消える)
- 英語の混入禁止 (legend, headers すべて日本語)

## Visual
- ジュエルトーン: 藍 #2a3f6e / 琥珀 #d49a3f / 朱 #a8453c / 翠 #4a7d5a / 紫 #7a5a8c / 金 #c8a248
- 鉛枠 (leading): 黒 #1a1a1a に dim 銀 #5a6470
- 空白日: rgba 風の `──` で穏やかに
- ヘッダの「言葉の窓」は etched ふうに濃淡を変えた重ね打ち

## Data
- `~/.kotoba-mado/log.json` schema: `{ version, sessions: [ {date, language, category, minutes, note} ] }`
- 1 日に複数セッションあり。 集計時に minutes を足す
- ISO date / 2-letter language code (en, ja, ko, zh, fr...)

## Categories (順序固定)
- read  ─ 藍 ▓
- listen ─ 琥珀 ▒
- speak  ─ 朱 ░
- write  ─ 翠 ▚
- vocab  ─ 紫 ▞
- grammar ─ 金 ◆

## Tests
- pytest。Rich の `Console(record=True, force_terminal=False)` でテキスト出力をキャプチャ
- 純粋関数は full pytest、CLI は capsys
