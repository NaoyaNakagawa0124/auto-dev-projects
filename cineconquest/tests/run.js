// Test runner for CineConquest
// Lightweight test framework - no dependencies needed

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let currentSuite = '';

function describe(name, fn) {
  currentSuite = name;
  console.log(`\n  \x1b[1m${name}\x1b[0m`);
  fn();
}

function it(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`    \x1b[32m✓\x1b[0m ${name}`);
  } catch (e) {
    failedTests++;
    console.log(`    \x1b[31m✗\x1b[0m ${name}`);
    console.log(`      \x1b[31m${e.message}\x1b[0m`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertDeepEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// ===== Mock localStorage =====
const storage = {};
globalThis.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); },
};

// ===== Mock DOM =====
globalThis.document = {
  createElement: (tag) => ({
    tagName: tag,
    textContent: '',
    innerHTML: '',
    get innerText() { return this.textContent; },
  }),
};

// ===== Tests =====

console.log('\n\x1b[1m🎬 CineConquest Test Suite\x1b[0m');

// --- Countries Data ---
import { countries, genres, getCountryByCode, getGenreById, continentNames } from '../src/data/countries.js';

describe('Countries Data', () => {
  it('should have at least 50 countries', () => {
    assert(countries.length >= 50, `Only ${countries.length} countries`);
  });

  it('should have unique country codes', () => {
    const codes = countries.map(c => c.code);
    const unique = new Set(codes);
    assertEqual(codes.length, unique.size, 'Duplicate country codes found');
  });

  it('should have valid lat/lng for all countries', () => {
    countries.forEach(c => {
      assert(typeof c.lat === 'number' && c.lat >= -90 && c.lat <= 90, `Invalid lat for ${c.code}: ${c.lat}`);
      assert(typeof c.lng === 'number' && c.lng >= -180 && c.lng <= 180, `Invalid lng for ${c.code}: ${c.lng}`);
    });
  });

  it('should have Japanese names for all countries', () => {
    countries.forEach(c => {
      assert(c.name && c.name.length > 0, `Missing name for ${c.code}`);
    });
  });

  it('should have valid continents', () => {
    const validContinents = Object.keys(continentNames);
    countries.forEach(c => {
      assert(validContinents.includes(c.continent), `Invalid continent for ${c.code}: ${c.continent}`);
    });
  });

  it('getCountryByCode should return correct country', () => {
    const jp = getCountryByCode('JP');
    assertEqual(jp.name, '日本');
    assertEqual(jp.continent, 'asia');
  });

  it('getCountryByCode should return undefined for invalid code', () => {
    assertEqual(getCountryByCode('XX'), undefined);
  });
});

describe('Genres Data', () => {
  it('should have at least 10 genres', () => {
    assert(genres.length >= 10, `Only ${genres.length} genres`);
  });

  it('should have unique genre ids', () => {
    const ids = genres.map(g => g.id);
    const unique = new Set(ids);
    assertEqual(ids.length, unique.size, 'Duplicate genre ids found');
  });

  it('should have Japanese names for all genres', () => {
    genres.forEach(g => {
      assert(g.name && g.name.length > 0, `Missing name for ${g.id}`);
    });
  });

  it('should have valid hex colors', () => {
    genres.forEach(g => {
      assert(/^#[0-9a-fA-F]{6}$/.test(g.color), `Invalid color for ${g.id}: ${g.color}`);
    });
  });

  it('getGenreById should return correct genre', () => {
    const action = getGenreById('action');
    assertEqual(action.name, 'アクション');
  });
});

// --- Store ---
// Reset storage before store tests
localStorage.clear();

// Re-import store with fresh state
const storeModule = await import('../src/store.js');
const { getState, addMovie, deleteMovie, getStats, getConquestLevel, addAchievement, setPlayerName } = storeModule;

describe('Store - Basic Operations', () => {
  it('should start with empty state', () => {
    const state = getState();
    assertEqual(state.movies.length, 0);
    assertEqual(state.achievements.length, 0);
  });

  it('should add a movie', () => {
    const movie = addMovie({
      title: '千と千尋の神隠し',
      country: 'JP',
      genre: 'animation',
      rating: 5,
      date: '2026-03-29',
    });
    assert(movie.id, 'Movie should have an id');
    assertEqual(movie.title, '千と千尋の神隠し');
    assertEqual(getState().movies.length, 1);
  });

  it('should add multiple movies', () => {
    addMovie({ title: 'パラサイト', country: 'KR', genre: 'thriller', rating: 5 });
    addMovie({ title: 'アメリ', country: 'FR', genre: 'comedy', rating: 4 });
    assertEqual(getState().movies.length, 3);
  });

  it('should persist to localStorage', () => {
    const saved = JSON.parse(localStorage.getItem('cineconquest_data'));
    assertEqual(saved.movies.length, 3);
  });

  it('should delete a movie', () => {
    const state = getState();
    const movieId = state.movies[0].id;
    deleteMovie(movieId);
    assertEqual(getState().movies.length, 2);
  });
});

describe('Store - Stats', () => {
  it('should calculate correct total films', () => {
    const stats = getStats();
    assertEqual(stats.totalFilms, 2);
  });

  it('should calculate correct total countries', () => {
    const stats = getStats();
    assertEqual(stats.totalCountries, 2); // KR, FR
  });

  it('should calculate correct total genres', () => {
    const stats = getStats();
    assertEqual(stats.totalGenres, 2); // thriller, comedy
  });

  it('should calculate diversity score', () => {
    const stats = getStats();
    assert(stats.diversityScore > 0, 'Score should be positive');
  });

  it('should count films per country', () => {
    const stats = getStats();
    assertEqual(stats.countryFilmCounts['KR'], 1);
    assertEqual(stats.countryFilmCounts['FR'], 1);
  });

  it('should count films per genre', () => {
    const stats = getStats();
    assertEqual(stats.genreFilmCounts['thriller'], 1);
    assertEqual(stats.genreFilmCounts['comedy'], 1);
  });
});

describe('Store - Conquest Levels', () => {
  it('should return 0 for unconquered country', () => {
    assertEqual(getConquestLevel('US'), 0);
  });

  it('should return 1 for country with 1 film', () => {
    assertEqual(getConquestLevel('KR'), 1);
  });

  it('should return higher levels for more films', () => {
    // Add more KR films
    addMovie({ title: '올드보이', country: 'KR', genre: 'thriller', rating: 5 });
    assertEqual(getConquestLevel('KR'), 2); // 2 films = level 2

    addMovie({ title: '기생충', country: 'KR', genre: 'drama', rating: 5 });
    assertEqual(getConquestLevel('KR'), 3); // 3 films = level 3
  });

  it('should reach level 5 at 10+ films', () => {
    for (let i = 0; i < 7; i++) {
      addMovie({ title: `Korean Film ${i}`, country: 'KR', genre: 'drama', rating: 4 });
    }
    assertEqual(getConquestLevel('KR'), 5); // 10 films = level 5
  });
});

describe('Store - Achievements', () => {
  it('should add an achievement', () => {
    const added = addAchievement({ id: 'test-ach', icon: '🧪', name: 'テスト', desc: 'Test achievement' });
    assertEqual(added, true);
    assertEqual(getState().achievements.length, 1);
  });

  it('should not add duplicate achievement', () => {
    const added = addAchievement({ id: 'test-ach', icon: '🧪', name: 'テスト', desc: 'Test achievement' });
    assertEqual(added, false);
    assertEqual(getState().achievements.length, 1);
  });
});

describe('Store - Player Name', () => {
  it('should set player name', () => {
    setPlayerName('テストプレイヤー');
    assertEqual(getState().playerName, 'テストプレイヤー');
  });
});

// --- Achievements Checker ---
const { checkAchievements, getAllAchievements } = await import('../src/achievements.js');

describe('Achievements Checker', () => {
  it('should detect unlocked achievements', () => {
    const newAchievements = checkAchievements();
    // With 10 KR films + 1 FR film = 11 total films, 2 countries, 3 genres
    // Should unlock: first-film, five-films, ten-films, three-countries (no), etc.
    assert(newAchievements.length > 0, 'Should have new achievements');
  });

  it('should list all achievements with unlock status', () => {
    const all = getAllAchievements();
    assert(all.length > 0, 'Should have achievement definitions');
    assert(all.some(a => a.unlocked), 'Some should be unlocked');
    assert(all.some(a => !a.unlocked), 'Some should still be locked');
  });
});

// --- Leaderboard ---
const { getRankings, getPlayerRank } = await import('../src/leaderboard.js');

describe('Leaderboard', () => {
  it('should return rankings including player', () => {
    const rankings = getRankings();
    assert(rankings.length === 10, `Expected 10 entries, got ${rankings.length}`); // 1 player + 9 AI
    assert(rankings.some(r => r.isPlayer), 'Player should be in rankings');
  });

  it('should be sorted by score descending', () => {
    const rankings = getRankings();
    for (let i = 1; i < rankings.length; i++) {
      assert(rankings[i - 1].score >= rankings[i].score, 'Rankings should be sorted');
    }
  });

  it('should have correct rank numbers', () => {
    const rankings = getRankings();
    rankings.forEach((r, i) => {
      assertEqual(r.rank, i + 1);
    });
  });

  it('getPlayerRank should return a valid rank', () => {
    const rank = getPlayerRank();
    assert(rank >= 1 && rank <= 10, `Invalid rank: ${rank}`);
  });
});

// --- Challenges ---
const { getActiveChallenges } = await import('../src/challenges.js');

describe('Challenges', () => {
  it('should return 3 active challenges', () => {
    const challenges = getActiveChallenges();
    assertEqual(challenges.length, 3);
  });

  it('should have valid challenge structure', () => {
    const challenges = getActiveChallenges();
    challenges.forEach(c => {
      assert(c.id, 'Should have id');
      assert(c.title, 'Should have title');
      assert(c.desc, 'Should have desc');
      assert(typeof c.progress === 'number', 'Should have numeric progress');
      assert(typeof c.target === 'number', 'Should have numeric target');
      assert(typeof c.completed === 'boolean', 'Should have boolean completed');
      assert(c.progress <= c.target, 'Progress should not exceed target');
    });
  });

  it('should have unique challenge ids', () => {
    const challenges = getActiveChallenges();
    const ids = challenges.map(c => c.id);
    assertEqual(new Set(ids).size, ids.length, 'Challenge ids should be unique');
  });
});

// --- Summary ---
console.log('\n' + '─'.repeat(50));
console.log(`\x1b[1m  Results: ${passedTests}/${totalTests} passed\x1b[0m`);
if (failedTests > 0) {
  console.log(`  \x1b[31m${failedTests} failed\x1b[0m`);
  process.exit(1);
} else {
  console.log('  \x1b[32mAll tests passed! ✨\x1b[0m');
}
console.log('');
