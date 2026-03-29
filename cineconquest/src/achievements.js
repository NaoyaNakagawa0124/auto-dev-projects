// Achievement definitions and checker
import { getStats, addAchievement, getState } from './store.js';

const achievementDefs = [
  {
    id: 'first-film',
    icon: '🎬',
    name: '映画デビュー',
    desc: '最初の映画を記録した',
    check: (s) => s.totalFilms >= 1,
  },
  {
    id: 'five-films',
    icon: '🎥',
    name: 'シネマファン',
    desc: '5本の映画を記録した',
    check: (s) => s.totalFilms >= 5,
  },
  {
    id: 'ten-films',
    icon: '🎞️',
    name: '映画通',
    desc: '10本の映画を記録した',
    check: (s) => s.totalFilms >= 10,
  },
  {
    id: 'fifty-films',
    icon: '🏆',
    name: 'シネマ王',
    desc: '50本の映画を記録した',
    check: (s) => s.totalFilms >= 50,
  },
  {
    id: 'hundred-films',
    icon: '👑',
    name: '映画の神',
    desc: '100本の映画を記録した',
    check: (s) => s.totalFilms >= 100,
  },
  {
    id: 'three-countries',
    icon: '🌍',
    name: '冒険の始まり',
    desc: '3か国の映画を観た',
    check: (s) => s.totalCountries >= 3,
  },
  {
    id: 'ten-countries',
    icon: '✈️',
    name: '世界旅行者',
    desc: '10か国の映画を観た',
    check: (s) => s.totalCountries >= 10,
  },
  {
    id: 'twenty-countries',
    icon: '🗺️',
    name: 'グローバリスト',
    desc: '20か国の映画を観た',
    check: (s) => s.totalCountries >= 20,
  },
  {
    id: 'thirty-countries',
    icon: '🌐',
    name: '世界征服者',
    desc: '30か国の映画を観た',
    check: (s) => s.totalCountries >= 30,
  },
  {
    id: 'five-genres',
    icon: '🎭',
    name: '多彩な味覚',
    desc: '5種類のジャンルを制覇した',
    check: (s) => s.totalGenres >= 5,
  },
  {
    id: 'ten-genres',
    icon: '🎪',
    name: 'ジャンルマスター',
    desc: '10種類のジャンルを制覇した',
    check: (s) => s.totalGenres >= 10,
  },
  {
    id: 'streak-3',
    icon: '🔥',
    name: '3日連続',
    desc: '3日連続で映画を記録した',
    check: (s) => s.streak >= 3,
  },
  {
    id: 'streak-7',
    icon: '💪',
    name: '一週間の挑戦',
    desc: '7日連続で映画を記録した',
    check: (s) => s.streak >= 7,
  },
  {
    id: 'streak-30',
    icon: '⚡',
    name: '鋼の意志',
    desc: '30日連続で映画を記録した',
    check: (s) => s.streak >= 30,
  },
  {
    id: 'conquest-5',
    icon: '🏰',
    name: '完全征服',
    desc: '1か国をレベル5まで征服した',
    check: (s) => Object.values(s.conquestLevels).some(l => l >= 5),
  },
  {
    id: 'asia-explorer',
    icon: '🏯',
    name: 'アジア探検家',
    desc: 'アジア5か国の映画を観た',
    check: (s) => {
      const asiaCodes = ['JP', 'KR', 'CN', 'IN', 'TH', 'HK', 'TW', 'PH', 'ID', 'MY', 'VN', 'SG', 'TR', 'IL', 'IR', 'SA', 'AE', 'PK', 'BD', 'LB', 'NP', 'LK', 'MM', 'KH', 'MN', 'KZ', 'GE', 'AM'];
      const watched = new Set(s.movies.map(m => m.country));
      return asiaCodes.filter(c => watched.has(c)).length >= 5;
    },
  },
  {
    id: 'europe-explorer',
    icon: '🏰',
    name: 'ヨーロッパ探検家',
    desc: 'ヨーロッパ5か国の映画を観た',
    check: (s) => {
      const eurCodes = ['GB', 'FR', 'DE', 'IT', 'ES', 'RU', 'SE', 'NO', 'DK', 'FI', 'NL', 'BE', 'CH', 'AT', 'PL', 'CZ', 'HU', 'GR', 'PT', 'IE', 'RO', 'UA', 'IS', 'HR', 'RS', 'BG', 'SK', 'SI', 'LT', 'LV', 'EE'];
      const watched = new Set(s.movies.map(m => m.country));
      return eurCodes.filter(c => watched.has(c)).length >= 5;
    },
  },
];

export function checkAchievements() {
  const stats = getStats();
  const newAchievements = [];

  achievementDefs.forEach(def => {
    if (def.check(stats)) {
      const added = addAchievement({ id: def.id, icon: def.icon, name: def.name, desc: def.desc });
      if (added) {
        newAchievements.push(def);
      }
    }
  });

  return newAchievements;
}

export function getAllAchievements() {
  const unlocked = new Set(getState().achievements.map(a => a.id));
  return achievementDefs.map(def => ({
    ...def,
    unlocked: unlocked.has(def.id),
  }));
}
