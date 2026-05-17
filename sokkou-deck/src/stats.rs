use serde::{Deserialize, Serialize};

use crate::run::{Run, RunMode, Split};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PersonalBest {
    pub deck_id: String,
    pub mode: RunMode,
    pub total_ms: u64,
    pub split_times: Vec<u64>,
    pub achieved_at_iso: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AnnotatedSplit {
    pub card_id: String,
    pub answer_given: String,
    pub correct: bool,
    pub time_ms: u64,
    pub delta_ms: u64,
    pub pb_delta: Option<i64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RunResult {
    pub total_ms: u64,
    pub correct_count: usize,
    pub total_count: usize,
    pub penalty_ms: u64,
    pub annotated_splits: Vec<AnnotatedSplit>,
    pub pb_total_delta: Option<i64>,
    pub is_new_pb: bool,
}

pub fn annotate(splits: &[Split], pb_split_times: Option<&[u64]>) -> Vec<AnnotatedSplit> {
    splits
        .iter()
        .enumerate()
        .map(|(i, s)| {
            let pb_delta = pb_split_times
                .and_then(|times| times.get(i))
                .map(|pb_t| s.time_ms as i64 - *pb_t as i64);
            AnnotatedSplit {
                card_id: s.card_id.clone(),
                answer_given: s.answer_given.clone(),
                correct: s.correct,
                time_ms: s.time_ms,
                delta_ms: s.delta_ms,
                pb_delta,
            }
        })
        .collect()
}

pub fn compute_result(run: &Run, pb: Option<&PersonalBest>) -> RunResult {
    let pb_times = pb
        .filter(|p| p.deck_id == run.deck_id && p.mode == run.mode)
        .map(|p| p.split_times.as_slice());
    let annotated = annotate(&run.splits, pb_times);
    let total = run.total_ms();
    let correct = run.correct_count();

    let pb_total_delta = pb
        .filter(|p| p.deck_id == run.deck_id && p.mode == run.mode)
        .map(|p| total as i64 - p.total_ms as i64);

    let is_new_pb = match pb {
        Some(p) if p.deck_id == run.deck_id && p.mode == run.mode => total < p.total_ms,
        _ => true,
    };

    RunResult {
        total_ms: total,
        correct_count: correct,
        total_count: run.splits.len(),
        penalty_ms: run.penalty_ms,
        annotated_splits: annotated,
        pb_total_delta,
        is_new_pb,
    }
}

pub fn format_time_ms(ms: u64) -> String {
    let total_seconds = ms / 1000;
    let ms_part = ms % 1000;
    let h = total_seconds / 3600;
    let m = (total_seconds % 3600) / 60;
    let s = total_seconds % 60;
    if h > 0 {
        format!("{}:{:02}:{:02}.{:03}", h, m, s, ms_part)
    } else {
        format!("{:02}:{:02}.{:03}", m, s, ms_part)
    }
}

pub fn format_delta(delta: i64) -> String {
    let sign = if delta >= 0 { "+" } else { "-" };
    let abs = delta.unsigned_abs();
    let s = abs / 1000;
    let ms = abs % 1000;
    if s == 0 {
        format!("{}{}", sign, ms)
    } else {
        format!("{}{}.{:03}", sign, s, ms)
    }
}
