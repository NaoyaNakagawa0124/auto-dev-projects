// Simulated global leaderboard with AI opponents
import { getStats, getState } from './store.js';

// Generate AI opponents with varying skill levels
const aiOpponents = [
  { name: 'シネマ太郎', baseCountries: 42, baseFilms: 180, growth: 0.3 },
  { name: '映画子', baseCountries: 35, baseFilms: 150, growth: 0.25 },
  { name: 'フィルム侍', baseCountries: 28, baseFilms: 120, growth: 0.2 },
  { name: 'ムービー姫', baseCountries: 22, baseFilms: 95, growth: 0.18 },
  { name: 'スクリーン忍者', baseCountries: 18, baseFilms: 78, growth: 0.15 },
  { name: '銀幕の旅人', baseCountries: 15, baseFilms: 60, growth: 0.12 },
  { name: 'ポップコーン番長', baseCountries: 12, baseFilms: 48, growth: 0.1 },
  { name: 'レイトショー職人', baseCountries: 8, baseFilms: 35, growth: 0.08 },
  { name: 'DVD山田', baseCountries: 5, baseFilms: 20, growth: 0.05 },
];

function getAiScore(opponent) {
  // AI opponents grow slowly over time (days since epoch)
  const daysSinceEpoch = Math.floor(Date.now() / 86400000);
  const jitter = Math.sin(daysSinceEpoch * 0.1 + opponent.name.length) * 5;
  const countriesGrowth = Math.floor(daysSinceEpoch * opponent.growth * 0.01);
  const filmsGrowth = Math.floor(daysSinceEpoch * opponent.growth * 0.05);

  const countries = Math.min(80, opponent.baseCountries + countriesGrowth);
  const films = opponent.baseFilms + filmsGrowth;
  const score = Math.round(countries * 10 + films * 2 + jitter);

  return {
    name: opponent.name,
    countries,
    films,
    score: Math.max(0, score),
    isPlayer: false,
  };
}

export function getRankings() {
  const stats = getStats();
  const playerName = getState().playerName || 'あなた';

  const playerEntry = {
    name: playerName,
    countries: stats.totalCountries,
    films: stats.totalFilms,
    score: stats.diversityScore,
    isPlayer: true,
  };

  const entries = [
    playerEntry,
    ...aiOpponents.map(getAiScore),
  ];

  // Sort by score descending
  entries.sort((a, b) => b.score - a.score);

  return entries.map((entry, i) => ({
    ...entry,
    rank: i + 1,
  }));
}

export function getPlayerRank() {
  const rankings = getRankings();
  const player = rankings.find(r => r.isPlayer);
  return player ? player.rank : rankings.length;
}
