//! 副業バブル — pure-logic core.

pub mod data;
pub mod game;

pub use data::{HustleDef, load_hustles, GameConfig};
pub use game::{Game, GameState, HustleState, ViralState, click, buy_upgrade, upgrade_cost,
                auto_income_per_sec, step, try_start_viral};
