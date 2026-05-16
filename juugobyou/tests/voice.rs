use juugobyou::voice::{render, Voice, ALL_VOICES};

#[test]
fn three_voices_with_unique_keys() {
    let keys: std::collections::HashSet<&str> =
        ALL_VOICES.iter().map(|v| v.key()).collect();
    assert_eq!(keys.len(), 3);
    assert!(keys.contains("quiet"));
    assert!(keys.contains("friend"));
    assert!(keys.contains("mother"));
}

#[test]
fn from_key_falls_back_to_quiet() {
    assert_eq!(Voice::from_key("nope"), Voice::Quiet);
    assert_eq!(Voice::from_key(""), Voice::Quiet);
    assert_eq!(Voice::from_key("friend"), Voice::Friend);
}

#[test]
fn quiet_voice_uses_period_style() {
    let s = render("コップ", Voice::Quiet);
    assert!(s.contains("。"), "quiet should end with 。: {}", s);
    assert!(!s.starts_with("ねえ"), "quiet should not start with ねえ");
}

#[test]
fn friend_voice_is_casual() {
    let s = render("本", Voice::Friend);
    // Friend voice uses casual ね-ending or よ-ending somewhere
    assert!(s.contains("ね") || s.contains("よ"),
        "friend voice should be casual: {}", s);
}

#[test]
fn mother_voice_starts_with_ne_e() {
    let s = render("皿", Voice::Mother);
    assert!(s.starts_with("ねえ"), "mother starts with ねえ: {}", s);
}

#[test]
fn each_voice_has_distinct_farewell() {
    let f1 = Voice::Quiet.farewell();
    let f2 = Voice::Friend.farewell();
    let f3 = Voice::Mother.farewell();
    assert_ne!(f1, f2);
    assert_ne!(f2, f3);
    assert_ne!(f1, f3);
}

#[test]
fn each_voice_says_thanks() {
    for v in ALL_VOICES {
        let f = v.farewell();
        assert!(f.contains("ありがとう"), "missing thanks in {:?}: {}", v, f);
    }
}

#[test]
fn each_voice_says_enough() {
    for v in ALL_VOICES {
        let f = v.farewell();
        assert!(f.contains("十分"), "missing 十分 in {:?}: {}", v, f);
    }
}
