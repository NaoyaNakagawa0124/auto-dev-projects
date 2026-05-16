use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HustleDef {
    pub id: String,
    pub name_jp: String,
    pub emoji: String,
    pub click_reward: i64,
    pub base_income: f64,
    pub upgrade_base_cost: f64,
    pub cost_growth: f64,
    pub viral_blurb: String,
    pub color: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameConfig {
    pub version: u32,
    pub win_target: i64,
    pub viral_period_sec: f64,
    pub viral_duration_sec: f64,
    pub viral_multiplier: f64,
    pub hustles: Vec<HustleDef>,
}

const RAW: &str = include_str!("../../src/data/hustles.json");

pub fn load_hustles() -> GameConfig {
    serde_json::from_str(RAW).expect("hustles.json must be valid")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn data_loads() {
        let cfg = load_hustles();
        assert_eq!(cfg.hustles.len(), 8);
        assert!(cfg.win_target > 0);
        assert!(cfg.viral_multiplier > 1.0);
    }

    #[test]
    fn hustles_have_ascending_unlock_cost() {
        let cfg = load_hustles();
        for w in cfg.hustles.windows(2) {
            assert!(
                w[0].upgrade_base_cost <= w[1].upgrade_base_cost,
                "hustle {} should not be more expensive than {}",
                w[0].id, w[1].id
            );
        }
    }

    #[test]
    fn all_ids_unique() {
        let cfg = load_hustles();
        let mut ids: Vec<&str> = cfg.hustles.iter().map(|h| h.id.as_str()).collect();
        ids.sort();
        let n_before = ids.len();
        ids.dedup();
        assert_eq!(ids.len(), n_before);
    }
}
