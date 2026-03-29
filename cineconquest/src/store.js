// Data store with localStorage persistence
const STORAGE_KEY = 'cineconquest_data';

const defaultState = {
  movies: [],
  achievements: [],
  streakLastDate: null,
  streakCount: 0,
  playerName: 'あなた',
};

let state = loadState();
const listeners = new Set();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...defaultState, ...JSON.parse(saved) };
    }
  } catch {
    // ignore
  }
  return { ...defaultState };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function notify() {
  listeners.forEach(fn => fn(state));
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function addMovie(movie) {
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title: movie.title,
    country: movie.country,
    genre: movie.genre,
    rating: movie.rating || 0,
    date: movie.date || new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
  };

  state.movies.push(entry);
  updateStreak(entry.date);
  saveState();
  notify();
  return entry;
}

export function deleteMovie(id) {
  state.movies = state.movies.filter(m => m.id !== id);
  saveState();
  notify();
}

function updateStreak(dateStr) {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (state.streakLastDate === today) {
    // Already logged today
    return;
  } else if (state.streakLastDate === yesterday || state.streakLastDate === null) {
    state.streakCount += 1;
  } else {
    state.streakCount = 1;
  }
  state.streakLastDate = today;
}

export function addAchievement(achievement) {
  if (state.achievements.some(a => a.id === achievement.id)) return false;
  state.achievements.push({ ...achievement, unlockedAt: new Date().toISOString() });
  saveState();
  notify();
  return true;
}

// Computed stats
export function getStats() {
  const { movies } = state;

  const countriesSet = new Set(movies.map(m => m.country));
  const genresSet = new Set(movies.map(m => m.genre));
  const continentsSet = new Set();

  // Count films per country
  const countryFilmCounts = {};
  movies.forEach(m => {
    countryFilmCounts[m.country] = (countryFilmCounts[m.country] || 0) + 1;
  });

  // Count films per genre
  const genreFilmCounts = {};
  movies.forEach(m => {
    genreFilmCounts[m.genre] = (genreFilmCounts[m.genre] || 0) + 1;
  });

  // Conquest levels per country (1-5 based on film count)
  const conquestLevels = {};
  Object.entries(countryFilmCounts).forEach(([code, count]) => {
    if (count >= 10) conquestLevels[code] = 5;
    else if (count >= 6) conquestLevels[code] = 4;
    else if (count >= 3) conquestLevels[code] = 3;
    else if (count >= 2) conquestLevels[code] = 2;
    else conquestLevels[code] = 1;
  });

  // Diversity score: weighted by countries, genres, continents
  const diversityScore = Math.round(
    countriesSet.size * 10 +
    genresSet.size * 5 +
    movies.length * 2
  );

  return {
    totalFilms: movies.length,
    totalCountries: countriesSet.size,
    totalGenres: genresSet.size,
    diversityScore,
    streak: state.streakCount,
    countryFilmCounts,
    genreFilmCounts,
    conquestLevels,
    movies: [...movies].reverse(),
  };
}

export function getConquestLevel(countryCode) {
  const count = state.movies.filter(m => m.country === countryCode).length;
  if (count >= 10) return 5;
  if (count >= 6) return 4;
  if (count >= 3) return 3;
  if (count >= 2) return 2;
  if (count >= 1) return 1;
  return 0;
}

export function setPlayerName(name) {
  state.playerName = name;
  saveState();
  notify();
}
