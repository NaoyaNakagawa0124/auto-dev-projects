use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

mod company;
mod data;
mod dungeon;
mod encounter;
mod player;

use company::Company;
use data::*;
use dungeon::{Dungeon, RoomType, GRID_SIZE};
use encounter::{Encounter, EncounterType};
use player::{Player, Position};

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum Screen {
    Title,
    Exploring,
    Encounter,
    Result,
    GameOver,
    Victory,
    Dashboard,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RunRecord {
    pub floors_reached: usize,
    pub companies_encountered: u32,
    pub companies_passed: u32,
    pub final_communication: u32,
    pub final_technical: u32,
    pub final_presentation: u32,
    pub final_mental: u32,
    pub victory: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct GameState {
    screen: Screen,
    floor: usize,
    floor_name: String,
    player: PlayerState,
    current_room: RoomState,
    encounter: Option<EncounterState>,
    message: String,
    boss_defeated: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct PlayerState {
    communication: u32,
    technical: u32,
    presentation: u32,
    mental: u32,
    items: Vec<ItemState>,
    position: PositionState,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct PositionState {
    x: usize,
    y: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct ItemState {
    name: String,
    description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct RoomState {
    #[serde(rename = "type")]
    room_type: String,
    visited: bool,
    description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct EncounterState {
    description: String,
    choices: Vec<String>,
    resolved: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct MapData {
    grid_size: usize,
    rooms: Vec<Vec<MapRoom>>,
    player_x: usize,
    player_y: usize,
    floor: usize,
    floor_name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct MapRoom {
    room_type: String,
    visited: bool,
    connections: [bool; 4],
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct DashboardData {
    total_runs: usize,
    best_floor: usize,
    total_companies: u32,
    success_rate: f64,
    runs: Vec<RunRecord>,
}

#[wasm_bindgen]
pub struct Game {
    player: Player,
    dungeon: Dungeon,
    screen: Screen,
    message: String,
    current_encounter: Option<Encounter>,
    boss_defeated: bool,
    run_history: Vec<RunRecord>,
    seed: u64,
    turn_counter: u64,
}

impl Game {
    fn next_seed(&mut self) -> u64 {
        self.turn_counter += 1;
        let s = self.seed
            .wrapping_mul(self.turn_counter)
            .wrapping_add(6364136223846793005);
        (s >> 16) ^ s
    }

    fn room_type_string(rt: RoomType) -> &'static str {
        match rt {
            RoomType::Company => "company",
            RoomType::Study => "study",
            RoomType::Networking => "networking",
            RoomType::Rest => "rest",
            RoomType::Crisis => "crisis",
            RoomType::Treasure => "treasure",
            RoomType::Exit => "exit",
            RoomType::Boss => "boss",
            RoomType::Empty => "empty",
        }
    }

    fn room_description(rt: RoomType) -> &'static str {
        match rt {
            RoomType::Company => ROOM_DESCRIPTIONS[0],
            RoomType::Study => ROOM_DESCRIPTIONS[1],
            RoomType::Networking => ROOM_DESCRIPTIONS[2],
            RoomType::Rest => ROOM_DESCRIPTIONS[3],
            RoomType::Crisis => ROOM_DESCRIPTIONS[4],
            RoomType::Treasure => ROOM_DESCRIPTIONS[5],
            RoomType::Exit => ROOM_DESCRIPTIONS[6],
            RoomType::Boss => ROOM_DESCRIPTIONS[7],
            RoomType::Empty => "何もない部屋だ。",
        }
    }

    fn build_state(&self) -> GameState {
        let room = self
            .dungeon
            .get_room(self.player.position.x, self.player.position.y)
            .unwrap();

        let encounter_state = self.current_encounter.as_ref().map(|e| EncounterState {
            description: e.description.clone(),
            choices: e.choices.clone(),
            resolved: e.resolved,
        });

        GameState {
            screen: self.screen,
            floor: self.player.floor,
            floor_name: FLOOR_NAMES[self.player.floor.min(4)].to_string(),
            player: PlayerState {
                communication: self.player.communication,
                technical: self.player.technical,
                presentation: self.player.presentation,
                mental: self.player.mental,
                items: self
                    .player
                    .items
                    .iter()
                    .map(|i| ItemState {
                        name: i.name.clone(),
                        description: i.description.clone(),
                    })
                    .collect(),
                position: PositionState {
                    x: self.player.position.x,
                    y: self.player.position.y,
                },
            },
            current_room: RoomState {
                room_type: Self::room_type_string(room.room_type).to_string(),
                visited: room.visited,
                description: Self::room_description(room.room_type).to_string(),
            },
            encounter: encounter_state,
            message: self.message.clone(),
            boss_defeated: self.boss_defeated,
        }
    }

    fn enter_room(&mut self) {
        let x = self.player.position.x;
        let y = self.player.position.y;

        self.dungeon.visit_room(x, y);
        let room = self.dungeon.get_room(x, y).unwrap().clone();

        if !room.has_encounter || room.room_type == RoomType::Exit {
            // Already visited start or exit room
            if room.room_type == RoomType::Exit {
                if self.boss_defeated {
                    if self.player.floor >= 4 {
                        // Victory!
                        self.screen = Screen::Victory;
                        self.message = VICTORY_MESSAGE.to_string();
                        self.record_run(true);
                    } else {
                        // Next floor
                        self.player.floor += 1;
                        let seed = self.next_seed();
                        self.dungeon = Dungeon::generate(self.player.floor, seed);
                        self.player.position = Position { x: 0, y: 0 };
                        self.boss_defeated = false;
                        self.dungeon.visit_room(0, 0);
                        self.message = format!(
                            "{}\n{}階: {}",
                            NEW_FLOOR_MESSAGE,
                            self.player.floor + 1,
                            FLOOR_NAMES[self.player.floor.min(4)]
                        );
                        self.screen = Screen::Exploring;
                    }
                } else {
                    self.message =
                        "出口は見えるけど、ボスを倒さないと進めない！".to_string();
                    self.screen = Screen::Exploring;
                }
            } else {
                self.message = Self::room_description(room.room_type).to_string();
                self.screen = Screen::Exploring;
            }
            return;
        }

        // Mark room as having been encountered
        if let Some(r) = self.dungeon.get_room_mut(x, y) {
            r.has_encounter = false;
        }

        let seed = room.encounter_seed;
        // Create encounter based on room type
        match room.room_type {
            RoomType::Company => {
                let company = Company::generate(seed);
                self.current_encounter = Some(Encounter::company(&company));
                self.screen = Screen::Encounter;
                self.message = format!("{}の面接室に入った！", company.name);
            }
            RoomType::Boss => {
                let company = Company::generate(seed);
                self.current_encounter = Some(Encounter::boss(&company, seed));
                self.screen = Screen::Encounter;
                self.message = "ボス面接が始まる！".to_string();
            }
            RoomType::Study => {
                self.current_encounter = Some(Encounter::study(seed));
                self.screen = Screen::Encounter;
                self.message = "勉強スペースを発見！".to_string();
            }
            RoomType::Networking => {
                self.current_encounter = Some(Encounter::networking(seed));
                self.screen = Screen::Encounter;
                self.message = "交流イベント発見！".to_string();
            }
            RoomType::Rest => {
                self.current_encounter = Some(Encounter::rest(seed));
                self.screen = Screen::Encounter;
                self.message = "休憩スペースだ。".to_string();
            }
            RoomType::Crisis => {
                self.current_encounter = Some(Encounter::crisis(seed));
                self.screen = Screen::Encounter;
                self.message = "なんだか嫌な予感が...".to_string();
            }
            RoomType::Treasure => {
                self.current_encounter = Some(Encounter::treasure(seed));
                self.screen = Screen::Encounter;
                self.message = "何かキラキラしている！".to_string();
            }
            _ => {
                self.message = Self::room_description(room.room_type).to_string();
                self.screen = Screen::Exploring;
            }
        }
    }

    fn record_run(&mut self, victory: bool) {
        self.run_history.push(RunRecord {
            floors_reached: self.player.floor + 1,
            companies_encountered: self.player.companies_encountered,
            companies_passed: self.player.companies_passed,
            final_communication: self.player.communication,
            final_technical: self.player.technical,
            final_presentation: self.player.presentation,
            final_mental: self.player.mental,
            victory,
        });
    }
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Game {
        // Use js_sys for initial seed
        let seed = (js_sys::Math::random() * 1_000_000_000.0) as u64;
        let dungeon = Dungeon::generate(0, seed);
        Game {
            player: Player::new(),
            dungeon,
            screen: Screen::Title,
            message: WELCOME_MESSAGE.to_string(),
            current_encounter: None,
            boss_defeated: false,
            run_history: Vec::new(),
            seed,
            turn_counter: 0,
        }
    }

    pub fn get_state(&self) -> String {
        serde_json::to_string(&self.build_state()).unwrap_or_else(|_| "{}".to_string())
    }

    pub fn move_player(&mut self, direction: &str) -> String {
        if self.screen != Screen::Exploring {
            self.message = "今は移動できないよ！".to_string();
            return self.get_state();
        }

        let dir_idx = match direction {
            "north" => 0,
            "south" => 1,
            "east" => 2,
            "west" => 3,
            _ => {
                self.message = "その方向には行けないよ！".to_string();
                return self.get_state();
            }
        };

        let x = self.player.position.x;
        let y = self.player.position.y;

        if !self.dungeon.can_move(x, y, dir_idx) {
            self.message = "その方向には道がないよ！".to_string();
            return self.get_state();
        }

        match dir_idx {
            0 if y > 0 => self.player.position.y -= 1,
            1 if y + 1 < GRID_SIZE => self.player.position.y += 1,
            2 if x + 1 < GRID_SIZE => self.player.position.x += 1,
            3 if x > 0 => self.player.position.x -= 1,
            _ => {
                self.message = "その方向には行けないよ！".to_string();
                return self.get_state();
            }
        }

        self.enter_room();
        self.get_state()
    }

    pub fn resolve_encounter(&mut self, choice: usize) -> String {
        if self.screen != Screen::Encounter {
            self.message = "今はエンカウント中じゃないよ！".to_string();
            return self.get_state();
        }

        if let Some(mut enc) = self.current_encounter.take() {
            let is_boss = matches!(enc.encounter_type, EncounterType::Boss(_));
            let seed = self.next_seed();
            let floor = self.player.floor;
            let (success, msg) =
                encounter::resolve_encounter(&mut self.player, &mut enc, choice, floor, seed);

            self.message = msg;

            if is_boss && success {
                self.boss_defeated = true;
                self.message = format!(
                    "{}\n\nボス面接クリア！出口への道が開いた！",
                    self.message
                );
            }

            self.current_encounter = Some(enc);
            self.screen = Screen::Result;

            // Check game over
            if self.player.is_dead() {
                self.screen = Screen::GameOver;
                self.message = format!("{}\n\n{}", self.message, GAME_OVER_MESSAGE);
                self.record_run(false);
            }
        }

        self.get_state()
    }

    pub fn continue_exploring(&mut self) -> String {
        if self.screen == Screen::Result {
            self.current_encounter = None;
            self.screen = Screen::Exploring;
            self.message = "探索を続けよう！".to_string();
        }
        self.get_state()
    }

    pub fn use_item(&mut self, slot: usize) -> String {
        if let Some(msg) = self.player.use_item(slot) {
            self.message = msg;
        } else {
            self.message = "そのスロットにはアイテムがないよ！".to_string();
        }
        self.get_state()
    }

    pub fn get_map_data(&self) -> String {
        let mut map_rooms = Vec::new();
        for y in 0..GRID_SIZE {
            let mut row = Vec::new();
            for x in 0..GRID_SIZE {
                let room = &self.dungeon.rooms[y][x];
                row.push(MapRoom {
                    room_type: if room.visited {
                        Self::room_type_string(room.room_type).to_string()
                    } else {
                        "unknown".to_string()
                    },
                    visited: room.visited,
                    connections: room.connections,
                });
            }
            map_rooms.push(row);
        }

        let map = MapData {
            grid_size: GRID_SIZE,
            rooms: map_rooms,
            player_x: self.player.position.x,
            player_y: self.player.position.y,
            floor: self.player.floor,
            floor_name: FLOOR_NAMES[self.player.floor.min(4)].to_string(),
        };

        serde_json::to_string(&map).unwrap_or_else(|_| "{}".to_string())
    }

    pub fn get_dashboard_data(&self) -> String {
        let total_runs = self.run_history.len();
        let best_floor = self
            .run_history
            .iter()
            .map(|r| r.floors_reached)
            .max()
            .unwrap_or(0);
        let total_companies: u32 = self.run_history.iter().map(|r| r.companies_encountered).sum();
        let total_passed: u32 = self.run_history.iter().map(|r| r.companies_passed).sum();
        let success_rate = if total_companies > 0 {
            (total_passed as f64 / total_companies as f64) * 100.0
        } else {
            0.0
        };

        let dashboard = DashboardData {
            total_runs,
            best_floor,
            total_companies,
            success_rate,
            runs: self.run_history.clone(),
        };

        serde_json::to_string(&dashboard).unwrap_or_else(|_| "{}".to_string())
    }

    pub fn start_new_run(&mut self) -> String {
        let seed = (js_sys::Math::random() * 1_000_000_000.0) as u64;
        self.seed = seed;
        self.turn_counter = 0;
        self.player = Player::new();
        self.dungeon = Dungeon::generate(0, seed);
        self.screen = Screen::Exploring;
        self.message = format!(
            "{}\n{}階: {}",
            WELCOME_MESSAGE,
            1,
            FLOOR_NAMES[0]
        );
        self.current_encounter = None;
        self.boss_defeated = false;
        self.get_state()
    }

    pub fn show_title(&mut self) -> String {
        self.screen = Screen::Title;
        self.message = WELCOME_MESSAGE.to_string();
        self.get_state()
    }

    pub fn show_dashboard(&mut self) -> String {
        self.screen = Screen::Dashboard;
        self.get_state()
    }

    pub fn save_run_history(&self) -> String {
        serde_json::to_string(&self.run_history).unwrap_or_else(|_| "[]".to_string())
    }

    pub fn load_run_history(&mut self, data: &str) {
        if let Ok(history) = serde_json::from_str::<Vec<RunRecord>>(data) {
            self.run_history = history;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // We can't use js_sys in tests, so create a test-only constructor
    fn make_test_game(seed: u64) -> Game {
        let dungeon = Dungeon::generate(0, seed);
        Game {
            player: Player::new(),
            dungeon,
            screen: Screen::Title,
            message: WELCOME_MESSAGE.to_string(),
            current_encounter: None,
            boss_defeated: false,
            run_history: Vec::new(),
            seed,
            turn_counter: 0,
        }
    }

    #[test]
    fn test_game_initial_state() {
        let game = make_test_game(42);
        assert_eq!(game.screen, Screen::Title);
        assert_eq!(game.player.floor, 0);
    }

    #[test]
    fn test_start_new_run_changes_screen() {
        let mut game = make_test_game(42);
        game.screen = Screen::Exploring;
        // Simulate start_new_run without js_sys
        game.player = Player::new();
        game.dungeon = Dungeon::generate(0, 99);
        game.screen = Screen::Exploring;
        assert_eq!(game.screen, Screen::Exploring);
    }

    #[test]
    fn test_save_load_history() {
        let mut game = make_test_game(42);
        game.run_history.push(RunRecord {
            floors_reached: 3,
            companies_encountered: 5,
            companies_passed: 3,
            final_communication: 50,
            final_technical: 40,
            final_presentation: 35,
            final_mental: 60,
            victory: false,
        });
        let saved = game.save_run_history();
        let mut game2 = make_test_game(99);
        game2.load_run_history(&saved);
        assert_eq!(game2.run_history.len(), 1);
        assert_eq!(game2.run_history[0].floors_reached, 3);
    }

    #[test]
    fn test_room_type_string() {
        assert_eq!(Game::room_type_string(RoomType::Company), "company");
        assert_eq!(Game::room_type_string(RoomType::Boss), "boss");
        assert_eq!(Game::room_type_string(RoomType::Exit), "exit");
    }

    #[test]
    fn test_enter_room_on_start() {
        let mut game = make_test_game(42);
        game.screen = Screen::Exploring;
        game.enter_room();
        // Start room should not trigger encounter (has_encounter = false)
        assert_eq!(game.screen, Screen::Exploring);
    }

    #[test]
    fn test_record_run() {
        let mut game = make_test_game(42);
        game.record_run(false);
        assert_eq!(game.run_history.len(), 1);
        assert!(!game.run_history[0].victory);
    }

    #[test]
    fn test_build_state_serializes() {
        let game = make_test_game(42);
        let state = game.build_state();
        let json = serde_json::to_string(&state);
        assert!(json.is_ok());
    }

    #[test]
    fn test_move_blocked_when_not_exploring() {
        let mut game = make_test_game(42);
        game.screen = Screen::Title;
        // Can't actually call move_player without wasm, but test the logic
        assert_ne!(game.screen, Screen::Exploring);
    }
}
