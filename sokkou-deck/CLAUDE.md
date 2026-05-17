# sokkou-deck — Conventions

## トーン
- スピードラン 文化 ノリ で OK: "PB", "WR", "splits", "frame data", "delta"
- 数字 が 主役 — ms 単位 で 表示、 切り捨て な ら "00:32.184" 形式
- 過剰 な 煽り は しない — 「お前 は 弱い」 「やり 直し」 「失格」 等 NG
- BANNED_WORDS: 「失格」 「お前」 「クソ」 「無能」 「ダメ」 「諦めろ」

## Rust スタイル
- `cargo fmt` 準拠、 `#![warn(clippy::all)]` 想定
- 公開 API は `pub`、 内部 は private
- `String` で 詰める、 `&str` で 借りる、 ライフタイム は 必要 な とき だけ
- `Result<T, String>` で 軽量 エラー、 `thiserror` は 入れ ない
- `wasm_bindgen` 関数 は `#[wasm_bindgen]` を 付けて 名前 を JS 命名 規則 に
- 純 ロジック (deck / run / stats / normalize) は `wasm_bindgen` 無しで cargo test 可能

## デッキ データ
```rust
pub struct Card {
    pub id: String,
    pub prompt: String,      // 「diligent」
    pub answers: Vec<String>, // 「勤勉な」「勤勉」
    pub note: Option<String>,
}
pub struct Deck {
    pub id: String,
    pub name: String,
    pub description: String,
    pub cards: Vec<Card>,
}
```

## ラン 状態
```rust
pub enum RunMode { AnyPercent, HundredPercent, Consistency }
pub struct Split { card_id, answer_given, correct, time_ms, delta_ms }
pub struct Run { deck_id, mode, started_at_ms, splits, finished, current_index }
```

## 入力 正規化
- 半角 / 全角 を 揃え、 前後 空白 削除、 ASCII は 小文字 化
- カタカナ ⇔ ひらがな は 暫定 で 同一視 (debate あり、 today は 同一視)
- 「、」 で 区切られた 複数 答え は どれか 1 つ 当たれば OK
- ハイフン や 句読点 は 無視

## 表示 ルール
- 時間 表記: `MM:SS.mmm` (例: `00:32.184`)、 1 時間 超 は `H:MM:SS.mmm`
- PB delta: `+412` (赤) / `-678` (緑) ms 単位
- splits 表 は 最大 20 行 表示、 古い 行 は スクロール
- color: dim gray 罫線、 緑 (#3aff7d) と 赤 (#ff4a5e) を accent に、 背景 はほぼ 黒 (#0c0f12)

## 永続化
- `localStorage`
  - `sokkou-deck:pb` — `{deck_id: {mode: PB}}`
  - `sokkou-deck:settings` — `{lastDeck, lastMode, soundOn, ghostOn}`
- JSON シリアライズ は serde_json + serde-wasm-bindgen

## UI 構造
- index.html: シングル ページ、 セクション で 表示 切替 (`.screen[data-active]`)
- 画面: ホーム (デッキ ピッカー) / ラン / リザルト
- フォント: SF Mono / JetBrains Mono / "ＭＳ ゴシック" の フォール バック
- 入力 は 自動 フォーカス、 Enter で 確定、 ミス で 振動 (アニメ)

## テスト
- `cargo test` 純 ロジック のみ
- WASM は 手動 で ブラウザ smoke
- BANNED_WORDS 監査 は cargo test に 含める
