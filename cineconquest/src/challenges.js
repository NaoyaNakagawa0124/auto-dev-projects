// Weekly challenge system with news-inspired missions
import { getStats } from './store.js';

const challengeTemplates = [
  {
    id: 'asia-week',
    title: 'アジア探索ウィーク',
    desc: '今週はアジアの映画を3本観よう！',
    target: 3,
    region: 'asia',
    reward: 50,
    icon: '🏯',
    countryCodes: ['JP', 'KR', 'CN', 'IN', 'TH', 'HK', 'TW', 'PH', 'ID', 'MY', 'VN', 'SG'],
  },
  {
    id: 'europe-week',
    title: 'ヨーロッパ映画祭',
    desc: 'ヨーロッパの映画を3本観よう！',
    target: 3,
    region: 'europe',
    reward: 50,
    icon: '🏰',
    countryCodes: ['GB', 'FR', 'DE', 'IT', 'ES', 'SE', 'NO', 'DK', 'FI', 'NL', 'BE', 'CH', 'AT', 'PL', 'CZ', 'HU', 'GR', 'PT', 'IE'],
  },
  {
    id: 'middle-east',
    title: '中東を知ろう',
    desc: '中東の映画を2本観よう。世界を理解する一歩に',
    target: 2,
    region: 'middle-east',
    reward: 60,
    icon: '🕌',
    countryCodes: ['IR', 'IL', 'TR', 'LB', 'SA', 'AE', 'EG'],
  },
  {
    id: 'latin-week',
    title: 'ラテンアメリカ紀行',
    desc: '南米・中米の映画を2本観よう！',
    target: 2,
    region: 'latin',
    reward: 50,
    icon: '💃',
    countryCodes: ['BR', 'AR', 'MX', 'CL', 'CO', 'PE', 'CU', 'UY', 'EC', 'BO'],
  },
  {
    id: 'africa-discovery',
    title: 'アフリカ映画発見',
    desc: 'アフリカの映画を2本観よう！',
    target: 2,
    region: 'africa',
    reward: 60,
    icon: '🌍',
    countryCodes: ['NG', 'ZA', 'KE', 'EG', 'MA', 'ET', 'SN', 'GH', 'TN', 'DZ'],
  },
  {
    id: 'new-country',
    title: '未知の国へ',
    desc: 'まだ観たことがない国の映画を2本観よう',
    target: 2,
    region: 'any-new',
    reward: 40,
    icon: '🗺️',
    countryCodes: null, // special handling
  },
  {
    id: 'genre-variety',
    title: 'ジャンル横断',
    desc: '今週3つの異なるジャンルの映画を観よう',
    target: 3,
    region: 'genre-variety',
    reward: 40,
    icon: '🎭',
    countryCodes: null,
  },
  {
    id: 'daily-streak',
    title: '毎日シネマ',
    desc: '5日連続で映画を記録しよう',
    target: 5,
    region: 'streak',
    reward: 70,
    icon: '🔥',
    countryCodes: null,
  },
];

function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
}

function getThisWeekMovies(movies) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekStartStr = weekStart.toISOString().slice(0, 10);

  return movies.filter(m => m.date >= weekStartStr);
}

export function getActiveChallenges() {
  const stats = getStats();
  const weekNum = getWeekNumber();
  const weekMovies = getThisWeekMovies(stats.movies);

  // Pick 3 challenges based on week number (rotating)
  const indices = [
    weekNum % challengeTemplates.length,
    (weekNum + 3) % challengeTemplates.length,
    (weekNum + 5) % challengeTemplates.length,
  ];

  // Deduplicate
  const uniqueIndices = [...new Set(indices)];
  while (uniqueIndices.length < 3) {
    const next = (uniqueIndices[uniqueIndices.length - 1] + 1) % challengeTemplates.length;
    if (!uniqueIndices.includes(next)) uniqueIndices.push(next);
  }

  return uniqueIndices.map(idx => {
    const template = challengeTemplates[idx];
    let progress = 0;

    if (template.region === 'streak') {
      progress = Math.min(stats.streak, template.target);
    } else if (template.region === 'genre-variety') {
      const genres = new Set(weekMovies.map(m => m.genre));
      progress = genres.size;
    } else if (template.region === 'any-new') {
      const allCountries = new Set(stats.movies.filter(m => !weekMovies.includes(m)).map(m => m.country));
      const newCountries = weekMovies.filter(m => !allCountries.has(m.country));
      progress = new Set(newCountries.map(m => m.country)).size;
    } else if (template.countryCodes) {
      progress = weekMovies.filter(m => template.countryCodes.includes(m.country)).length;
    }

    return {
      ...template,
      progress: Math.min(progress, template.target),
      completed: progress >= template.target,
    };
  });
}
