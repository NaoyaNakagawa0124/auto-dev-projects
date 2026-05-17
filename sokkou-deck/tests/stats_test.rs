use sokkou_deck::deck::find_deck;
use sokkou_deck::run::{Run, RunMode};
use sokkou_deck::stats::{annotate, compute_result, format_delta, format_time_ms, PersonalBest};

fn make_run() -> Run {
    let deck = find_deck("jlpt-n1").unwrap();
    let mut run = Run::start(&deck, RunMode::AnyPercent, 0);
    run.submit_answer(&deck, &deck.cards[0].answers[0].clone(), 300);
    run.submit_answer(&deck, &deck.cards[1].answers[0].clone(), 700);
    run.submit_answer(&deck, &deck.cards[2].answers[0].clone(), 1_400);
    run
}

#[test]
fn format_time_under_minute() {
    assert_eq!(format_time_ms(0), "00:00.000");
    assert_eq!(format_time_ms(412), "00:00.412");
    assert_eq!(format_time_ms(1_000), "00:01.000");
}

#[test]
fn format_time_minutes_seconds() {
    assert_eq!(format_time_ms(60_000), "01:00.000");
    assert_eq!(format_time_ms(32_184), "00:32.184");
    assert_eq!(format_time_ms(75_500), "01:15.500");
}

#[test]
fn format_time_hours() {
    assert_eq!(format_time_ms(3_600_000), "1:00:00.000");
    assert_eq!(format_time_ms(3_661_500), "1:01:01.500");
}

#[test]
fn format_delta_zero() {
    assert_eq!(format_delta(0), "+0");
}

#[test]
fn format_delta_positive() {
    assert_eq!(format_delta(412), "+412");
    assert_eq!(format_delta(1_234), "+1.234");
}

#[test]
fn format_delta_negative() {
    assert_eq!(format_delta(-682), "-682");
    assert_eq!(format_delta(-2_500), "-2.500");
}

#[test]
fn annotate_without_pb_has_no_pb_delta() {
    let run = make_run();
    let annotated = annotate(&run.splits, None);
    assert!(annotated.iter().all(|a| a.pb_delta.is_none()));
    assert_eq!(annotated.len(), 3);
}

#[test]
fn annotate_with_pb_computes_delta() {
    let run = make_run();
    let pb_times = vec![350, 800, 1_300];
    let annotated = annotate(&run.splits, Some(&pb_times));
    assert_eq!(annotated[0].pb_delta, Some(-50));
    assert_eq!(annotated[1].pb_delta, Some(-100));
    assert_eq!(annotated[2].pb_delta, Some(100));
}

#[test]
fn compute_result_no_pb_is_new_pb() {
    let run = make_run();
    let result = compute_result(&run, None);
    assert!(result.is_new_pb);
    assert_eq!(result.total_count, 3);
    assert_eq!(result.correct_count, 3);
    assert_eq!(result.total_ms, 1_400);
}

#[test]
fn compute_result_slower_than_pb_is_not_new() {
    let run = make_run();
    let pb = PersonalBest {
        deck_id: run.deck_id.clone(),
        mode: run.mode,
        total_ms: 1_000,
        split_times: vec![],
        achieved_at_iso: "2026-05-17T12:00:00Z".to_string(),
    };
    let result = compute_result(&run, Some(&pb));
    assert!(!result.is_new_pb);
    assert_eq!(result.pb_total_delta, Some(400));
}

#[test]
fn compute_result_faster_than_pb_is_new() {
    let run = make_run();
    let pb = PersonalBest {
        deck_id: run.deck_id.clone(),
        mode: run.mode,
        total_ms: 2_000,
        split_times: vec![],
        achieved_at_iso: "2026-05-17T12:00:00Z".to_string(),
    };
    let result = compute_result(&run, Some(&pb));
    assert!(result.is_new_pb);
    assert_eq!(result.pb_total_delta, Some(-600));
}

#[test]
fn compute_result_pb_for_different_deck_is_ignored() {
    let run = make_run();
    let pb = PersonalBest {
        deck_id: "other-deck".to_string(),
        mode: run.mode,
        total_ms: 100,
        split_times: vec![],
        achieved_at_iso: "2026-05-17T12:00:00Z".to_string(),
    };
    let result = compute_result(&run, Some(&pb));
    assert!(result.is_new_pb);
    assert_eq!(result.pb_total_delta, None);
}
