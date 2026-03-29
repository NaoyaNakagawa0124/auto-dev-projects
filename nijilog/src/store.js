// NijiLog data store with localStorage persistence
const STORAGE_KEY = 'nijilog_data';

const defaultState = {
  entries: [],       // { id, date, mood, text, createdAt }
  streakCount: 0,
  streakLastDate: null,
  longestStreak: 0,
};

let state = loadState();
const listeners = new Set();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultState, ...JSON.parse(saved) };
  } catch { /* ignore */ }
  return { ...defaultState };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
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

export function addEntry(entry) {
  const dateStr = entry.date || todayStr();

  // Replace if same date exists
  state.entries = state.entries.filter(e => e.date !== dateStr);

  const newEntry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    date: dateStr,
    mood: entry.mood,
    text: entry.text || '',
    createdAt: new Date().toISOString(),
  };

  state.entries.push(newEntry);
  state.entries.sort((a, b) => a.date.localeCompare(b.date));

  updateStreak();
  saveState();
  notify();
  return newEntry;
}

export function deleteEntry(date) {
  state.entries = state.entries.filter(e => e.date !== date);
  updateStreak();
  saveState();
  notify();
}

export function getEntryByDate(date) {
  return state.entries.find(e => e.date === date) || null;
}

function updateStreak() {
  // Calculate streak from entries
  const dates = new Set(state.entries.map(e => e.date));
  const today = todayStr();
  let streak = 0;
  let d = today;

  // Count backwards from today
  while (dates.has(d)) {
    streak++;
    d = prevDay(d);
  }

  // If no entry today, check if yesterday was last entry
  if (!dates.has(today)) {
    const yesterday = prevDay(today);
    if (dates.has(yesterday)) {
      streak = 0;
      d = yesterday;
      while (dates.has(d)) {
        streak++;
        d = prevDay(d);
      }
    }
  }

  state.streakCount = streak;
  state.streakLastDate = dates.has(today) ? today : null;
  state.longestStreak = Math.max(state.longestStreak, streak);
}

export function getStats() {
  const { entries, streakCount, longestStreak } = state;

  // Mood counts
  const moodCounts = {};
  entries.forEach(e => {
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });

  // Entries by month
  const monthlyEntries = {};
  entries.forEach(e => {
    const month = e.date.slice(0, 7); // YYYY-MM
    monthlyEntries[month] = (monthlyEntries[month] || 0) + 1;
  });

  // Days with entries
  const daysWithEntries = new Set(entries.map(e => e.date)).size;

  // Consecutive days analysis
  const gaps = computeGaps(entries);

  return {
    totalEntries: entries.length,
    daysWithEntries,
    streak: streakCount,
    longestStreak,
    moodCounts,
    monthlyEntries,
    gaps,
    entries: [...entries].reverse(),
  };
}

// Compute gaps (breaks) between entry dates
export function computeGaps(entries) {
  if (entries.length < 2) return [];
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const gaps = [];

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date);
    const curr = new Date(sorted[i].date);
    const diffDays = Math.round((curr - prev) / 86400000);
    if (diffDays > 1) {
      gaps.push({
        after: sorted[i - 1].date,
        before: sorted[i].date,
        days: diffDays - 1,
      });
    }
  }

  return gaps;
}

// Get entries for a specific month (YYYY-MM)
export function getEntriesForMonth(yearMonth) {
  return state.entries.filter(e => e.date.startsWith(yearMonth));
}

// Helpers
export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function prevDay(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
