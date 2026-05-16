//! Tiny SVG path library — one calm shape per motif id.
//!
//! Paths are designed to render inside a 80×80 box, monochrome stroke,
//! intended to be displayed with a single accent color from the page palette.

pub fn motif_svg(motif_id: &str) -> &'static str {
    match motif_id {
        "flower" => r#"<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="40" cy="40" r="6"/><path d="M40 34 Q34 24 28 30 Q30 38 40 36"/><path d="M40 34 Q46 24 52 30 Q50 38 40 36"/><path d="M40 46 Q34 56 28 50 Q30 42 40 44"/><path d="M40 46 Q46 56 52 50 Q50 42 40 44"/><line x1="40" y1="46" x2="40" y2="68"/><path d="M40 60 Q44 56 48 60" /></g>"#,
        "lamp" => r#"<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M30 26 H50 L46 50 H34 Z"/><line x1="40" y1="14" x2="40" y2="26"/><circle cx="40" cy="14" r="2" fill="currentColor"/><line x1="34" y1="50" x2="46" y2="50"/><line x1="34" y1="60" x2="46" y2="60" opacity="0.5"/><line x1="30" y1="55" x2="50" y2="55" opacity="0.3"/></g>"#,
        "hand" => r#"<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M22 50 Q22 40 28 38 L34 36 V22 Q34 18 38 18 Q42 18 42 22 V34"/><path d="M42 26 Q42 22 46 22 Q50 22 50 26 V36"/><path d="M50 30 Q50 26 54 26 Q58 26 58 30 V42"/><path d="M58 38 Q58 34 60 34 Q62 34 62 38 V52"/><path d="M22 50 Q22 60 28 64 L52 64 Q62 64 62 54"/></g>"#,
        "leaf" => r#"<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M24 58 Q40 16 56 22 Q60 50 36 58 Q28 60 24 58 Z"/><path d="M30 56 Q40 38 54 28"/></g>"#,
        "bowl" => r#"<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><ellipse cx="40" cy="42" rx="22" ry="6"/><path d="M18 42 Q22 60 40 60 Q58 60 62 42"/><path d="M28 36 Q30 30 36 30" opacity="0.5"/></g>"#,
        "basket" => r#"<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M22 38 H58 L52 60 H28 Z"/><path d="M28 38 Q30 22 40 22 Q50 22 52 38"/><line x1="22" y1="44" x2="58" y2="44" opacity="0.5"/><line x1="34" y1="38" x2="34" y2="60" opacity="0.4"/><line x1="46" y1="38" x2="46" y2="60" opacity="0.4"/></g>"#,
        "bird" => r#"<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M22 48 Q34 30 50 36 Q60 38 62 46"/><path d="M50 36 L52 30 L48 34"/><circle cx="58" cy="44" r="1.5" fill="currentColor"/><path d="M30 48 Q34 56 40 56 Q46 56 50 52" opacity="0.6"/><line x1="38" y1="56" x2="38" y2="62" opacity="0.5"/><line x1="44" y1="56" x2="44" y2="62" opacity="0.5"/></g>"#,
        "cloud" => r#"<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M20 48 Q20 38 30 38 Q32 28 44 30 Q58 30 58 42 Q66 42 66 50 Q66 56 60 56 H26 Q20 56 20 50 Z"/></g>"#,
        "moon" => r#"<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M50 18 Q30 22 30 42 Q30 62 50 66 Q34 60 34 42 Q34 24 50 18 Z"/></g>"#,
        "shadow" => r#"<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="20" y1="58" x2="60" y2="58"/><path d="M28 58 L36 30 L42 30 L48 58" /><circle cx="39" cy="22" r="4"/></g>"#,
        "step" => r#"<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="18,60 28,60 28,50 40,50 40,40 52,40 52,30 62,30"/><line x1="62" y1="30" x2="62" y2="20" opacity="0.4"/></g>"#,
        "gate" => r#"<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="22" y1="60" x2="22" y2="24"/><line x1="58" y1="60" x2="58" y2="24"/><line x1="18" y1="26" x2="62" y2="26"/><line x1="22" y1="34" x2="58" y2="34" opacity="0.5"/><line x1="40" y1="60" x2="40" y2="34" opacity="0.4"/></g>"#,
        _ => r#"<g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="40" cy="40" r="14"/></g>"#,
    }
}

pub fn known_motifs() -> &'static [&'static str] {
    &["flower", "lamp", "hand", "leaf", "bowl", "basket", "bird",
      "cloud", "moon", "shadow", "step", "gate"]
}
