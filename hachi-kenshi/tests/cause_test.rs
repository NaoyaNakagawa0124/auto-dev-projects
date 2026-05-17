use hachi_kenshi::cause::{Cause, ALL_CAUSES};

#[test]
fn seven_causes() {
    assert_eq!(ALL_CAUSES.len(), 7);
}

#[test]
fn each_cause_label_non_empty() {
    for &c in ALL_CAUSES {
        assert!(!c.label().is_empty(), "{:?} has empty label", c);
    }
}

#[test]
fn each_cause_alibi_non_empty() {
    for &c in ALL_CAUSES {
        assert!(c.alibi().len() >= 10, "{:?} alibi too short", c);
    }
}

#[test]
fn labels_are_unique() {
    let mut labels: Vec<_> = ALL_CAUSES.iter().map(|c| c.label()).collect();
    labels.sort();
    let before = labels.len();
    labels.dedup();
    assert_eq!(before, labels.len());
}

#[test]
fn cause_equality() {
    assert_eq!(Cause::Dryness, Cause::Dryness);
    assert_ne!(Cause::Dryness, Cause::Overwatering);
}
