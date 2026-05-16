// Stats accumulator — pure logic. Sessions are keyed by ISO date.

export function todayKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function emptyStats() {
  return {
    version: 1,
    sessions: 0,
    cycles: 0,
    by_day: {},
    last_session_ts: null,
  };
}

/** Record a completed guided session. */
export function recordSession(stats, opts) {
  const { duration_sec, cycles, ts = new Date().toISOString() } = opts;
  const dayKey = todayKey(new Date(ts));
  stats.sessions += 1;
  stats.cycles += cycles;
  stats.last_session_ts = ts;
  const day = stats.by_day[dayKey] ?? { sessions: 0, cycles: 0, duration_sec: 0 };
  day.sessions += 1;
  day.cycles += cycles;
  day.duration_sec += duration_sec;
  stats.by_day[dayKey] = day;
  return stats;
}

export function todaySessions(stats, now = new Date()) {
  const k = todayKey(now);
  return stats.by_day[k]?.sessions ?? 0;
}

export function streak(stats, now = new Date()) {
  let day = new Date(now);
  let s = 0;
  while (true) {
    const k = day.toISOString().slice(0, 10);
    const d = stats.by_day[k];
    if (!d || d.sessions === 0) break;
    s++;
    day.setUTCDate(day.getUTCDate() - 1);
  }
  return s;
}

export function recent(stats, n = 7) {
  return Object.entries(stats.by_day)
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, n)
    .map(([date, d]) => ({ date, ...d }));
}
