use serde::Serialize;

use crate::judge::Verdict;
use crate::rng::Rng;
use crate::round::{Round, generate_round};

#[derive(Debug, Clone, Copy, Serialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum GameStatus {
    Idle,
    Playing,
    Reveal,
    GameOver,
}

#[derive(Debug, Clone, Serialize)]
pub struct GameState {
    pub status: GameStatus,
    pub streak: u32,
    pub score: u32,
    pub high_streak: u32,
    pub high_score: u32,
    pub time_remaining_ms: f64,
    pub round: Option<Round>,
    pub last_correct: Option<bool>,
    pub last_player_verdict: Option<Verdict>,
}

pub struct Game {
    rng: Rng,
    state: GameState,
}

impl Game {
    pub fn new(seed: u64) -> Game {
        Game {
            rng: Rng::new(seed),
            state: GameState {
                status: GameStatus::Idle,
                streak: 0,
                score: 0,
                high_streak: 0,
                high_score: 0,
                time_remaining_ms: 0.0,
                round: None,
                last_correct: None,
                last_player_verdict: None,
            },
        }
    }

    pub fn start(&mut self) {
        self.state.streak = 0;
        self.state.score = 0;
        self.state.last_correct = None;
        self.state.last_player_verdict = None;
        self.state.status = GameStatus::Playing;
        self.next_round();
    }

    pub fn restart(&mut self) {
        self.start();
    }

    pub fn tick(&mut self, delta_ms: f64) {
        if self.state.status != GameStatus::Playing {
            return;
        }
        self.state.time_remaining_ms -= delta_ms;
        if self.state.time_remaining_ms <= 0.0 {
            self.state.time_remaining_ms = 0.0;
            self.end_game(false);
        }
    }

    pub fn answer(&mut self, choice: Verdict) {
        if self.state.status != GameStatus::Playing {
            return;
        }
        let round = match &self.state.round {
            Some(r) => r.clone(),
            None => return,
        };
        let correct = round.correct == choice;
        self.state.last_player_verdict = Some(choice);
        self.state.last_correct = Some(correct);
        if correct {
            self.state.streak += 1;
            // bonus: faster answer = more points (time_remaining/limit * 100)
            let speed_bonus = (self.state.time_remaining_ms / round.time_limit_ms * 100.0)
                .clamp(10.0, 100.0) as u32;
            self.state.score += 100 + speed_bonus;
            if self.state.streak > self.state.high_streak {
                self.state.high_streak = self.state.streak;
            }
            if self.state.score > self.state.high_score {
                self.state.high_score = self.state.score;
            }
            self.next_round();
        } else {
            self.end_game(false);
        }
    }

    pub fn state_json(&self) -> String {
        serde_json::to_string(&self.state).unwrap_or_else(|_| "{}".to_string())
    }

    pub fn state(&self) -> &GameState {
        &self.state
    }

    fn next_round(&mut self) {
        let round = generate_round(&mut self.rng, self.state.streak);
        self.state.time_remaining_ms = round.time_limit_ms;
        self.state.round = Some(round);
        self.state.status = GameStatus::Playing;
    }

    fn end_game(&mut self, _won: bool) {
        if self.state.score > self.state.high_score {
            self.state.high_score = self.state.score;
        }
        if self.state.streak > self.state.high_streak {
            self.state.high_streak = self.state.streak;
        }
        self.state.status = GameStatus::GameOver;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn start_initializes_round() {
        let mut g = Game::new(1);
        g.start();
        assert_eq!(g.state.status, GameStatus::Playing);
        assert!(g.state.round.is_some());
        assert!(g.state.time_remaining_ms > 0.0);
    }

    #[test]
    fn timeout_ends_game() {
        let mut g = Game::new(1);
        g.start();
        g.tick(10_000.0);
        assert_eq!(g.state.status, GameStatus::GameOver);
    }

    #[test]
    fn correct_answer_increments_streak() {
        let mut g = Game::new(1);
        g.start();
        let correct = g.state.round.as_ref().unwrap().correct;
        g.answer(correct);
        assert_eq!(g.state.streak, 1);
        assert!(g.state.score > 0);
        assert_eq!(g.state.status, GameStatus::Playing);
    }

    #[test]
    fn wrong_answer_ends_game() {
        let mut g = Game::new(1);
        g.start();
        let correct = g.state.round.as_ref().unwrap().correct;
        let wrong = match correct {
            Verdict::Cheap => Verdict::Expensive,
            Verdict::Fair => Verdict::Cheap,
            Verdict::Expensive => Verdict::Cheap,
        };
        g.answer(wrong);
        assert_eq!(g.state.status, GameStatus::GameOver);
        assert_eq!(g.state.streak, 0);
    }

    #[test]
    fn high_streak_persists_across_restart() {
        let mut g = Game::new(2);
        g.start();
        let correct = g.state.round.as_ref().unwrap().correct;
        g.answer(correct);
        let prev_high = g.state.high_streak;
        g.restart();
        assert_eq!(g.state.streak, 0);
        assert_eq!(g.state.high_streak, prev_high);
    }

    #[test]
    fn faster_answer_yields_more_score() {
        let mut g1 = Game::new(99);
        g1.start();
        let c1 = g1.state.round.as_ref().unwrap().correct;
        g1.answer(c1);
        let s_fast = g1.state.score;

        let mut g2 = Game::new(99);
        g2.start();
        let c2 = g2.state.round.as_ref().unwrap().correct;
        // simulate slow answer: tick almost to the limit then answer
        g2.tick(g2.state.round.as_ref().unwrap().time_limit_ms - 100.0);
        if g2.state.status == GameStatus::Playing {
            g2.answer(c2);
            let s_slow = g2.state.score;
            assert!(s_fast > s_slow, "fast={} slow={}", s_fast, s_slow);
        }
    }
}
