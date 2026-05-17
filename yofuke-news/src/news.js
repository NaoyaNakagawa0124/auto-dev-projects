// 12 representative indie game news items for mid-May 2026.
// Titles are invented (indie-flavored). Genres + prices + hours are illustrative.

export const NEWS = Object.freeze([
  Object.freeze({
    id: "hollow-frequencies",
    title: "Hollow Frequencies",
    jp: "電波 と 廃線 を テーマ に した メトロイドヴァニア",
    genre: "メトロイドヴァニア",
    price_jpy: 1980,
    hours_to_clear: 12,
    release_kind: "released",
    short_blurb: "廃線 の 駅 で 拾った ラジオ が、 廃線 の 過去 を 鳴らす。",
  }),
  Object.freeze({
    id: "embers-of-okutama",
    title: "Embers of Okutama",
    jp: "山奥 の 神社 を 復興 する スローライフ",
    genre: "スローライフ",
    price_jpy: 2480,
    hours_to_clear: 28,
    release_kind: "released",
    short_blurb: "鳥居 の 朱色 を 自分 で 塗り直して、 季節 を 1 周 する。",
  }),
  Object.freeze({
    id: "cassette-cipher",
    title: "Cassette Cipher",
    jp: "80 年代 の カセット を 解読 する アドベンチャー",
    genre: "アドベンチャー",
    price_jpy: 1480,
    hours_to_clear: 6,
    release_kind: "released",
    short_blurb: "片面 28 分 の 中 に、 1 人 の 失踪 が 隠されて いる。",
  }),
  Object.freeze({
    id: "tiny-zoning-board",
    title: "Tiny Zoning Board",
    jp: "架空 の 町 の 用途 地域 を 引く 都市 計画 シミュ",
    genre: "シミュレーション",
    price_jpy: 2980,
    hours_to_clear: 40,
    release_kind: "early-access",
    short_blurb: "「商業」 を 引く と 「住宅」 から 文句 が 来る、 そういう 町。",
  }),
  Object.freeze({
    id: "moss-runner",
    title: "Moss Runner",
    jp: "苔 の 上 を 1 ピクセル ずつ 進む 短編 プラットフォーマー",
    genre: "プラットフォーマー",
    price_jpy: 980,
    hours_to_clear: 3,
    release_kind: "released",
    short_blurb: "落ちて は 1 マス 戻る、 詰む と 苔 が 1 cm 育つ。",
  }),
  Object.freeze({
    id: "nightowl-courier",
    title: "Nightowl Courier",
    jp: "深夜 の 街 を 自転車 で 配達 する オープン ワールド",
    genre: "オープン ワールド",
    price_jpy: 3680,
    hours_to_clear: 35,
    release_kind: "released",
    short_blurb: "信号 と 月 だけ が 相棒、 配達 の 報酬 は コンビニ コーヒー。",
  }),
  Object.freeze({
    id: "kiln-and-tea",
    title: "Kiln and Tea",
    jp: "陶器 を 焼いて、 季節 を 待つ ロギライク",
    genre: "ロギライク",
    price_jpy: 1980,
    hours_to_clear: 15,
    release_kind: "demo",
    short_blurb: "窯 を 1 度 開けて しまう と、 全部 が 灰 に 戻る。",
  }),
  Object.freeze({
    id: "ghosts-of-station-9",
    title: "Ghosts of Station 9",
    jp: "深夜 の 駅 員 シミュレーター、 ステーションホラー",
    genre: "ホラー",
    price_jpy: 1480,
    hours_to_clear: 8,
    release_kind: "released",
    short_blurb: "最終 電車 が 出た 後、 ホーム の 影 が 1 人 増える。",
  }),
  Object.freeze({
    id: "papercut-circuits",
    title: "Papercut Circuits",
    jp: "紙工作 の 回路 を 組む パズル",
    genre: "パズル",
    price_jpy: 1280,
    hours_to_clear: 10,
    release_kind: "released",
    short_blurb: "ハサミ で 切った 回路 が、 光って 鳴る。 計算 は 折り紙 の 中。",
  }),
  Object.freeze({
    id: "monsoon-bookshop",
    title: "Monsoon Bookshop",
    jp: "雨季 の ムンバイ の 古本屋 を 切り盛り する シミュ",
    genre: "シミュレーション",
    price_jpy: 2680,
    hours_to_clear: 22,
    release_kind: "released",
    short_blurb: "雨 が 強い 日 は 客 が 増える、 棚 が 傷む、 そんな 営業 9 ヶ月。",
  }),
  Object.freeze({
    id: "weld-and-wait",
    title: "Weld and Wait",
    jp: "造船 所 の 溶接 工 が 月 を 見上げる シーン だけ の 短編",
    genre: "ナラティブ",
    price_jpy: 880,
    hours_to_clear: 2,
    release_kind: "released",
    short_blurb: "金属 が 冷める 5 分 を、 同じ 5 分 だけ 待つ。",
  }),
  Object.freeze({
    id: "underwater-archive",
    title: "Underwater Archive",
    jp: "沈没 船 の 図書館 を 整理 する スキューバ パズル",
    genre: "パズル",
    price_jpy: 1880,
    hours_to_clear: 14,
    release_kind: "early-access",
    short_blurb: "本 は 開けば 散る、 でも 索引 は 海底 に 残る。",
  }),
]);


export const BANNED_WORDS = Object.freeze([
  "夜更かし 注意", "廃人", "ダメ人間", "もう 寝なさい",
  "絶対", "神レベル", "最強", "神ゲー", "クソゲー", "失敗",
]);


export function byId(id) {
  return NEWS.find((n) => n.id === id) || null;
}

export const GENRES = Object.freeze([
  ...new Set(NEWS.map((n) => n.genre)),
]);
