use serde::{Deserialize, Serialize};

/// 文豪カードのステータス (各 0-99)。
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct AuthorStats {
    /// 文才 — 文学的卓越性
    pub literary: u32,
    /// 多作 — 作品数の多さ
    pub prolific: u32,
    /// 影響 — 後世への影響力
    pub influence: u32,
    /// 寿命 — 生涯の長さ（生存中は推定年齢）
    pub longevity: u32,
}

impl AuthorStats {
    /// 戦闘軸の値を取得する。
    pub fn axis(&self, axis: StatAxis) -> u32 {
        match axis {
            StatAxis::Literary => self.literary,
            StatAxis::Prolific => self.prolific,
            StatAxis::Influence => self.influence,
            StatAxis::Longevity => self.longevity,
        }
    }

    /// 4軸の合計。総合力の目安として使う。
    pub fn total(&self) -> u32 {
        self.literary + self.prolific + self.influence + self.longevity
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum StatAxis {
    Literary,
    Prolific,
    Influence,
    Longevity,
}

impl StatAxis {
    pub fn jp_label(&self) -> &'static str {
        match self {
            StatAxis::Literary => "文才",
            StatAxis::Prolific => "多作",
            StatAxis::Influence => "影響",
            StatAxis::Longevity => "寿命",
        }
    }

    pub fn all() -> [StatAxis; 4] {
        [
            StatAxis::Literary,
            StatAxis::Prolific,
            StatAxis::Influence,
            StatAxis::Longevity,
        ]
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Author {
    pub id: String,
    pub name: String,
    pub name_en: String,
    pub country: String,
    pub era: String,
    /// 生年月日 YYYY-MM-DD
    pub born: String,
    /// 没年月日 YYYY-MM-DD、生存中は null
    pub died: Option<String>,
    pub works: Vec<String>,
    pub stats: AuthorStats,
    pub color: String,
    pub epithet: String,
}

impl Author {
    /// 表示用イニシャル（名前の先頭1文字）。
    pub fn portrait_glyph(&self) -> char {
        self.name.chars().next().unwrap_or('文')
    }

    /// 生没年から月日 (MM-DD) を抽出する。
    pub fn birth_md(&self) -> Option<&str> {
        date_md(&self.born)
    }

    pub fn death_md(&self) -> Option<&str> {
        self.died.as_deref().and_then(date_md)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AuthorFile {
    authors: Vec<Author>,
}

const AUTHORS_RAW: &str = include_str!("../../src/data/authors.json");

/// 静的データセットを読み込む。
pub fn load_authors() -> Vec<Author> {
    let file: AuthorFile = serde_json::from_str(AUTHORS_RAW).expect("authors.json must parse");
    file.authors
}

/// YYYY-MM-DD から MM-DD を抽出するヘルパー。
pub fn date_md(s: &str) -> Option<&str> {
    if s.len() == 10 && s.as_bytes()[4] == b'-' && s.as_bytes()[7] == b'-' {
        Some(&s[5..])
    } else {
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn authors_load_without_error() {
        let authors = load_authors();
        assert!(authors.len() >= 50, "expected >=50 authors, got {}", authors.len());
    }

    #[test]
    fn all_authors_have_valid_birth_md() {
        for a in load_authors() {
            assert!(a.birth_md().is_some(), "{} has invalid born {}", a.id, a.born);
        }
    }

    #[test]
    fn stats_are_in_range() {
        for a in load_authors() {
            for axis in StatAxis::all() {
                let v = a.stats.axis(axis);
                assert!(v <= 99, "{} {} out of range: {}", a.id, axis.jp_label(), v);
            }
        }
    }

    #[test]
    fn ids_are_unique() {
        let authors = load_authors();
        let mut ids: Vec<&str> = authors.iter().map(|a| a.id.as_str()).collect();
        ids.sort();
        let len_before = ids.len();
        ids.dedup();
        assert_eq!(ids.len(), len_before, "duplicate author IDs detected");
    }

    #[test]
    fn date_md_extracts_correctly() {
        assert_eq!(date_md("1867-02-09"), Some("02-09"));
        assert_eq!(date_md("bad"), None);
    }
}
