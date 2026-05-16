# ミーム札 (meme-fuda) — Build Summary

## What was built
シニアと家族 (孫・子・配偶者) が、一台のラップトップを挟んで二人で
「思い出ミーム札」 を作る Textual TUI。 12 種類のかわいい顔文字テンプレ
(うれしい / こまった / なつかしい / ぐっすり / びっくり / 思い出した /
ほこらしい / ないしょ / ゆるした / まんぞく / とまどう / おはよう) のひとつを
選び、上下の 2 行に状況と落ちを書き込む。 札には「話: ばあちゃん / 書: 孫」
の足跡が残り、 ローカルの「家のデッキ」に積まれる。 数年後、 また二人で
めくり返して笑える。

起動画面が 「話す人」 「書く人」 を聞いてくる。 これが Intent 7 「2人で
開けるか」 の判定そのもの。 一人でも作れる (Esc で skip 可) けれど、
このアプリは「ふたりで開いた方が、 ちゃんと楽しい」 を 1 つの設計指針として
作られている。

## Discovery Roll
- **Source: 5** Viral memes and internet culture of the week
- **Persona: 36** 老後を楽しんでいるシニア
- **Platform: 3** Python desktop app (Textual TUI)
- **Intent: 7** 誰かと一緒にやる — 2 人で開けるか

## Features Built
- **12 templates** — 棘のない柔らかい顔文字のみ。 1-3 行の ASCII アートと、
  上下それぞれの hint テキスト (例文) を持つ。
- **SetupScreen** — 起動直後に「話す人 / 書く人」 を聞く。 Esc で skip 可。
- **ComposeScreen** — `Ctrl+←` / `Ctrl+→` でテンプレ切替、 上下 Input が
  リアルタイムでカードプレビューに反映、 `Ctrl+S` で保存、 `Ctrl+D` でデッキ
  画面へ。
- **DeckScreen** — 保存された札を `←` / `→` でめくる、 `Delete` で捨てる、
  `Esc` で戻る。 空の時は invitation message を表示。
- **Live preview** — テキストが空の時は hint がうっすら表示され、 書き込むと
  墨色の本文に変わる。 「話: X / 書: Y / 日付」 が下に常時表示。
- **タグ** — Card には tags[] フィールドがあり、 #昭和 #旅行 のように
  鈍金の小さな chip として描画される。
- **永続化** — `~/.meme-fuda/deck.json` に atomic write、 起動時 reload。

## Tech Stack
- Python 3.10+
- Textual 1.x
- Rich 13.x (Panel / Group / Text)
- JSON 永続化 + atomic temp+rename
- pytest + pytest-asyncio + Textual `run_test()` pilot
- 依存ゼロの純ロジック (`templates.py`, `models.py`, `render.py`) は
  Textual を一切 import しない。 TUI 抜きでテスト可。

## Key Files
```
meme-fuda/
├── src/meme_fuda/
│   ├── __init__.py
│   ├── cli.py            # entry, --speaker / --writer で setup skip
│   ├── app.py            # MemeFudaApp, SetupScreen, ComposeScreen, DeckScreen
│   ├── render.py         # render_card / render_card_plain / render_thumbnail
│   ├── models.py         # Card (validated, clamped) + Deck (CRUD)
│   ├── storage.py        # atomic JSON I/O
│   └── templates.py      # 12 kaomoji + hint テンプレ
├── tests/
│   ├── test_templates.py # 6 tests
│   ├── test_models.py    # 6 tests
│   ├── test_storage.py   # 5 tests
│   ├── test_render.py    # 7 tests
│   └── test_app_smoke.py # 11 tests (pilot)
├── pyproject.toml
├── README.md / PLAN.md / CLAUDE.md
└── SUMMARY.md
```

## How to Run
```bash
cd meme-fuda
pip install -e .
meme-fuda                       # setup → compose → deck
meme-fuda --speaker ばあちゃん --writer 孫   # setup skip

# テスト
pip install pytest pytest-asyncio
pytest -q                       # 35 tests
```

## Tests
**35 passing** (templates 6 / models 6 / storage 5 / render 7 / app_smoke 11)

## Challenges & Fixes
- **`_render` の名前衝突** (3 度目!) — Textual Widget の内部 `_render` と
  画面の `_render(self)` メソッドが衝突して ComposeScreen の本文が空。
  全部 `_refresh_view` にリネーム。 ── これは記憶に刻む。
- **Input が arrow key を吸う** — テンプレート切替を `left` / `right` に
  していたら、 Input に focus がある間 cursor 移動に吸われて反応せず。
  `Ctrl+←` / `Ctrl+→` に変えて priority=True 指定。 一般ユーザーの UX 的
  にも `Ctrl+矢印` の方が「カテゴリ切替」感が強い。
- **`Ctrl+D` も priority 指定が必要** — Input focus 下では bubble する前に
  消費されたので `priority=True` を追加。
- **Card 永続化のテスト** — `run_test()` は `tmp_path` でファイル書き
  保証なし、 と思っていたが `save(deck, path)` がきちんと atomic write
  しているのでテスト pass。

## Potential Next Steps
- ローマ字対応 — シニアが見るのは日本語、 でも入力が辛い人のために
  かな入力切替を視覚的にサポート (現状は OS の IME 頼り)
- 「今日の一枚」 起動オーバーレイ — 過去の札 1 枚をランダムに表示
- 印刷向けエクスポート — Card を A6 ポストカードサイズの SVG / PNG に
- LINE / メッセンジャー貼り付け用画像エクスポート
- ボイスメモ添付 (mp3 を Card に紐付け、 再生)
- 「これは父さんの話」 「これは母の話」 と複数人を同時に登録できる
  シャドウメンバー機能 (今は speaker/writer の 2 人だけ)
