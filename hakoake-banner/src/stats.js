// Fictional moving-house stats. Pure: no DOM, no chrome API.

export const INITIAL_BOXES = 35;
export const BOXES_PER_VISIT_FACTOR = 1.7;
export const PHASE_BOUNDS = {
  fresh:    { min: 0,  maxInclusive: 6 },
  settling: { min: 7,  maxInclusive: 29 },
  stale:    { min: 30, maxInclusive: 89 },
  ghost:    { min: 90, maxInclusive: Infinity },
};

const DAY_MS = 86_400_000;

export function daysBetween(thenMs, nowMs) {
  return Math.max(0, Math.floor((nowMs - thenMs) / DAY_MS));
}

export function phaseFor(days) {
  if (days <= PHASE_BOUNDS.fresh.maxInclusive)    return "fresh";
  if (days <= PHASE_BOUNDS.settling.maxInclusive) return "settling";
  if (days <= PHASE_BOUNDS.stale.maxInclusive)    return "stale";
  return "ghost";
}

export function computeStats({ installedAt, visits, now }) {
  const daysSinceMove = daysBetween(installedAt, now);
  // Boxes you "should" still have after `daysSinceMove` days at home,
  // adjusted down by the visits you spent reading HN.
  const dailyAccrual = 0.4;
  const boxesRemaining = Math.round(
    INITIAL_BOXES + (daysSinceMove * dailyAccrual) - (visits * BOXES_PER_VISIT_FACTOR)
  );
  return {
    daysSinceMove,
    boxesRemaining,
    visits,
    phase: phaseFor(daysSinceMove),
    asOf: now,
  };
}

// Reads/writes via an injected storage adapter so tests don't need localStorage.
export function ensureInstallDate(storage, now) {
  const raw = storage.get("installedAt");
  if (raw == null) {
    storage.set("installedAt", now);
    return now;
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) {
    storage.set("installedAt", now);
    return now;
  }
  return n;
}

export function incrementVisits(storage) {
  const cur = Number(storage.get("visits") || 0);
  const next = (Number.isFinite(cur) ? cur : 0) + 1;
  storage.set("visits", next);
  return next;
}

export function resetMove(storage, now) {
  storage.set("installedAt", now);
  storage.set("visits", 0);
  storage.set("recent", []);
}
