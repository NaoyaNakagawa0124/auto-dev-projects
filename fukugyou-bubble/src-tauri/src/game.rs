use serde::{Deserialize, Serialize};

use crate::data::{GameConfig, HustleDef};

/// Per-hustle dynamic state.
#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
pub struct HustleState {
    pub upgrades: u32,
}

/// Viral event state — when set, multiplies one hustle's auto income.
#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
pub struct ViralState {
    /// Which hustle is currently viral (None = no event).
    pub hustle_id: Option<String>,
    /// Seconds remaining on the multiplier.
    pub seconds_left: f64,
    /// Multiplier (only meaningful while seconds_left > 0).
    pub multiplier: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameState {
    pub cash: f64,
    pub total_clicks: u64,
    pub hustles: Vec<HustleState>,
    pub viral: ViralState,
    pub elapsed_sec: f64,
    pub time_since_last_viral: f64,
    pub won: bool,
}

impl GameState {
    pub fn new(hustle_count: usize) -> Self {
        Self {
            cash: 0.0,
            total_clicks: 0,
            hustles: vec![HustleState::default(); hustle_count],
            viral: ViralState::default(),
            elapsed_sec: 0.0,
            time_since_last_viral: 0.0,
            won: false,
        }
    }
}

/// `Game` couples config + state for convenience.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Game {
    pub config: GameConfig,
    pub state: GameState,
}

impl Game {
    pub fn new(config: GameConfig) -> Self {
        let n = config.hustles.len();
        Self { config, state: GameState::new(n) }
    }
}

/// Geometric upgrade cost: base * growth^count.
pub fn upgrade_cost(base: f64, growth: f64, count: u32) -> f64 {
    base * growth.powi(count as i32)
}

/// Auto income per second from all hustles (multiplier applied if viral).
pub fn auto_income_per_sec(config: &GameConfig, state: &GameState) -> f64 {
    let mut total = 0.0;
    for (i, def) in config.hustles.iter().enumerate() {
        let upgrades = state.hustles.get(i).map(|h| h.upgrades).unwrap_or(0);
        let base = def.base_income * upgrades as f64;
        let mult = if state.viral.seconds_left > 0.0
            && state.viral.hustle_id.as_deref() == Some(def.id.as_str())
        {
            state.viral.multiplier
        } else {
            1.0
        };
        total += base * mult;
    }
    total
}

/// Single click on a hustle — adds click_reward (×viral if applicable).
pub fn click(config: &GameConfig, state: &mut GameState, hustle_id: &str) -> bool {
    let Some(def) = config.hustles.iter().find(|h| h.id == hustle_id) else { return false };
    let mult = if state.viral.seconds_left > 0.0
        && state.viral.hustle_id.as_deref() == Some(hustle_id)
    {
        state.viral.multiplier
    } else {
        1.0
    };
    state.cash += def.click_reward as f64 * mult;
    state.total_clicks += 1;
    check_win(config, state);
    true
}

/// Buy an upgrade if the player has the cash. Returns the new upgrade count or None.
pub fn buy_upgrade(config: &GameConfig, state: &mut GameState, hustle_id: &str) -> Option<u32> {
    let idx = config.hustles.iter().position(|h| h.id == hustle_id)?;
    let def: &HustleDef = &config.hustles[idx];
    let current = state.hustles[idx].upgrades;
    let cost = upgrade_cost(def.upgrade_base_cost, def.cost_growth, current);
    if state.cash < cost {
        return None;
    }
    state.cash -= cost;
    state.hustles[idx].upgrades = current + 1;
    Some(current + 1)
}

/// Advance game by `delta_ms` milliseconds.
pub fn step(config: &GameConfig, state: &mut GameState, delta_ms: f64) {
    if state.won {
        return;
    }
    let delta_sec = delta_ms / 1000.0;
    let rate = auto_income_per_sec(config, state);
    state.cash += rate * delta_sec;
    state.elapsed_sec += delta_sec;

    if state.viral.seconds_left > 0.0 {
        state.viral.seconds_left -= delta_sec;
        if state.viral.seconds_left <= 0.0 {
            state.viral = ViralState::default();
        }
    } else {
        state.time_since_last_viral += delta_sec;
    }

    check_win(config, state);
}

/// Try to roll a viral event. Returns true if started. Should be called when
/// `state.time_since_last_viral >= config.viral_period_sec` and `viral.seconds_left == 0`.
pub fn try_start_viral(config: &GameConfig, state: &mut GameState, rng_value: f64) -> Option<String> {
    if state.viral.seconds_left > 0.0 {
        return None;
    }
    if state.time_since_last_viral < config.viral_period_sec {
        return None;
    }
    let count = config.hustles.len();
    if count == 0 {
        return None;
    }
    let idx = ((rng_value.fract().abs() * count as f64) as usize).min(count - 1);
    let h = &config.hustles[idx];
    state.viral = ViralState {
        hustle_id: Some(h.id.clone()),
        seconds_left: config.viral_duration_sec,
        multiplier: config.viral_multiplier,
    };
    state.time_since_last_viral = 0.0;
    Some(h.id.clone())
}

fn check_win(config: &GameConfig, state: &mut GameState) {
    if state.cash >= config.win_target as f64 {
        state.won = true;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::data::load_hustles;

    #[test]
    fn upgrade_cost_grows_geometrically() {
        // base 100, growth 1.15
        assert!((upgrade_cost(100.0, 1.15, 0) - 100.0).abs() < 0.001);
        assert!((upgrade_cost(100.0, 1.15, 1) - 115.0).abs() < 0.001);
        assert!((upgrade_cost(100.0, 1.15, 5) - 100.0 * 1.15_f64.powi(5)).abs() < 0.001);
    }

    #[test]
    fn click_adds_reward() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        let reward = cfg.hustles[0].click_reward as f64;
        assert!(click(&cfg, &mut s, &cfg.hustles[0].id));
        assert!((s.cash - reward).abs() < 0.001);
        assert_eq!(s.total_clicks, 1);
    }

    #[test]
    fn click_with_viral_multiplies() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        let hid = cfg.hustles[0].id.clone();
        s.viral = ViralState { hustle_id: Some(hid.clone()), seconds_left: 30.0, multiplier: 3.0 };
        click(&cfg, &mut s, &hid);
        let expected = cfg.hustles[0].click_reward as f64 * 3.0;
        assert!((s.cash - expected).abs() < 0.001);
    }

    #[test]
    fn click_on_unknown_returns_false() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        assert!(!click(&cfg, &mut s, "not-a-hustle"));
        assert_eq!(s.cash, 0.0);
    }

    #[test]
    fn buy_upgrade_succeeds_with_cash() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        s.cash = 100.0;
        let bought = buy_upgrade(&cfg, &mut s, &cfg.hustles[0].id);
        assert_eq!(bought, Some(1));
        assert!(s.cash < 100.0);
    }

    #[test]
    fn buy_upgrade_fails_without_cash() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        let bought = buy_upgrade(&cfg, &mut s, &cfg.hustles[0].id);
        assert_eq!(bought, None);
        assert_eq!(s.cash, 0.0);
    }

    #[test]
    fn auto_income_zero_when_no_upgrades() {
        let cfg = load_hustles();
        let s = GameState::new(cfg.hustles.len());
        assert_eq!(auto_income_per_sec(&cfg, &s), 0.0);
    }

    #[test]
    fn auto_income_sums_upgrades() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        s.hustles[0].upgrades = 2; // base 0.5 * 2 = 1.0
        s.hustles[1].upgrades = 1; // base 0.8 * 1 = 0.8
        let expected = cfg.hustles[0].base_income * 2.0 + cfg.hustles[1].base_income * 1.0;
        assert!((auto_income_per_sec(&cfg, &s) - expected).abs() < 0.001);
    }

    #[test]
    fn auto_income_viral_applies_only_to_target() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        s.hustles[0].upgrades = 1;
        s.hustles[1].upgrades = 1;
        s.viral = ViralState {
            hustle_id: Some(cfg.hustles[0].id.clone()),
            seconds_left: 10.0,
            multiplier: 3.0,
        };
        let expected = cfg.hustles[0].base_income * 3.0 + cfg.hustles[1].base_income * 1.0;
        assert!((auto_income_per_sec(&cfg, &s) - expected).abs() < 0.001);
    }

    #[test]
    fn step_advances_cash_with_income() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        s.hustles[0].upgrades = 10; // 0.5 * 10 = 5/sec
        step(&cfg, &mut s, 1000.0);
        let expected = cfg.hustles[0].base_income * 10.0;
        assert!((s.cash - expected).abs() < 0.001);
        assert!((s.elapsed_sec - 1.0).abs() < 0.001);
    }

    #[test]
    fn step_decrements_viral_timer() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        s.viral = ViralState { hustle_id: Some("blog".into()), seconds_left: 30.0, multiplier: 3.0 };
        step(&cfg, &mut s, 5000.0);
        assert!((s.viral.seconds_left - 25.0).abs() < 0.01);
    }

    #[test]
    fn step_clears_viral_when_expired() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        s.viral = ViralState { hustle_id: Some("blog".into()), seconds_left: 1.0, multiplier: 3.0 };
        step(&cfg, &mut s, 2000.0);
        assert!(s.viral.hustle_id.is_none());
    }

    #[test]
    fn step_increases_time_since_viral_when_no_event() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        step(&cfg, &mut s, 5000.0);
        assert!((s.time_since_last_viral - 5.0).abs() < 0.001);
    }

    #[test]
    fn step_no_effect_after_win() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        s.cash = cfg.win_target as f64 + 1.0;
        s.won = true;
        let prev_cash = s.cash;
        s.hustles[0].upgrades = 100;
        step(&cfg, &mut s, 5000.0);
        assert_eq!(s.cash, prev_cash);
    }

    #[test]
    fn try_start_viral_requires_period_elapsed() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        s.time_since_last_viral = 10.0;
        assert!(try_start_viral(&cfg, &mut s, 0.5).is_none());
        s.time_since_last_viral = cfg.viral_period_sec + 1.0;
        let result = try_start_viral(&cfg, &mut s, 0.5);
        assert!(result.is_some());
        assert!(s.viral.seconds_left > 0.0);
        assert_eq!(s.time_since_last_viral, 0.0);
    }

    #[test]
    fn try_start_viral_skips_when_already_viral() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        s.time_since_last_viral = 200.0;
        s.viral = ViralState { hustle_id: Some("blog".into()), seconds_left: 10.0, multiplier: 3.0 };
        assert!(try_start_viral(&cfg, &mut s, 0.5).is_none());
    }

    #[test]
    fn try_start_viral_picks_deterministically() {
        let cfg = load_hustles();
        let mut s1 = GameState::new(cfg.hustles.len());
        let mut s2 = GameState::new(cfg.hustles.len());
        s1.time_since_last_viral = cfg.viral_period_sec + 1.0;
        s2.time_since_last_viral = cfg.viral_period_sec + 1.0;
        let r1 = try_start_viral(&cfg, &mut s1, 0.42);
        let r2 = try_start_viral(&cfg, &mut s2, 0.42);
        assert_eq!(r1, r2);
    }

    #[test]
    fn winning_sets_won_flag() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        s.cash = cfg.win_target as f64 - 10.0;
        step(&cfg, &mut s, 0.0);
        assert!(!s.won);
        s.cash = cfg.win_target as f64;
        step(&cfg, &mut s, 0.0);
        assert!(s.won);
    }

    #[test]
    fn upgrade_cost_doubles_with_growth_2() {
        assert!((upgrade_cost(10.0, 2.0, 3) - 80.0).abs() < 0.001);
    }

    #[test]
    fn game_new_initializes_one_state_per_hustle() {
        let cfg = load_hustles();
        let game = Game::new(cfg.clone());
        assert_eq!(game.state.hustles.len(), cfg.hustles.len());
        assert!(game.state.hustles.iter().all(|h| h.upgrades == 0));
    }

    #[test]
    fn buy_upgrade_cost_increases_per_level() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        s.cash = 1_000_000.0;
        let id = cfg.hustles[0].id.clone();
        buy_upgrade(&cfg, &mut s, &id);
        let after_first = s.cash;
        buy_upgrade(&cfg, &mut s, &id);
        let after_second = s.cash;
        assert!(after_first - after_second > cfg.hustles[0].upgrade_base_cost,
                "second cost should be more than first base cost");
    }

    #[test]
    fn no_cash_change_when_unknown_upgrade() {
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        s.cash = 1000.0;
        assert_eq!(buy_upgrade(&cfg, &mut s, "not-a-hustle"), None);
        assert_eq!(s.cash, 1000.0);
    }

    #[test]
    fn click_after_win_still_blocks_state_save() {
        // clicks after win should still increment cash but not unwin
        let cfg = load_hustles();
        let mut s = GameState::new(cfg.hustles.len());
        s.cash = cfg.win_target as f64;
        step(&cfg, &mut s, 0.0);
        assert!(s.won);
        let cash_before = s.cash;
        click(&cfg, &mut s, &cfg.hustles[0].id);
        assert!(s.cash > cash_before);
        assert!(s.won, "won flag should remain after click");
    }
}
