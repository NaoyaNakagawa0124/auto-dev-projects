use wasm_bindgen::prelude::*;

/// Trending topics for March 2026 — real data from TikTok, Netflix, YouTube, Spotify
const TOPICS: &[(&str, &str, &str)] = &[
    ("One Piece Season 2 Reactions", "anime", "Side-by-side manga comparisons, cosplay transitions"),
    ("Peaky Blinders Movie Edits", "entertainment", "Tommy Shelby audio pulls and cinematic edits"),
    ("Harry Styles Album Deep Dives", "music", "Track-by-track reaction content for new album"),
    ("Don Toliver Dance Challenge", "dance", "Viral choreography by @mai world"),
    ("Slow Content Movement", "format", "Long-form, thoughtful videos countering scroll fatigue"),
    ("Italian Brainrot", "meme", "Anti-brainrot trend forcing creative new formats"),
    ("Cartoon Chase Edits", "meme", "Tom & Jerry style sped-up chase footage"),
    ("Couples Comedy Format", "relationship", "Duo skits and relationship humor"),
    ("Admin Night Content", "lifestyle", "Making boring adult tasks social and fun"),
    ("Oscars 2026 Predictions", "entertainment", "Academy Awards hot takes and ranking content"),
    ("Megan Moroney Breakup Trend", "music", "Emotional storytelling with '6 Months Later'"),
    ("Bachelorette Watch Party", "reality", "React content for Taylor Frankie Paul season"),
    ("Food Hack Challenge", "food", "Quick kitchen hacks and recipe reveals"),
    ("Gym Transformation Duets", "fitness", "Before/after fitness journey collaborations"),
    ("Day in My Life Collab", "lifestyle", "Parallel day-in-my-life with another creator"),
    ("Get Ready With Me Duo", "beauty", "Side-by-side GRWM with different styles"),
    ("AI Art Comparison", "tech", "Comparing AI-generated art styles and tools"),
    ("Budget vs Luxury Challenge", "lifestyle", "One creator goes budget, one goes luxury"),
    ("Travel Vlog Swap", "travel", "Creators visit each other's cities"),
    ("Book Club TikTok", "education", "Duo book reviews and reading challenges"),
    ("Podcast Clip Reactions", "podcast", "Reacting to each other's hot takes"),
    ("Music Production Collab", "music", "Making a beat together remotely"),
    ("Thrift Flip Challenge", "fashion", "Both thrift, both flip, viewers vote"),
    ("Mystery Box Cooking", "food", "Each sends a mystery box, other must cook it"),
    ("2-Player Game Stream", "gaming", "Co-op gaming highlights and fails"),
    ("Street Interview Duo", "comedy", "Both interview strangers, compare answers"),
    ("Science Experiment Race", "education", "Who can complete the experiment first"),
    ("Pet Content Collab", "animals", "Pets 'meet' via video, owners react"),
    ("Storytime Sequel", "storytelling", "One starts a story, other continues"),
    ("Skill Swap Challenge", "education", "Each teaches the other their expertise"),
];

const CATEGORIES: &[(&str, &str)] = &[
    ("anime", "🎌"), ("entertainment", "🎬"), ("music", "🎵"), ("dance", "💃"),
    ("format", "📱"), ("meme", "😂"), ("relationship", "💑"), ("lifestyle", "🌟"),
    ("reality", "📺"), ("food", "🍳"), ("fitness", "💪"), ("beauty", "💄"),
    ("tech", "🤖"), ("travel", "✈️"), ("education", "📚"), ("podcast", "🎙️"),
    ("fashion", "👗"), ("gaming", "🎮"), ("comedy", "😄"), ("animals", "🐾"),
    ("storytelling", "📖"),
];

#[wasm_bindgen]
pub fn get_topic_count() -> usize {
    TOPICS.len()
}

#[wasm_bindgen]
pub fn get_topic_title(index: usize) -> String {
    if index < TOPICS.len() { TOPICS[index].0.to_string() } else { String::new() }
}

#[wasm_bindgen]
pub fn get_topic_category(index: usize) -> String {
    if index < TOPICS.len() { TOPICS[index].1.to_string() } else { String::new() }
}

#[wasm_bindgen]
pub fn get_topic_description(index: usize) -> String {
    if index < TOPICS.len() { TOPICS[index].2.to_string() } else { String::new() }
}

#[wasm_bindgen]
pub fn get_category_icon(category: &str) -> String {
    for (cat, icon) in CATEGORIES {
        if *cat == category { return icon.to_string(); }
    }
    "📌".to_string()
}

#[wasm_bindgen]
pub fn encode_votes(votes: &[u8]) -> String {
    votes.iter().map(|v| if *v > 0 { '1' } else { '0' }).collect()
}

#[wasm_bindgen]
pub fn decode_votes(encoded: &str) -> Vec<u8> {
    encoded.chars().map(|c| if c == '1' { 1 } else { 0 }).collect()
}

#[wasm_bindgen]
pub fn find_matches(votes_a: &[u8], votes_b: &[u8]) -> Vec<usize> {
    let len = votes_a.len().min(votes_b.len()).min(TOPICS.len());
    (0..len).filter(|&i| votes_a[i] > 0 && votes_b[i] > 0).collect()
}

#[wasm_bindgen]
pub fn compatibility_score(votes_a: &[u8], votes_b: &[u8]) -> u32 {
    let len = votes_a.len().min(votes_b.len()).min(TOPICS.len());
    if len == 0 { return 0; }
    let agree = (0..len).filter(|&i| (votes_a[i] > 0) == (votes_b[i] > 0)).count() as u32;
    (agree * 100) / len as u32
}

#[wasm_bindgen]
pub fn count_yes(votes: &[u8]) -> usize {
    votes.iter().filter(|v| **v > 0).count()
}

#[wasm_bindgen]
pub fn generate_plan(matches: &[usize]) -> String {
    if matches.is_empty() {
        return "No matching topics! Try again with more open minds. 🤷".to_string();
    }
    let mut plan = format!("🎬 YOUR COLLAB PLAN\n━━━━━━━━━━━━━━━━━━━━━\n{} matching topics!\n\n", matches.len());
    for (rank, &idx) in matches.iter().enumerate() {
        if idx < TOPICS.len() {
            let (title, cat, desc) = TOPICS[idx];
            plan.push_str(&format!("{}. {} {} [{}]\n   {}\n\n", rank + 1, get_category_icon(cat), title, cat, desc));
        }
    }
    plan.push_str("📅 Suggested Schedule:\n");
    let weeks = ["This week", "Next week", "Week 3", "Week 4"];
    for (i, &idx) in matches.iter().take(4).enumerate() {
        if idx < TOPICS.len() { plan.push_str(&format!("   {}: {}\n", weeks[i], TOPICS[idx].0)); }
    }
    plan
}

#[wasm_bindgen]
pub fn match_quality(match_count: usize, total: usize) -> String {
    if total == 0 { return "No data".to_string(); }
    match match_count * 100 / total {
        80..=100 => "🔥 Creative Soulmates".to_string(),
        60..=79 => "💫 Great Match".to_string(),
        40..=59 => "✨ Solid Potential".to_string(),
        20..=39 => "🌱 Some Common Ground".to_string(),
        _ => "🤔 Opposites Attract?".to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test] fn topic_count() { assert_eq!(get_topic_count(), 30); }
    #[test] fn titles_not_empty() { for i in 0..30 { assert!(!get_topic_title(i).is_empty()); } }
    #[test] fn categories_valid() {
        let valid: Vec<&str> = CATEGORIES.iter().map(|(c,_)| *c).collect();
        for i in 0..30 { assert!(valid.contains(&get_topic_category(i).as_str())); }
    }
    #[test] fn descs_not_empty() { for i in 0..30 { assert!(!get_topic_description(i).is_empty()); } }
    #[test] fn out_of_bounds() { assert!(get_topic_title(999).is_empty()); }
    #[test] fn icons() {
        assert_eq!(get_category_icon("anime"), "🎌");
        assert_eq!(get_category_icon("music"), "🎵");
        assert_eq!(get_category_icon("unknown"), "📌");
    }
    #[test] fn encode() { assert_eq!(encode_votes(&[1,0,1,0,1]), "10101"); assert_eq!(encode_votes(&[]), ""); }
    #[test] fn decode() { assert_eq!(decode_votes("10101"), vec![1,0,1,0,1]); assert_eq!(decode_votes(""), Vec::<u8>::new()); }
    #[test] fn roundtrip() { let v = vec![1,0,1,1,0,0,1]; assert_eq!(decode_votes(&encode_votes(&v)), v); }
    #[test] fn matches_both() { assert_eq!(find_matches(&[1,0,1,0,1], &[1,1,1,0,0]), vec![0,2]); }
    #[test] fn matches_none() { assert!(find_matches(&[1,0], &[0,1]).is_empty()); }
    #[test] fn matches_all() { assert_eq!(find_matches(&[1,1,1], &[1,1,1]), vec![0,1,2]); }
    #[test] fn matches_empty() { assert!(find_matches(&[], &[]).is_empty()); }
    #[test] fn matches_diff_len() { assert_eq!(find_matches(&[1,1,1,1,1], &[1,0,1]), vec![0,2]); }
    #[test] fn compat_perfect() { assert_eq!(compatibility_score(&[1,0,1], &[1,0,1]), 100); }
    #[test] fn compat_none() { assert_eq!(compatibility_score(&[1,1,1], &[0,0,0]), 0); }
    #[test] fn compat_half() { assert_eq!(compatibility_score(&[1,0,1,0], &[1,1,0,0]), 50); }
    #[test] fn compat_empty() { assert_eq!(compatibility_score(&[], &[]), 0); }
    #[test] fn yes_count() { assert_eq!(count_yes(&[1,0,1,0,1]), 3); assert_eq!(count_yes(&[]), 0); }
    #[test] fn plan_matches() { let p = generate_plan(&[0,5,10]); assert!(p.contains("3 matching")); }
    #[test] fn plan_empty() { assert!(generate_plan(&[]).contains("No matching")); }
    #[test] fn quality() {
        assert!(match_quality(9,10).contains("Soulmates"));
        assert!(match_quality(7,10).contains("Great"));
        assert!(match_quality(5,10).contains("Solid"));
        assert!(match_quality(2,10).contains("Common"));
        assert!(match_quality(1,10).contains("Opposites"));
        assert!(match_quality(0,0).contains("No data"));
    }
    #[test] fn full_scenario() {
        let a: Vec<u8> = (0..30).map(|i| if i % 2 == 1 { 1 } else { 0 }).collect();
        let b: Vec<u8> = (0..30).map(|i| if i < 15 { 1 } else { 0 }).collect();
        assert_eq!(find_matches(&a, &b).len(), 7);
        let c = compatibility_score(&a, &b);
        assert!(c > 0 && c < 100);
    }
    #[test] fn unique_titles() {
        let t: Vec<String> = (0..30).map(get_topic_title).collect();
        let s: std::collections::HashSet<&String> = t.iter().collect();
        assert_eq!(t.len(), s.len());
    }
}
