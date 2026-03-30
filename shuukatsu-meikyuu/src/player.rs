use serde::{Deserialize, Serialize};
use crate::company::StatType;
use crate::data::ITEM_NAMES;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Player {
    pub communication: u32,
    pub technical: u32,
    pub presentation: u32,
    pub mental: u32,
    pub items: Vec<Item>,
    pub position: Position,
    pub floor: usize,
    pub companies_encountered: u32,
    pub companies_passed: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Position {
    pub x: usize,
    pub y: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Item {
    pub id: usize,
    pub name: String,
    pub description: String,
    pub used: bool,
}

impl Item {
    pub fn from_id(id: usize) -> Item {
        let (name, desc) = ITEM_NAMES[id];
        Item {
            id,
            name: name.to_string(),
            description: desc.to_string(),
            used: false,
        }
    }

    pub fn random(seed: u64) -> Item {
        let id = (seed % ITEM_NAMES.len() as u64) as usize;
        Item::from_id(id)
    }
}

impl Player {
    pub fn new() -> Player {
        Player {
            communication: 30,
            technical: 25,
            presentation: 20,
            mental: 80,
            items: Vec::new(),
            position: Position { x: 0, y: 0 },
            floor: 0,
            companies_encountered: 0,
            companies_passed: 0,
        }
    }

    pub fn get_stat(&self, stat: StatType) -> u32 {
        match stat {
            StatType::Communication => self.communication,
            StatType::Technical => self.technical,
            StatType::Presentation => self.presentation,
        }
    }

    pub fn boost_stat(&mut self, stat: StatType, amount: u32) {
        match stat {
            StatType::Communication => {
                self.communication = (self.communication + amount).min(100);
            }
            StatType::Technical => {
                self.technical = (self.technical + amount).min(100);
            }
            StatType::Presentation => {
                self.presentation = (self.presentation + amount).min(100);
            }
        }
    }

    pub fn boost_random_stat(&mut self, amount: u32, seed: u64) -> StatType {
        let stat = match seed % 3 {
            0 => StatType::Communication,
            1 => StatType::Technical,
            _ => StatType::Presentation,
        };
        self.boost_stat(stat, amount);
        stat
    }

    pub fn drain_mental(&mut self, amount: u32) {
        if amount >= self.mental {
            self.mental = 0;
        } else {
            self.mental -= amount;
        }
    }

    pub fn restore_mental(&mut self, amount: u32) {
        self.mental = (self.mental + amount).min(100);
    }

    pub fn is_dead(&self) -> bool {
        self.mental == 0
    }

    pub fn add_item(&mut self, item: Item) -> bool {
        if self.items.len() >= 3 {
            return false;
        }
        self.items.push(item);
        true
    }

    pub fn remove_item(&mut self, slot: usize) -> Option<Item> {
        if slot < self.items.len() {
            Some(self.items.remove(slot))
        } else {
            None
        }
    }

    pub fn has_item(&self, id: usize) -> bool {
        self.items.iter().any(|i| i.id == id && !i.used)
    }

    /// Use an item by slot index. Returns the item effect description.
    pub fn use_item(&mut self, slot: usize) -> Option<String> {
        if slot >= self.items.len() {
            return None;
        }
        let item = self.items.remove(slot);
        let msg = match item.id {
            0 => {
                // 完璧なES - handled in encounter
                "完璧なESを使った！次の企業面接で+20！".to_string()
            }
            1 => {
                // ポートフォリオ - handled in encounter
                "ポートフォリオを準備した！技術チェックで+15！".to_string()
            }
            2 => {
                // 推薦状 - handled in encounter
                "推薦状を用意した！次の面接で全ステータス+10！".to_string()
            }
            3 => {
                // エナジードリンク
                self.restore_mental(30);
                "エナジードリンクを飲んだ！メンタル+30回復！".to_string()
            }
            4 => {
                // 自己分析ノート - handled in encounter
                "自己分析ノートを読み返した！表現力+10！".to_string()
            }
            5 => {
                // OB訪問の名刺 - handled in encounter
                "OB訪問の名刺を使った！面接をスキップ！".to_string()
            }
            _ => "アイテムを使った！".to_string(),
        };
        Some(msg)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_player_new() {
        let p = Player::new();
        assert_eq!(p.communication, 30);
        assert_eq!(p.technical, 25);
        assert_eq!(p.presentation, 20);
        assert_eq!(p.mental, 80);
        assert!(p.items.is_empty());
        assert_eq!(p.position, Position { x: 0, y: 0 });
    }

    #[test]
    fn test_stat_clamped_at_100() {
        let mut p = Player::new();
        p.boost_stat(StatType::Communication, 200);
        assert_eq!(p.communication, 100);
    }

    #[test]
    fn test_mental_drain_floor_zero() {
        let mut p = Player::new();
        p.drain_mental(200);
        assert_eq!(p.mental, 0);
        assert!(p.is_dead());
    }

    #[test]
    fn test_mental_restore_capped() {
        let mut p = Player::new();
        p.restore_mental(50);
        assert_eq!(p.mental, 100);
    }

    #[test]
    fn test_inventory_max_three() {
        let mut p = Player::new();
        assert!(p.add_item(Item::from_id(0)));
        assert!(p.add_item(Item::from_id(1)));
        assert!(p.add_item(Item::from_id(2)));
        assert!(!p.add_item(Item::from_id(3))); // 4th fails
        assert_eq!(p.items.len(), 3);
    }

    #[test]
    fn test_remove_item() {
        let mut p = Player::new();
        p.add_item(Item::from_id(0));
        p.add_item(Item::from_id(1));
        let removed = p.remove_item(0).unwrap();
        assert_eq!(removed.id, 0);
        assert_eq!(p.items.len(), 1);
    }

    #[test]
    fn test_remove_item_invalid_slot() {
        let mut p = Player::new();
        assert!(p.remove_item(5).is_none());
    }

    #[test]
    fn test_use_energy_drink() {
        let mut p = Player::new();
        p.mental = 50;
        p.add_item(Item::from_id(3));
        let msg = p.use_item(0);
        assert!(msg.is_some());
        assert_eq!(p.mental, 80);
        assert!(p.items.is_empty());
    }

    #[test]
    fn test_boost_random_stat() {
        let mut p = Player::new();
        let stat = p.boost_random_stat(10, 0);
        assert_eq!(stat, StatType::Communication);
        assert_eq!(p.communication, 40);
    }

    #[test]
    fn test_has_item() {
        let mut p = Player::new();
        assert!(!p.has_item(0));
        p.add_item(Item::from_id(0));
        assert!(p.has_item(0));
    }

    #[test]
    fn test_get_stat() {
        let p = Player::new();
        assert_eq!(p.get_stat(StatType::Communication), 30);
        assert_eq!(p.get_stat(StatType::Technical), 25);
        assert_eq!(p.get_stat(StatType::Presentation), 20);
    }

    #[test]
    fn test_drain_exact_mental() {
        let mut p = Player::new();
        p.mental = 10;
        p.drain_mental(10);
        assert_eq!(p.mental, 0);
        assert!(p.is_dead());
    }
}
