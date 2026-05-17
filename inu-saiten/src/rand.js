// xorshift32 with golden-ratio warmup (auto-dev standard since cycle 18)

export function seedFromString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) || 1;
}

export function makeRng(seed) {
  let state = seed >>> 0 || 1;
  // golden-ratio warmup (10 steps)
  for (let i = 0; i < 10; i++) {
    state = step(state);
  }
  return {
    next() {
      state = step(state);
      return state >>> 0;
    },
    float() {
      state = step(state);
      return (state >>> 0) / 4294967296;
    },
    pick(arr) {
      if (!arr.length) return undefined;
      state = step(state);
      return arr[(state >>> 0) % arr.length];
    },
  };
}

function step(s) {
  s ^= s << 13;
  s ^= s >>> 17;
  s ^= s << 5;
  return s | 0;
}
