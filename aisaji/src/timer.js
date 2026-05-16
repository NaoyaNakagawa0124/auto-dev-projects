// Test-friendly timer. The caller drives time via `clock` (default: real wall
// clock). For tests, pass a fake clock that advances explicitly.

export function realClock() {
  return {
    now: () => Date.now(),
    setTimeout: (fn, ms) => setTimeout(fn, ms),
    clearTimeout: (h) => clearTimeout(h),
  };
}

// Returns a controller: { start(), stop(), elapsedMs() }.
// Calls onTick at most every tickMs; calls onEnd once when total time hits
// durationMs. onCardChange fires every cardSwitchMs to advance the hand index.
export function createRound({
  durationMs = 90_000,
  tickMs = 200,
  cardSwitchMs = 6_000,
  handSize,
  onTick = () => {},
  onCardChange = () => {},
  onEnd = () => {},
  clock = realClock(),
}) {
  let startedAt = 0;
  let handle = null;
  let stopped = false;
  let lastCardIndex = -1;

  function loop() {
    if (stopped) return;
    const elapsed = clock.now() - startedAt;
    if (elapsed >= durationMs) {
      onTick(durationMs, durationMs);
      const finalIdx = Math.min(handSize - 1, Math.floor(elapsed / cardSwitchMs));
      if (finalIdx !== lastCardIndex) {
        lastCardIndex = finalIdx;
        onCardChange(finalIdx);
      }
      stopped = true;
      onEnd();
      return;
    }
    onTick(elapsed, durationMs);
    const idx = Math.min(handSize - 1, Math.floor(elapsed / cardSwitchMs));
    if (idx !== lastCardIndex) {
      lastCardIndex = idx;
      onCardChange(idx);
    }
    handle = clock.setTimeout(loop, tickMs);
  }

  return {
    start() {
      if (startedAt) return;
      startedAt = clock.now();
      loop();
    },
    stop() {
      stopped = true;
      if (handle != null) clock.clearTimeout(handle);
    },
    elapsedMs() {
      return startedAt ? Math.min(durationMs, clock.now() - startedAt) : 0;
    },
  };
}

// Simple controllable clock for tests.
export function fakeClock() {
  let t = 0;
  const queue = [];
  return {
    now: () => t,
    setTimeout(fn, ms) {
      const id = queue.length + 1;
      queue.push({ id, fireAt: t + ms, fn });
      return id;
    },
    clearTimeout(id) {
      const i = queue.findIndex(q => q.id === id);
      if (i >= 0) queue.splice(i, 1);
    },
    advance(ms) {
      const target = t + ms;
      while (queue.length) {
        const next = queue.reduce((a, b) => (a.fireAt < b.fireAt ? a : b));
        if (next.fireAt > target) break;
        t = next.fireAt;
        const i = queue.indexOf(next);
        queue.splice(i, 1);
        next.fn();
      }
      t = target;
    },
  };
}
