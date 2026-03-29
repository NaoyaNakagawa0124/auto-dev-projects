use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct Movie {
    pub id: u32,
    pub title: &'static str,
    pub year: u16,
    pub genre: &'static str,
    pub tagline: &'static str,
    pub themes: &'static [&'static str],
}

pub const MOVIES: &[Movie] = &[
    Movie { id: 1, title: "The Shape of Water", year: 2017, genre: "Fantasy", tagline: "A fairy tale for troubled times", themes: &["ocean", "romance", "fantasy"] },
    Movie { id: 2, title: "Moonlight", year: 2016, genre: "Drama", tagline: "At some point you gotta decide who you gonna be", themes: &["night", "identity", "coming-of-age"] },
    Movie { id: 3, title: "Spirited Away", year: 2001, genre: "Animation", tagline: "A journey beyond imagination", themes: &["fantasy", "journey", "spirit"] },
    Movie { id: 4, title: "The Grand Budapest Hotel", year: 2014, genre: "Comedy", tagline: "A story of friendship in war", themes: &["travel", "humor", "nostalgia"] },
    Movie { id: 5, title: "Interstellar", year: 2014, genre: "Sci-Fi", tagline: "Mankind was born on Earth. It was never meant to die here.", themes: &["space", "science", "family"] },
    Movie { id: 6, title: "Amélie", year: 2001, genre: "Romance", tagline: "She'll change your life", themes: &["romance", "whimsy", "paris"] },
    Movie { id: 7, title: "Pan's Labyrinth", year: 2006, genre: "Fantasy", tagline: "Innocence has a power evil cannot imagine", themes: &["fantasy", "war", "fairy-tale"] },
    Movie { id: 8, title: "Drive", year: 2011, genre: "Thriller", tagline: "There are no clean getaways", themes: &["night", "cars", "noir"] },
    Movie { id: 9, title: "The Truman Show", year: 1998, genre: "Drama", tagline: "On the air. Unaware.", themes: &["media", "freedom", "reality"] },
    Movie { id: 10, title: "Lost in Translation", year: 2003, genre: "Drama", tagline: "Everyone wants to be found", themes: &["travel", "loneliness", "night"] },
    Movie { id: 11, title: "Blade Runner 2049", year: 2017, genre: "Sci-Fi", tagline: "The key to the future is finally unearthed", themes: &["future", "identity", "noir"] },
    Movie { id: 12, title: "Whiplash", year: 2014, genre: "Drama", tagline: "The road to greatness can destroy you", themes: &["music", "ambition", "discipline"] },
    Movie { id: 13, title: "The Little Mermaid", year: 1989, genre: "Animation", tagline: "Love has no boundaries", themes: &["ocean", "romance", "fairy-tale"] },
    Movie { id: 14, title: "Jaws", year: 1975, genre: "Thriller", tagline: "You'll never go in the water again", themes: &["ocean", "fear", "summer"] },
    Movie { id: 15, title: "Finding Nemo", year: 2003, genre: "Animation", tagline: "There are 3.7 trillion fish in the ocean", themes: &["ocean", "family", "adventure"] },
    Movie { id: 16, title: "Casablanca", year: 1942, genre: "Romance", tagline: "Here's looking at you, kid", themes: &["war", "romance", "nostalgia"] },
    Movie { id: 17, title: "Soul", year: 2020, genre: "Animation", tagline: "What makes you, you?", themes: &["music", "spirit", "meaning"] },
    Movie { id: 18, title: "Apocalypse Now", year: 1979, genre: "War", tagline: "The horror... the horror...", themes: &["war", "journey", "darkness"] },
    Movie { id: 19, title: "The Secret Life of Walter Mitty", year: 2013, genre: "Adventure", tagline: "Stop dreaming. Start living.", themes: &["travel", "adventure", "dreams"] },
    Movie { id: 20, title: "Ratatouille", year: 2007, genre: "Animation", tagline: "Anyone can cook", themes: &["food", "ambition", "paris"] },
    Movie { id: 21, title: "Good Will Hunting", year: 1997, genre: "Drama", tagline: "Some people can never believe in themselves", themes: &["education", "identity", "friendship"] },
    Movie { id: 22, title: "Her", year: 2013, genre: "Sci-Fi", tagline: "A love story unlike any other", themes: &["future", "romance", "loneliness"] },
    Movie { id: 23, title: "The Matrix", year: 1999, genre: "Sci-Fi", tagline: "Reality is a thing of the past", themes: &["reality", "freedom", "future"] },
    Movie { id: 24, title: "Coco", year: 2017, genre: "Animation", tagline: "The celebration of a lifetime", themes: &["family", "music", "spirit"] },
    Movie { id: 25, title: "Taxi Driver", year: 1976, genre: "Thriller", tagline: "On every street in every city there's a nobody who dreams", themes: &["night", "loneliness", "noir"] },
    Movie { id: 26, title: "My Neighbor Totoro", year: 1988, genre: "Animation", tagline: "A magical adventure into the enchanted forest", themes: &["nature", "family", "fantasy"] },
    Movie { id: 27, title: "The Shawshank Redemption", year: 1994, genre: "Drama", tagline: "Fear can hold you prisoner. Hope can set you free.", themes: &["freedom", "friendship", "hope"] },
    Movie { id: 28, title: "Gravity", year: 2013, genre: "Sci-Fi", tagline: "Don't let go", themes: &["space", "survival", "isolation"] },
    Movie { id: 29, title: "In the Mood for Love", year: 2000, genre: "Romance", tagline: "The past is something he could see but not touch", themes: &["romance", "night", "nostalgia"] },
    Movie { id: 30, title: "WALL-E", year: 2008, genre: "Animation", tagline: "After 700 years of doing what he was built for, he discovered what he was meant for", themes: &["future", "romance", "nature"] },
    Movie { id: 31, title: "The Pianist", year: 2002, genre: "Drama", tagline: "Music was his passion. Survival was his masterpiece.", themes: &["war", "music", "survival"] },
    Movie { id: 32, title: "Eternal Sunshine of the Spotless Mind", year: 2004, genre: "Sci-Fi", tagline: "You can erase someone from your mind. Getting them out of your heart is another story.", themes: &["romance", "memory", "identity"] },
    Movie { id: 33, title: "Life of Pi", year: 2012, genre: "Adventure", tagline: "Believe the unbelievable", themes: &["ocean", "faith", "survival"] },
    Movie { id: 34, title: "Nightcrawler", year: 2014, genre: "Thriller", tagline: "The city shines brightest at night", themes: &["night", "media", "ambition"] },
    Movie { id: 35, title: "Your Name", year: 2016, genre: "Animation", tagline: "What is your name?", themes: &["romance", "fate", "dreams"] },
    Movie { id: 36, title: "The Wizard of Oz", year: 1939, genre: "Fantasy", tagline: "There's no place like home", themes: &["journey", "fantasy", "dreams"] },
    Movie { id: 37, title: "Parasite", year: 2019, genre: "Thriller", tagline: "Act like you own the place", themes: &["class", "family", "noir"] },
    Movie { id: 38, title: "Ponyo", year: 2008, genre: "Animation", tagline: "Welcome to a world where anything is possible", themes: &["ocean", "fantasy", "family"] },
    Movie { id: 39, title: "Before Sunrise", year: 1995, genre: "Romance", tagline: "Can the greatest romance of your life last only one night?", themes: &["travel", "romance", "night"] },
    Movie { id: 40, title: "The Nightmare Before Christmas", year: 1993, genre: "Animation", tagline: "A ghoulish tale with wicked humor", themes: &["fantasy", "night", "whimsy"] },
    Movie { id: 41, title: "2001: A Space Odyssey", year: 1968, genre: "Sci-Fi", tagline: "The ultimate trip", themes: &["space", "future", "mystery"] },
    Movie { id: 42, title: "Groundhog Day", year: 1993, genre: "Comedy", tagline: "He's having the worst day of his life... over, and over...", themes: &["time", "humor", "growth"] },
    Movie { id: 43, title: "Arrival", year: 2016, genre: "Sci-Fi", tagline: "Why are they here?", themes: &["science", "time", "communication"] },
    Movie { id: 44, title: "Howl's Moving Castle", year: 2004, genre: "Animation", tagline: "The two lived there happily ever after", themes: &["fantasy", "romance", "war"] },
    Movie { id: 45, title: "The Big Lebowski", year: 1998, genre: "Comedy", tagline: "The Dude abides", themes: &["humor", "noir", "identity"] },
    Movie { id: 46, title: "Phantom Thread", year: 2017, genre: "Drama", tagline: "To be seen, to be noticed", themes: &["fashion", "romance", "ambition"] },
    Movie { id: 47, title: "Ocean's Eleven", year: 2001, genre: "Thriller", tagline: "Are you in or out?", themes: &["heist", "humor", "teamwork"] },
    Movie { id: 48, title: "Moana", year: 2016, genre: "Animation", tagline: "The ocean is calling", themes: &["ocean", "journey", "identity"] },
    Movie { id: 49, title: "Collateral", year: 2004, genre: "Thriller", tagline: "It started like any other night", themes: &["night", "cars", "noir"] },
    Movie { id: 50, title: "Princess Mononoke", year: 1997, genre: "Animation", tagline: "The fate of the world rests on the courage of one warrior", themes: &["nature", "war", "spirit"] },
    Movie { id: 51, title: "Django Unchained", year: 2012, genre: "Western", tagline: "Life, liberty, and the pursuit of vengeance", themes: &["freedom", "justice", "history"] },
    Movie { id: 52, title: "Aquaman", year: 2018, genre: "Action", tagline: "Home is calling", themes: &["ocean", "hero", "adventure"] },
    Movie { id: 53, title: "La La Land", year: 2016, genre: "Musical", tagline: "Here's to the fools who dream", themes: &["music", "romance", "dreams"] },
    Movie { id: 54, title: "Mad Max: Fury Road", year: 2015, genre: "Action", tagline: "What a lovely day", themes: &["survival", "future", "journey"] },
    Movie { id: 55, title: "The Social Network", year: 2010, genre: "Drama", tagline: "You don't get to 500 million friends without making a few enemies", themes: &["media", "ambition", "identity"] },
    Movie { id: 56, title: "Inception", year: 2010, genre: "Sci-Fi", tagline: "Your mind is the scene of the crime", themes: &["dreams", "reality", "noir"] },
    Movie { id: 57, title: "After Hours", year: 1985, genre: "Comedy", tagline: "One crazy night in SoHo", themes: &["night", "humor", "chaos"] },
    Movie { id: 58, title: "Eyes Wide Shut", year: 1999, genre: "Thriller", tagline: "Cruise. Kidman. Kubrick.", themes: &["night", "mystery", "romance"] },
    Movie { id: 59, title: "Midnight in Paris", year: 2011, genre: "Fantasy", tagline: "Paris is always a good idea", themes: &["night", "nostalgia", "paris"] },
    Movie { id: 60, title: "The Abyss", year: 1989, genre: "Sci-Fi", tagline: "A place on Earth more awesome than anywhere in space", themes: &["ocean", "science", "survival"] },
];

pub fn get_movies() -> &'static [Movie] {
    MOVIES
}

pub fn get_movie_by_id(id: u32) -> Option<&'static Movie> {
    MOVIES.iter().find(|m| m.id == id)
}

pub fn find_movies_by_theme(theme: &str) -> Vec<&'static Movie> {
    MOVIES.iter().filter(|m| m.themes.contains(&theme)).collect()
}
