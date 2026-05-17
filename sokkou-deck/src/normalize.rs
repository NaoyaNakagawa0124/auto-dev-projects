pub fn normalize_answer(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for ch in s.chars() {
        let mapped = fullwidth_to_halfwidth(ch);
        let mapped = katakana_to_hiragana(mapped);
        out.push(mapped);
    }
    out = out.trim().to_string();
    out = out.to_lowercase();
    out = strip_punctuation(&out);
    out
}

fn fullwidth_to_halfwidth(c: char) -> char {
    let cp = c as u32;
    // Fullwidth ASCII (U+FF01–U+FF5E) -> halfwidth
    if (0xFF01..=0xFF5E).contains(&cp) {
        if let Some(out) = char::from_u32(cp - 0xFEE0) {
            return out;
        }
    }
    // Fullwidth space U+3000 -> regular space
    if cp == 0x3000 {
        return ' ';
    }
    c
}

fn katakana_to_hiragana(c: char) -> char {
    let cp = c as u32;
    // カタカナ (U+30A1–U+30F6) → ひらがな (U+3041–U+3096)
    if (0x30A1..=0x30F6).contains(&cp) {
        if let Some(out) = char::from_u32(cp - 0x60) {
            return out;
        }
    }
    c
}

fn strip_punctuation(s: &str) -> String {
    let drop: &[char] = &[
        '.', ',', '!', '?', ';', ':', '-', '_', '"', '\'',
        '、', '。', '・', '「', '」', '『', '』', '(', ')', '（', '）',
        ' ', '\u{3000}',
    ];
    s.chars().filter(|c| !drop.contains(c)).collect()
}

pub fn is_correct(given: &str, accepted: &[String]) -> bool {
    let g = normalize_answer(given);
    if g.is_empty() {
        return false;
    }
    accepted.iter().any(|a| {
        // accepted may contain alternatives split by "/" or "、"
        a.split(['/', '、', ','])
            .any(|alt| normalize_answer(alt) == g)
    })
}
