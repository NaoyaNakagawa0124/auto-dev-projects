pub const BANNED_WORDS: &[&str] = &[
    "殺人犯",
    "殺害",
    "凶悪",
    "死刑",
    "死亡 確認",
    "死亡確認",
    "お前",
    "クソ",
    "無能",
    "失敗 作",
    "失敗作",
];

pub fn find(s: &str) -> Option<&'static str> {
    BANNED_WORDS.iter().find(|w| s.contains(*w)).copied()
}

pub fn audit_all<'a, I: IntoIterator<Item = &'a str>>(strings: I) -> Vec<(String, &'static str)> {
    strings
        .into_iter()
        .filter_map(|s| find(s).map(|w| (s.to_string(), w)))
        .collect()
}
