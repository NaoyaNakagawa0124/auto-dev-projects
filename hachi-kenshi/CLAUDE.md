# hachi-kenshi — Conventions

## トーン
- ノワール 推理 もの の 文体: 端正、 やや 冷たい、 過剰 な 比喩 は 避ける
- 「殺人」 「殺害」 等 の 言葉 は 観葉 植物 に 対する 比喩 と して 軽く 使う が、 重さ を 出さ ない
- 容疑 者 (死因) は 1 人称 で 「私 が 犯人 なら〜」 と 自己 弁明 する スタイル
- 解説 文 は 教育 的 だが 命令 調 は 避ける (「〜 して ください」 NG、 「〜 と 言える」 OK)
- BANNED_WORDS: 「殺人犯」 「殺害」 「凶悪」 「死刑」 「死亡 確認」 「お前」 「クソ」 「無能」 「失敗 作」 (注: 「殺す」 単独 は 観葉 植物 の 文脈 で 使える ので OK、 「殺人」 と いう 重い 名詞 を 弾く)

## Rust スタイル
- 純ロジック (cases / verdict / score) は `wasm_bindgen` 無しで cargo test 可能
- `wasm_bindgen` 関数 は `#[wasm_bindgen]` で 命名 を JS 命名 規則 (camelCase) に
- `serde-wasm-bindgen` で JsValue やり取り、 直接 JsValue を 触らない

## 死因 (Cause)
```rust
pub enum Cause {
    Dryness,          // 乾燥死
    Overwatering,     // 過湿
    RootRot,          // 根腐れ
    LowLight,         // 光 不足
    Cold,             // 寒さ
    Pest,             // 害虫
    FertilizerBurn,   // 肥料 焼け
}
```

各 cause に は alibi (容疑 者 の 弁明 文) が 紐付く。

## 事件 (Case) 構造
```rust
pub struct Case {
    pub id: String,             // "c01" .. "c12"
    pub chapter: Chapter,       // Houseplant / Cactus / Herb / Succulent
    pub victim: String,         // "ポトス (Epipremnum aureum)"
    pub age: String,            // "8 ヶ月"
    pub found_at: String,       // "2026-05-15"
    pub conditions: String,     // "室温 19°C、 湿度 32%、 北 向き 窓辺"
    pub evidence: Vec<String>,  // 5-7 ヶ条 の 物的 証拠
    pub suspects: Vec<Cause>,   // 4-5 名
    pub culprit: Cause,         // 正解
    pub explanation: String,    // 解説 (正解 後 に 表示)
}
```

## 章
- **観葉** (3 件) — easy: 過湿 / 乾燥 / 光 不足
- **サボテン** (3 件) — 過湿 / 凍害 / 害虫 (サボテン は 通常 と 逆 の 落とし穴)
- **ハーブ** (3 件) — 肥料 焼け / 乾燥 / 寒さ
- **多肉** (3 件) — 根腐れ / 過湿 / 光 不足 / 害虫 の 複合 ヒント (難)

## ゲーム フロー
1. ホーム: 章 一覧、 進捗 表示 (完走 数 / 全件)、 PB
2. 事件 画面: 被害 者 + 条件 + 証拠 + 容疑 者 + 「起訴 する」 ボタン
3. 起訴 → 結果 画面 (正解 / 誤起訴) + 解説 + 次 へ / ホーム
4. 全 12 件 を 解く と PB が 確定、 「再 検視」 で やり 直し

## 採点
- 正解: +100 点
- 誤 起訴: -30 点 (各 事件 1 回 だけ 起訴 可、 取り 直し なし)
- 章 完走 (3/3): +50 点 ボーナス
- 12 件 全 正解: +200 点 ボーナス
- タイム ボーナス: 全 完走 5 分 以内 で +100 点

## UI トーン
- 色: 古い 検視 メモ 風 (背景 セピア #f4ebd9、 文字 黒 茶 #2b2014、 アクセント 赤 茶 #8c3a2c)
- フォント: serif (Hiragino Mincho / Yu Mincho / Noto Serif JP) + 等幅 (タイム 表示)
- 罫線: 破線、 「⊡」 「▣」 「─」 を 多用、 「事件 簿 を 開く」 感
- 章 ヘッダー は 黒 ベタ に 白文字、 case 番号 は 大きく

## 永続化
- `localStorage`:
  - `hachi-kenshi:progress` — `{c01: "solved", c02: "wrong", ...}`
  - `hachi-kenshi:pb` — `{total_score: 850, total_ms: 268500}`
  - `hachi-kenshi:settings` — (将来 用、 現状 は 空)

## テスト
- cargo test only、 cases / verdict / score を 重点
- BANNED_WORDS 監査 は 全 case の 文字列 を 走査
- 各 cause の 「私 で は ない」 弁明 文 を 確認
