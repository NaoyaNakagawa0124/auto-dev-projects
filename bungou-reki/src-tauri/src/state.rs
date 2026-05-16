use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct PlayerState {
    /// プレイヤーが召喚した作家ID。
    pub collection: Vec<String>,
    /// 作家ID→ XP。読書や対戦勝利で増える。
    #[serde(default)]
    pub xp: HashMap<String, u32>,
    /// 読書ログ。
    #[serde(default)]
    pub reading: Vec<ReadingEntry>,
    /// 対戦履歴。
    #[serde(default)]
    pub battles: Vec<BattleRecord>,
    /// 「今日の召喚」を完了した日付 (ISO)。1日1回制限の根拠。
    #[serde(default)]
    pub recruited_dates: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReadingEntry {
    pub author_id: String,
    pub title: String,
    pub pages: u32,
    /// ISO 日付
    pub date: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BattleRecord {
    pub date: String,
    pub player_won: bool,
    pub player_wins: u32,
    pub opponent_wins: u32,
    pub xp_gained: u32,
}

impl PlayerState {
    /// 作家IDにXPを加算。
    pub fn add_xp(&mut self, author_id: &str, amount: u32) {
        *self.xp.entry(author_id.to_string()).or_insert(0) += amount;
    }

    /// XPからレベルを算出 (XP 100で +1)。
    pub fn level_for(&self, author_id: &str) -> u32 {
        1 + self.xp.get(author_id).copied().unwrap_or(0) / 100
    }

    /// 召喚済みかどうか。
    pub fn has_recruited_on(&self, date_iso: &str) -> bool {
        self.recruited_dates.iter().any(|d| d == date_iso)
    }

    /// 作家をコレクションに追加 (重複は無視)。
    pub fn recruit(&mut self, author_id: &str, date_iso: &str) -> Result<(), String> {
        if self.has_recruited_on(date_iso) {
            return Err("本日は既に召喚済みです".to_string());
        }
        if !self.collection.iter().any(|id| id == author_id) {
            self.collection.push(author_id.to_string());
        }
        self.recruited_dates.push(date_iso.to_string());
        Ok(())
    }

    /// 読書ログを追加し、対象作家にXPを付与する。
    /// 戻り値は付与されたXP量。
    pub fn log_reading(&mut self, author_id: &str, title: &str, pages: u32, date_iso: &str) -> u32 {
        let xp = std::cmp::max(5, pages / 4); // 4ページ=1XP, 最低5XP
        self.reading.push(ReadingEntry {
            author_id: author_id.to_string(),
            title: title.to_string(),
            pages,
            date: date_iso.to_string(),
        });
        self.add_xp(author_id, xp);
        xp
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn recruit_locks_for_the_day() {
        let mut s = PlayerState::default();
        s.recruit("soseki", "2026-05-16").unwrap();
        assert!(s.recruit("akutagawa", "2026-05-16").is_err());
        assert!(s.recruit("dazai", "2026-05-17").is_ok());
    }

    #[test]
    fn log_reading_awards_xp() {
        let mut s = PlayerState::default();
        let xp = s.log_reading("soseki", "こころ", 200, "2026-05-16");
        assert_eq!(xp, 50);
        assert_eq!(s.xp["soseki"], 50);
        assert_eq!(s.level_for("soseki"), 1);

        s.log_reading("soseki", "坊っちゃん", 240, "2026-05-17");
        // +60 XP → 110 total → level 2
        assert_eq!(s.level_for("soseki"), 2);
    }

    #[test]
    fn short_reading_still_gives_min_xp() {
        let mut s = PlayerState::default();
        let xp = s.log_reading("dazai", "走れメロス", 10, "2026-05-16");
        assert_eq!(xp, 5); // 10/4=2, but min is 5
    }

    #[test]
    fn recruit_dedups_collection() {
        let mut s = PlayerState::default();
        s.recruit("soseki", "2026-05-16").unwrap();
        // 翌日に同じ作家を召喚しようとしてもコレクションは重複しない
        s.recruit("soseki", "2026-05-17").unwrap();
        assert_eq!(s.collection.len(), 1);
    }

    #[test]
    fn json_roundtrip() {
        let mut s = PlayerState::default();
        s.recruit("soseki", "2026-05-16").unwrap();
        s.log_reading("soseki", "こころ", 200, "2026-05-16");
        let json = serde_json::to_string(&s).unwrap();
        let back: PlayerState = serde_json::from_str(&json).unwrap();
        assert_eq!(back.collection, s.collection);
        assert_eq!(back.xp.get("soseki"), s.xp.get("soseki"));
    }
}
