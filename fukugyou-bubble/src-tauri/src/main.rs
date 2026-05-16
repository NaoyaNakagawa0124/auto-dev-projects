//! Bin entry. With `--features desktop` this hosts the Tauri webview;
//! without it, prints a quick CLI sanity check so `cargo run` always works.

#[cfg(feature = "desktop")]
mod desktop {
    use fukugyou_bubble_lib::data::load_hustles;
    use fukugyou_bubble_lib::game::Game;

    pub fn run() {
        let cfg = load_hustles();
        let _game = Game::new(cfg);
        tauri::Builder::default()
            .invoke_handler(tauri::generate_handler![])
            .run(tauri::generate_context!())
            .expect("副業バブルの起動に失敗");
    }
}

#[cfg(not(feature = "desktop"))]
fn cli_smoke() {
    use fukugyou_bubble_lib::data::load_hustles;
    use fukugyou_bubble_lib::game::{Game, click};
    let cfg = load_hustles();
    let mut game = Game::new(cfg);
    println!("📈 副業バブル — {} 種類の副業を収録", game.config.hustles.len());
    for h in &game.config.hustles {
        println!(
            "  {} {} (クリック ¥{} / 放置 ¥{:.1}/秒 / アップグレード初期コスト ¥{:.0})",
            h.emoji, h.name_jp, h.click_reward, h.base_income, h.upgrade_base_cost
        );
    }
    println!("\n🎯 目標: ¥{} を貯めること", game.config.win_target);
    println!("\n💡 ブラウザで試すには: cd ../src && python3 -m http.server 8000");
    println!("💡 Tauri ビルド: cargo tauri build --features desktop");
    // Simulate 100 clicks on first hustle to demonstrate the engine is wired
    let id = game.config.hustles[0].id.clone();
    for _ in 0..100 {
        click(&game.config, &mut game.state, &id);
    }
    println!(
        "\n🧪 100 回クリックで稼げた額: ¥{:.0}",
        game.state.cash
    );
}

fn main() {
    #[cfg(feature = "desktop")]
    desktop::run();

    #[cfg(not(feature = "desktop"))]
    cli_smoke();
}
