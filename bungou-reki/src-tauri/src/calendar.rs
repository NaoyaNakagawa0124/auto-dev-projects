use serde::{Deserialize, Serialize};

use crate::data::Author;

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum AnniversaryKind {
    Birth,
    Death,
}

impl AnniversaryKind {
    pub fn jp_label(&self) -> &'static str {
        match self {
            AnniversaryKind::Birth => "誕生",
            AnniversaryKind::Death => "命日",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Anniversary {
    pub author: Author,
    pub kind: AnniversaryKind,
    /// 元の年（生年または没年）。
    pub year: i32,
    /// 何周年か（今日の年から見て）。
    pub years_ago: i32,
}

fn year_of(date: &str) -> Option<i32> {
    date.get(0..4).and_then(|s| s.parse::<i32>().ok())
}

/// 指定された MM-DD に該当する作家の出来事を抽出。
/// 同日に複数該当があれば、誕生→命日の順、より周年数の大きい順に並ぶ。
pub fn anniversaries_on(authors: &[Author], today_year: i32, mmdd: &str) -> Vec<Anniversary> {
    let mut out = Vec::new();
    for a in authors {
        if a.birth_md() == Some(mmdd) {
            if let Some(y) = year_of(&a.born) {
                out.push(Anniversary {
                    author: a.clone(),
                    kind: AnniversaryKind::Birth,
                    year: y,
                    years_ago: today_year - y,
                });
            }
        }
        if let Some(dd) = a.death_md() {
            if dd == mmdd {
                if let Some(y) = a.died.as_deref().and_then(year_of) {
                    out.push(Anniversary {
                        author: a.clone(),
                        kind: AnniversaryKind::Death,
                        year: y,
                        years_ago: today_year - y,
                    });
                }
            }
        }
    }
    out.sort_by(|x, y| match x.kind.cmp(&y.kind) {
        std::cmp::Ordering::Equal => y.years_ago.cmp(&x.years_ago),
        other => other,
    });
    out
}

impl Ord for AnniversaryKind {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        let order = |k: &AnniversaryKind| match k {
            AnniversaryKind::Birth => 0,
            AnniversaryKind::Death => 1,
        };
        order(self).cmp(&order(other))
    }
}

impl PartialOrd for AnniversaryKind {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

/// 「今日の召喚」候補を返す。同日の出来事がなければ前後最大 ±3 日まで探索する。
pub fn summons_for_date(authors: &[Author], date_iso: &str) -> Vec<Anniversary> {
    let Some((y, m, d)) = parse_iso_date(date_iso) else {
        return Vec::new();
    };
    for delta in 0i32..=3 {
        for sign in [0i32, -1, 1] {
            if delta == 0 && sign != 0 {
                continue;
            }
            let offset = sign * delta;
            let Some((nm, nd)) = shift_md(m, d, offset) else {
                continue;
            };
            let mmdd = format!("{:02}-{:02}", nm, nd);
            let hits = anniversaries_on(authors, y, &mmdd);
            if !hits.is_empty() {
                return hits.into_iter().take(5).collect();
            }
        }
    }
    Vec::new()
}

/// 月内の各日のイベントをカウントする。0埋めで返す（インデックス0が1日）。
pub fn anniversaries_for_month(authors: &[Author], year: i32, month: u32) -> Vec<u32> {
    let days = days_in_month(year, month);
    let mut counts = vec![0u32; days as usize];
    for d in 1..=days {
        let mmdd = format!("{:02}-{:02}", month, d);
        counts[(d - 1) as usize] = anniversaries_on(authors, year, &mmdd).len() as u32;
    }
    counts
}

fn parse_iso_date(s: &str) -> Option<(i32, u32, u32)> {
    if s.len() != 10 {
        return None;
    }
    let y: i32 = s.get(0..4)?.parse().ok()?;
    let m: u32 = s.get(5..7)?.parse().ok()?;
    let d: u32 = s.get(8..10)?.parse().ok()?;
    if !(1..=12).contains(&m) {
        return None;
    }
    if d == 0 || d > days_in_month(y, m) {
        return None;
    }
    Some((y, m, d))
}

fn days_in_month(year: i32, month: u32) -> u32 {
    match month {
        1 | 3 | 5 | 7 | 8 | 10 | 12 => 31,
        4 | 6 | 9 | 11 => 30,
        2 => {
            if is_leap(year) {
                29
            } else {
                28
            }
        }
        _ => 0,
    }
}

fn is_leap(year: i32) -> bool {
    (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
}

/// 月日に日数オフセットをかける。年跨ぎは閏年を考慮した暦上で扱う。
fn shift_md(month: u32, day: u32, offset: i32) -> Option<(u32, u32)> {
    if !(1..=12).contains(&month) {
        return None;
    }
    let dim = days_in_month(2024, month); // 閏年を含む基準
    if day == 0 || day > dim {
        return None;
    }
    let mut m = month as i32;
    let mut d = day as i32 + offset;
    loop {
        if d < 1 {
            m -= 1;
            if m < 1 {
                m = 12;
            }
            d += days_in_month(2024, m as u32) as i32;
            continue;
        }
        let dim_now = days_in_month(2024, m as u32) as i32;
        if d > dim_now {
            d -= dim_now;
            m += 1;
            if m > 12 {
                m = 1;
            }
            continue;
        }
        break;
    }
    Some((m as u32, d as u32))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::data::load_authors;

    #[test]
    fn finds_may_16_anniversaries() {
        let authors = load_authors();
        let hits = anniversaries_on(&authors, 2026, "05-16");
        // Studs Terkel と Adrienne Rich の誕生日があるはず
        assert!(
            hits.iter().any(|a| a.author.id == "terkel"),
            "Studs Terkel が May 16 にヒットしなかった"
        );
        assert!(
            hits.iter().any(|a| a.author.id == "rich"),
            "Adrienne Rich が May 16 にヒットしなかった"
        );
    }

    #[test]
    fn summons_falls_back_to_nearby_dates() {
        let authors = load_authors();
        // Aug 12 — Thomas Mann's death (Aug 12, 1955). 既にヒットするはず
        let hits = summons_for_date(&authors, "2026-08-12");
        assert!(!hits.is_empty());
    }

    #[test]
    fn summons_handles_rare_days() {
        let authors = load_authors();
        // Feb 29 など希少な日でも近傍にフォールバックして空にならない
        let hits = summons_for_date(&authors, "2024-02-29");
        assert!(!hits.is_empty());
    }

    #[test]
    fn calendar_month_returns_correct_size() {
        let authors = load_authors();
        assert_eq!(anniversaries_for_month(&authors, 2026, 1).len(), 31);
        assert_eq!(anniversaries_for_month(&authors, 2026, 2).len(), 28);
        assert_eq!(anniversaries_for_month(&authors, 2024, 2).len(), 29);
        assert_eq!(anniversaries_for_month(&authors, 2026, 4).len(), 30);
    }

    #[test]
    fn shift_md_wraps_correctly() {
        assert_eq!(shift_md(1, 1, -1), Some((12, 31)));
        assert_eq!(shift_md(12, 31, 1), Some((1, 1)));
        assert_eq!(shift_md(3, 1, -1), Some((2, 29))); // 2024 (閏年) basis
    }
}
