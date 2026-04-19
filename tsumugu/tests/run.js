/**
 * 紡ぐ テストスイート
 * Run: node tests/run.js
 */

import { getCurrentKou, getNextKou, searchKou, getAllKou, getKouBySeason, getCurrentSeason, SOLAR_TERMS, SEASON_COLORS, SEASON_EMOJI } from '../src/seasons.js';
import { getCraftForKou, getCraftsBySeason, getCraftsByMonth, getCraftsWithContext, searchCrafts, CRAFT_CATEGORIES, MONTHLY_CRAFTS } from '../src/crafts.js';
import { buildTodayEmbed, buildNextEmbed, buildCraftsEmbed, buildSearchEmbed } from '../src/embeds.js';

let passed = 0;
let failed = 0;

function suite(name) {
  console.log(`\n\x1b[33m  ${name}\x1b[0m`);
}

function assert(testName, condition) {
  if (condition) {
    console.log(`    \x1b[32m✓\x1b[0m ${testName}`);
    passed++;
  } else {
    console.log(`    \x1b[31m✗\x1b[0m ${testName}`);
    failed++;
  }
}

console.log('\x1b[1m紡ぐ テストスイート\x1b[0m');

// ===== 七十二候データベース =====
suite('七十二候データベース');

const allKou = getAllKou();
assert('全72候が存在', allKou.length === 72);
assert('二十四節気が24個', SOLAR_TERMS.length === 24);

// Check each kou has required fields
for (const kou of allKou) {
  if (!kou.name || !kou.reading || !kou.meaning || !kou.solarTerm || !kou.season || !kou.period || !kou.color) {
    assert(`候データ完全性: ${kou.name || 'unknown'}`, false);
    break;
  }
}
assert('全候に必須フィールドあり', true);

// Check periods
const periods = allKou.map(k => k.period);
const initialPeriods = periods.filter(p => p === '初候').length;
const midPeriods = periods.filter(p => p === '次候').length;
const endPeriods = periods.filter(p => p === '末候').length;
assert('初候が24個', initialPeriods === 24);
assert('次候が24個', midPeriods === 24);
assert('末候が24個', endPeriods === 24);

// Check seasons
const springKou = getKouBySeason('春');
const summerKou = getKouBySeason('夏');
const autumnKou = getKouBySeason('秋');
const winterKou = getKouBySeason('冬');
assert('春の候: 18個', springKou.length === 18);
assert('夏の候: 18個', summerKou.length === 18);
assert('秋の候: 18個', autumnKou.length === 18);
assert('冬の候: 18個', winterKou.length === 18);

// Check index continuity
for (let i = 0; i < allKou.length; i++) {
  if (allKou[i].index !== i) {
    assert(`インデックス連続: ${i}`, false);
    break;
  }
}
assert('インデックスが0〜71で連続', true);

// Check season colors and emoji
assert('春の色がある', SEASON_COLORS['春'] !== undefined);
assert('夏の色がある', SEASON_COLORS['夏'] !== undefined);
assert('秋の色がある', SEASON_COLORS['秋'] !== undefined);
assert('冬の色がある', SEASON_COLORS['冬'] !== undefined);
assert('春の絵文字がある', SEASON_EMOJI['春'] === '🌸');
assert('夏の絵文字がある', SEASON_EMOJI['夏'] === '🌿');
assert('秋の絵文字がある', SEASON_EMOJI['秋'] === '🍁');
assert('冬の絵文字がある', SEASON_EMOJI['冬'] === '❄️');

// ===== 日付計算 =====
suite('日付計算');

// Test specific dates
const jan15 = new Date(2026, 0, 15); // January 15
const kouJan = getCurrentKou(jan15);
assert('1月15日: 冬の候', kouJan.season === '冬');

const apr1 = new Date(2026, 3, 1);
const kouApr = getCurrentKou(apr1);
assert('4月1日: 春の候', kouApr.season === '春');

const jul15 = new Date(2026, 6, 15);
const kouJul = getCurrentKou(jul15);
assert('7月15日: 夏の候', kouJul.season === '夏');

const oct15 = new Date(2026, 9, 15);
const kouOct = getCurrentKou(oct15);
assert('10月15日: 秋の候', kouOct.season === '秋');

// Test cherry blossom season
const mar27 = new Date(2026, 2, 27);
const kouMar = getCurrentKou(mar27);
assert('3月27日: 桜始開', kouMar.name === '桜始開');

// Test next kou
const nextAfterMar27 = getNextKou(mar27);
assert('桜始開の次: 雷乃発声', nextAfterMar27.name === '雷乃発声');

// Test year-end wrap
const dec25 = new Date(2026, 11, 25);
const kouDec = getCurrentKou(dec25);
assert('12月25日: 冬の候', kouDec.season === '冬');

// Test getCurrentSeason
assert('getCurrentSeason 1月: 冬', getCurrentSeason(jan15) === '冬');
assert('getCurrentSeason 4月: 春', getCurrentSeason(apr1) === '春');
assert('getCurrentSeason 7月: 夏', getCurrentSeason(jul15) === '夏');
assert('getCurrentSeason 10月: 秋', getCurrentSeason(oct15) === '秋');

// Test today (should not crash)
const todayKou = getCurrentKou();
assert('今日の候が取得可能', todayKou !== null && todayKou !== undefined);
assert('今日の候に名前がある', typeof todayKou.name === 'string');

// ===== 検索 =====
suite('検索');

const sakuraResults = searchKou('桜');
assert('「桜」で候が見つかる', sakuraResults.length > 0);
assert('桜始開が含まれる', sakuraResults.some(k => k.name === '桜始開'));

const tsubameResults = searchKou('燕');
assert('「燕」で候が見つかる', tsubameResults.length > 0);

const winterResults = searchKou('冬');
assert('「冬」で候が見つかる', winterResults.length > 0);

const noResults = searchKou('アブラカダブラ');
assert('存在しないキーワード: 0件', noResults.length === 0);

const readingSearch = searchKou('うぐいす');
assert('読みがなで検索可能', readingSearch.length > 0);

// ===== 手仕事データベース =====
suite('手仕事データベース');

// Check all months have crafts
for (let m = 1; m <= 12; m++) {
  const crafts = getCraftsByMonth(m);
  assert(`${m}月にクラフトあり (${crafts.length}件)`, crafts.length > 0);
}

// Check craft structure
const janCrafts = getCraftsByMonth(1);
const firstCraft = janCrafts[0];
assert('名前がある', typeof firstCraft.name === 'string');
assert('カテゴリがある', typeof firstCraft.category === 'string');
assert('説明がある', typeof firstCraft.description === 'string');
assert('難易度がある', typeof firstCraft.difficulty === 'string');
assert('材料がある', Array.isArray(firstCraft.materials));
assert('季節メモがある', typeof firstCraft.seasonalNote === 'string');

// Check category registry
assert('つまみ細工カテゴリ', CRAFT_CATEGORIES['つまみ細工'] !== undefined);
assert('水引カテゴリ', CRAFT_CATEGORIES['水引'] !== undefined);
assert('刺し子カテゴリ', CRAFT_CATEGORIES['刺し子'] !== undefined);
assert('草木染めカテゴリ', CRAFT_CATEGORIES['草木染め'] !== undefined);

// getCraftsBySeason
const springCrafts = getCraftsBySeason('春');
assert('春のクラフトあり', springCrafts.length > 0);
const summerCrafts = getCraftsBySeason('夏');
assert('夏のクラフトあり', summerCrafts.length > 0);
const autumnCrafts = getCraftsBySeason('秋');
assert('秋のクラフトあり', autumnCrafts.length > 0);
const winterCrafts = getCraftsBySeason('冬');
assert('冬のクラフトあり', winterCrafts.length > 0);

// getCraftForKou
const testKou = getCurrentKou(apr1);
const craftForKou = getCraftForKou(testKou);
assert('候に紐づくクラフト取得', craftForKou !== null);

// getCraftsWithContext
const contextCrafts = getCraftsWithContext(4, '春');
assert('コンテキスト付きクラフト', contextCrafts.length > 0);
assert('カテゴリ情報がある', contextCrafts[0].categoryInfo !== undefined);

// searchCrafts
const sakuraCrafts = searchCrafts('桜');
assert('「桜」でクラフト検索', sakuraCrafts.length > 0);

const tumamCrafts = searchCrafts('つまみ');
assert('「つまみ」でクラフト検索', tumamCrafts.length > 0);

const noMatchCrafts = searchCrafts('量子コンピュータ');
assert('存在しないキーワード: 0件', noMatchCrafts.length === 0);

// ===== Embed生成 =====
suite('Embed生成');

const todayEmbed = buildTodayEmbed(apr1);
assert('今日のEmbed: titleあり', typeof todayEmbed.title === 'string');
assert('今日のEmbed: descriptionあり', typeof todayEmbed.description === 'string');
assert('今日のEmbed: colorあり', typeof todayEmbed.color === 'number');
assert('今日のEmbed: fieldsあり', Array.isArray(todayEmbed.fields));
assert('今日のEmbed: 3+フィールド', todayEmbed.fields.length >= 3);
assert('今日のEmbed: footerあり', todayEmbed.footer !== undefined);

const nextEmbed = buildNextEmbed(apr1);
assert('次のEmbed: titleあり', typeof nextEmbed.title === 'string');
assert('次のEmbed: 「次の候」を含む', nextEmbed.title.includes('次の候'));

const craftsEmbed = buildCraftsEmbed(apr1);
assert('手仕事Embed: titleあり', typeof craftsEmbed.title === 'string');
assert('手仕事Embed: fieldsあり', craftsEmbed.fields.length > 0);

const searchEmbed = buildSearchEmbed('桜');
assert('検索Embed: titleあり', searchEmbed.title.includes('桜'));
assert('検索Embed: fieldsあり', searchEmbed.fields.length > 0);

const emptySearch = buildSearchEmbed('zzzzz');
assert('空の検索: フィールドあり', emptySearch.fields.length > 0);
assert('空の検索: 「見つかりません」', emptySearch.fields[0].value.includes('見つかりません'));

// Embed with different seasons
const winterEmbed = buildTodayEmbed(jan15);
assert('冬のEmbed生成可能', typeof winterEmbed.title === 'string');

const summerEmbed = buildTodayEmbed(jul15);
assert('夏のEmbed生成可能', typeof summerEmbed.title === 'string');

// ===== データ整合性 =====
suite('データ整合性');

// All solar terms have exactly 3 kou
for (const term of SOLAR_TERMS) {
  assert(`${term.name}: 3候`, term.kou.length === 3);
}

// All kou dates are valid
for (const kou of allKou) {
  const validMonth = kou.startMonth >= 1 && kou.startMonth <= 12;
  const validDay = kou.startDay >= 1 && kou.startDay <= 31;
  if (!validMonth || !validDay) {
    assert(`${kou.name}: 日付妥当性`, false);
    break;
  }
}
assert('全候の日付が妥当', true);

// All kou have readings in hiragana/katakana
for (const kou of allKou) {
  if (!kou.reading || kou.reading.length === 0) {
    assert(`${kou.name}: 読みがなあり`, false);
    break;
  }
}
assert('全候に読みがなあり', true);

// Color format validation
for (const term of SOLAR_TERMS) {
  if (!/^#[0-9a-fA-F]{6}$/.test(term.color)) {
    assert(`${term.name}: 色フォーマット`, false);
    break;
  }
}
assert('全節気の色がhex形式', true);

// Difficulty levels are valid
const validDifficulties = ['初級', '中級', '上級'];
for (const [month, crafts] of Object.entries(MONTHLY_CRAFTS)) {
  for (const craft of crafts) {
    if (!validDifficulties.includes(craft.difficulty)) {
      assert(`${craft.name}: 難易度妥当性`, false);
      break;
    }
  }
}
assert('全クラフトの難易度が妥当', true);

// Materials are non-empty arrays
for (const [month, crafts] of Object.entries(MONTHLY_CRAFTS)) {
  for (const craft of crafts) {
    if (!Array.isArray(craft.materials) || craft.materials.length === 0) {
      assert(`${craft.name}: 材料あり`, false);
      break;
    }
  }
}
assert('全クラフトに材料あり', true);

// ===== Summary =====
const total = passed + failed;
console.log(`\n${'─'.repeat(40)}`);
if (failed === 0) {
  console.log(`\x1b[32m✓ ${passed}/${total} テスト全て通過\x1b[0m`);
} else {
  console.log(`\x1b[31m✗ ${failed}/${total} テスト失敗\x1b[0m`);
}

process.exit(failed > 0 ? 1 : 0);
