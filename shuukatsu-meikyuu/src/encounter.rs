use serde::{Deserialize, Serialize};
use crate::company::{Company, StatType};
use crate::data::*;
use crate::player::{Item, Player};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Encounter {
    pub encounter_type: EncounterType,
    pub description: String,
    pub choices: Vec<String>,
    pub resolved: bool,
    pub result_message: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum EncounterType {
    Company(CompanyEncounter),
    Study,
    Networking,
    Rest,
    Crisis,
    Treasure,
    Boss(CompanyEncounter),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CompanyEncounter {
    pub company_name: String,
    pub company_industry: String,
    pub company_size: String,
    pub primary_stat: StatType,
    pub difficulty_mod: i32,
}

impl From<&Company> for CompanyEncounter {
    fn from(c: &Company) -> Self {
        CompanyEncounter {
            company_name: c.name.clone(),
            company_industry: c.industry.clone(),
            company_size: c.size.clone(),
            primary_stat: c.primary_stat,
            difficulty_mod: c.difficulty_mod,
        }
    }
}

impl Encounter {
    pub fn company(company: &Company) -> Encounter {
        Encounter {
            encounter_type: EncounterType::Company(CompanyEncounter::from(company)),
            description: format!(
                "{}の面接が始まる！\n{}",
                company.name,
                company.description()
            ),
            choices: vec![
                "全力で挑む！".to_string(),
                "慎重に行こう".to_string(),
            ],
            resolved: false,
            result_message: String::new(),
        }
    }

    pub fn boss(company: &Company, seed: u64) -> Encounter {
        let intro_idx = (seed % BOSS_INTRO_MESSAGES.len() as u64) as usize;
        Encounter {
            encounter_type: EncounterType::Boss(CompanyEncounter::from(company)),
            description: format!(
                "【ボス面接】{}\n{}\n{}",
                company.name,
                company.description(),
                BOSS_INTRO_MESSAGES[intro_idx]
            ),
            choices: vec![
                "全力で挑む！".to_string(),
                "落ち着いて、自分らしく".to_string(),
            ],
            resolved: false,
            result_message: String::new(),
        }
    }

    pub fn study(seed: u64) -> Encounter {
        let msg_idx = (seed % STUDY_MESSAGES.len() as u64) as usize;
        Encounter {
            encounter_type: EncounterType::Study,
            description: "勉強スペースを見つけた！何を勉強する？".to_string(),
            choices: vec![
                "コミュニケーション練習".to_string(),
                "技術の勉強".to_string(),
                "プレゼン練習".to_string(),
            ],
            resolved: false,
            result_message: STUDY_MESSAGES[msg_idx].to_string(),
        }
    }

    pub fn networking(seed: u64) -> Encounter {
        let msg_idx = (seed % NETWORKING_MESSAGES.len() as u64) as usize;
        Encounter {
            encounter_type: EncounterType::Networking,
            description: "交流イベントが開催されている！参加しよう！".to_string(),
            choices: vec![
                "積極的に話しかける".to_string(),
                "様子を見ながら参加".to_string(),
            ],
            resolved: false,
            result_message: NETWORKING_MESSAGES[msg_idx].to_string(),
        }
    }

    pub fn rest(seed: u64) -> Encounter {
        let msg_idx = (seed % REST_MESSAGES.len() as u64) as usize;
        Encounter {
            encounter_type: EncounterType::Rest,
            description: "休憩スペースがある。少し休もうか？".to_string(),
            choices: vec![
                "ゆっくり休む".to_string(),
                "軽く休憩".to_string(),
            ],
            resolved: false,
            result_message: REST_MESSAGES[msg_idx].to_string(),
        }
    }

    pub fn crisis(seed: u64) -> Encounter {
        let msg_idx = (seed % CRISIS_MESSAGES.len() as u64) as usize;
        Encounter {
            encounter_type: EncounterType::Crisis,
            description: CRISIS_MESSAGES[msg_idx].to_string(),
            choices: vec![
                "気持ちを切り替える".to_string(),
                "落ち込むけど前に進む".to_string(),
            ],
            resolved: false,
            result_message: String::new(),
        }
    }

    pub fn treasure(seed: u64) -> Encounter {
        let msg_idx = (seed % TREASURE_MESSAGES.len() as u64) as usize;
        Encounter {
            encounter_type: EncounterType::Treasure,
            description: TREASURE_MESSAGES[msg_idx].to_string(),
            choices: vec![
                "拾う！".to_string(),
            ],
            resolved: false,
            result_message: String::new(),
        }
    }
}

/// Resolve an encounter. Returns (success, message, stat_changes_description).
pub fn resolve_encounter(
    player: &mut Player,
    encounter: &mut Encounter,
    choice: usize,
    floor: usize,
    seed: u64,
) -> (bool, String) {
    if encounter.resolved {
        return (true, "もう解決済みだよ。".to_string());
    }
    encounter.resolved = true;

    // Clone encounter_type to avoid borrow conflict
    let enc_type = encounter.encounter_type.clone();
    match &enc_type {
        EncounterType::Company(ce) | EncounterType::Boss(ce) => {
            resolve_company_encounter(player, ce, encounter, choice, floor, seed)
        }
        EncounterType::Study => {
            let stat = match choice {
                0 => StatType::Communication,
                1 => StatType::Technical,
                _ => StatType::Presentation,
            };
            let amount = 5 + (seed % 11) as u32; // 5-15
            player.boost_stat(stat, amount);
            let stat_name = STAT_NAMES[choice.min(2)];
            let msg = format!(
                "{}\n{}が{}アップした！",
                encounter.result_message, stat_name, amount
            );
            (true, msg)
        }
        EncounterType::Networking => {
            // Chance for stat boost or item
            let boost = 3 + (seed % 8) as u32; // 3-10
            let stat = player.boost_random_stat(boost, seed / 7);
            let stat_name = match stat {
                StatType::Communication => "コミュ力",
                StatType::Technical => "技術力",
                StatType::Presentation => "表現力",
            };

            // 30% chance for item
            let mut msg = format!(
                "{}\n{}が{}アップ！",
                encounter.result_message, stat_name, boost
            );
            if seed % 3 == 0 {
                let item = Item::random(seed / 5);
                let item_name = item.name.clone();
                if player.add_item(item) {
                    msg = format!("{}\nさらに「{}」を手に入れた！", msg, item_name);
                }
            }
            (true, msg)
        }
        EncounterType::Rest => {
            let amount = 10 + (seed % 11) as u32; // 10-20
            player.restore_mental(amount);
            let msg = format!(
                "{}\nメンタルが{}回復した！",
                encounter.result_message, amount
            );
            (true, msg)
        }
        EncounterType::Crisis => {
            let drain = 5 + (seed % 11) as u32; // 5-15
            player.drain_mental(drain);
            let mut msg = format!(
                "{}\nメンタルが{}ダウン...",
                encounter.description, drain
            );
            // 20% chance to lose item
            if seed % 5 == 0 && !player.items.is_empty() {
                let slot = (seed as usize / 3) % player.items.len();
                let item = player.remove_item(slot).unwrap();
                msg = format!("{}\n「{}」を失ってしまった...", msg, item.name);
            }
            msg = format!("{}\nでも大丈夫、前を向いて進もう！", msg);
            (false, msg)
        }
        EncounterType::Treasure => {
            let item = Item::random(seed);
            let item_name = item.name.clone();
            if player.add_item(item) {
                let msg = format!("「{}」を手に入れた！", item_name);
                (true, msg)
            } else {
                (true, "持ち物がいっぱいだ！何かを捨てないと...".to_string())
            }
        }
    }
}

fn resolve_company_encounter(
    player: &mut Player,
    ce: &CompanyEncounter,
    encounter: &mut Encounter,
    _choice: usize,
    floor: usize,
    seed: u64,
) -> (bool, String) {
    let is_boss = matches!(encounter.encounter_type, EncounterType::Boss(_));

    player.companies_encountered += 1;

    let base_stat = player.get_stat(ce.primary_stat);
    let mental_bonus = player.mental / 10; // 0-10
    let random_roll = (seed % 21) as u32; // 0-20
    let threshold = FLOOR_THRESHOLDS[floor.min(4)];

    // Apply item bonuses
    let mut item_bonus: i32 = 0;
    // Check for reference letter (id 2) - +10 all
    if player.has_item(2) {
        item_bonus += 10;
    }
    // Check for Perfect ES (id 0) - +20 for company encounters
    if player.has_item(0) {
        item_bonus += 20;
    }
    // Check for portfolio (id 1) - +15 for technical
    if ce.primary_stat == StatType::Technical && player.has_item(1) {
        item_bonus += 15;
    }
    // Check for self-analysis notes (id 4) - +10 presentation
    if ce.primary_stat == StatType::Presentation && player.has_item(4) {
        item_bonus += 10;
    }

    let roll = base_stat as i32 + mental_bonus as i32 + random_roll as i32
        + item_bonus + ce.difficulty_mod;
    let boss_threshold = if is_boss {
        threshold as i32 + 10
    } else {
        threshold as i32
    };

    let success = roll >= boss_threshold;

    let msg_idx = (seed / 3) as usize;
    if success {
        player.companies_passed += 1;
        let boost = 3 + (seed % 6) as u32; // 3-8
        player.boost_stat(ce.primary_stat, boost);
        let success_msg = ENCOUNTER_SUCCESS_MESSAGES[msg_idx % ENCOUNTER_SUCCESS_MESSAGES.len()];
        let stat_name = match ce.primary_stat {
            StatType::Communication => "コミュ力",
            StatType::Technical => "技術力",
            StatType::Presentation => "表現力",
        };
        let msg = format!(
            "{}の面接に合格！\n{}\n{}が{}アップ！\n（判定: {} vs {} = {}）",
            ce.company_name, success_msg, stat_name, boost, roll, boss_threshold,
            if success { "成功" } else { "失敗" }
        );
        encounter.result_message = msg.clone();
        (true, msg)
    } else {
        let drain = 8 + (seed % 8) as u32; // 8-15
        player.drain_mental(drain);
        let fail_msg = ENCOUNTER_FAILURE_MESSAGES[msg_idx % ENCOUNTER_FAILURE_MESSAGES.len()];
        let msg = format!(
            "{}の面接は不合格...\n{}\nメンタルが{}ダウン\n（判定: {} vs {} = {}）",
            ce.company_name, fail_msg, drain, roll, boss_threshold,
            if success { "成功" } else { "失敗" }
        );
        encounter.result_message = msg.clone();
        (false, msg)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_study_encounter_boosts_stat() {
        let mut player = Player::new();
        let mut enc = Encounter::study(42);
        let old_comm = player.communication;
        let (success, _msg) = resolve_encounter(&mut player, &mut enc, 0, 0, 42);
        assert!(success);
        assert!(player.communication > old_comm);
    }

    #[test]
    fn test_rest_encounter_restores_mental() {
        let mut player = Player::new();
        player.mental = 50;
        let mut enc = Encounter::rest(42);
        let (success, _msg) = resolve_encounter(&mut player, &mut enc, 0, 0, 42);
        assert!(success);
        assert!(player.mental > 50);
    }

    #[test]
    fn test_crisis_encounter_drains_mental() {
        let mut player = Player::new();
        let old_mental = player.mental;
        let mut enc = Encounter::crisis(42);
        let (success, _msg) = resolve_encounter(&mut player, &mut enc, 0, 0, 42);
        assert!(!success);
        assert!(player.mental < old_mental);
    }

    #[test]
    fn test_treasure_encounter_gives_item() {
        let mut player = Player::new();
        let mut enc = Encounter::treasure(42);
        let (success, _msg) = resolve_encounter(&mut player, &mut enc, 0, 0, 42);
        assert!(success);
        assert_eq!(player.items.len(), 1);
    }

    #[test]
    fn test_treasure_full_inventory() {
        let mut player = Player::new();
        player.add_item(Item::from_id(0));
        player.add_item(Item::from_id(1));
        player.add_item(Item::from_id(2));
        let mut enc = Encounter::treasure(42);
        let (_success, msg) = resolve_encounter(&mut player, &mut enc, 0, 0, 42);
        assert!(msg.contains("いっぱい"));
        assert_eq!(player.items.len(), 3);
    }

    #[test]
    fn test_encounter_cannot_resolve_twice() {
        let mut player = Player::new();
        let mut enc = Encounter::study(42);
        resolve_encounter(&mut player, &mut enc, 0, 0, 42);
        let (_, msg) = resolve_encounter(&mut player, &mut enc, 0, 0, 42);
        assert!(msg.contains("解決済み"));
    }

    #[test]
    fn test_company_encounter_tracks_count() {
        let mut player = Player::new();
        let company = Company::generate(42);
        let mut enc = Encounter::company(&company);
        resolve_encounter(&mut player, &mut enc, 0, 0, 42);
        assert_eq!(player.companies_encountered, 1);
    }
}
