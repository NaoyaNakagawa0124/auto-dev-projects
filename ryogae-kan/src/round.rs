use serde::Serialize;

use crate::currencies::{Currency, unlocked_for_streak};
use crate::items::{Item, all_items};
use crate::judge::{Verdict, judge};
use crate::rng::Rng;

#[derive(Debug, Clone, Serialize)]
pub struct Round {
    pub item_id: &'static str,
    pub item_name_jp: &'static str,
    pub item_emoji: &'static str,
    pub item_category: &'static str,
    pub item_jpy_ref: f64,
    pub currency_code: &'static str,
    pub currency_name: &'static str,
    pub currency_symbol: &'static str,
    pub currency_flag: &'static str,
    /// Displayed price in foreign currency (rounded to `display_step`).
    pub price_display: f64,
    /// Equivalent JPY value (computed from price_display).
    pub price_jpy: f64,
    /// Correct verdict for this round.
    pub correct: Verdict,
    pub time_limit_ms: f64,
}

/// Generate the next round. Pulls difficulty from `streak`.
pub fn generate_round(rng: &mut Rng, streak: u32) -> Round {
    let currencies = unlocked_for_streak(streak);
    let currency: &Currency = currencies[rng.range_usize(currencies.len())];
    let item: &Item = &all_items()[rng.range_usize(all_items().len())];

    // Skew distribution: 33% cheap, 34% fair, 33% expensive
    let bucket = rng.range_usize(3);
    let ratio = match bucket {
        0 => rng.range_f64(0.30, 0.69),
        1 => rng.range_f64(0.71, 1.29),
        _ => rng.range_f64(1.31, 2.20),
    };
    let target_jpy = item.jpy_ref * ratio;
    let raw_price = target_jpy / currency.jpy_per_unit;
    let step = currency.display_step;
    let rounded = if step > 0.0 {
        (raw_price / step).round() * step
    } else {
        raw_price
    };
    let price_display = rounded.max(step);
    let price_jpy = price_display * currency.jpy_per_unit;
    let correct = judge(price_jpy, item.jpy_ref);

    let time_limit_ms = match streak {
        0..=4 => 5000.0,
        5..=9 => 4500.0,
        10..=19 => 4000.0,
        20..=29 => 3500.0,
        _ => 3000.0,
    };

    Round {
        item_id: item.id,
        item_name_jp: item.name_jp,
        item_emoji: item.emoji,
        item_category: item.category,
        item_jpy_ref: item.jpy_ref,
        currency_code: currency.code,
        currency_name: currency.name,
        currency_symbol: currency.symbol,
        currency_flag: currency.flag,
        price_display,
        price_jpy,
        correct,
        time_limit_ms,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rounds_have_consistent_jpy() {
        let mut rng = Rng::new(1);
        for _ in 0..100 {
            let r = generate_round(&mut rng, 0);
            // price_jpy should match price_display * rate (allowing float error)
            let rate = crate::currencies::all_currencies()
                .iter()
                .find(|c| c.code == r.currency_code)
                .unwrap()
                .jpy_per_unit;
            let expected = r.price_display * rate;
            assert!((r.price_jpy - expected).abs() < 0.001);
        }
    }

    #[test]
    fn correct_verdict_matches_judge() {
        let mut rng = Rng::new(2);
        for _ in 0..200 {
            let r = generate_round(&mut rng, 0);
            assert_eq!(r.correct, judge(r.price_jpy, r.item_jpy_ref));
        }
    }

    #[test]
    fn time_decreases_with_streak() {
        let mut rng = Rng::new(3);
        let r0 = generate_round(&mut rng, 0);
        let r10 = generate_round(&mut rng, 10);
        let r30 = generate_round(&mut rng, 30);
        assert!(r0.time_limit_ms > r10.time_limit_ms);
        assert!(r10.time_limit_ms > r30.time_limit_ms);
    }

    #[test]
    fn higher_streak_unlocks_harder_currencies() {
        let mut rng = Rng::new(11);
        let mut seen_hard = false;
        for _ in 0..200 {
            let r = generate_round(&mut rng, 30);
            if r.currency_code == "IDR" || r.currency_code == "TRY" || r.currency_code == "BRL" {
                seen_hard = true;
                break;
            }
        }
        assert!(seen_hard, "high streak should occasionally pick hard currency");
    }
}
