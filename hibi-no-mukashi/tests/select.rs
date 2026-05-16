use hibi_no_mukashi::select::{next_md, parse_iso, prev_md, select_for_iso, select_for_md};
use hibi_no_mukashi::vignettes::available_mds;

#[test]
fn parse_iso_valid() {
    let r = parse_iso("2026-05-17").unwrap();
    assert_eq!(r.0, 2026);
    assert_eq!(r.1, "05-17");
}

#[test]
fn parse_iso_invalid_returns_none() {
    assert!(parse_iso("nope").is_none());
    assert!(parse_iso("2026/05/17").is_none());
    assert!(parse_iso("2026-13-17").is_none());
    assert!(parse_iso("2026-05-32").is_none());
}

#[test]
fn select_returns_exact_for_known_date() {
    let s = select_for_iso("2026-05-17").unwrap();
    assert!(!s.is_nearby);
    assert_eq!(s.vignette.date_md, "05-17");
    assert_eq!(s.requested_md, "05-17");
}

#[test]
fn select_falls_back_to_nearby_for_unknown_date() {
    // 02-29 doesn't exist in our dataset
    let s = select_for_md("02-29", 2026).unwrap();
    assert!(s.is_nearby);
    assert_eq!(s.requested_md, "02-29");
    // The chosen vignette is real — not 02-29
    assert_ne!(s.vignette.date_md, "02-29");
}

#[test]
fn select_is_deterministic_for_same_year() {
    let a = select_for_iso("2026-05-17").unwrap();
    let b = select_for_iso("2026-05-17").unwrap();
    assert_eq!(a.vignette.title, b.vignette.title);
}

#[test]
fn select_may_differ_across_years_when_multiple_vignettes_share_date() {
    // 05-17 has 2 entries (1923 and 1951) in the dataset
    let a = select_for_iso("2024-05-17").unwrap();
    let b = select_for_iso("2025-05-17").unwrap();
    // We don't strictly require they differ, but at least one of the
    // collection must have multiple entries; pick any duplicated MM-DD.
    let dup_md = "05-17";
    let mds = available_mds();
    assert!(mds.contains(&dup_md));
    // Both selections must be in the duplicate set
    assert_eq!(a.vignette.date_md, dup_md);
    assert_eq!(b.vignette.date_md, dup_md);
}

#[test]
fn next_md_wraps_around_year() {
    let mds = available_mds();
    let last = mds.iter().max_by_key(|x| (x[0..2].to_string(), x[3..5].to_string())).unwrap();
    let next = next_md(last).unwrap();
    // It should wrap to the earliest MD
    let first = mds.iter().min_by_key(|x| (x[0..2].to_string(), x[3..5].to_string())).unwrap();
    assert_eq!(&next, first);
}

#[test]
fn prev_md_wraps_around_year() {
    let mds = available_mds();
    let first = mds.iter().min_by_key(|x| (x[0..2].to_string(), x[3..5].to_string())).unwrap();
    let prev = prev_md(first).unwrap();
    let last = mds.iter().max_by_key(|x| (x[0..2].to_string(), x[3..5].to_string())).unwrap();
    assert_eq!(&prev, last);
}

#[test]
fn next_md_strictly_after() {
    let r = next_md("01-08").unwrap();
    assert!(r != "01-08");
}
