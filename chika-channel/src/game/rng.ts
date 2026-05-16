/** xorshift64* — small deterministic RNG for testability. */

export class RNG {
  private state: bigint;

  constructor(seed: number | bigint) {
    let s = BigInt(seed);
    if (s === 0n) s = 1n;
    this.state = s;
  }

  next(): number {
    // xorshift64*
    let x = this.state;
    x ^= x >> 12n;
    x ^= x << 25n;
    x ^= x >> 27n;
    this.state = x;
    // 0..1
    const result = (x * 2685821657736338717n) & 0xFFFFFFFFFFFFFFFFn;
    return Number(result) / 0x10000000000000000;
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(arr: readonly T[]): T {
    return arr[this.int(0, arr.length - 1)]!;
  }

  /** Bernoulli draw with probability p in [0,1] */
  chance(p: number): boolean {
    return this.next() < p;
  }
}
