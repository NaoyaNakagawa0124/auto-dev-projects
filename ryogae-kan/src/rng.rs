/// Deterministic xorshift64 PRNG so rounds reproduce given a seed.
pub struct Rng {
    state: u64,
}

impl Rng {
    pub fn new(seed: u64) -> Rng {
        Rng {
            state: if seed == 0 { 0xDEADBEEFCAFEBABE } else { seed },
        }
    }

    pub fn next_u64(&mut self) -> u64 {
        let mut x = self.state;
        x ^= x << 13;
        x ^= x >> 7;
        x ^= x << 17;
        self.state = x;
        x
    }

    /// Returns a float in [0.0, 1.0).
    pub fn next_f64(&mut self) -> f64 {
        (self.next_u64() >> 11) as f64 / (1u64 << 53) as f64
    }

    pub fn range_usize(&mut self, end: usize) -> usize {
        if end == 0 {
            return 0;
        }
        (self.next_u64() as usize) % end
    }

    /// Returns a value uniformly in [lo, hi).
    pub fn range_f64(&mut self, lo: f64, hi: f64) -> f64 {
        lo + (hi - lo) * self.next_f64()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn determinism() {
        let mut a = Rng::new(42);
        let mut b = Rng::new(42);
        for _ in 0..20 {
            assert_eq!(a.next_u64(), b.next_u64());
        }
    }

    #[test]
    fn next_f64_in_range() {
        let mut r = Rng::new(1);
        for _ in 0..200 {
            let v = r.next_f64();
            assert!(v >= 0.0 && v < 1.0);
        }
    }

    #[test]
    fn range_usize_bounded() {
        let mut r = Rng::new(7);
        for _ in 0..200 {
            assert!(r.range_usize(10) < 10);
        }
    }
}
