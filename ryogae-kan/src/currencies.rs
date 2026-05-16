use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct Currency {
    pub code: &'static str,
    pub name: &'static str,
    pub symbol: &'static str,
    pub flag: &'static str,
    /// 1 unit of this currency = `jpy_per_unit` JPY (approximate 2026 reference)
    pub jpy_per_unit: f64,
    /// Step for rounding the displayed amount (avoids decimals)
    pub display_step: f64,
    pub difficulty: u8,
}

pub fn all_currencies() -> &'static [Currency] {
    static LIST: &[Currency] = &[
        Currency { code: "USD", name: "アメリカドル", symbol: "$",  flag: "🇺🇸", jpy_per_unit: 150.0,   display_step: 1.0,   difficulty: 1 },
        Currency { code: "EUR", name: "ユーロ",       symbol: "€",  flag: "🇪🇺", jpy_per_unit: 162.0,   display_step: 1.0,   difficulty: 1 },
        Currency { code: "KRW", name: "韓国ウォン",   symbol: "₩",  flag: "🇰🇷", jpy_per_unit: 0.11,    display_step: 100.0, difficulty: 1 },
        Currency { code: "CNY", name: "人民元",       symbol: "¥",  flag: "🇨🇳", jpy_per_unit: 20.5,    display_step: 1.0,   difficulty: 2 },
        Currency { code: "GBP", name: "英ポンド",     symbol: "£",  flag: "🇬🇧", jpy_per_unit: 190.0,   display_step: 1.0,   difficulty: 2 },
        Currency { code: "AUD", name: "豪ドル",       symbol: "A$", flag: "🇦🇺", jpy_per_unit: 99.0,    display_step: 1.0,   difficulty: 2 },
        Currency { code: "THB", name: "タイバーツ",   symbol: "฿",  flag: "🇹🇭", jpy_per_unit: 4.2,     display_step: 5.0,   difficulty: 2 },
        Currency { code: "SGD", name: "シンガポールドル", symbol: "S$", flag: "🇸🇬", jpy_per_unit: 111.0, display_step: 1.0, difficulty: 3 },
        Currency { code: "INR", name: "インドルピー", symbol: "₹",  flag: "🇮🇳", jpy_per_unit: 1.8,     display_step: 10.0,  difficulty: 3 },
        Currency { code: "VND", name: "ベトナムドン", symbol: "₫",  flag: "🇻🇳", jpy_per_unit: 0.006,   display_step: 1000.0, difficulty: 3 },
        Currency { code: "IDR", name: "インドネシアルピア", symbol: "Rp", flag: "🇮🇩", jpy_per_unit: 0.0093, display_step: 500.0, difficulty: 4 },
        Currency { code: "TWD", name: "台湾ドル",     symbol: "NT$", flag: "🇹🇼", jpy_per_unit: 4.7,    display_step: 1.0,   difficulty: 3 },
        Currency { code: "TRY", name: "トルコリラ",   symbol: "₺",  flag: "🇹🇷", jpy_per_unit: 4.5,     display_step: 1.0,   difficulty: 4 },
        Currency { code: "BRL", name: "ブラジルレアル", symbol: "R$", flag: "🇧🇷", jpy_per_unit: 27.0, display_step: 0.5, difficulty: 4 },
        Currency { code: "MXN", name: "メキシコペソ", symbol: "$",  flag: "🇲🇽", jpy_per_unit: 7.8,     display_step: 1.0,   difficulty: 4 },
    ];
    LIST
}

pub fn unlocked_for_streak(streak: u32) -> Vec<&'static Currency> {
    let level = match streak {
        0..=4 => 1,
        5..=9 => 2,
        10..=14 => 3,
        _ => 4,
    };
    all_currencies().iter().filter(|c| c.difficulty <= level).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn currencies_define_15() {
        assert_eq!(all_currencies().len(), 15);
    }

    #[test]
    fn all_rates_positive() {
        for c in all_currencies() {
            assert!(c.jpy_per_unit > 0.0, "{} has non-positive rate", c.code);
        }
    }

    #[test]
    fn difficulty_unlocks_progressively() {
        assert_eq!(unlocked_for_streak(0).iter().all(|c| c.difficulty == 1), true);
        assert!(unlocked_for_streak(5).iter().any(|c| c.difficulty == 2));
        assert!(unlocked_for_streak(10).iter().any(|c| c.difficulty == 3));
        assert!(unlocked_for_streak(20).iter().any(|c| c.difficulty == 4));
        // Highest streak unlocks everything
        assert_eq!(unlocked_for_streak(100).len(), 15);
    }

    #[test]
    fn unique_codes() {
        let codes: Vec<&str> = all_currencies().iter().map(|c| c.code).collect();
        let mut sorted = codes.clone();
        sorted.sort();
        sorted.dedup();
        assert_eq!(codes.len(), sorted.len());
    }
}
