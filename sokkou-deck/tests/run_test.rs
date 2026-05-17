use sokkou_deck::deck::find_deck;
use sokkou_deck::run::{consistency_target, Run, RunMode, RunStatus, SubmitOutcome};

fn small_deck() -> sokkou_deck::deck::Deck {
    find_deck("jlpt-n1").expect("jlpt-n1")
}

#[test]
fn fresh_run_starts_at_zero() {
    let deck = small_deck();
    let run = Run::start(&deck, RunMode::AnyPercent, 1_000);
    assert_eq!(run.current_index, 0);
    assert_eq!(run.status, RunStatus::InProgress);
    assert_eq!(run.splits.len(), 0);
}

#[test]
fn anypercent_advances_on_any_input() {
    let deck = small_deck();
    let mut run = Run::start(&deck, RunMode::AnyPercent, 0);
    let o = run.submit_answer(&deck, "wrong answer", 500);
    assert_eq!(o, SubmitOutcome::NextCard);
    assert_eq!(run.current_index, 1);
    assert_eq!(run.splits.len(), 1);
    assert!(!run.splits[0].correct);
}

#[test]
fn anypercent_finishes_at_end() {
    let deck = small_deck();
    let mut run = Run::start(&deck, RunMode::AnyPercent, 0);
    let mut t = 100;
    for _ in 0..deck.cards.len() {
        run.submit_answer(&deck, "x", t);
        t += 100;
    }
    assert_eq!(run.status, RunStatus::Finished);
    assert_eq!(run.splits.len(), deck.cards.len());
}

#[test]
fn hundred_percent_blocks_on_wrong() {
    let deck = small_deck();
    let mut run = Run::start(&deck, RunMode::HundredPercent, 0);
    let outcome = run.submit_answer(&deck, "wrong", 500);
    assert_eq!(outcome, SubmitOutcome::Penalty);
    assert_eq!(run.current_index, 0); // still on first card
    assert_eq!(run.penalty_ms, 5_000);
}

#[test]
fn hundred_percent_advances_on_correct() {
    let deck = small_deck();
    let first = deck.cards[0].answers[0].clone();
    let mut run = Run::start(&deck, RunMode::HundredPercent, 0);
    let outcome = run.submit_answer(&deck, &first, 600);
    assert_eq!(outcome, SubmitOutcome::NextCard);
    assert_eq!(run.current_index, 1);
}

#[test]
fn consistency_fails_on_wrong() {
    let deck = small_deck();
    let mut run = Run::start(&deck, RunMode::Consistency, 0);
    let outcome = run.submit_answer(&deck, "wrong", 800);
    assert_eq!(outcome, SubmitOutcome::Failed);
    assert_eq!(run.status, RunStatus::Failed);
}

#[test]
fn consistency_finishes_at_target() {
    let deck = small_deck();
    let target = consistency_target(deck.cards.len());
    let mut run = Run::start(&deck, RunMode::Consistency, 0);
    let mut t = 100;
    for i in 0..target {
        let ans = deck.cards[i].answers[0].clone();
        let outcome = run.submit_answer(&deck, &ans, t);
        if i == target - 1 {
            assert_eq!(outcome, SubmitOutcome::Finished);
        } else {
            assert_eq!(outcome, SubmitOutcome::NextCard);
        }
        t += 100;
    }
    assert_eq!(run.status, RunStatus::Finished);
}

#[test]
fn split_delta_is_card_time() {
    let deck = small_deck();
    let mut run = Run::start(&deck, RunMode::AnyPercent, 0);
    run.submit_answer(&deck, "a", 300);
    run.submit_answer(&deck, "b", 800);
    assert_eq!(run.splits[0].time_ms, 300);
    assert_eq!(run.splits[0].delta_ms, 300);
    assert_eq!(run.splits[1].time_ms, 800);
    assert_eq!(run.splits[1].delta_ms, 500);
}

#[test]
fn total_ms_includes_penalty() {
    let deck = small_deck();
    let mut run = Run::start(&deck, RunMode::HundredPercent, 0);
    run.submit_answer(&deck, "wrong", 200);
    let correct = deck.cards[0].answers[0].clone();
    run.submit_answer(&deck, &correct, 500);
    assert_eq!(run.penalty_ms, 5_000);
    assert_eq!(run.total_ms(), 500 + 5_000);
}

#[test]
fn correct_count() {
    let deck = small_deck();
    let mut run = Run::start(&deck, RunMode::AnyPercent, 0);
    run.submit_answer(&deck, &deck.cards[0].answers[0].clone(), 200);
    run.submit_answer(&deck, "wrong", 500);
    run.submit_answer(&deck, &deck.cards[2].answers[0].clone(), 700);
    assert_eq!(run.correct_count(), 2);
}

#[test]
fn submit_to_finished_run_is_no_op() {
    let deck = small_deck();
    let mut run = Run::start(&deck, RunMode::AnyPercent, 0);
    let mut t = 100;
    for _ in 0..deck.cards.len() {
        run.submit_answer(&deck, "x", t);
        t += 100;
    }
    let outcome = run.submit_answer(&deck, "y", t);
    assert_eq!(outcome, SubmitOutcome::AlreadyDone);
}

#[test]
fn consistency_target_clamp() {
    assert_eq!(consistency_target(1), 1);
    assert_eq!(consistency_target(5), 5);
    assert_eq!(consistency_target(10), 10);
    assert_eq!(consistency_target(50), 10);
    assert_eq!(consistency_target(0), 1);
}

#[test]
fn mode_labels() {
    assert_eq!(RunMode::AnyPercent.label(), "any%");
    assert_eq!(RunMode::HundredPercent.label(), "100%");
    assert_eq!(RunMode::Consistency.label(), "consistency");
}
