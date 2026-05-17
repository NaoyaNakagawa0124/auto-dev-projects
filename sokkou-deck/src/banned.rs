pub const BANNED_WORDS: &[&str] = &[
    "失格",
    "クソ",
    "無能",
    "諦めろ",
    "ダメ人間",
    "お前",
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
