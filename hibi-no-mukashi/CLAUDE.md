# hibi-no-mukashi — Conventions

## Tone (絶対)
- 大事件・大発明・偉人の話は禁止
- 戦争・死・病気・革命などの重い題材は禁止 (子育てパパ・ママの夜の癒しが目的)
- vignette は短く (60-150 字)、 平易な漢字、 漢語より和語
- 過剰な情緒語 (「美しい」「素晴らしい」 など) を避け、 具体名詞で書く

## Visual
- 紙の色: #f6efe0 (淡い和紙)
- 墨: #2b2520 (本文)
- 鈍金: #b8945b (タイトル / アクセント)
- 薄紅: #c47b76 (日付)
- 木陰: #6b6f5c (補助情報)
- 余白多め、 線は dim

## Data
- Vignette: `{ date_md: "MM-DD", year: u16, title: String, body: String, motif: String, mood: String }`
- date_md は MM-DD (年は除く、 毎年同じ日付に表示)
- motif は固定の id 集合: flower / lamp / hand / leaf / bowl / basket / bird / cloud / moon / shadow / step / gate
- mood: spring / summer / autumn / winter / dawn / dusk / night

## Tests
- `cargo test` のみ (wasm-bindgen-test は使わない、 純ロジックで十分)
- 副作用なし、 dataset は static
