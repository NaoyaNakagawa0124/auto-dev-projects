# 間取り図鑑 — SUMMARY

## 何を作ったか

**間取り図鑑 (madori-zukan)** は、アニメ・漫画の家を「不動産物件」として記録するアーカイブPWA。年100作品を観るオタクの「観たことある」を、ただのリストではなく **間取り図つきの物件カタログ** として残す。

- 8 件の名作の家 (野比家・磯野家・野原家・草壁家・竈門家・高須家・平沢家・フォージャー家) を収録
- 各家は SVG で「実際の不動産チラシ風の間取り図」として描画 (壁・部屋ラベル・面積・畳数・縮尺バー・方位記号 N)
- 物件詳細では、各部屋に紐づく「印象的な場面」をタップで見られる
- 「観了」「★お気に入り」を記録、累計記録延床面積をアーカイブ画面で確認
- PWA (Service Worker + manifest) でオフライン対応、スマホのホーム画面に追加可能
- 全 UI 日本語、モバイル幅 375px まで崩れない

## 技術的判断

| 課題 | 解決 |
|---|---|
| 各家の正確な間取りは公式に無いことが多い | 「オマージュ的再現」と明示し、原作のレイアウトに準拠した plausible な間取りを設計 |
| SVG floorplan を建築図面っぽく見せる | 太い壁・薄い色つき部屋・畳パターン・庭ドットパターン・縮尺/方位を入れた手作り SVG |
| 単一の SVG で 2 階建ても表現 | 1F と 2F を横並びにレイアウト (x座標オフセット)、各フロアに "1F"/"2F" ラベル |
| PWA 認定基準 | manifest.json + service-worker.js + 192/512 PNG アイコン + start_url スコープ |
| サムネと詳細で SVG を流用 | `scale` と `showAnnotations` を引数化して、同じ renderer から物件カード用 mini SVG も生成 |

## ファイル構成

```
madori-zukan/
├── README.md, PLAN.md, CLAUDE.md, SUMMARY.md
├── index.html              4ビュー (一覧/詳細/アーカイブ/使い方)
├── style.css               paper + ink + blueprint
├── app.js                  コントローラ
├── modules/
│   ├── floorplan.js        SVG レンダラ + geometry
│   └── store.js            localStorage アーカイブ
├── data/homes.json         8件の家 (合計 85 部屋)
├── manifest.json
├── service-worker.js
├── icons/icon-192.png, icon-512.png
└── tests/
    ├── floorplan.test.mjs  (10 tests)
    └── store.test.mjs      (6 tests)
```

## 動かし方

```bash
cd madori-zukan
python3 -m http.server 8000
# ブラウザで http://localhost:8000

# テスト
node --test "tests/*.test.mjs"  # 16 tests
```

## 数値

- **テスト**: 16 / 16 passing
- **収録物件**: 8 件
- **総部屋数**: 85
- **コード行数**: ~1,200 (HTML+CSS+JS)
- **データ行数**: ~250 (JSON)

## 次のステップ案

- 収録物件の拡張 (もののけ姫 アシタカの家、千と千尋 油屋、進撃の巨人 エレンの家、ハイキュー 影山家、etc)
- 部屋にゲーム/シーンの開始時刻を紐づけて、「時刻別の家」を見られるようにする
- 「自分の部屋」をユーザーが追加できる UI (作品×部屋を自由に作れる)
- 友人とアーカイブを比較する (URL シェア)
- 「年代別お気に入りランキング」「最古/最新の物件」など統計の充実
- ダークモード (建築青焼き風)
