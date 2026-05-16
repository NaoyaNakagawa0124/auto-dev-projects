// xorshift32 — small deterministic RNG.
// All callers must pass an explicit seed; we never reach for Math.random.

export function makeRng(seed) {
  // Mix the seed with the golden-ratio constant so tiny seeds (1, 2, …) still
  // produce well-spread state on the first call.
  let s = (((seed | 0) ^ 0x9e3779b1) | 0) || 0x9e3779b1;
  // Three warmup rotations to fully populate 32 bits.
  for (let i = 0; i < 3; i++) {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
  }
  return function next() {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) / 0x1_0000_0000);
  };
}

export function pickIndex(rng, len) {
  return Math.floor(rng() * len);
}

export function shuffleInPlace(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}
