# juugobyou — Conventions

## Tone (絶対 ‐ 違反は cargo test で失敗させる)
- 禁止語: 「頑張」「怠け」「汚」「ダメ」「クリア」「達成」「完了」「やり遂げる」「諦めず」「努力」
- 数字も控えめ: 「3 回」 はいいが、 「あと 5 回!」 のような期待誘導は禁止
- 主語を入れない (「あなたが…」 と書かない)
- 比較しない (「他の人は…」、「昨日は…」 を出さない)
- 「触る」 が動詞、 「やる / 完了する / 片付ける」 は使わない

## Visual
- 紙の色: #fbf7ef (真っ白でない、 落ち着き)
- 墨: #2b2520 (主文字)
- 鈍金: #b8945b (アクセント、 円のフィル)
- 薄紫: #a09abd (farewell の調)
- 木陰: #6b6f5c (補助)
- フォントサイズ: 18px 以上 (ぐったり状態の目に楽)
- ボタンは画面中央、 ふっと押せる大きさ

## Voices (3 種類)
- `quiet` (静か): 主語なし、 命令形なし、 「…」 を多用
- `friend` (友達): カジュアル、 「ね」 で終わる、 「一緒に」 を 1 回まで
- `mother` (おかあさん): 「ねえ」 から始まる、 やさしい命令形 (「…してみない?」)

## Data
- Prompt: `{ id: u8, object: String, voice_renders: { quiet, friend, mother } }`
- Prompts は 40 件、 すべて object-focused (本、 マグ、 鉛筆、 紙、 服、 etc)
- Counter: `{ date: "YYYY-MM-DD", count: u32 }` in localStorage
- Voice 選択も localStorage

## Tests
- cargo test、 banned_words contains check
- 純 Rust ロジック、 wasm-bindgen-test は不要
