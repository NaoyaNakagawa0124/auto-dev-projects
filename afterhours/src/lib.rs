mod movies;
mod themes;

use movies::{find_movies_by_theme, get_movie_by_id, get_movies, Movie};
use themes::get_theme;
use wasm_bindgen::prelude::*;

/// Check if the current hour is within the midnight-6am window.
#[wasm_bindgen]
pub fn is_after_hours(hour: u32) -> bool {
    hour < 6
}

/// Get minutes until the doors open (from current hour/minute).
/// Returns 0 if already open.
#[wasm_bindgen]
pub fn minutes_until_open(hour: u32, minute: u32) -> u32 {
    if is_after_hours(hour) {
        return 0;
    }
    let minutes_left_today = (23 - hour) * 60 + (60 - minute);
    minutes_left_today
}

/// Get tonight's theme as JSON.
#[wasm_bindgen]
pub fn get_tonight_theme(month: u32, day: u32) -> String {
    let theme = get_theme(month, day);
    format!(
        r#"{{"name":"{}","description":"{}","movie_theme":"{}"}}"#,
        theme.name, theme.description, theme.movie_theme
    )
}

/// Get tonight's movie recommendation as JSON, deterministic per date.
#[wasm_bindgen]
pub fn get_tonight_movie(month: u32, day: u32) -> String {
    let theme = get_theme(month, day);
    let matches = find_movies_by_theme(theme.movie_theme);

    let movie = if matches.is_empty() {
        let idx = ((month * 31 + day) as usize) % get_movies().len();
        &get_movies()[idx]
    } else {
        let idx = ((month * 31 + day) as usize) % matches.len();
        matches[idx]
    };

    movie_to_json(movie)
}

/// Get a movie by ID as JSON.
#[wasm_bindgen]
pub fn get_movie_json(id: u32) -> String {
    match get_movie_by_id(id) {
        Some(m) => movie_to_json(m),
        None => "null".to_string(),
    }
}

/// Get all movies as a JSON array.
#[wasm_bindgen]
pub fn get_all_movies_json() -> String {
    let movies: Vec<String> = get_movies().iter().map(movie_to_json).collect();
    format!("[{}]", movies.join(","))
}

/// Get the total movie count.
#[wasm_bindgen]
pub fn movie_count() -> u32 {
    get_movies().len() as u32
}

fn movie_to_json(m: &Movie) -> String {
    let themes_json: Vec<String> = m.themes.iter().map(|t| format!("\"{}\"", t)).collect();
    format!(
        r#"{{"id":{},"title":"{}","year":{},"genre":"{}","tagline":"{}","themes":[{}]}}"#,
        m.id,
        m.title.replace('"', "\\\""),
        m.year,
        m.genre,
        m.tagline.replace('"', "\\\""),
        themes_json.join(",")
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_is_after_hours() {
        assert!(is_after_hours(0));
        assert!(is_after_hours(1));
        assert!(is_after_hours(5));
        assert!(!is_after_hours(6));
        assert!(!is_after_hours(12));
        assert!(!is_after_hours(23));
    }

    #[test]
    fn test_minutes_until_open() {
        assert_eq!(minutes_until_open(0, 0), 0);
        assert_eq!(minutes_until_open(3, 30), 0);
        assert!(minutes_until_open(12, 0) > 0);
        assert!(minutes_until_open(23, 0) < 120);
    }

    #[test]
    fn test_get_tonight_theme() {
        let json = get_tonight_theme(3, 29);
        assert!(json.contains("Mermaid"));
        assert!(json.contains("ocean"));
    }

    #[test]
    fn test_get_tonight_movie() {
        let json = get_tonight_movie(3, 29);
        assert!(json.contains("title"));
        assert!(json.contains("year"));
    }

    #[test]
    fn test_deterministic_picks() {
        let pick1 = get_tonight_movie(3, 29);
        let pick2 = get_tonight_movie(3, 29);
        assert_eq!(pick1, pick2);
    }

    #[test]
    fn test_different_dates() {
        let pick1 = get_tonight_movie(3, 29);
        let pick2 = get_tonight_movie(7, 4);
        assert_ne!(pick1, pick2);
    }

    #[test]
    fn test_movie_count() {
        assert!(movie_count() >= 60);
    }

    #[test]
    fn test_get_movie_json() {
        let json = get_movie_json(1);
        assert!(json.contains("Shape of Water"));
        assert_eq!(get_movie_json(9999), "null");
    }

    #[test]
    fn test_all_movies_json() {
        let json = get_all_movies_json();
        assert!(json.starts_with('['));
        assert!(json.ends_with(']'));
    }

    #[test]
    fn test_every_day_gets_a_movie() {
        for month in 1..=12 {
            for day in [1, 15, 28] {
                let json = get_tonight_movie(month, day);
                assert!(json.contains("title"), "m{} d{}", month, day);
            }
        }
    }

    #[test]
    fn test_find_movies_by_theme() {
        let ocean = find_movies_by_theme("ocean");
        assert!(ocean.len() >= 4);
        let night = find_movies_by_theme("night");
        assert!(night.len() >= 4);
    }

    #[test]
    fn test_movie_data_integrity() {
        for m in get_movies() {
            assert!(m.id > 0);
            assert!(!m.title.is_empty());
            assert!(m.year >= 1930 && m.year <= 2030);
            assert!(!m.genre.is_empty());
            assert!(!m.themes.is_empty());
        }
    }

    #[test]
    fn test_unique_ids() {
        let mut ids: Vec<u32> = get_movies().iter().map(|m| m.id).collect();
        let total = ids.len();
        ids.sort();
        ids.dedup();
        assert_eq!(ids.len(), total);
    }
}
