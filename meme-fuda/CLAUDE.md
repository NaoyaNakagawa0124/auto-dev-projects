# meme-fuda — Conventions

## Tone (絶対)
- 顔文字は柔らかい系のみ ((◕‿◕) (´• ω •`) (´∀｀) など)。 棘・怒り系は禁止
- 「ネット民が笑う」ものではなく「家族が読んで微笑む」もの
- 起動メッセージは命令ではなく招待 (「ふたりで開いてくれた?」)

## Visual
- 紙の色: #ebe2c8 (墨流し和紙)
- 墨色: #2b2820 (主文字)
- 鈍金: #b8945b (アクセント)
- 薄紅: #c47b76 (タグ)
- 枠は箱罫線 (`╭ ╮ ╰ ╯ ─ │`)、 dim グレー
- フォントは Textual の bold で十分大きく見せる

## Data
- 1 札 = `{id, template_id, top, bottom, speaker, writer, tags[], created_at}`
- top/bottom 各 40 文字まで
- `~/.meme-fuda/deck.json` schema: { version, cards: [Card] }

## Tests
- pytest + pytest-asyncio
- Textual の `run_test()` でモーダル経由のフローを smoke
- Card render は Rich の `Console(record=True)` でテキスト捕捉
