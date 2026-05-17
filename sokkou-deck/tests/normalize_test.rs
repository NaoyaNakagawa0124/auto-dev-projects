use sokkou_deck::normalize::{is_correct, normalize_answer};

#[test]
fn lowercases_ascii() {
    assert_eq!(normalize_answer("Hello"), "hello");
    assert_eq!(normalize_answer("DILIGENT"), "diligent");
}

#[test]
fn trims_whitespace() {
    assert_eq!(normalize_answer("  hello  "), "hello");
    assert_eq!(normalize_answer("\thello\n"), "hello");
}

#[test]
fn fullwidth_to_halfwidth() {
    assert_eq!(normalize_answer("ＡＰＩ"), "api");
    assert_eq!(normalize_answer("ＨＥＬＬＯ"), "hello");
}

#[test]
fn katakana_to_hiragana() {
    assert_eq!(normalize_answer("カタカナ"), "かたかな");
    assert_eq!(normalize_answer("リチウム"), "りちうむ");
}

#[test]
fn strips_punctuation() {
    assert_eq!(normalize_answer("勤勉な、"), "勤勉な");
    assert_eq!(normalize_answer("簡潔な。"), "簡潔な");
}

#[test]
fn correctness_matches_alternative() {
    let answers = vec!["勤勉な".to_string(), "熱心な".to_string()];
    assert!(is_correct("勤勉な", &answers));
    assert!(is_correct("熱心な", &answers));
    assert!(!is_correct("脆い", &answers));
}

#[test]
fn correctness_handles_fullwidth() {
    let answers = vec!["API".to_string()];
    assert!(is_correct("ＡＰＩ", &answers));
}

#[test]
fn correctness_handles_katakana_hiragana() {
    let answers = vec!["リチウム".to_string()];
    assert!(is_correct("りちうむ", &answers));
}

#[test]
fn correctness_handles_split_alternatives_in_answer() {
    let answers = vec!["a/b/c".to_string()];
    assert!(is_correct("a", &answers));
    assert!(is_correct("b", &answers));
    assert!(is_correct("c", &answers));
    assert!(!is_correct("d", &answers));
}

#[test]
fn empty_input_is_not_correct() {
    let answers = vec!["x".to_string()];
    assert!(!is_correct("", &answers));
    assert!(!is_correct("   ", &answers));
}

#[test]
fn fullwidth_space_normalizes() {
    assert_eq!(normalize_answer("hello\u{3000}world"), "helloworld");
}
