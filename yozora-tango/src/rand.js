// xorshift32 with golden-ratio warmup so tiny seeds (1, 2, …) still produce
// well-spread sequences from the first call.
export function makeRng(seed) {
  let s = (((seed | 0) ^ 0x9e3779b1) | 0) || 0x9e3779b1;
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

export function shuffleInPlace(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}
