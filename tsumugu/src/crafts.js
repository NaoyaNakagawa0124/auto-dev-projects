/**
 * 季節の手仕事データベース
 * Japanese seasonal craft suggestions mapped to months and seasons
 */

export const CRAFT_CATEGORIES = {
  つまみ細工: { emoji: '🌺', description: '布をつまんで作る伝統工芸' },
  水引: { emoji: '🎀', description: '紙紐を結んで作る装飾' },
  刺し子: { emoji: '🧵', description: '布に幾何学模様を縫う技法' },
  草木染め: { emoji: '🎨', description: '植物で布を染める技法' },
  折り紙: { emoji: '📄', description: '紙を折って形を作る' },
  ちりめん細工: { emoji: '🧶', description: 'ちりめん布で作る小物' },
  押し花: { emoji: '🌿', description: '花や葉を押して保存する' },
  和紙工芸: { emoji: '📜', description: '和紙を使った工芸' },
  編み物: { emoji: '🧣', description: '毛糸や糸で編む' },
  陶芸: { emoji: '🏺', description: '粘土で器を作る' },
  書道: { emoji: '✒️', description: '筆と墨で文字を書く' },
  香り: { emoji: '🪷', description: 'お香や匂い袋を作る' },
};

/**
 * Crafts organized by month, with seasonal relevance
 */
export const MONTHLY_CRAFTS = {
  1: [
    {
      name: '繭玉飾り',
      category: 'ちりめん細工',
      description: '小正月に飾る繭玉をちりめんで作る',
      difficulty: '初級',
      materials: ['ちりめん布', '発泡スチロール球', 'ボンド', '紐'],
      seasonalNote: '新年の福を願う伝統的な飾り',
    },
    {
      name: '水引のポチ袋',
      category: '水引',
      description: 'お年玉やお祝いに使える水引のポチ袋',
      difficulty: '初級',
      materials: ['水引（紅白）', '和紙', 'のり'],
      seasonalNote: '冬の贈り物に心を添える',
    },
    {
      name: '冬の刺し子ふきん',
      category: '刺し子',
      description: '雪の結晶をモチーフにした刺し子のふきん',
      difficulty: '中級',
      materials: ['刺し子布', '刺し子糸', '刺し子針'],
      seasonalNote: '雪の美しさを針と糸で表現する',
    },
  ],
  2: [
    {
      name: '梅の枝つまみ細工',
      category: 'つまみ細工',
      description: '梅の花をモチーフにしたつまみ細工の髪飾り',
      difficulty: '中級',
      materials: ['正絹ちりめん', 'ワイヤー', 'ボンド', 'かんざし台'],
      seasonalNote: '早春の訪れを告げる梅の花を手のひらに',
    },
    {
      name: '節分の鬼面',
      category: '和紙工芸',
      description: '和紙で作る鬼のお面',
      difficulty: '初級',
      materials: ['和紙（赤・青・黄）', 'のり', 'ゴム紐'],
      seasonalNote: '豆まきを彩る手作りのお面',
    },
    {
      name: '冬の草木染めストール',
      category: '草木染め',
      description: 'ビワの葉で染めるピンクのストール',
      difficulty: '上級',
      materials: ['シルクストール', 'ビワの葉', 'ミョウバン', '大きな鍋'],
      seasonalNote: 'ビワの葉は冬が一番色素が濃い',
    },
  ],
  3: [
    {
      name: '桃の節句のつるし飾り',
      category: 'ちりめん細工',
      description: 'ひな祭りに飾るちりめんのつるし雛',
      difficulty: '中級',
      materials: ['ちりめん布', '綿', '糸', '竹輪'],
      seasonalNote: '桃の節句を手作りで祝う',
    },
    {
      name: '春の折り紙リース',
      category: '折り紙',
      description: '桜や蝶をモチーフにした折り紙のリース',
      difficulty: '初級',
      materials: ['折り紙', 'のり', '台紙'],
      seasonalNote: '芽吹きの季節を折り紙で表現する',
    },
    {
      name: '菜の花の押し花カード',
      category: '押し花',
      description: '菜の花を押して春のグリーティングカードに',
      difficulty: '初級',
      materials: ['菜の花', '押し花シート', 'カード台紙', 'ラミネート'],
      seasonalNote: '春の野原の記憶を一枚のカードに閉じ込める',
    },
  ],
  4: [
    {
      name: '桜のつまみ細工ブローチ',
      category: 'つまみ細工',
      description: '満開の桜をイメージしたブローチ',
      difficulty: '中級',
      materials: ['ちりめん（ピンク系）', 'ブローチ台', 'ボンド'],
      seasonalNote: '花見の季節にぴったりのアクセサリー',
    },
    {
      name: '桜染めのハンカチ',
      category: '草木染め',
      description: '桜の枝で淡いピンクに染めるハンカチ',
      difficulty: '中級',
      materials: ['綿のハンカチ', '桜の枝', 'ミョウバン'],
      seasonalNote: '散った桜の枝からもらう春の色',
    },
    {
      name: '和紙の花封筒',
      category: '和紙工芸',
      description: '和紙に押し花を添えた封筒作り',
      difficulty: '初級',
      materials: ['和紙', '押し花', 'のり'],
      seasonalNote: '手紙に春を添えて',
    },
  ],
  5: [
    {
      name: '端午の節句飾り',
      category: 'ちりめん細工',
      description: 'ちりめんで作るミニ鯉のぼり',
      difficulty: '中級',
      materials: ['ちりめん布', '竹串', '綿', '金糸'],
      seasonalNote: '子どもの成長を願う手作りの飾り',
    },
    {
      name: '新緑の刺し子コースター',
      category: '刺し子',
      description: '若葉をイメージした緑のコースター',
      difficulty: '初級',
      materials: ['刺し子布（緑）', '刺し子糸', '針'],
      seasonalNote: '新緑の息吹を食卓に',
    },
    {
      name: '藤の花の水引アクセサリー',
      category: '水引',
      description: '藤の花をモチーフにした水引のイヤリング',
      difficulty: '上級',
      materials: ['水引（紫・白）', 'イヤリング金具'],
      seasonalNote: '風に揺れる藤棚のイメージ',
    },
  ],
  6: [
    {
      name: '紫陽花の押し花アート',
      category: '押し花',
      description: '紫陽花を押して額装するアート作品',
      difficulty: '中級',
      materials: ['紫陽花', '押し花シート', '額縁', '台紙'],
      seasonalNote: '梅雨の美しさを永遠に留める',
    },
    {
      name: '蛍かご風の竹編み',
      category: '和紙工芸',
      description: '和紙で作る蛍かご風のランタン',
      difficulty: '中級',
      materials: ['和紙', '竹ひご', 'のり', 'LEDライト'],
      seasonalNote: '蛍の季節に灯す手作りの明かり',
    },
    {
      name: '梅干し用の紫蘇染め',
      category: '草木染め',
      description: '赤紫蘇で染めるテーブルナプキン',
      difficulty: '初級',
      materials: ['綿布', '赤紫蘇', 'ミョウバン', '酢'],
      seasonalNote: '梅仕事のそばで楽しむ染め仕事',
    },
  ],
  7: [
    {
      name: '七夕の折り紙飾り',
      category: '折り紙',
      description: '星や短冊など七夕飾りのセット',
      difficulty: '初級',
      materials: ['折り紙', '笹（造花可）', '紐', 'ペン'],
      seasonalNote: '願いを込めた七夕飾り',
    },
    {
      name: '朝顔のつまみ細工',
      category: 'つまみ細工',
      description: '朝顔をモチーフにしたヘアピン',
      difficulty: '中級',
      materials: ['ちりめん（青・紫系）', 'ヘアピン台', 'ボンド'],
      seasonalNote: '夏の朝を彩る花のアクセサリー',
    },
    {
      name: '匂い袋（ラベンダー）',
      category: '香り',
      description: 'ラベンダーとちりめんで作る匂い袋',
      difficulty: '初級',
      materials: ['ちりめん布', 'ラベンダー', '紐', '綿'],
      seasonalNote: '暑い夏に涼を呼ぶ香り',
    },
  ],
  8: [
    {
      name: '藍染めの手ぬぐい',
      category: '草木染め',
      description: '藍の生葉で叩き染めする手ぬぐい',
      difficulty: '中級',
      materials: ['さらし布', '藍の生葉', '木槌', 'まな板'],
      seasonalNote: '夏の植物で染める季節限定の技法',
    },
    {
      name: 'お盆の蓮の折り紙',
      category: '折り紙',
      description: '蓮の花とお供え飾りの折り紙',
      difficulty: '初級',
      materials: ['折り紙（白・ピンク・緑）'],
      seasonalNote: 'ご先祖様を迎えるお盆の準備',
    },
    {
      name: '秋の書道作品',
      category: '書道',
      description: '立秋をテーマにした書道の掛け軸',
      difficulty: '中級',
      materials: ['半紙', '墨', '筆', '掛け軸台'],
      seasonalNote: '秋の気配を筆に込める',
    },
  ],
  9: [
    {
      name: '月見うさぎのちりめん',
      category: 'ちりめん細工',
      description: 'お月見うさぎのちりめん人形',
      difficulty: '中級',
      materials: ['ちりめん布（白・黄）', '綿', '糸', 'ボンド'],
      seasonalNote: '十五夜のお供えに添える',
    },
    {
      name: '秋桜の押し花しおり',
      category: '押し花',
      description: 'コスモスを使った押し花のしおり',
      difficulty: '初級',
      materials: ['コスモス', '押し花シート', 'カード紙', 'ラミネート'],
      seasonalNote: '読書の秋に花を添える',
    },
    {
      name: '菊の水引飾り',
      category: '水引',
      description: '重陽の節句にちなんだ菊の水引',
      difficulty: '上級',
      materials: ['水引（黄・白・紫）'],
      seasonalNote: '長寿を願う菊の節句の飾り',
    },
  ],
  10: [
    {
      name: '紅葉の押し花額',
      category: '押し花',
      description: 'もみじやイチョウの押し花を額装する',
      difficulty: '初級',
      materials: ['紅葉', 'イチョウ', '押し花シート', '額縁'],
      seasonalNote: '秋の色彩を部屋に飾る',
    },
    {
      name: '秋の実のリース',
      category: '和紙工芸',
      description: '和紙と木の実で作る秋のリース',
      difficulty: '中級',
      materials: ['和紙', '木の実', 'リース台', 'グルーガン'],
      seasonalNote: '秋の恵みを玄関に飾る',
    },
    {
      name: '柿渋染めのバッグ',
      category: '草木染め',
      description: '柿渋で染める丈夫なトートバッグ',
      difficulty: '中級',
      materials: ['綿バッグ', '柿渋液', 'ゴム手袋'],
      seasonalNote: '秋の果実から生まれる伝統の色',
    },
  ],
  11: [
    {
      name: '七五三の千歳飴袋',
      category: '和紙工芸',
      description: '和紙で作るオリジナルの千歳飴袋',
      difficulty: '初級',
      materials: ['和紙', '水引', 'のり', 'スタンプ'],
      seasonalNote: '子どもの成長を祝う手作りの袋',
    },
    {
      name: '冬支度の編みぐるみ',
      category: '編み物',
      description: '冬の動物モチーフの小さな編みぐるみ',
      difficulty: '中級',
      materials: ['毛糸', 'かぎ針', '綿', '目ボタン'],
      seasonalNote: '冬ごもりの動物たちを手のひらに',
    },
    {
      name: '落ち葉の蝋引きオーナメント',
      category: '押し花',
      description: '落ち葉を蝋で固めて窓飾りにする',
      difficulty: '初級',
      materials: ['落ち葉', '蜜蝋', 'クッキングシート', '紐'],
      seasonalNote: '冬に入る前の最後の秋色を保存する',
    },
  ],
  12: [
    {
      name: 'お正月のしめ飾り',
      category: '和紙工芸',
      description: '和紙と水引で作るモダンなしめ飾り',
      difficulty: '中級',
      materials: ['稲わら', '水引', '和紙', '松', '南天'],
      seasonalNote: '新年を迎える手作りの飾り',
    },
    {
      name: '冬の刺し子マフラー',
      category: '刺し子',
      description: '麻の葉模様の刺し子入りマフラー',
      difficulty: '上級',
      materials: ['ウール生地', '刺し子糸', '刺し子針'],
      seasonalNote: '寒い冬に手仕事の温もりを纏う',
    },
    {
      name: '柚子の匂い袋',
      category: '香り',
      description: '冬至の柚子を使った匂い袋',
      difficulty: '初級',
      materials: ['柚子の皮（乾燥）', 'ちりめん布', '紐'],
      seasonalNote: '冬至の柚子から生まれる香り',
    },
  ],
};

/**
 * Get crafts for a given month
 */
export function getCraftsByMonth(month) {
  return MONTHLY_CRAFTS[month] || [];
}

/**
 * Get crafts for a given season
 */
export function getCraftsBySeason(season) {
  const seasonMonths = {
    春: [3, 4, 5],
    夏: [6, 7, 8],
    秋: [9, 10, 11],
    冬: [12, 1, 2],
  };

  const months = seasonMonths[season] || [];
  const crafts = [];
  for (const m of months) {
    crafts.push(...getCraftsByMonth(m));
  }
  return crafts;
}

/**
 * Get a craft suggestion for the current microseason
 */
export function getCraftForKou(kou) {
  const month = kou.startMonth;
  const crafts = getCraftsByMonth(month);

  if (crafts.length === 0) return null;

  // Pick based on kou index for deterministic results
  return crafts[kou.index % crafts.length];
}

/**
 * Get all crafts for a given month with seasonal context
 */
export function getCraftsWithContext(month, season) {
  const crafts = getCraftsByMonth(month);
  return crafts.map(craft => ({
    ...craft,
    categoryInfo: CRAFT_CATEGORIES[craft.category] || { emoji: '🎨', description: '' },
    season,
  }));
}

/**
 * Search crafts by keyword
 */
export function searchCrafts(keyword) {
  const results = [];
  for (const [month, crafts] of Object.entries(MONTHLY_CRAFTS)) {
    for (const craft of crafts) {
      if (
        craft.name.includes(keyword) ||
        craft.category.includes(keyword) ||
        craft.description.includes(keyword) ||
        craft.seasonalNote.includes(keyword) ||
        craft.materials.some(m => m.includes(keyword))
      ) {
        results.push({ ...craft, month: parseInt(month) });
      }
    }
  }
  return results;
}
