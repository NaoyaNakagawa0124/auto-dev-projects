use serde::Serialize;

#[derive(Debug, Clone, Copy, Serialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum Verdict {
    Cheap,
    Fair,
    Expensive,
}

impl Verdict {
    pub fn jp_label(&self) -> &'static str {
        match self {
            Verdict::Cheap => "安い",
            Verdict::Fair => "妥当",
            Verdict::Expensive => "高い",
        }
    }
}

/// Decide the correct verdict given an `actual` JPY-equivalent price and the
/// reference JPY price. Boundaries: < 0.7 cheap, [0.7, 1.3) fair, >= 1.3 expensive.
pub fn judge(actual_jpy: f64, ref_jpy: f64) -> Verdict {
    let ratio = actual_jpy / ref_jpy;
    if ratio < 0.7 {
        Verdict::Cheap
    } else if ratio < 1.3 {
        Verdict::Fair
    } else {
        Verdict::Expensive
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cheap_below_70() {
        assert_eq!(judge(699.0, 1000.0), Verdict::Cheap);
    }

    #[test]
    fn fair_at_70_to_130_exclusive() {
        assert_eq!(judge(700.0, 1000.0), Verdict::Fair);
        assert_eq!(judge(1000.0, 1000.0), Verdict::Fair);
        assert_eq!(judge(1299.999, 1000.0), Verdict::Fair);
    }

    #[test]
    fn expensive_at_130_and_above() {
        assert_eq!(judge(1300.0, 1000.0), Verdict::Expensive);
        assert_eq!(judge(2000.0, 1000.0), Verdict::Expensive);
    }
}
