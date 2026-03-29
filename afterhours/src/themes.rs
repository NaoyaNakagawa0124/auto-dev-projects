/// Maps day-of-year to a theme and description.
/// Covers notable dates + fills gaps with rotating themes.

#[derive(Debug, Clone)]
pub struct DayTheme {
    pub name: &'static str,
    pub description: &'static str,
    pub movie_theme: &'static str,
}

/// Get the theme for a given month (1-12) and day (1-31).
pub fn get_theme(month: u32, day: u32) -> DayTheme {
    match (month, day) {
        // January
        (1, 1) => DayTheme { name: "New Year's Day", description: "Fresh starts and new beginnings", movie_theme: "journey" },
        (1, 27) => DayTheme { name: "Int'l Holocaust Remembrance Day", description: "Never forget", movie_theme: "war" },
        // February
        (2, 14) => DayTheme { name: "Valentine's Day", description: "Love is in the air", movie_theme: "romance" },
        (2, 22) => DayTheme { name: "World Thinking Day", description: "Expand your mind", movie_theme: "science" },
        // March
        (3, 8) => DayTheme { name: "Int'l Women's Day", description: "Celebrating women everywhere", movie_theme: "identity" },
        (3, 14) => DayTheme { name: "Pi Day", description: "Mathematics and wonder", movie_theme: "science" },
        (3, 20) => DayTheme { name: "World Storytelling Day", description: "Every story matters", movie_theme: "fairy-tale" },
        (3, 22) => DayTheme { name: "World Water Day", description: "The ocean calls", movie_theme: "ocean" },
        (3, 29) => DayTheme { name: "Int'l Mermaid Day", description: "Dive into the deep", movie_theme: "ocean" },
        // April
        (4, 1) => DayTheme { name: "April Fools' Day", description: "Nothing is what it seems", movie_theme: "humor" },
        (4, 12) => DayTheme { name: "Yuri's Night", description: "Celebrating space exploration", movie_theme: "space" },
        (4, 22) => DayTheme { name: "Earth Day", description: "Protect our planet", movie_theme: "nature" },
        // May
        (5, 1) => DayTheme { name: "May Day", description: "Workers and spring celebrations", movie_theme: "freedom" },
        (5, 4) => DayTheme { name: "Star Wars Day", description: "May the Force be with you", movie_theme: "space" },
        (5, 25) => DayTheme { name: "Towel Day", description: "Don't panic", movie_theme: "adventure" },
        // June
        (6, 5) => DayTheme { name: "World Environment Day", description: "One planet, one chance", movie_theme: "nature" },
        (6, 21) => DayTheme { name: "World Music Day", description: "Let the music play", movie_theme: "music" },
        // July
        (7, 4) => DayTheme { name: "Independence Day (US)", description: "Freedom rings", movie_theme: "freedom" },
        (7, 20) => DayTheme { name: "Moon Landing Day", description: "One giant leap", movie_theme: "space" },
        // August
        (8, 13) => DayTheme { name: "Int'l Left-Handers Day", description: "The world is different from a different angle", movie_theme: "identity" },
        (8, 19) => DayTheme { name: "World Photography Day", description: "Capturing moments", movie_theme: "nostalgia" },
        // September
        (9, 21) => DayTheme { name: "Int'l Day of Peace", description: "Imagine all the people", movie_theme: "hope" },
        (9, 27) => DayTheme { name: "World Tourism Day", description: "Explore the unknown", movie_theme: "travel" },
        // October
        (10, 4) => DayTheme { name: "World Animal Day", description: "Every creature counts", movie_theme: "nature" },
        (10, 31) => DayTheme { name: "Halloween", description: "Things that go bump in the night", movie_theme: "night" },
        // November
        (11, 3) => DayTheme { name: "World Jellyfish Day", description: "Drifting through the deep", movie_theme: "ocean" },
        (11, 19) => DayTheme { name: "World Philosophy Day", description: "What is real?", movie_theme: "reality" },
        // December
        (12, 10) => DayTheme { name: "Human Rights Day", description: "Dignity for all", movie_theme: "freedom" },
        (12, 25) => DayTheme { name: "Christmas Day", description: "Peace on Earth", movie_theme: "family" },
        (12, 31) => DayTheme { name: "New Year's Eve", description: "Out with the old", movie_theme: "night" },

        // Default: rotate through themes based on day of year
        _ => {
            let day_of_year = (month - 1) * 30 + day;
            let themes: &[(&str, &str, &str)] = &[
                ("Night Owl Cinema", "For those who stay up late", "night"),
                ("Ocean Dreams", "Deep blue inspiration", "ocean"),
                ("Wanderlust Night", "Travel from your couch", "travel"),
                ("Sci-Fi Saturday", "Futures imagined", "future"),
                ("Romance After Dark", "Love stories for insomniacs", "romance"),
                ("Noir Night", "Shadows and intrigue", "noir"),
                ("Adventure Awaits", "Bold journeys begin", "journey"),
                ("Fantasy Realm", "Magic is real at 2am", "fantasy"),
                ("Music & Soul", "Films that sing", "music"),
                ("Identity Crisis", "Who are you at 3am?", "identity"),
                ("Dream Logic", "Reality is optional", "dreams"),
                ("Family Ties", "The ones who matter most", "family"),
                ("Survival Mode", "Against all odds", "survival"),
                ("Ambition Drive", "The cost of greatness", "ambition"),
            ];
            let idx = (day_of_year as usize) % themes.len();
            let (name, desc, theme) = themes[idx];
            DayTheme { name, description: desc, movie_theme: theme }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_specific_dates() {
        let t = get_theme(3, 29);
        assert_eq!(t.name, "Int'l Mermaid Day");
        assert_eq!(t.movie_theme, "ocean");

        let t = get_theme(2, 14);
        assert_eq!(t.name, "Valentine's Day");
        assert_eq!(t.movie_theme, "romance");

        let t = get_theme(10, 31);
        assert_eq!(t.name, "Halloween");
        assert_eq!(t.movie_theme, "night");
    }

    #[test]
    fn test_default_themes() {
        // Non-specific date should still return a theme
        let t = get_theme(6, 15);
        assert!(!t.name.is_empty());
        assert!(!t.movie_theme.is_empty());
    }

    #[test]
    fn test_all_months_covered() {
        for month in 1..=12 {
            for day in [1, 15, 28] {
                let t = get_theme(month, day);
                assert!(!t.movie_theme.is_empty(), "month {} day {} has theme", month, day);
            }
        }
    }
}
