//! bungou-reki core library.
//!
//! Pure-logic crate: author dataset, calendar matching, battle resolution.
//! The Tauri command layer in `main.rs` wraps these as IPC commands.

pub mod data;
pub mod calendar;
pub mod battle;
pub mod state;

pub use data::{Author, AuthorStats, load_authors};
pub use calendar::{Anniversary, AnniversaryKind, summons_for_date, anniversaries_for_month};
pub use battle::{BattleRound, BattleResult, RoundOutcome, resolve_battle, score_card, opponent_for_seed};
pub use state::{PlayerState, ReadingEntry, BattleRecord};
