use hachi_kenshi::case::find_case;
use hachi_kenshi::cause::Cause;
use hachi_kenshi::verdict::{judge, judge_by_id};

#[test]
fn correct_accusation_returns_correct_true() {
    let case = find_case("c01").unwrap();
    let v = judge(&case, case.culprit);
    assert!(v.correct);
    assert_eq!(v.case_id, "c01");
    assert_eq!(v.culprit, case.culprit);
}

#[test]
fn wrong_accusation_returns_correct_false() {
    let case = find_case("c01").unwrap();
    let wrong = if case.culprit == Cause::Pest { Cause::Cold } else { Cause::Pest };
    let v = judge(&case, wrong);
    assert!(!v.correct);
    assert_eq!(v.accused, wrong);
}

#[test]
fn explanation_included() {
    let case = find_case("c01").unwrap();
    let v = judge(&case, case.culprit);
    assert_eq!(v.explanation, case.explanation);
    assert!(!v.explanation.is_empty());
}

#[test]
fn judge_by_id_unknown_returns_none() {
    assert!(judge_by_id("nope", Cause::Cold).is_none());
}

#[test]
fn judge_by_id_known_returns_some() {
    let v = judge_by_id("c05", Cause::Cold).unwrap();
    assert_eq!(v.case_id, "c05");
    assert!(v.correct);
}
