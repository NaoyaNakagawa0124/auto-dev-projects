# 種交わせ (tane-kawase) — Build Summary

## What was built
語学を勉強中の二人 (たとえば 英語と日本語を交換する友人どうし) が、
互いに 5–10 個のことばを「種包」 (`packet.json`) として渡し合う CLI。
受け取った包は `tane-kawase plant packet.json` で自分の畑に植える。
畑は ASCII art の小さな野菜畑として表示され、 5 つのトピック (春菜・
夏野菜・秋穀・冬根・草花) で行が分かれている。 各列の数字と送り主の
名前が下に並ぶ。

「採点しない、 マスター率を出さない、 ただ二人で交わす儀式に集中する」
という設計方針。 Intent 7 (誰かと一緒にやる) のための CLI。

## Discovery Roll
- **Source: 21** Agriculture, farming, or sustainability news
- **Persona: 34** 語学を勉強中の人
- **Platform: 2** CLI / terminal tool (Python)
- **Intent: 7** 誰かと一緒にやる — 2 人で開けるか

## Features Built
- **5 トピック** (春菜=新表現、 夏野菜=動詞、 秋穀=慣用句、 冬根=丁寧体、 草花=スラング) それぞれ専用の作物グリフ (ψ ◯ ‖ ▽ ✿)
- **包 (Packet)** — 1-10 の種を持つ JSON ファイル。 送り主・受け取り手・言語・1-2 行の手紙が記録される
- **`pack`** — 対話的にひと包を作る
- **`send`** — `--seed "term | gloss | reading | example | note"` 形式で one-shot 作成。 自動化テスト・スクリプトに最適
- **`open`** — 包を植えずにプレビュー
- **`plant`** — 受け取った包を自分の畑に植える
- **`field`** (or 無引数起動) — 畑を ASCII 野菜畑として表示
- **`stats`** — 数字で振り返る
- **`harvest <seed_id>`** — ことばを「収穫」 (マスター済みに)
- **`demo --name`** — サンプルの畑 + sent_log を一発生成
- **ASCII farm visualization** — トピック行ごとに作物が並び、 13 個以上は「+N」 で省略
- **自然色パレット** — 若草 / 朱赤 / 黄金 / 焦茶 / 薄紫 を Rich の色として使用

## Tech Stack
- Python 3.10+
- Rich 13.x (色とテキスト、 Console.record でテスト)
- argparse でサブコマンド構成
- JSON 永続化 + atomic write (temp+rename)
- pytest + capsys
- 依存ゼロのコアロジック (topics / models / render は CLI に依存しない)

## Key Files
```
tane-kawase/
├── src/tane_kawase/
│   ├── __init__.py
│   ├── cli.py            # argparse + 8 サブコマンド
│   ├── render.py         # render_field / render_packet / render_stats
│   ├── models.py         # Seed / Packet / Field (validated, roundtrip-safe)
│   ├── storage.py        # atomic JSON I/O for field + packet files
│   └── topics.py         # 5 トピック (key/name/glyph/color/blurb)
├── tests/
│   ├── test_topics.py    # 7
│   ├── test_models.py    # 10
│   ├── test_storage.py   # 6
│   ├── test_render.py    # 6
│   └── test_cli.py       # 13
├── pyproject.toml
├── README.md / PLAN.md / CLAUDE.md
└── SUMMARY.md
```

## How to Run
```bash
cd tane-kawase
pip install -e .

# 一人で雰囲気を見る
tane-kawase --field /tmp/me.json demo --name "ちあき"
tane-kawase --field /tmp/me.json field

# 包を作って友人に渡す
tane-kawase --field /tmp/me.json send \
    --name "週末の動詞" --topic natsu_yasai --out /tmp/packet.json \
    --sender "ちあき" --receiver "りん" --language en \
    --letter "りんへ。 今週使った動詞だよ。" \
    --seed "hang out | だらだら過ごす |  | We hung out at the park." \
    --seed "wing it | ぶっつけ本番 |  | I'll just wing it."

# 友人から受け取った包を植える
tane-kawase plant ~/Downloads/packet.json

# 数字で振り返る
tane-kawase stats

# テスト
pytest -q                                       # 42 tests
```

## Tests
**42 passing** (topics 7 / models 10 / storage 6 / render 6 / cli 13)

## Challenges & Fixes
- **「ファイル交換」 vs 「クラウド sync」** — 一瞬クラウド sync (Dropbox / GitHub Gist) を組み込もうかと考えたが、 ユーザーがどこ経由で渡すかに介入しない方が儀式が壊れない。 LINE / メール / USB / Slack — どの導線でも構わない、 という設計を維持。
- **包の inline editing** — packet を作った後、 送る前に編集したい場合 — でも入れると複雑になる。 シンプルさを優先し、 「気に入らなければ作り直す」 という割り切り。
- **対話モード (`pack`) のテスト** — `console.input()` が stdin を読むので test しにくい。 同等機能の `send` を non-interactive で実装し、 テストは `send` 経由で書いた。 `pack` は人間用ツール。
- **作物の色が黒背景で映えない** — Rich のデフォルト color_system で確認したら、 若草 #6fa05a と焦茶 #6b4a32 が両方暗くて見えづらかったので、 黄金 #c89238 を強めに、 朱赤 #c0563b を鮮やかにして明度を確保。

## Potential Next Steps
- 言語ごとのフィルター — `field --lang en` で英語の畑だけ見る
- 「同じ種を植えている友人」 — 受け取った packet の sender 同士を集計して 「あなたとさくらが共通して持っている春菜は…」 表示
- 包の暗号化 — 渡す前に passphrase で AES 暗号、 受け取り手のみ open 可能
- カレンダー連動 — 「最後に種を交わしたのは 12 日前」 と促すリマインド
- 包の有効期限 — 種は 1 ヶ月で「枯れる」 (アーカイブ行きで畑から消える、 でも収穫はカウントされる)
- 多言語ペアの可視化 — 「あなたは英語を学び、 友人は日本語を学ぶ」 双方向の関係を畑の左右に分けて描画
