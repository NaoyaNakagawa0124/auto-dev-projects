use serde::{Deserialize, Serialize};

use crate::case::{all_cases, Chapter, ALL_CHAPTERS};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CaseResult {
    pub case_id: String,
    pub correct: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScoreReport {
    pub correct_count: usize,
    pub wrong_count: usize,
    pub total_cases: usize,
    pub base_points: i64,
    pub chapter_bonus: i64,
    pub clear_bonus: i64,
    pub time_bonus: i64,
    pub total_points: i64,
    pub all_clear: bool,
    pub time_ms: u64,
}

pub const POINTS_CORRECT: i64 = 100;
pub const POINTS_WRONG: i64 = -30;
pub const CHAPTER_CLEAR_BONUS: i64 = 50; // 3/3 in a chapter
pub const ALL_CLEAR_BONUS: i64 = 200;     // 12/12 overall
pub const TIME_BONUS: i64 = 100;           // under 5 minutes
pub const TIME_BONUS_THRESHOLD_MS: u64 = 5 * 60 * 1000;

pub fn compute(results: &[CaseResult], time_ms: u64) -> ScoreReport {
    let total_cases = all_cases().len();
    let correct = results.iter().filter(|r| r.correct).count();
    let wrong = results.iter().filter(|r| !r.correct).count();
    let base = (correct as i64) * POINTS_CORRECT + (wrong as i64) * POINTS_WRONG;

    let mut chapter_bonus: i64 = 0;
    for &ch in ALL_CHAPTERS {
        let chapter_case_ids: Vec<String> = all_cases()
            .iter()
            .filter(|c| c.chapter == ch)
            .map(|c| c.id.clone())
            .collect();
        let solved = chapter_case_ids
            .iter()
            .filter(|id| results.iter().any(|r| &r.case_id == *id && r.correct))
            .count();
        if solved == chapter_case_ids.len() && !chapter_case_ids.is_empty() {
            chapter_bonus += CHAPTER_CLEAR_BONUS;
        }
    }

    let all_clear = correct == total_cases && wrong == 0;
    let clear_bonus = if all_clear { ALL_CLEAR_BONUS } else { 0 };

    let time_bonus = if all_clear && time_ms > 0 && time_ms <= TIME_BONUS_THRESHOLD_MS {
        TIME_BONUS
    } else {
        0
    };

    let total = base + chapter_bonus + clear_bonus + time_bonus;

    ScoreReport {
        correct_count: correct,
        wrong_count: wrong,
        total_cases,
        base_points: base,
        chapter_bonus,
        clear_bonus,
        time_bonus,
        total_points: total,
        all_clear,
        time_ms,
    }
}

pub fn chapter_progress(results: &[CaseResult], chapter: Chapter) -> (usize, usize) {
    let case_ids: Vec<String> = all_cases()
        .into_iter()
        .filter(|c| c.chapter == chapter)
        .map(|c| c.id)
        .collect();
    let solved = case_ids
        .iter()
        .filter(|id| results.iter().any(|r| &r.case_id == *id && r.correct))
        .count();
    (solved, case_ids.len())
}

/// 次 章 を 解放 する 条件 を 満たして いれば true を 返す (現 章 を 3/3 で クリア)
pub fn chapter_unlocked(results: &[CaseResult], chapter: Chapter) -> bool {
    if chapter == Chapter::Houseplant {
        return true; // 第 1 章 は 常に 開放
    }
    let prev = match chapter {
        Chapter::Cactus => Chapter::Houseplant,
        Chapter::Herb => Chapter::Cactus,
        Chapter::Succulent => Chapter::Herb,
        Chapter::Houseplant => return true,
    };
    let (solved, total) = chapter_progress(results, prev);
    solved >= total.saturating_sub(0) // require all 3
}
