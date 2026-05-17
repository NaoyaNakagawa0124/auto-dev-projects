# 机の隅 (tsukue-no-sumi)

> カフェ で 作業 する ノマド の ため の、 そっと いる 作業ログ Swift CLI。

机 の 隅 に 置いた ノート みたい に、 「今 何 を やって いる か」 を 1 行 書く だけ。 通知 し ない、 連勝 を 数え ない、 「集中 して ます か?」 と 聞か ない。 ただ あなた の 隣 に 静か に いて、 月末 に 「あ、 こんなに やって たん だ」 を 思い出さ せて くれる。

```bash
$ tsukue start acme-corp "ランディング 微調整"
机 の 隅 に 置いた。  acme-corp / ランディング 微調整  (14:32)

# ... 1 時間 後 ...
$ tsukue stop
お疲れ さま。  1 時間 7 分。

$ tsukue today
2026-05-17  Sat
  10:02-11:48  client-x   ロゴ ラフ                    1h 46m
  13:14-14:28  jibun      副業 サイト の 文章            1h 14m
  14:32-15:39  acme-corp  ランディング 微調整           1h 07m
                                                合計   4h 07m

$ tsukue month --copy
# 5 月 の レポート を Markdown で クリップボード に コピー。 そのまま 請求書 に 貼れる。
```

## なぜ Swift CLI か

- macOS native の `pbcopy` を ふつう に 呼べる → コピー が 一級 市民
- バイナリ 1 個 だけ で 配れる、 起動 が 速い (Electron で は ない)
- カフェ で 開く → `tsukue` と 1 単語 だけ 打つ → 終わり

## 思想

- **通知 を 出さ ない**: あなた が 自分 から 開く まで、 何 も 言わ ない
- **連勝 を 数え ない**: 「3 日 連続 達成!」 みたいな 圧力 は 一切 なし
- **「お疲れ さま」 以外 の 評価 は し ない**: 「集中 度 78%」 とか 出さ ない、 数字 で 自分 を 採点 さ せ ない
- **データ は ローカル の JSON**: クラウド に 上げ ない、 ~/.tsukue-no-sumi/sessions.json に 置く だけ
- **削除 は 1 コマンド**: `tsukue forget` で 全部 消える

## 機能

| コマンド | 何 を する か |
|---|---|
| `tsukue start <client> [task]` | 作業 開始 を 記録 |
| `tsukue stop` | 進行中 の セッション を 終わる |
| `tsukue cancel` | 進行中 の セッション を 破棄 |
| `tsukue status` | 今 動いて いる セッション を 1 行 で 表示 |
| `tsukue today` | 今日 の セッション を 表 で |
| `tsukue list [--days N]` | 直近 N 日 (デフォルト 7) |
| `tsukue month [--copy]` | 今月 の レポート、 `--copy` で pbcopy |
| `tsukue forget` | 全 データ を 削除 (確認 あり) |
| `tsukue --help` | ヘルプ |
| `tsukue --version` | バージョン |

## ビルド

```bash
swift build -c release
.build/release/tsukue --help

# どこ から でも 呼べる ように:
cp .build/release/tsukue /usr/local/bin/
```

## テスト

```bash
swift test
```

XCTest で TsukueCore (純ロジック) を テスト。 CLI 層 は smoke build で 確認。

## データ 形式

`~/.tsukue-no-sumi/sessions.json`:

```json
{
  "sessions": [
    {
      "id": "uuid",
      "client": "acme-corp",
      "task": "ランディング 微調整",
      "startedAt": "2026-05-17T14:32:00Z",
      "endedAt": "2026-05-17T15:39:00Z"
    }
  ]
}
```

`endedAt` が `null` なら 進行中。 1 度 に 1 セッション まで (start し てる の に start を 重ねる と エラー)。

## ライセンス

MIT
