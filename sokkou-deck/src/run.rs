use serde::{Deserialize, Serialize};

use crate::deck::Deck;
use crate::normalize::is_correct;

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum RunMode {
    AnyPercent,
    HundredPercent,
    Consistency,
}

impl RunMode {
    pub fn label(&self) -> &'static str {
        match self {
            RunMode::AnyPercent => "any%",
            RunMode::HundredPercent => "100%",
            RunMode::Consistency => "consistency",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Split {
    pub card_id: String,
    pub answer_given: String,
    pub correct: bool,
    pub time_ms: u64,
    pub delta_ms: u64,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub enum RunStatus {
    InProgress,
    Finished,
    Failed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Run {
    pub deck_id: String,
    pub mode: RunMode,
    pub started_at_ms: u64,
    pub splits: Vec<Split>,
    pub current_index: usize,
    pub status: RunStatus,
    pub penalty_ms: u64,
}

impl Run {
    pub fn start(deck: &Deck, mode: RunMode, started_at_ms: u64) -> Self {
        Self {
            deck_id: deck.id.clone(),
            mode,
            started_at_ms,
            splits: Vec::new(),
            current_index: 0,
            status: RunStatus::InProgress,
            penalty_ms: 0,
        }
    }

    pub fn current_card<'a>(&self, deck: &'a Deck) -> Option<&'a crate::deck::Card> {
        deck.cards.get(self.current_index)
    }

    pub fn submit_answer(&mut self, deck: &Deck, answer: &str, now_ms: u64) -> SubmitOutcome {
        if self.status != RunStatus::InProgress {
            return SubmitOutcome::AlreadyDone;
        }
        let prev_time = self
            .splits
            .last()
            .map(|s| s.time_ms)
            .unwrap_or(0);
        let elapsed_total = now_ms.saturating_sub(self.started_at_ms);
        let delta = elapsed_total.saturating_sub(prev_time);
        let card = match deck.cards.get(self.current_index) {
            Some(c) => c,
            None => {
                self.status = RunStatus::Finished;
                return SubmitOutcome::AlreadyDone;
            }
        };
        let correct = is_correct(answer, &card.answers);
        self.splits.push(Split {
            card_id: card.id.clone(),
            answer_given: answer.to_string(),
            correct,
            time_ms: elapsed_total,
            delta_ms: delta,
        });

        match self.mode {
            RunMode::AnyPercent => {
                self.current_index += 1;
                if self.current_index >= deck.cards.len() {
                    self.status = RunStatus::Finished;
                    return SubmitOutcome::Finished;
                }
                SubmitOutcome::NextCard
            }
            RunMode::HundredPercent => {
                if !correct {
                    self.penalty_ms = self.penalty_ms.saturating_add(5_000);
                    return SubmitOutcome::Penalty;
                }
                self.current_index += 1;
                if self.current_index >= deck.cards.len() {
                    self.status = RunStatus::Finished;
                    return SubmitOutcome::Finished;
                }
                SubmitOutcome::NextCard
            }
            RunMode::Consistency => {
                if !correct {
                    self.status = RunStatus::Failed;
                    return SubmitOutcome::Failed;
                }
                self.current_index += 1;
                let target = consistency_target(deck.cards.len());
                if self.current_index >= target {
                    self.status = RunStatus::Finished;
                    return SubmitOutcome::Finished;
                }
                SubmitOutcome::NextCard
            }
        }
    }

    pub fn total_ms(&self) -> u64 {
        let last = self.splits.last().map(|s| s.time_ms).unwrap_or(0);
        last.saturating_add(self.penalty_ms)
    }

    pub fn correct_count(&self) -> usize {
        self.splits.iter().filter(|s| s.correct).count()
    }
}

pub fn consistency_target(deck_size: usize) -> usize {
    // 通常 10、 デッキ が 小さい とき は その サイズ
    deck_size.clamp(1, 10)
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SubmitOutcome {
    NextCard,
    Finished,
    Failed,
    Penalty,
    AlreadyDone,
}
