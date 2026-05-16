//! Selection: given a date, pick the vignette to show.
//!
//! Logic:
//!   1. If there's at least one vignette with the exact MM-DD, pick one
//!      deterministically based on the year (so a person who opens the
//!      app today and again next year gets a different one, but the same
//!      person opening twice in one day always gets the same one).
//!   2. Otherwise, find the closest MM-DD in the dataset (wrapping the year)
//!      and return that one with `is_nearby = true`.

use crate::vignettes::{available_mds, vignettes_for_md, Vignette, VIGNETTES};

#[derive(Debug, Clone)]
pub struct Selection {
    pub vignette: &'static Vignette,
    pub is_nearby: bool,
    /// MM-DD the caller asked for. Useful for the UI to show "近い日の話".
    pub requested_md: String,
}

/// Parse "YYYY-MM-DD" and return (year, MM-DD).
pub fn parse_iso(s: &str) -> Option<(u16, String)> {
    let bytes = s.as_bytes();
    if bytes.len() < 10 || bytes[4] != b'-' || bytes[7] != b'-' {
        return None;
    }
    let year: u16 = s[0..4].parse().ok()?;
    let mm: u8 = s[5..7].parse().ok()?;
    let dd: u8 = s[8..10].parse().ok()?;
    if mm == 0 || mm > 12 || dd == 0 || dd > 31 {
        return None;
    }
    Some((year, format!("{:02}-{:02}", mm, dd)))
}

/// Convert MM-DD to a day-of-year-ish ordinal for nearness calculations.
/// We use simple month-based math; this is for picking nearest neighbors,
/// not for calendrical precision.
fn md_ordinal(md: &str) -> Option<u32> {
    let bytes = md.as_bytes();
    if bytes.len() != 5 || bytes[2] != b'-' {
        return None;
    }
    let mm: u32 = md[0..2].parse().ok()?;
    let dd: u32 = md[3..5].parse().ok()?;
    if mm == 0 || mm > 12 { return None; }
    // approximate "day count" — every month is 31 days for distance comparison
    Some((mm - 1) * 31 + (dd - 1))
}

/// Circular distance between two MM-DD ordinals modulo 12*31 = 372.
fn circular_distance(a: u32, b: u32) -> u32 {
    let modulo: u32 = 12 * 31;
    let diff = if a >= b { a - b } else { b - a };
    if diff <= modulo - diff { diff } else { modulo - diff }
}

pub fn select_for_iso(date_iso: &str) -> Option<Selection> {
    let (year, md) = parse_iso(date_iso)?;
    select_for_md(&md, year as u32)
}

pub fn select_for_md(md: &str, year_seed: u32) -> Option<Selection> {
    if VIGNETTES.is_empty() {
        return None;
    }
    let exact = vignettes_for_md(md);
    if !exact.is_empty() {
        // pick deterministically based on year_seed
        let idx = (year_seed as usize) % exact.len();
        return Some(Selection {
            vignette: exact[idx],
            is_nearby: false,
            requested_md: md.to_string(),
        });
    }
    // Nearest fallback
    let target = md_ordinal(md)?;
    let mut best: Option<(u32, &'static Vignette)> = None;
    for v in VIGNETTES {
        let Some(ord) = md_ordinal(v.date_md) else { continue };
        let d = circular_distance(target, ord);
        match best {
            None => best = Some((d, v)),
            Some((bd, _)) if d < bd => best = Some((d, v)),
            _ => {}
        }
    }
    best.map(|(_, v)| Selection {
        vignette: v,
        is_nearby: true,
        requested_md: md.to_string(),
    })
}

/// "Next" vignette MM-DD strictly after the given MM-DD (wrapping).
pub fn next_md(md: &str) -> Option<String> {
    let target = md_ordinal(md)?;
    let mut mds = available_mds();
    mds.sort_by_key(|x| md_ordinal(x).unwrap_or(0));
    for x in mds.iter() {
        let Some(o) = md_ordinal(x) else { continue };
        if o > target {
            return Some((*x).to_string());
        }
    }
    Some(mds.first().map(|s| (*s).to_string())?)
}

/// "Prev" vignette MM-DD strictly before the given MM-DD (wrapping).
pub fn prev_md(md: &str) -> Option<String> {
    let target = md_ordinal(md)?;
    let mut mds = available_mds();
    mds.sort_by_key(|x| md_ordinal(x).unwrap_or(0));
    for x in mds.iter().rev() {
        let Some(o) = md_ordinal(x) else { continue };
        if o < target {
            return Some((*x).to_string());
        }
    }
    Some(mds.last().map(|s| (*s).to_string())?)
}
