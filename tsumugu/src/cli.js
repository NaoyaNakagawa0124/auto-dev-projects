#!/usr/bin/env node
/**
 * 紡ぐ (Tsumugu) — CLI Mode
 * Standalone interface for testing without Discord
 */

import { getCurrentKou, getNextKou, searchKou, getAllKou, SEASON_EMOJI, SEASON_COLORS, getKouBySeason, getCurrentSeason } from './seasons.js';
import { getCraftForKou, getCraftsBySeason, getCraftsWithContext, searchCrafts, CRAFT_CATEGORIES } from './crafts.js';

// ===== ANSI Colors =====
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  bgBlack: '\x1b[40m',
};

const SEASON_CLI_COLORS = {
  春: c.magenta,
  夏: c.green,
  秋: c.yellow,
  冬: c.cyan,
};

// ===== Box Drawing =====
function box(title, content, color = c.white) {
  const lines = content.split('\n');
  const maxLen = Math.max(title.length * 2, ...lines.map(l => stripAnsi(l).length));
  const width = maxLen + 4;

  const top = `${color}┌${'─'.repeat(width)}┐${c.reset}`;
  const titleLine = `${color}│${c.reset} ${c.bold}${title}${c.reset}${' '.repeat(width - stripAnsi(title).length - 1)}${color}│${c.reset}`;
  const sep = `${color}├${'─'.repeat(width)}┤${c.reset}`;
  const bottom = `${color}└${'─'.repeat(width)}┘${c.reset}`;

  const contentLines = lines.map(l => {
    const pad = width - stripAnsi(l).length - 1;
    return `${color}│${c.reset} ${l}${' '.repeat(Math.max(0, pad))}${color}│${c.reset}`;
  });

  return [top, titleLine, sep, ...contentLines, bottom].join('\n');
}

function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

// ===== Commands =====
function cmdToday(date) {
  const kou = getCurrentKou(date);
  const craft = getCraftForKou(kou);
  const seasonColor = SEASON_CLI_COLORS[kou.season];
  const emoji = SEASON_EMOJI[kou.season];

  let content = '';
  content += `${seasonColor}${emoji} ${kou.season}${c.reset} ${c.dim}${kou.solarTerm}（${kou.solarTermReading}）${kou.period}${c.reset}\n`;
  content += `\n`;
  content += `${c.bold}${kou.name}${c.reset}\n`;
  content += `${c.dim}${kou.reading}${c.reset}\n`;
  content += `\n`;
  content += `${kou.meaning}\n`;
  content += `\n`;
  content += `${c.dim}時期: ${kou.startMonth}月${kou.startDay}日頃〜${c.reset}`;

  if (craft) {
    content += `\n\n${c.gray}── 季節の手仕事 ──${c.reset}\n`;
    content += `\n`;
    content += `${CRAFT_CATEGORIES[craft.category]?.emoji || '🎨'} ${c.bold}${craft.name}${c.reset}\n`;
    content += `${c.dim}${craft.category} ・ ${craft.difficulty}${c.reset}\n`;
    content += `${craft.description}\n`;
    content += `\n`;
    content += `${c.dim}材料: ${craft.materials.join('、')}${c.reset}\n`;
    content += `${c.italic}${craft.seasonalNote}${c.reset}`;
  }

  console.log();
  console.log(box(`${emoji} 今日の候`, content, seasonColor));
  console.log();
}

function cmdNext(date) {
  const kou = getNextKou(date);
  const seasonColor = SEASON_CLI_COLORS[kou.season];
  const emoji = SEASON_EMOJI[kou.season];

  let content = '';
  content += `${seasonColor}${emoji} ${kou.season}${c.reset} ${c.dim}${kou.solarTerm}（${kou.solarTermReading}）${kou.period}${c.reset}\n`;
  content += `\n`;
  content += `${c.bold}${kou.name}${c.reset}\n`;
  content += `${c.dim}${kou.reading}${c.reset}\n`;
  content += `\n`;
  content += `${kou.meaning}\n`;
  content += `\n`;
  content += `${c.dim}時期: ${kou.startMonth}月${kou.startDay}日頃〜${c.reset}`;

  console.log();
  console.log(box(`次の候`, content, seasonColor));
  console.log();
}

function cmdCrafts(date) {
  const season = getCurrentSeason(date);
  const seasonColor = SEASON_CLI_COLORS[season];
  const emoji = SEASON_EMOJI[season];
  const crafts = getCraftsBySeason(season);

  let content = '';
  content += `${seasonColor}${emoji} ${season}のおすすめ手仕事${c.reset}\n`;

  for (const craft of crafts) {
    const catEmoji = CRAFT_CATEGORIES[craft.category]?.emoji || '🎨';
    content += `\n`;
    content += `${catEmoji} ${c.bold}${craft.name}${c.reset} ${c.dim}[${craft.difficulty}]${c.reset}\n`;
    content += `   ${craft.description}\n`;
    content += `   ${c.dim}${craft.seasonalNote}${c.reset}`;
    content += `\n`;
  }

  console.log();
  console.log(box(`${emoji} 季節の手仕事`, content, seasonColor));
  console.log();
}

function cmdSearch(keyword) {
  if (!keyword) {
    console.log(`${c.red}検索キーワードを指定してください${c.reset}`);
    console.log(`使い方: node src/cli.js search <キーワード>`);
    return;
  }

  const kouResults = searchKou(keyword);
  const craftResults = searchCrafts(keyword);

  let content = '';
  content += `${c.dim}キーワード: 「${keyword}」${c.reset}\n`;

  if (kouResults.length > 0) {
    content += `\n${c.bold}── 候 (${kouResults.length}件) ──${c.reset}\n`;
    for (const kou of kouResults.slice(0, 5)) {
      const emoji = SEASON_EMOJI[kou.season];
      content += `\n  ${emoji} ${c.bold}${kou.name}${c.reset} ${c.dim}(${kou.reading})${c.reset}\n`;
      content += `     ${kou.meaning}\n`;
      content += `     ${c.dim}${kou.solarTerm} ${kou.period} ・ ${kou.startMonth}月${kou.startDay}日頃${c.reset}\n`;
    }
    if (kouResults.length > 5) {
      content += `\n  ${c.dim}...他 ${kouResults.length - 5} 件${c.reset}\n`;
    }
  }

  if (craftResults.length > 0) {
    content += `\n${c.bold}── 手仕事 (${craftResults.length}件) ──${c.reset}\n`;
    for (const craft of craftResults.slice(0, 5)) {
      const catEmoji = CRAFT_CATEGORIES[craft.category]?.emoji || '🎨';
      content += `\n  ${catEmoji} ${c.bold}${craft.name}${c.reset} ${c.dim}[${craft.difficulty}]${c.reset}\n`;
      content += `     ${craft.description}\n`;
    }
    if (craftResults.length > 5) {
      content += `\n  ${c.dim}...他 ${craftResults.length - 5} 件${c.reset}\n`;
    }
  }

  if (kouResults.length === 0 && craftResults.length === 0) {
    content += `\n${c.dim}該当する候・手仕事は見つかりませんでした${c.reset}\n`;
  }

  console.log();
  console.log(box(`🔍 検索結果`, content, c.white));
  console.log();
}

function cmdList() {
  const allKou = getAllKou();
  let currentSolarTerm = '';

  let content = '';
  content += `${c.dim}全 72 候 一覧${c.reset}\n`;

  for (const kou of allKou) {
    if (kou.solarTerm !== currentSolarTerm) {
      currentSolarTerm = kou.solarTerm;
      const seasonColor = SEASON_CLI_COLORS[kou.season];
      const emoji = SEASON_EMOJI[kou.season];
      content += `\n${seasonColor}${emoji} ${c.bold}${kou.solarTerm}${c.reset}${seasonColor} (${kou.solarTermReading})${c.reset}\n`;
    }
    const periodMark = { '初候': '┣', '次候': '┣', '末候': '┗' }[kou.period] || '┣';
    content += `  ${c.dim}${periodMark}${c.reset} ${kou.name} ${c.dim}${kou.reading}${c.reset}\n`;
    content += `  ${c.dim}┃${c.reset}  ${c.dim}${kou.meaning} (${kou.startMonth}/${kou.startDay}〜)${c.reset}\n`;
  }

  console.log();
  console.log(content);
  console.log();
}

function cmdHelp() {
  let content = '';
  content += `${c.bold}紡ぐ (Tsumugu)${c.reset} — 七十二候×手仕事\n`;
  content += `\n`;
  content += `${c.bold}使い方:${c.reset}\n`;
  content += `  node src/cli.js ${c.cyan}today${c.reset}       今日の候と手仕事\n`;
  content += `  node src/cli.js ${c.cyan}next${c.reset}        次の候\n`;
  content += `  node src/cli.js ${c.cyan}crafts${c.reset}      季節の手仕事一覧\n`;
  content += `  node src/cli.js ${c.cyan}search${c.reset} <kw> 候・手仕事を検索\n`;
  content += `  node src/cli.js ${c.cyan}list${c.reset}        全72候一覧\n`;
  content += `  node src/cli.js ${c.cyan}help${c.reset}        このヘルプを表示`;

  console.log();
  console.log(box('紡ぐ ヘルプ', content, c.cyan));
  console.log();
}

// ===== Main =====
const args = process.argv.slice(2);
const command = args[0] || 'today';

// Support --date for testing specific dates
let testDate = undefined;
const dateArg = args.find(a => a.startsWith('--date='));
if (dateArg) {
  testDate = new Date(dateArg.split('=')[1]);
}

switch (command) {
  case 'today':
    cmdToday(testDate);
    break;
  case 'next':
    cmdNext(testDate);
    break;
  case 'crafts':
    cmdCrafts(testDate);
    break;
  case 'search':
    cmdSearch(args[1]);
    break;
  case 'list':
    cmdList();
    break;
  case 'help':
  case '--help':
  case '-h':
    cmdHelp();
    break;
  default:
    console.log(`${c.red}不明なコマンド: ${command}${c.reset}`);
    cmdHelp();
}
