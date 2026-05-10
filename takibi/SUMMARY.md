# 焚火 (takibi) — 完成サマリ

## 完成したもの

カフェで作業するノマド向けの、ポケットの中の焚火 PWA。
スマホブラウザで開くと、ピクセルアートの焚火がパチパチと燃え、
集中25分・休憩5分のサイクルを静かに見守ってくれる。

## 着想ロール
- **Source 10**: インディーゲーム / 速攻クリア文化（『Dark Souls』『Hollow Knight』『Spiritfarer』のかがり火）
- **Persona 30**: カフェで作業するノマドワーカー
- **Platform 4**: モバイル PWA
- **Intent 4**: そっと寄り添う — 癒し・静けさ

## 技術判断

| 領域 | 選択 | 理由 |
|---|---|---|
| 描画 | Canvas 2D + Doom fire アルゴリズム | レトロな揺らぎ感、軽量、サンプル不要 |
| 音 | Web Audio で合成 | 著作権フリー、サイズ0KB、無限に変化 |
| ストレージ | localStorage | サーバー不要、プライバシー完結 |
| ビルド | なし（vanilla ES modules） | 触れる・読める・壊れない |
| アイコン | Python 標準ライブラリで PNG 生成 | 外部ツール不要 |

## ファイル構成

```
takibi/
├── index.html              エントリ
├── style.css               スタイル（ダーク + 温かみ）
├── app.js                  バインディング（DOM + Fire + Ambience + Timer）
├── fire.js                 焚火 Canvas アニメーション
├── ambience.js             Web Audio 環境音（パチパチ + 風）
├── timer.js                状態機械（純粋ロジック）
├── manifest.json           PWA マニフェスト
├── service-worker.js       オフラインキャッシュ
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── tests/
    └── timer.test.mjs      14 テスト
```

## 実行方法

```bash
cd takibi
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

スマホで使う場合: 同 LAN から `http://<PCのIP>:8000` にアクセスし、
共有メニューから「ホーム画面に追加」で PWA インストール。

## テスト

```bash
cd takibi
node --test tests/timer.test.mjs
# 14 pass, 0 fail
```

## 苦労したところ

- 「炎らしさ」を出すために Doom fire アルゴリズムのパレットを温かみのある黒→朱→橙→白に組み直した
- パチパチ音は短いノイズバーストにバンドパスフィルタをかけて作っている。長さ・周波数・Q をランダム化することで自然な揺らぎが出た
- iOS Safari で音を鳴らすには必ずユーザータップが必要なので、「音を聞く」ボタンを押した時点で AudioContext を起こす設計にした

## 次に伸ばすなら

- 「薪をくべる」演出をもっと派手に（火の粉が大量に舞う、視覚的にご褒美感）
- 一日の集中ログを別画面で見せる（火の年輪のような可視化）
- 環境音のバリエーション（雨の音モード、火だけモード）
- 「誰かと一緒に焚火を囲む」モード（複数端末同期）
