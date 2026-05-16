# 文豪暦 — SUMMARY

## 何を作ったか

**文豪暦 (bungou-reki)** は、文学史の「この日」を素材にしたカードバトル型デスクトップアプリ。年間100冊読む読書家のための、毎日めくる楽しみ。

- 61名の日本・世界文豪を実データで収録（生没年・代表作・国・時代）
- その日に誕生日／命日を持つ作家がカードとして召喚される
- 1日1名のみ蔵書に加えられる
- 集めたカードで3枚デッキを組み、「本日の挑戦者」と3ラウンド対戦（軸: 文才→多作→影響）
- 実際に読んだ本を記録するとXPが貯まり、レベルが上がる
- 暦タブで年間366日分の文学暦を月毎にめくれる

## 技術的判断

| 課題 | 解決 |
|---|---|
| TauriのフルビルドはCLIインストールに時間がかかる | `desktop` featureを optional 化し、CLIモードでも `cargo run` が成立する設計に |
| 同じ画面をブラウザ単体でも見たい | フロントを Vanilla JS + ES Modules で書き、`fetch` でJSONを読む。永続化は localStorage。ビルドステップなしで `python3 -m http.server` だけで動く |
| Rust と JS で同じロジックを保ちたい | `calendar.rs` / `battle.rs` と `modules/calendar.js` / `modules/battle.js` を 1:1 対応で実装。両側にユニットテスト |
| 5月16日付近に該当作家が少ないかも | データに Studs Terkel (1912-05-16) と Adrienne Rich (1929-05-16) を含め、なおかつ ±3日のフォールバック探索を実装 |

## ファイル構成

```
bungou-reki/
├── README.md, PLAN.md, CLAUDE.md, SUMMARY.md
├── src/                            # フロントエンド (Tauri/ブラウザ共通)
│   ├── index.html                  # 5タブUI
│   ├── style.css                   # 古書館アエステティック
│   ├── app.js                      # コントローラ
│   ├── modules/
│   │   ├── calendar.js             # 文学暦ロジック
│   │   ├── battle.js               # 対戦ロジック
│   │   └── store.js                # 永続化 (localStorage)
│   └── data/authors.json           # 61名の文豪データ
├── src-tauri/
│   ├── Cargo.toml, build.rs, tauri.conf.json
│   ├── capabilities/default.json
│   └── src/
│       ├── lib.rs                  # 公開 API
│       ├── data.rs                 # 作家データ読み込み
│       ├── calendar.rs             # 文学暦ロジック (Rust)
│       ├── battle.rs               # 対戦ロジック (Rust)
│       ├── state.rs                # プレイヤー状態
│       └── main.rs                 # Tauriコマンド or CLI smoke
└── tests/                          # JS 側ユニットテスト
    ├── battle.test.mjs
    └── calendar.test.mjs
```

## 動かし方

### 即座に試す（ブラウザ）

```bash
cd src
python3 -m http.server 8000
# http://localhost:8000 をブラウザで開く
```

### Tauri デスクトップとして

```bash
cargo install tauri-cli --version "^2.0"
cd src-tauri
cargo tauri dev --features desktop
```

### テスト

```bash
cd src-tauri && cargo test        # 22 tests
cd .. && node --test "tests/*.test.mjs"  # 14 tests
# 合計: 36 tests passing
```

## 数値

- **Rust テスト**: 22 / 22 passing
- **JS テスト**: 14 / 14 passing
- **合計テスト**: 36 / 36 passing
- **収録作家**: 61名
- **総ステータス軸**: 4 (文才・多作・影響・寿命)
- **行数 (Rust)**: 約 600 行
- **行数 (フロント JS/HTML/CSS)**: 約 1,100 行

## 次のステップ案

- 作家ポートレート (SVG/AI生成) でテキストイニシャルを置き換え
- 連続ログイン報酬（毎日召喚するとボーナス）
- 「本」テーブル — 実際の代表作とページ数を持たせ、より精度の高い読書XP
- 図書館モード — 横スクロール書架として蔵書を表示
- 友達対戦（シードを共有してデッキ比較）
- 「文豪同士の手紙」イベント — 同時代に生きた作家のクロスオーバー
