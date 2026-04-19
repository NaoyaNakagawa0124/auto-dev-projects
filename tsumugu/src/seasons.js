/**
 * 七十二候 (72 Microseasons) Complete Database
 *
 * Each entry in SOLAR_TERMS contains:
 * - name: 二十四節気 name
 * - reading: hiragana reading
 * - meaning: brief meaning
 * - month/day: approximate start date
 * - color: hex color for theming
 * - kou: array of 3 microseasons (初候、次候、末候)
 *
 * Dates are approximate — based on solar longitude, actual dates vary ±1 day per year.
 * We use 2026 approximate dates.
 */

export const SEASONS = ['春', '夏', '秋', '冬'];

export const SEASON_COLORS = {
  春: '#e8a0b4', // 桜色
  夏: '#4a9c5d', // 若葉色
  秋: '#c47a2e', // 紅葉色
  冬: '#6b8e9b', // 氷色
};

export const SEASON_EMOJI = {
  春: '🌸',
  夏: '🌿',
  秋: '🍁',
  冬: '❄️',
};

export const SOLAR_TERMS = [
  // ===== 春 (Spring) =====
  {
    name: '立春', reading: 'りっしゅん', meaning: '春の始まり',
    season: '春', month: 2, day: 4, color: '#f0c0d0',
    kou: [
      { name: '東風解凍', reading: 'はるかぜこおりをとく', meaning: '春風が氷を解かし始める', startMonth: 2, startDay: 4 },
      { name: '黄鶯睍睆', reading: 'うぐいすなく', meaning: '鶯が山里で鳴き始める', startMonth: 2, startDay: 9 },
      { name: '魚上氷', reading: 'うおこおりをいずる', meaning: '氷の割れ目から魚が飛び出す', startMonth: 2, startDay: 14 },
    ],
  },
  {
    name: '雨水', reading: 'うすい', meaning: '雪が雨に変わる',
    season: '春', month: 2, day: 19, color: '#c8dce8',
    kou: [
      { name: '土脉潤起', reading: 'つちのしょううるおいおこる', meaning: '雨が降って土が湿り気を含む', startMonth: 2, startDay: 19 },
      { name: '霞始靆', reading: 'かすみはじめてたなびく', meaning: '霞がたなびき始める', startMonth: 2, startDay: 24 },
      { name: '草木萌動', reading: 'そうもくめばえいずる', meaning: '草木が芽吹き始める', startMonth: 3, startDay: 1 },
    ],
  },
  {
    name: '啓蟄', reading: 'けいちつ', meaning: '虫が冬ごもりから目覚める',
    season: '春', month: 3, day: 6, color: '#d4c89a',
    kou: [
      { name: '蟄虫啓戸', reading: 'すごもりむしとをひらく', meaning: '冬ごもりの虫が出てくる', startMonth: 3, startDay: 6 },
      { name: '桃始笑', reading: 'ももはじめてさく', meaning: '桃の花が咲き始める', startMonth: 3, startDay: 11 },
      { name: '菜虫化蝶', reading: 'なむしちょうとなる', meaning: '青虫が蝶になる', startMonth: 3, startDay: 16 },
    ],
  },
  {
    name: '春分', reading: 'しゅんぶん', meaning: '昼と夜の長さがほぼ等しくなる',
    season: '春', month: 3, day: 21, color: '#f5d0e0',
    kou: [
      { name: '雀始巣', reading: 'すずめはじめてすくう', meaning: '雀が巣を作り始める', startMonth: 3, startDay: 21 },
      { name: '桜始開', reading: 'さくらはじめてひらく', meaning: '桜が咲き始める', startMonth: 3, startDay: 26 },
      { name: '雷乃発声', reading: 'かみなりすなわちこえをはっす', meaning: '遠くで雷が鳴り始める', startMonth: 3, startDay: 31 },
    ],
  },
  {
    name: '清明', reading: 'せいめい', meaning: '万物が清らかで明るい',
    season: '春', month: 4, day: 5, color: '#b8d8a8',
    kou: [
      { name: '玄鳥至', reading: 'つばめきたる', meaning: '燕が南からやって来る', startMonth: 4, startDay: 5 },
      { name: '鴻雁北', reading: 'こうがんきたへかえる', meaning: '雁が北へ帰っていく', startMonth: 4, startDay: 10 },
      { name: '虹始見', reading: 'にじはじめてあらわる', meaning: '虹が見え始める', startMonth: 4, startDay: 15 },
    ],
  },
  {
    name: '穀雨', reading: 'こくう', meaning: '穀物を潤す雨が降る',
    season: '春', month: 4, day: 20, color: '#a0c8a0',
    kou: [
      { name: '葭始生', reading: 'あしはじめてしょうず', meaning: '葦が芽を吹き始める', startMonth: 4, startDay: 20 },
      { name: '霜止出苗', reading: 'しもやんでなえいずる', meaning: '霜が降りなくなり苗が育つ', startMonth: 4, startDay: 25 },
      { name: '牡丹華', reading: 'ぼたんはなさく', meaning: '牡丹の花が咲く', startMonth: 4, startDay: 30 },
    ],
  },

  // ===== 夏 (Summer) =====
  {
    name: '立夏', reading: 'りっか', meaning: '夏の始まり',
    season: '夏', month: 5, day: 6, color: '#88c488',
    kou: [
      { name: '蛙始鳴', reading: 'かわずはじめてなく', meaning: '蛙が鳴き始める', startMonth: 5, startDay: 6 },
      { name: '蚯蚓出', reading: 'みみずいずる', meaning: 'ミミズが地上に出てくる', startMonth: 5, startDay: 11 },
      { name: '竹笋生', reading: 'たけのこしょうず', meaning: '筍が生えてくる', startMonth: 5, startDay: 16 },
    ],
  },
  {
    name: '小満', reading: 'しょうまん', meaning: '万物が次第に成長して満ちる',
    season: '夏', month: 5, day: 21, color: '#78b878',
    kou: [
      { name: '蚕起食桑', reading: 'かいこおきてくわをはむ', meaning: '蚕が桑を食べ始める', startMonth: 5, startDay: 21 },
      { name: '紅花栄', reading: 'べにばなさかう', meaning: '紅花が盛りになる', startMonth: 5, startDay: 26 },
      { name: '麦秋至', reading: 'むぎのときいたる', meaning: '麦が熟する', startMonth: 5, startDay: 31 },
    ],
  },
  {
    name: '芒種', reading: 'ぼうしゅ', meaning: '稲や麦の穂が出る植物の種をまく',
    season: '夏', month: 6, day: 6, color: '#68a868',
    kou: [
      { name: '蟷螂生', reading: 'かまきりしょうず', meaning: 'カマキリが生まれる', startMonth: 6, startDay: 6 },
      { name: '腐草為蛍', reading: 'くされたるくさほたるとなる', meaning: '蛍が光り始める', startMonth: 6, startDay: 11 },
      { name: '梅子黄', reading: 'うめのみきばむ', meaning: '梅の実が黄色く熟す', startMonth: 6, startDay: 16 },
    ],
  },
  {
    name: '夏至', reading: 'げし', meaning: '一年で最も昼が長い日',
    season: '夏', month: 6, day: 21, color: '#58a058',
    kou: [
      { name: '乃東枯', reading: 'なつかれくさかるる', meaning: '夏枯草が枯れる', startMonth: 6, startDay: 21 },
      { name: '菖蒲華', reading: 'あやめはなさく', meaning: '菖蒲の花が咲く', startMonth: 6, startDay: 27 },
      { name: '半夏生', reading: 'はんげしょうず', meaning: '半夏が生える', startMonth: 7, startDay: 2 },
    ],
  },
  {
    name: '小暑', reading: 'しょうしょ', meaning: '暑さが増し始める',
    season: '夏', month: 7, day: 7, color: '#e8a848',
    kou: [
      { name: '温風至', reading: 'あつかぜいたる', meaning: '温かい風が吹き始める', startMonth: 7, startDay: 7 },
      { name: '蓮始開', reading: 'はすはじめてひらく', meaning: '蓮の花が咲き始める', startMonth: 7, startDay: 12 },
      { name: '鷹乃学習', reading: 'たかすなわちわざをならう', meaning: '鷹の幼鳥が飛ぶことを覚える', startMonth: 7, startDay: 17 },
    ],
  },
  {
    name: '大暑', reading: 'たいしょ', meaning: '一年で最も暑い頃',
    season: '夏', month: 7, day: 23, color: '#e89030',
    kou: [
      { name: '桐始結花', reading: 'きりはじめてはなをむすぶ', meaning: '桐の花が実を結び始める', startMonth: 7, startDay: 23 },
      { name: '土潤溽暑', reading: 'つちうるおうてむしあつし', meaning: '土が湿って蒸し暑くなる', startMonth: 7, startDay: 28 },
      { name: '大雨時行', reading: 'たいうときどきふる', meaning: '大雨が時々降る', startMonth: 8, startDay: 2 },
    ],
  },

  // ===== 秋 (Autumn) =====
  {
    name: '立秋', reading: 'りっしゅう', meaning: '秋の始まり',
    season: '秋', month: 8, day: 7, color: '#d8a860',
    kou: [
      { name: '涼風至', reading: 'すずかぜいたる', meaning: '涼しい風が立ち始める', startMonth: 8, startDay: 7 },
      { name: '寒蝉鳴', reading: 'ひぐらしなく', meaning: 'ヒグラシが鳴く', startMonth: 8, startDay: 12 },
      { name: '蒙霧升降', reading: 'ふかききりまとう', meaning: '深い霧が立ち込める', startMonth: 8, startDay: 18 },
    ],
  },
  {
    name: '処暑', reading: 'しょしょ', meaning: '暑さが峠を越える',
    season: '秋', month: 8, day: 23, color: '#c89848',
    kou: [
      { name: '綿柎開', reading: 'わたのはなしべひらく', meaning: '綿の花の萼が開く', startMonth: 8, startDay: 23 },
      { name: '天地始粛', reading: 'てんちはじめてさむし', meaning: '天地の暑さが収まり始める', startMonth: 8, startDay: 28 },
      { name: '禾乃登', reading: 'こくものすなわちみのる', meaning: '穀物が実る', startMonth: 9, startDay: 2 },
    ],
  },
  {
    name: '白露', reading: 'はくろ', meaning: '草花に朝露が宿る',
    season: '秋', month: 9, day: 8, color: '#d0c0a0',
    kou: [
      { name: '草露白', reading: 'くさのつゆしろし', meaning: '草に降りた露が白く光る', startMonth: 9, startDay: 8 },
      { name: '鶺鴒鳴', reading: 'せきれいなく', meaning: 'セキレイが鳴き始める', startMonth: 9, startDay: 13 },
      { name: '玄鳥去', reading: 'つばめさる', meaning: '燕が南へ帰っていく', startMonth: 9, startDay: 18 },
    ],
  },
  {
    name: '秋分', reading: 'しゅうぶん', meaning: '秋の半ば、昼と夜の長さがほぼ等しい',
    season: '秋', month: 9, day: 23, color: '#c8a068',
    kou: [
      { name: '雷乃収声', reading: 'かみなりすなわちこえをおさむ', meaning: '雷が鳴り止む', startMonth: 9, startDay: 23 },
      { name: '蟄虫坏戸', reading: 'むしかくれてとをふさぐ', meaning: '虫が冬ごもりの準備をする', startMonth: 9, startDay: 28 },
      { name: '水始涸', reading: 'みずはじめてかるる', meaning: '田の水を落として稲刈りの準備', startMonth: 10, startDay: 3 },
    ],
  },
  {
    name: '寒露', reading: 'かんろ', meaning: '冷たい露が降りる',
    season: '秋', month: 10, day: 8, color: '#b88850',
    kou: [
      { name: '鴻雁来', reading: 'こうがんきたる', meaning: '雁が飛来し始める', startMonth: 10, startDay: 8 },
      { name: '菊花開', reading: 'きくのはなひらく', meaning: '菊の花が咲く', startMonth: 10, startDay: 13 },
      { name: '蟋蟀在戸', reading: 'きりぎりすとにあり', meaning: '蟋蟀が戸口で鳴く', startMonth: 10, startDay: 18 },
    ],
  },
  {
    name: '霜降', reading: 'そうこう', meaning: '霜が降り始める',
    season: '秋', month: 10, day: 23, color: '#a87838',
    kou: [
      { name: '霜始降', reading: 'しもはじめてふる', meaning: '霜が降り始める', startMonth: 10, startDay: 23 },
      { name: '霎時施', reading: 'こさめときどきふる', meaning: '小雨がしとしと降る', startMonth: 10, startDay: 28 },
      { name: '楓蔦黄', reading: 'もみじつたきばむ', meaning: '紅葉や蔦が色づく', startMonth: 11, startDay: 2 },
    ],
  },

  // ===== 冬 (Winter) =====
  {
    name: '立冬', reading: 'りっとう', meaning: '冬の始まり',
    season: '冬', month: 11, day: 7, color: '#8aacb8',
    kou: [
      { name: '山茶始開', reading: 'つばきはじめてひらく', meaning: '山茶花が咲き始める', startMonth: 11, startDay: 7 },
      { name: '地始凍', reading: 'ちはじめてこおる', meaning: '大地が凍り始める', startMonth: 11, startDay: 12 },
      { name: '金盞香', reading: 'きんせんかさく', meaning: '水仙の花が咲く', startMonth: 11, startDay: 17 },
    ],
  },
  {
    name: '小雪', reading: 'しょうせつ', meaning: '小さな雪が降り始める',
    season: '冬', month: 11, day: 22, color: '#b0c8d0',
    kou: [
      { name: '虹蔵不見', reading: 'にじかくれてみえず', meaning: '虹を見かけなくなる', startMonth: 11, startDay: 22 },
      { name: '朔風払葉', reading: 'きたかぜこのはをはらう', meaning: '北風が木の葉を払う', startMonth: 11, startDay: 27 },
      { name: '橘始黄', reading: 'たちばなはじめてきばむ', meaning: '橘の実が黄色くなり始める', startMonth: 12, startDay: 2 },
    ],
  },
  {
    name: '大雪', reading: 'たいせつ', meaning: '雪が激しく降り始める',
    season: '冬', month: 12, day: 7, color: '#98b8c8',
    kou: [
      { name: '閉塞成冬', reading: 'そらさむくふゆとなる', meaning: '天地の気が塞がり冬となる', startMonth: 12, startDay: 7 },
      { name: '熊蟄穴', reading: 'くまあなにこもる', meaning: '熊が冬ごもりに入る', startMonth: 12, startDay: 12 },
      { name: '鱖魚群', reading: 'さけのうおむらがる', meaning: '鮭が群がって川を上る', startMonth: 12, startDay: 17 },
    ],
  },
  {
    name: '冬至', reading: 'とうじ', meaning: '一年で最も夜が長い日',
    season: '冬', month: 12, day: 22, color: '#7098a8',
    kou: [
      { name: '乃東生', reading: 'なつかれくさしょうず', meaning: '夏枯草が芽を出す', startMonth: 12, startDay: 22 },
      { name: '麋角解', reading: 'さわしかのつのおつる', meaning: '鹿の角が落ちる', startMonth: 12, startDay: 27 },
      { name: '雪下出麦', reading: 'ゆきわたりてむぎのびる', meaning: '雪の下で麦が芽を出す', startMonth: 1, startDay: 1 },
    ],
  },
  {
    name: '小寒', reading: 'しょうかん', meaning: '寒さが増し始める',
    season: '冬', month: 1, day: 6, color: '#6890a0',
    kou: [
      { name: '芹乃栄', reading: 'せりすなわちさかう', meaning: '芹が生え始める', startMonth: 1, startDay: 6 },
      { name: '水泉動', reading: 'しみずあたたかをふくむ', meaning: '地中で凍った泉が動き始める', startMonth: 1, startDay: 10 },
      { name: '雉始雊', reading: 'きじはじめてなく', meaning: '雉が鳴き始める', startMonth: 1, startDay: 15 },
    ],
  },
  {
    name: '大寒', reading: 'たいかん', meaning: '一年で最も寒い頃',
    season: '冬', month: 1, day: 20, color: '#5888a0',
    kou: [
      { name: '款冬華', reading: 'ふきのはなさく', meaning: 'フキノトウが蕾を出す', startMonth: 1, startDay: 20 },
      { name: '水沢腹堅', reading: 'さわみずこおりつめる', meaning: '沢に厚い氷が張る', startMonth: 1, startDay: 25 },
      { name: '鶏始乳', reading: 'にわとりはじめてとやにつく', meaning: '鶏が卵を産み始める', startMonth: 1, startDay: 30 },
    ],
  },
];

/**
 * Get all 72 microseasons as a flat list with parent solar term info
 */
export function getAllKou() {
  const result = [];
  let kouIndex = 0;

  for (const term of SOLAR_TERMS) {
    for (let i = 0; i < term.kou.length; i++) {
      const kou = term.kou[i];
      const period = ['初候', '次候', '末候'][i];
      result.push({
        index: kouIndex,
        period,
        ...kou,
        solarTerm: term.name,
        solarTermReading: term.reading,
        season: term.season,
        color: term.color,
      });
      kouIndex++;
    }
  }

  return result;
}

/**
 * Find the current microseason for a given date
 */
export function getCurrentKou(date = new Date()) {
  const allKou = getAllKou();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Convert date to a comparable number (month * 100 + day)
  const dateNum = month * 100 + day;

  // Find the kou whose start date is <= current date
  // and next kou's start date is > current date
  for (let i = 0; i < allKou.length; i++) {
    const current = allKou[i];
    const next = allKou[(i + 1) % allKou.length];

    const currentNum = current.startMonth * 100 + current.startDay;
    const nextNum = next.startMonth * 100 + next.startDay;

    // Handle year wrap (e.g., Dec → Jan)
    if (nextNum < currentNum) {
      // Wrapping case
      if (dateNum >= currentNum || dateNum < nextNum) {
        return current;
      }
    } else {
      if (dateNum >= currentNum && dateNum < nextNum) {
        return current;
      }
    }
  }

  // Fallback: return last kou
  return allKou[allKou.length - 1];
}

/**
 * Get the next microseason after the current one
 */
export function getNextKou(date = new Date()) {
  const allKou = getAllKou();
  const current = getCurrentKou(date);
  const nextIndex = (current.index + 1) % allKou.length;
  return allKou[nextIndex];
}

/**
 * Search microseasons by keyword
 */
export function searchKou(keyword) {
  const allKou = getAllKou();
  const lower = keyword.toLowerCase();

  return allKou.filter(kou =>
    kou.name.includes(keyword) ||
    kou.reading.includes(lower) ||
    kou.meaning.includes(keyword) ||
    kou.solarTerm.includes(keyword) ||
    kou.season.includes(keyword)
  );
}

/**
 * Get all kou for a specific season
 */
export function getKouBySeason(season) {
  return getAllKou().filter(kou => kou.season === season);
}

/**
 * Get the current season name
 */
export function getCurrentSeason(date = new Date()) {
  const kou = getCurrentKou(date);
  return kou.season;
}
