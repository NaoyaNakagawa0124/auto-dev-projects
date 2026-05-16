//! 両替勘 — Currency Sense Trainer.
//!
//! The Rust core handles game state, round generation, judging, and scoring.
//! The browser JS only renders state and forwards player actions.

mod currencies;
mod items;
mod judge;
mod rng;
mod round;
mod game;

pub use currencies::{Currency, all_currencies, unlocked_for_streak};
pub use items::{Item, all_items};
pub use judge::{Verdict, judge};
pub use round::{Round, generate_round};
pub use game::{Game, GameState, GameStatus};

use wasm_bindgen::prelude::*;

/// JS facing handle. Wraps a Game.
#[wasm_bindgen]
pub struct Engine {
    game: Game,
}

#[wasm_bindgen]
impl Engine {
    #[wasm_bindgen(constructor)]
    pub fn new(seed: u64) -> Engine {
        Engine { game: Game::new(seed) }
    }

    pub fn start(&mut self) -> String {
        self.game.start();
        self.state_json()
    }

    pub fn tick(&mut self, delta_ms: f64) -> String {
        self.game.tick(delta_ms);
        self.state_json()
    }

    /// answer: 0 = cheap, 1 = fair, 2 = expensive
    pub fn answer(&mut self, choice: u8) -> String {
        self.game.answer(match choice {
            0 => Verdict::Cheap,
            1 => Verdict::Fair,
            _ => Verdict::Expensive,
        });
        self.state_json()
    }

    pub fn state_json(&self) -> String {
        self.game.state_json()
    }

    pub fn restart(&mut self) -> String {
        self.game.restart();
        self.state_json()
    }
}
