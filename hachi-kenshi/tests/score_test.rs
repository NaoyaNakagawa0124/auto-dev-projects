use hachi_kenshi::case::{all_cases, Chapter};
use hachi_kenshi::score::{
    chapter_progress, chapter_unlocked, compute, CaseResult, ALL_CLEAR_BONUS,
    CHAPTER_CLEAR_BONUS, POINTS_CORRECT, POINTS_WRONG, TIME_BONUS, TIME_BONUS_THRESHOLD_MS,
};

fn all_correct_results() -> Vec<CaseResult> {
    all_cases()
        .into_iter()
        .map(|c| CaseResult { case_id: c.id, correct: true })
        .collect()
}

#[test]
fn empty_results_zero_score() {
    let r = compute(&[], 0);
    assert_eq!(r.correct_count, 0);
    assert_eq!(r.total_points, 0);
}

#[test]
fn all_correct_under_time_gets_all_bonuses() {
    let results = all_correct_results();
    let r = compute(&results, 4 * 60 * 1000);
    assert_eq!(r.correct_count, 12);
    assert_eq!(r.wrong_count, 0);
    assert_eq!(r.base_points, 12 * POINTS_CORRECT);
    assert_eq!(r.chapter_bonus, 4 * CHAPTER_CLEAR_BONUS);
    assert_eq!(r.clear_bonus, ALL_CLEAR_BONUS);
    assert_eq!(r.time_bonus, TIME_BONUS);
    assert!(r.all_clear);
}

#[test]
fn all_correct_over_time_no_time_bonus() {
    let results = all_correct_results();
    let r = compute(&results, TIME_BONUS_THRESHOLD_MS + 1);
    assert_eq!(r.time_bonus, 0);
    assert!(r.all_clear);
}

#[test]
fn single_chapter_clear_gives_chapter_bonus_only() {
    let results: Vec<CaseResult> = all_cases()
        .into_iter()
        .filter(|c| c.chapter == Chapter::Houseplant)
        .map(|c| CaseResult { case_id: c.id, correct: true })
        .collect();
    let r = compute(&results, 60_000);
    assert_eq!(r.correct_count, 3);
    assert_eq!(r.base_points, 3 * POINTS_CORRECT);
    assert_eq!(r.chapter_bonus, CHAPTER_CLEAR_BONUS);
    assert_eq!(r.clear_bonus, 0);
    assert_eq!(r.time_bonus, 0);
}

#[test]
fn wrong_answers_subtract() {
    let results = vec![
        CaseResult { case_id: "c01".into(), correct: true },
        CaseResult { case_id: "c02".into(), correct: false },
    ];
    let r = compute(&results, 0);
    assert_eq!(r.correct_count, 1);
    assert_eq!(r.wrong_count, 1);
    assert_eq!(r.base_points, POINTS_CORRECT + POINTS_WRONG);
}

#[test]
fn chapter_progress_counts_correct_only() {
    let results = vec![
        CaseResult { case_id: "c01".into(), correct: true },
        CaseResult { case_id: "c02".into(), correct: false },
    ];
    let (solved, total) = chapter_progress(&results, Chapter::Houseplant);
    assert_eq!(total, 3);
    assert_eq!(solved, 1);
}

#[test]
fn first_chapter_always_unlocked() {
    assert!(chapter_unlocked(&[], Chapter::Houseplant));
}

#[test]
fn next_chapter_unlocks_after_full_clear() {
    let results: Vec<CaseResult> = all_cases()
        .into_iter()
        .filter(|c| c.chapter == Chapter::Houseplant)
        .map(|c| CaseResult { case_id: c.id, correct: true })
        .collect();
    assert!(chapter_unlocked(&results, Chapter::Cactus));
    assert!(!chapter_unlocked(&[], Chapter::Cactus));
}

#[test]
fn partial_chapter_does_not_unlock_next() {
    let results = vec![
        CaseResult { case_id: "c01".into(), correct: true },
        CaseResult { case_id: "c02".into(), correct: true },
    ];
    assert!(!chapter_unlocked(&results, Chapter::Cactus));
}

#[test]
fn time_bonus_only_with_all_clear() {
    let results = vec![CaseResult { case_id: "c01".into(), correct: true }];
    let r = compute(&results, 1000);
    assert_eq!(r.time_bonus, 0);
}
