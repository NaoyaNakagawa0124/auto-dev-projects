/**
 * Discord Embed Builder — 和風デザイン
 * Constructs beautiful embeds for the bot commands
 */

import { getCurrentKou, getNextKou, searchKou, SEASON_EMOJI, SEASON_COLORS } from './seasons.js';
import { getCraftForKou, getCraftsBySeason, CRAFT_CATEGORIES, searchCrafts } from './crafts.js';

/**
 * Convert hex color to integer for Discord embeds
 */
function hexToInt(hex) {
  return parseInt(hex.replace('#', ''), 16);
}

/**
 * Build embed for 今日の候
 */
export function buildTodayEmbed(date = new Date()) {
  const kou = getCurrentKou(date);
  const craft = getCraftForKou(kou);
  const emoji = SEASON_EMOJI[kou.season];

  const embed = {
    title: `${emoji} ${kou.name}`,
    description: `*${kou.reading}*\n\n${kou.meaning}`,
    color: hexToInt(kou.color),
    fields: [
      {
        name: '二十四節気',
        value: `${kou.solarTerm}（${kou.solarTermReading}）`,
        inline: true,
      },
      {
        name: '区分',
        value: `${kou.season} ・ ${kou.period}`,
        inline: true,
      },
      {
        name: '時期',
        value: `${kou.startMonth}月${kou.startDay}日頃〜`,
        inline: true,
      },
    ],
    footer: {
      text: '紡ぐ — 七十二候×手仕事',
    },
    timestamp: new Date().toISOString(),
  };

  if (craft) {
    const catEmoji = CRAFT_CATEGORIES[craft.category]?.emoji || '🎨';
    embed.fields.push(
      {
        name: `\n${catEmoji} 季節の手仕事 — ${craft.name}`,
        value: `**${craft.category}** ・ ${craft.difficulty}\n${craft.description}\n\n*${craft.seasonalNote}*`,
        inline: false,
      },
      {
        name: '材料',
        value: craft.materials.join('、'),
        inline: false,
      }
    );
  }

  return embed;
}

/**
 * Build embed for 次の候
 */
export function buildNextEmbed(date = new Date()) {
  const kou = getNextKou(date);
  const emoji = SEASON_EMOJI[kou.season];

  return {
    title: `${emoji} 次の候 — ${kou.name}`,
    description: `*${kou.reading}*\n\n${kou.meaning}`,
    color: hexToInt(kou.color),
    fields: [
      {
        name: '二十四節気',
        value: `${kou.solarTerm}（${kou.solarTermReading}）`,
        inline: true,
      },
      {
        name: '区分',
        value: `${kou.season} ・ ${kou.period}`,
        inline: true,
      },
      {
        name: '時期',
        value: `${kou.startMonth}月${kou.startDay}日頃〜`,
        inline: true,
      },
    ],
    footer: {
      text: '紡ぐ — 七十二候×手仕事',
    },
  };
}

/**
 * Build embed for 季節の手仕事
 */
export function buildCraftsEmbed(date = new Date()) {
  const kou = getCurrentKou(date);
  const season = kou.season;
  const emoji = SEASON_EMOJI[season];
  const crafts = getCraftsBySeason(season);

  const craftFields = crafts.slice(0, 9).map(craft => {
    const catEmoji = CRAFT_CATEGORIES[craft.category]?.emoji || '🎨';
    return {
      name: `${catEmoji} ${craft.name}`,
      value: `**${craft.category}** ・ ${craft.difficulty}\n${craft.description}\n*${craft.seasonalNote}*`,
      inline: false,
    };
  });

  return {
    title: `${emoji} ${season}の手仕事`,
    description: `${season}にぴったりのクラフトをご紹介します`,
    color: hexToInt(SEASON_COLORS[season]),
    fields: craftFields,
    footer: {
      text: `紡ぐ — ${crafts.length}件の手仕事`,
    },
  };
}

/**
 * Build embed for search results
 */
export function buildSearchEmbed(keyword) {
  const kouResults = searchKou(keyword);
  const craftResults = searchCrafts(keyword);

  const fields = [];

  if (kouResults.length > 0) {
    const kouText = kouResults.slice(0, 5).map(kou => {
      const emoji = SEASON_EMOJI[kou.season];
      return `${emoji} **${kou.name}** (${kou.reading})\n${kou.meaning} — ${kou.startMonth}月${kou.startDay}日頃`;
    }).join('\n\n');

    fields.push({
      name: `候 (${kouResults.length}件)`,
      value: kouText + (kouResults.length > 5 ? `\n\n*...他 ${kouResults.length - 5} 件*` : ''),
      inline: false,
    });
  }

  if (craftResults.length > 0) {
    const craftText = craftResults.slice(0, 5).map(craft => {
      const catEmoji = CRAFT_CATEGORIES[craft.category]?.emoji || '🎨';
      return `${catEmoji} **${craft.name}** [${craft.difficulty}]\n${craft.description}`;
    }).join('\n\n');

    fields.push({
      name: `手仕事 (${craftResults.length}件)`,
      value: craftText + (craftResults.length > 5 ? `\n\n*...他 ${craftResults.length - 5} 件*` : ''),
      inline: false,
    });
  }

  if (fields.length === 0) {
    fields.push({
      name: '検索結果',
      value: '該当する候・手仕事は見つかりませんでした',
      inline: false,
    });
  }

  return {
    title: `🔍 検索: 「${keyword}」`,
    color: 0x888888,
    fields,
    footer: {
      text: '紡ぐ — 七十二候×手仕事',
    },
  };
}
