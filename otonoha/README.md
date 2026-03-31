# 音の葉 (Otonoha) - 音楽チャートから咲く花の庭

A generative flower garden where each bloom represents a song from the music charts. Built with p5.js, using the iTunes RSS API for real chart data.

## Features

- **リアルチャート連動**: iTunes Japan トップ25の楽曲データを取得
- **ジャンル別の花**: ポップ=丸い花弁、ロック=とがった花弁、ヒップホップ=角張った花弁
- **ランキング反映**: 1位の花ほど大きく、茎も高く咲く
- **風の演出**: 花や花弁が風にそよぐアニメーション
- **ホバーで情報表示**: 花に触れると曲名・アーティスト・順位を表示
- **花の再生成**: ボタンで成長アニメーションを再開

## How to Run

```bash
open index.html
# or
npx serve otonoha/
```

## Tech Stack

- p5.js (generative art)
- iTunes RSS API (real chart data)
- Vanilla JS / HTML / CSS
