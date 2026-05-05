# バグずもう — bug-zumou

> 60 秒一本勝負。バグの行を見抜けば、一勝。

`bug-zumou` は、画面に出てきたコードのどこか **1 行に潜むバグ** を 60 秒以内に指で突くだけの、SwiftUI で書かれた macOS ネイティブのミニ取組アプリです。

家で一人で働いている開発者向け。ストレッチでもなく、コーヒーでもなく、ただ 90 秒の集中したい時に開いて、土俵を 1 番だけ取って閉じる。連勝が伸びると番付が上がります — 序ノ口から、横綱まで。

## 特徴

- **24 番（取組）の手作りコーパス** — 6 部屋（カテゴリ） × 4 番。Stack Overflow で頻繁に飛び交う実在のバグを下敷きにしたコード断片。
- **6 つの部屋**:
    - ぬる怪部屋（null/nil/None）
    - 一つ違ヰ部屋（off-by-one）
    - 等号部屋（assignment vs equality / mutable defaults）
    - 正規表現部屋（regex の罠）
    - 並行ノ宿（concurrency / async / closures）
    - 罠ノ型部屋（type coercion / shadowing）
- **番付 10 段階**: 序ノ口 → 序二段 → 三段目 → 幕下 → 十両 → 前頭 → 小結 → 関脇 → 大関 → 横綱。連勝で進み、黒星で序ノ口に戻る。
- **連勝・最高記録・勝率の永続化**（UserDefaults）。
- **キーボードショートカット**: Return で取組開始 / 次の取組へ。

## 動かす

### 必要なもの

- macOS 14 以上
- Swift 5.9 以上（同梱の Xcode CLI で十分）

### ビルドと起動

```sh
cd bug-zumou
swift build -c release
.build/release/bug-zumou
```

開発時は `swift run` で十分。

### テスト

```sh
swift test
```

19 のユニットテストが走ります（コーパス検証 6 / 番付 5 / ゲーム状態機械 8）。

## ファイル

```
bug-zumou/
├── Package.swift
├── Sources/BugZumou/
│   ├── BugZumouApp.swift     — @main エントリ
│   ├── ContentView.swift     — 画面全体・取組ビュー・公開判定の重ね表示
│   ├── Theme.swift           — 配色 (朱色アクセント) と Font
│   ├── Models.swift          — Stable / Rank / Puzzle / Outcome
│   ├── Corpus.swift          — 24 番のキュレーションされた取組
│   └── GameState.swift       — フェーズ機械、タイマー、永続化
└── Tests/BugZumouTests/      — XCTest スイート
```

## 設計メモ

- **Intent**: 夢中にさせる。連勝が伸びていくミニ番付の心地よさを、60 秒の制限時間と組み合わせて、開いてから閉じるまでが小さく深く濃くなるよう設計。
- 部屋は意図的に 6 つに留めた。「分類されている」感覚があれば十分で、増やしすぎるとライブラリ感が出てしまう。
- 番付は 0→1→3→6→10→15→22→30→40→55 と非線形に間隔が広がる。横綱は遠くて当然。
- 取組のフォーカスを絞るため、行クリック以外の入力は意図的に作っていない（複数行・タイプ修正・ヒント表示などはあえて無し）。

## ライセンス

MIT。
