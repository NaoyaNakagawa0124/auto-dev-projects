use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct Item {
    pub id: &'static str,
    pub name_jp: &'static str,
    /// Reference fair price in JPY at home (Tokyo baseline)
    pub jpy_ref: f64,
    pub emoji: &'static str,
    pub category: &'static str,
}

pub fn all_items() -> &'static [Item] {
    static LIST: &[Item] = &[
        Item { id: "coffee",      name_jp: "屋台コーヒー一杯", jpy_ref: 500.0,   emoji: "☕", category: "ドリンク" },
        Item { id: "water",       name_jp: "ペットボトルの水", jpy_ref: 150.0,   emoji: "💧", category: "ドリンク" },
        Item { id: "streetfood",  name_jp: "屋台メシ一食",     jpy_ref: 1_000.0, emoji: "🍜", category: "食事" },
        Item { id: "dinner",      name_jp: "レストラン夕食",   jpy_ref: 3_500.0, emoji: "🍽️", category: "食事" },
        Item { id: "taxi",        name_jp: "タクシー初乗り",   jpy_ref: 600.0,   emoji: "🚕", category: "移動" },
        Item { id: "metro",       name_jp: "地下鉄一回乗車",   jpy_ref: 220.0,   emoji: "🚇", category: "移動" },
        Item { id: "hostel",      name_jp: "ホステル一泊",     jpy_ref: 4_500.0, emoji: "🛏️", category: "宿" },
        Item { id: "hotel",       name_jp: "中級ホテル一泊",   jpy_ref: 12_000.0, emoji: "🏨", category: "宿" },
        Item { id: "souvenir",    name_jp: "土産マグネット",   jpy_ref: 800.0,   emoji: "🧲", category: "雑貨" },
        Item { id: "museum",      name_jp: "美術館の入場料",   jpy_ref: 1_800.0, emoji: "🎨", category: "観光" },
    ];
    LIST
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn items_define_10() {
        assert_eq!(all_items().len(), 10);
    }

    #[test]
    fn all_refs_positive() {
        for it in all_items() {
            assert!(it.jpy_ref > 0.0, "{} non-positive ref", it.id);
        }
    }

    #[test]
    fn unique_ids() {
        let ids: Vec<&str> = all_items().iter().map(|i| i.id).collect();
        let mut sorted = ids.clone();
        sorted.sort();
        sorted.dedup();
        assert_eq!(ids.len(), sorted.len());
    }
}
