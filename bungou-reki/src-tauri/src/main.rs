//! Tauri binary entry point.
//!
//! With `--features desktop` (the standard build path), this exposes IPC
//! commands that wrap `bungou_reki_lib`. Without the feature, it falls back to
//! a CLI smoke check so `cargo run` succeeds in any environment.

#[cfg(feature = "desktop")]
mod desktop {
    use std::sync::Mutex;

    use bungou_reki_lib::{
        anniversaries_for_month, load_authors, opponent_for_seed, resolve_battle, summons_for_date,
        Anniversary, Author, BattleResult, PlayerState,
    };
    use serde::Serialize;

    pub struct AppState {
        pub authors: Vec<Author>,
        pub player: Mutex<PlayerState>,
    }

    impl AppState {
        pub fn new() -> Self {
            Self {
                authors: load_authors(),
                player: Mutex::new(PlayerState::default()),
            }
        }
    }

    #[tauri::command]
    fn cmd_today_summons(state: tauri::State<AppState>, date: String) -> Vec<Anniversary> {
        summons_for_date(&state.authors, &date)
    }

    #[tauri::command]
    fn cmd_recruit(state: tauri::State<AppState>, author_id: String, date: String) -> Result<PlayerState, String> {
        let mut p = state.player.lock().map_err(|e| e.to_string())?;
        p.recruit(&author_id, &date)?;
        Ok(p.clone())
    }

    #[tauri::command]
    fn cmd_log_reading(
        state: tauri::State<AppState>,
        author_id: String,
        title: String,
        pages: u32,
        date: String,
    ) -> Result<PlayerState, String> {
        let mut p = state.player.lock().map_err(|e| e.to_string())?;
        p.log_reading(&author_id, &title, pages, &date);
        Ok(p.clone())
    }

    #[tauri::command]
    fn cmd_battle(
        state: tauri::State<AppState>,
        deck_ids: Vec<String>,
        seed: u64,
    ) -> Result<BattleResult, String> {
        let player_deck: Vec<Author> = deck_ids
            .iter()
            .filter_map(|id| state.authors.iter().find(|a| &a.id == id).cloned())
            .collect();
        let opponent = opponent_for_seed(&state.authors, seed, &deck_ids);
        let res = resolve_battle(&player_deck, &opponent)?;
        let mut p = state.player.lock().map_err(|e| e.to_string())?;
        for id in &res.xp_targets {
            p.add_xp(id, 20);
        }
        Ok(res)
    }

    #[tauri::command]
    fn cmd_calendar(state: tauri::State<AppState>, year: i32, month: u32) -> Vec<u32> {
        anniversaries_for_month(&state.authors, year, month)
    }

    #[tauri::command]
    fn cmd_authors(state: tauri::State<AppState>) -> Vec<Author> {
        state.authors.clone()
    }

    #[tauri::command]
    fn cmd_player(state: tauri::State<AppState>) -> Result<PlayerState, String> {
        let p = state.player.lock().map_err(|e| e.to_string())?;
        Ok(p.clone())
    }

    #[tauri::command]
    fn cmd_load_player(state: tauri::State<AppState>, json: String) -> Result<PlayerState, String> {
        let parsed: PlayerState = serde_json::from_str(&json).map_err(|e| e.to_string())?;
        let mut p = state.player.lock().map_err(|e| e.to_string())?;
        *p = parsed;
        Ok(p.clone())
    }

    #[derive(Serialize)]
    pub struct AppMeta {
        pub version: &'static str,
        pub author_count: usize,
    }

    #[tauri::command]
    fn cmd_meta(state: tauri::State<AppState>) -> AppMeta {
        AppMeta {
            version: env!("CARGO_PKG_VERSION"),
            author_count: state.authors.len(),
        }
    }

    pub fn run() {
        tauri::Builder::default()
            .manage(AppState::new())
            .invoke_handler(tauri::generate_handler![
                cmd_today_summons,
                cmd_recruit,
                cmd_log_reading,
                cmd_battle,
                cmd_calendar,
                cmd_authors,
                cmd_player,
                cmd_load_player,
                cmd_meta,
            ])
            .run(tauri::generate_context!())
            .expect("文豪暦の起動に失敗しました");
    }
}

#[cfg(not(feature = "desktop"))]
fn cli_smoke() {
    use bungou_reki_lib::{load_authors, summons_for_date};
    let authors = load_authors();
    println!("📚 文豪暦 — {} 名の文豪を収録", authors.len());
    let today = chrono::Local::now().format("%Y-%m-%d").to_string();
    let summons = summons_for_date(&authors, &today);
    if summons.is_empty() {
        println!("本日 ({}) は近傍に該当作家がいません", today);
    } else {
        println!("本日 ({}) の召喚候補:", today);
        for a in summons {
            println!(
                "  ・{} ({}) — {} {} 周年",
                a.author.name,
                a.author.epithet,
                a.kind.jp_label(),
                a.years_ago
            );
        }
    }
    println!("\n💡 デスクトップアプリとして起動するには: cargo tauri dev --features desktop");
    println!("💡 ブラウザで試すには: cd ../src && python3 -m http.server 8000");
}

fn main() {
    #[cfg(feature = "desktop")]
    desktop::run();

    #[cfg(not(feature = "desktop"))]
    cli_smoke();
}
