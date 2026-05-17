# yofuke-news — Conventions

## トーン (絶対)
- 「夜更かし 注意」 「もう 寝なさい」 「廃人」 「ダメ人間」 のような 命令 / 蔑称 は 禁止
- 換算 は バカっぽい が 攻撃 的 で は ない — 「あなた の 睡眠 と 引き換え に」 OK、 「あなた の 健康 と 引き換え に」 重い ので NG
- 数字 は 控えめ に 創作、 でも 不自然 に 大きく しない (「クリア まで 9999 時間」 は ジョーク に なる が 引く)
- 「私 は あなた を 心配 して います」 系 の 自意識 表現 は 出さない
- BANNED_WORDS: 「夜更かし 注意」 「廃人」 「ダメ人間」 「もう 寝なさい」 「絶対」 「神レベル」 「最強」 「神ゲー」 「クソゲー」 「失敗」 (注: 「神社」 のような 一般語 で 偽陽性 にならないよう、 「神」 単体 ではなく 「神レベル」 「神ゲー」 を 禁止)

## 配色 (chalk)
- 罫線: `chalk.dim.gray`
- ヘッダー アイコン (✦): `chalk.cyan`
- ヘッダー テキスト: `chalk.cyanBright`
- タイトル (英語): `chalk.bold.white`
- タイトル (日本語訳): `chalk.gray`
- ジャンル タグ: `chalk.magenta`
- 価格: `chalk.yellow`
- 数値 (睡眠 / 朝食): `chalk.yellowBright`
- 「あなた の 睡眠 と 引き換え に」 ラベル: `chalk.dim`

## データ
```ts
type News = {
  id: string;
  title: string;           // 創作 英語 タイトル
  jp: string;              // 日本語 サブタイトル (genre 含む 1 行)
  genre: string;           // "メトロイドヴァニア" など
  price_jpy: number;       // 0 (無料) から 12000
  hours_to_clear: number;  // 1-100
  release_kind: "released" | "demo" | "early-access";
  short_blurb: string;     // 30-80 字 の 1 行 紹介
};
```

## CLI
- shebang `#!/usr/bin/env node`
- 引数 は process.argv の 簡易 parse、 yargs は 使わない (依存 軽く)
- `--all` で 12 件、 デフォルト で 5 件
- `--no-color` で chalk を 無効化 (FORCE_COLOR=0 を 内部 で 設定)
- exit code 0 が 正常、 1 が 内部 エラー、 2 が 引数 エラー

## テスト
- Vitest、 unit only
- chalk は process.env.FORCE_COLOR=0 で 無効化 して render テスト
- terminal 操作 は test しない
