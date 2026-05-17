// 12 world-news headlines for the morning paper.
// Curated to mid-May 2026 vibes; characteristic events real, specific words composed.
// All UI text is Japanese.

const REGIONS = Object.freeze([
  "north-america",
  "europe",
  "east-asia",
  "southeast-asia",
  "south-america",
  "africa",
]);

const CATEGORIES = Object.freeze(["politics", "economics", "culture", "science"]);

const REGION_JP = Object.freeze({
  "north-america":   "北米",
  "europe":          "欧州",
  "east-asia":       "東アジア",
  "southeast-asia":  "東南アジア",
  "south-america":   "南米",
  "africa":          "アフリカ",
});

const CATEGORY_JP = Object.freeze({
  politics:  "政治",
  economics: "経済",
  culture:   "文化",
  science:   "科学",
});

const HEADLINES = Object.freeze([
  Object.freeze({
    id: "us-fed-rate",
    region: "north-america",
    category: "economics",
    priority: 1,
    headline: "FRB、 金利据え置き を 継続 — インフレ 鈍化 待ち の 5 月",
    subhead: "市場 は 9 月 利下げ を 見込み、 雇用統計 が 鍵 と なる",
    body: "米連邦準備制度理事会 (FRB) は 5 月 の 会合 で 政策 金利 を 据え置く 判断 を 示した。 消費者物価 の 伸び が 緩やか に 落ち着き つつ ある 中、 利下げ の 開始 時期 を 慎重 に 見定める 姿勢 が 鮮明 と なって いる。 市場 では 早ければ 9 月、 遅くとも 年末 の 利下げ を 織り込む 動き が 広がる。 雇用 統計 と 賃金 の 推移 が、 今後 数 ヶ月 の 政策 判断 を 左右 する 見通し だ。 通貨 ドル は 主要 通貨 に 対し 緩やか な 動き を 続けて いる。",
  }),
  Object.freeze({
    id: "eu-ai-act-followup",
    region: "europe",
    category: "politics",
    priority: 2,
    headline: "EU、 AI法 の 運用 指針 を 改定 — 汎用 AI に 透明性 義務",
    subhead: "高 リスク 用途 の 監査 制度 が 6 月 から 段階 適用 へ",
    body: "欧州 委員会 は AI 法 (AI Act) の 運用 指針 を 改定 し、 汎用 AI モデル の 学習 データ の 透明性 や、 高 リスク 用途 における 第三者 監査 の 段階 適用 を 5 月 中旬 に 公表 した。 6 月 から 順次、 大規模 モデル を 提供 する 事業者 に 透明性 義務 が 課される。",
  }),
  Object.freeze({
    id: "jp-wage-discussion",
    region: "east-asia",
    category: "economics",
    priority: 2,
    headline: "日本、 春闘 後 の 最低 賃金 議論 が 本格 化",
    subhead: "中央 最賃 審議会 が 6 月 開始、 目安 50 円 超 が 焦点",
    body: "厚生 労働省 は 5 月 中旬、 最低 賃金 の 改定 に 向けた 中央 最低 賃金 審議会 を 6 月 に 立ち上げる と 発表 した。 春闘 で 大手 が 5 % 超 の 賃上げ を 示した 中、 地域別 の 目安 で 50 円 を 超える 引き上げ が 議論 の 中心 に なる 見通し。",
  }),
  Object.freeze({
    id: "sg-port-expansion",
    region: "southeast-asia",
    category: "economics",
    priority: 3,
    headline: "シンガポール、 トゥアス 港 の 第 2 期 開業",
    subhead: "世界 最大級 の 自動化 ターミナル、 24 時間 稼働 へ",
    body: "シンガポール 港湾 庁 は 5 月、 トゥアス 港 第 2 期 の 主要 バース の 商業 運用 を 開始 した。 完全 自動化 の クレーン と 無人 搬送車 を 組み合わせ、 アジア 太平洋 の 物流 結節点 と して 24 時間 体制 で 稼働 する。",
  }),
  Object.freeze({
    id: "ng-creative-industries",
    region: "africa",
    category: "culture",
    priority: 2,
    headline: "ナイジェリア、 映像 産業 への 公的 ファンド を 拡充",
    subhead: "ノリウッド 向け 制作 助成、 配信 平台 と の 連携 加速",
    body: "ナイジェリア 政府 は 文化 観光 省 を 通じ、 国産 映像 産業 (通称 ノリウッド) 向け の 制作 助成 を 拡充 する 方針 を 示した。 国際 配信 平台 との 共同 制作 案件 に も 補助 を 適用 し、 アフリカ 大陸 で 一段 の 制作 規模 拡大 を 図る。",
  }),
  Object.freeze({
    id: "br-deforestation",
    region: "south-america",
    category: "science",
    priority: 2,
    headline: "ブラジル、 アマゾン 監視 衛星 の 解像度 強化",
    subhead: "違法 伐採 の 検知、 5 月 段階 で 前年 比 縮小",
    body: "ブラジル 国立 宇宙 研究所 (INPE) は、 アマゾン 監視 用 衛星 群 の 解像度 を 強化 した と 発表 した。 5 月 時点 の 違法 伐採 面積 は 前年 同月 比 で 縮小 して おり、 監視 技術 の 進化 と 取締り 強化 の 双方 が 寄与 した 形 だ。",
  }),
  Object.freeze({
    id: "kr-semicon-export",
    region: "east-asia",
    category: "economics",
    priority: 3,
    headline: "韓国、 半導体 輸出 が 22 ヶ月 ぶり 高水準",
    subhead: "高 帯域 メモリ の 引き合い、 受注 残 も 積み上がる",
    body: "韓国 産業 通商 資源 部 の 5 月 中旬 発表 で、 半導体 輸出 額 は 22 ヶ月 ぶり の 高 水準 と なった。 AI 関連 の 高 帯域 メモリ (HBM) の 引き合い が 強く、 主要 メーカー の 受注 残 も 拡大 を 続ける。",
  }),
  Object.freeze({
    id: "fr-cinema-cannes",
    region: "europe",
    category: "culture",
    priority: 2,
    headline: "カンヌ 国際 映画 祭、 中盤 の 注目 作 が 出揃う",
    subhead: "ドキュメンタリー 部門 で アジア 勢 が 健闘",
    body: "5 月 下旬 に 閉幕 を 控える カンヌ 国際 映画 祭 は、 中盤 で 主要 部門 の 注目 作 が 出揃った。 ドキュメンタリー 部門 で アジア 勢 の 出品 が 健闘 して おり、 配給 商談 も 例年 を 上回る ペース で 進む。",
  }),
  Object.freeze({
    id: "ke-mpesa-anniversary",
    region: "africa",
    category: "culture",
    priority: 3,
    headline: "ケニア、 モバイル 送金 普及 19 年 — 利用 率 9 割 へ",
    subhead: "農村 部 の 小口 融資 へ の 影響 を 学術 が 検証",
    body: "ケニア の モバイル 送金 サービス が 普及 19 年 目 を 迎えた。 5 月 公表 の 統計 で 成人 利用 率 は 9 割 に 近づき、 農村 部 の 小口 融資 や 教育 費 送金 を 通じた 経済 影響 が 学術 研究 で 改めて 検証 されて いる。",
  }),
  Object.freeze({
    id: "id-jakarta-relocation",
    region: "southeast-asia",
    category: "politics",
    priority: 3,
    headline: "インドネシア 新 首都、 行政 機関 の 段階 移転 を 加速",
    subhead: "ヌサンタラ で 5 月、 9 省 の 業務 が 並行 運用 へ",
    body: "インドネシア の 新 首都 ヌサンタラ では、 5 月 中旬 から 9 省 の 業務 が 旧 首都 ジャカルタ と 並行 して 運用 を 開始 した。 段階 移転 の 加速 は、 来年 の 行政 機能 の 完全 移管 を 視野 に 入れた 動き と される。",
  }),
  Object.freeze({
    id: "br-rio-museum",
    region: "south-america",
    category: "culture",
    priority: 3,
    headline: "リオ デ ジャネイロ、 「明日 の 美術館」 が 拡張 開館",
    subhead: "気候 変動 を テーマ に した 常設 展 を 刷新",
    body: "リオ デ ジャネイロ の 港湾 地区 に ある 通称 「明日 の 美術館」 は、 拡張 棟 を 5 月 中旬 に 開館 した。 気候 変動 と 海洋 を テーマ に した 常設 展 を 刷新 し、 教育 連携 プログラム も 増設 された。",
  }),
  Object.freeze({
    id: "ca-orbital-debris",
    region: "north-america",
    category: "science",
    priority: 3,
    headline: "カナダ、 軌道 上 デブリ 観測 網 の 共同 運用 へ",
    subhead: "民間 衛星 事業者 と 学術 機関 が 5 月 連携 開始",
    body: "カナダ 宇宙 庁 は 5 月、 民間 衛星 事業者 と 学術 機関 と の 連携 で、 軌道 上 デブリ の 観測 網 の 共同 運用 を 開始 した。 高 軌道 の 小型 物体 を 重点 的 に 追跡 し、 衝突 リスク の 低減 を 目指す。",
  }),
]);


// === Validators / accessors ===

const BANNED_WORDS = Object.freeze([
  "絶対", "必ず", "ヤバい", "衝撃", "驚愕", "神", "最強", "炎上",
]);

function byId(id) {
  return HEADLINES.find((h) => h.id === id) || null;
}

function byRegion(region) {
  return HEADLINES.filter((h) => h.region === region);
}

function byCategory(category) {
  return HEADLINES.filter((h) => h.category === category);
}

function leadStory() {
  return HEADLINES.find((h) => h.priority === 1) || null;
}

module.exports = {
  HEADLINES,
  REGIONS,
  CATEGORIES,
  REGION_JP,
  CATEGORY_JP,
  BANNED_WORDS,
  byId,
  byRegion,
  byCategory,
  leadStory,
};
