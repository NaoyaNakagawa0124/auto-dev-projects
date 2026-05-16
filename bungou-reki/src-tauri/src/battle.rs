use serde::{Deserialize, Serialize};

use crate::data::{Author, StatAxis};

/// 各ラウンドの軸（3 ラウンドあらかじめ決まる）。
const ROUND_AXES: [StatAxis; 3] = [StatAxis::Literary, StatAxis::Prolific, StatAxis::Influence];

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum RoundOutcome {
    Win,
    Loss,
    Draw,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BattleRound {
    pub axis: StatAxis,
    pub axis_label: String,
    pub player_card: Author,
    pub player_value: u32,
    pub opponent_card: Author,
    pub opponent_value: u32,
    pub outcome: RoundOutcome,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BattleResult {
    pub rounds: Vec<BattleRound>,
    pub player_wins: u32,
    pub opponent_wins: u32,
    pub player_won: bool,
    pub xp_gained: u32,
    /// プレイヤー側で勝利したカードのID（XP付与対象）
    pub xp_targets: Vec<String>,
}

/// カード単体の総合スコア。0-396 (各軸の合計)。
pub fn score_card(author: &Author) -> u32 {
    author.stats.total()
}

/// シード値を元に対戦相手の3枚デッキを決定論的に組み立てる。
/// 同じシード→同じ相手。日付ベースで「本日の挑戦者」が安定する。
pub fn opponent_for_seed(authors: &[Author], seed: u64, exclude: &[String]) -> Vec<Author> {
    if authors.is_empty() {
        return Vec::new();
    }
    let mut deck = Vec::new();
    let mut state = seed.wrapping_mul(0x9E3779B97F4A7C15).wrapping_add(1);
    let mut attempts = 0;
    while deck.len() < 3 && attempts < authors.len() * 4 {
        // xorshift風の簡易PRNG
        state ^= state << 13;
        state ^= state >> 7;
        state ^= state << 17;
        let idx = (state as usize) % authors.len();
        let candidate = &authors[idx];
        if exclude.iter().any(|id| id == &candidate.id) {
            attempts += 1;
            continue;
        }
        if deck.iter().any(|a: &Author| a.id == candidate.id) {
            attempts += 1;
            continue;
        }
        deck.push(candidate.clone());
        attempts += 1;
    }
    // 万一足りない時はexcludeを無視して埋める
    let mut idx = 0;
    while deck.len() < 3 && idx < authors.len() {
        let candidate = &authors[idx];
        if !deck.iter().any(|a| a.id == candidate.id) {
            deck.push(candidate.clone());
        }
        idx += 1;
    }
    deck
}

/// 3ラウンドの対戦を解決する。プレイヤー・相手それぞれ3枚必要。
/// 軸はラウンドごとに固定（文才→多作→影響）。各ラウンドはステータス比較で勝敗が決まる。
pub fn resolve_battle(player_deck: &[Author], opponent_deck: &[Author]) -> Result<BattleResult, String> {
    if player_deck.len() != 3 {
        return Err(format!("プレイヤーのデッキは3枚必要です（現在 {} 枚）", player_deck.len()));
    }
    if opponent_deck.len() != 3 {
        return Err(format!("相手のデッキは3枚必要です（現在 {} 枚）", opponent_deck.len()));
    }
    let mut rounds = Vec::with_capacity(3);
    let mut player_wins = 0u32;
    let mut opponent_wins = 0u32;
    let mut xp_targets = Vec::new();

    for i in 0..3 {
        let axis = ROUND_AXES[i];
        let pc = &player_deck[i];
        let oc = &opponent_deck[i];
        let pv = pc.stats.axis(axis);
        let ov = oc.stats.axis(axis);
        let outcome = if pv > ov {
            player_wins += 1;
            xp_targets.push(pc.id.clone());
            RoundOutcome::Win
        } else if pv < ov {
            opponent_wins += 1;
            RoundOutcome::Loss
        } else {
            RoundOutcome::Draw
        };
        rounds.push(BattleRound {
            axis,
            axis_label: axis.jp_label().to_string(),
            player_card: pc.clone(),
            player_value: pv,
            opponent_card: oc.clone(),
            opponent_value: ov,
            outcome,
        });
    }

    let player_won = player_wins > opponent_wins;
    // XP = 勝ったラウンド数 × 10 + 勝者ボーナス20（勝った場合）
    let xp_gained = player_wins * 10 + if player_won { 20 } else { 0 };

    Ok(BattleResult {
        rounds,
        player_wins,
        opponent_wins,
        player_won,
        xp_gained,
        xp_targets,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::data::{AuthorStats, load_authors};

    fn make_author(id: &str, stats: AuthorStats) -> Author {
        Author {
            id: id.to_string(),
            name: id.to_string(),
            name_en: id.to_string(),
            country: "テスト".to_string(),
            era: "テスト".to_string(),
            born: "2000-01-01".to_string(),
            died: None,
            works: vec![],
            stats,
            color: "#000".to_string(),
            epithet: "".to_string(),
        }
    }

    #[test]
    fn rejects_wrong_deck_size() {
        let strong = make_author("s", AuthorStats { literary: 90, prolific: 90, influence: 90, longevity: 50 });
        let three = vec![strong.clone(), strong.clone(), strong.clone()];
        let two = vec![strong.clone(), strong.clone()];
        assert!(resolve_battle(&two, &three).is_err());
        assert!(resolve_battle(&three, &two).is_err());
    }

    #[test]
    fn player_wins_when_all_stats_higher() {
        let strong = make_author("s", AuthorStats { literary: 90, prolific: 90, influence: 90, longevity: 50 });
        let weak = make_author("w", AuthorStats { literary: 10, prolific: 10, influence: 10, longevity: 50 });
        let p = vec![strong.clone(), strong.clone(), strong.clone()];
        let o = vec![weak.clone(), weak.clone(), weak.clone()];
        let res = resolve_battle(&p, &o).unwrap();
        assert_eq!(res.player_wins, 3);
        assert_eq!(res.opponent_wins, 0);
        assert!(res.player_won);
        assert_eq!(res.xp_gained, 3 * 10 + 20);
    }

    #[test]
    fn draw_round_credits_neither() {
        let a = make_author("a", AuthorStats { literary: 50, prolific: 50, influence: 50, longevity: 50 });
        let b = make_author("b", AuthorStats { literary: 50, prolific: 50, influence: 50, longevity: 50 });
        let res = resolve_battle(&vec![a.clone(); 3], &vec![b.clone(); 3]).unwrap();
        assert_eq!(res.player_wins, 0);
        assert_eq!(res.opponent_wins, 0);
        assert!(!res.player_won);
        for r in &res.rounds {
            assert_eq!(r.outcome, RoundOutcome::Draw);
        }
    }

    #[test]
    fn xp_targets_records_winning_cards() {
        // 1ラウンド勝ち、2ラウンド負け、3ラウンド勝ち、にする
        let winner1 = make_author("w1", AuthorStats { literary: 99, prolific: 1,  influence: 1,  longevity: 50 });
        let loser   = make_author("ll", AuthorStats { literary: 1,  prolific: 1,  influence: 1,  longevity: 50 });
        let winner3 = make_author("w3", AuthorStats { literary: 1,  prolific: 1,  influence: 99, longevity: 50 });
        let opp     = make_author("op", AuthorStats { literary: 50, prolific: 50, influence: 50, longevity: 50 });
        let p = vec![winner1.clone(), loser.clone(), winner3.clone()];
        let o = vec![opp.clone(), opp.clone(), opp.clone()];
        let res = resolve_battle(&p, &o).unwrap();
        assert_eq!(res.xp_targets, vec!["w1", "w3"]);
        assert_eq!(res.player_wins, 2);
        assert_eq!(res.opponent_wins, 1);
        assert!(res.player_won);
    }

    #[test]
    fn opponent_for_seed_is_deterministic() {
        let authors = load_authors();
        let a = opponent_for_seed(&authors, 42, &[]);
        let b = opponent_for_seed(&authors, 42, &[]);
        let c = opponent_for_seed(&authors, 99, &[]);
        assert_eq!(a.len(), 3);
        assert_eq!(b.len(), 3);
        assert_eq!(c.len(), 3);
        let a_ids: Vec<_> = a.iter().map(|x| &x.id).collect();
        let b_ids: Vec<_> = b.iter().map(|x| &x.id).collect();
        assert_eq!(a_ids, b_ids);
        // 違うシードで一致したらラッキーすぎる（事故防止）
        let c_ids: Vec<_> = c.iter().map(|x| &x.id).collect();
        assert_ne!(a_ids, c_ids);
    }

    #[test]
    fn opponent_excludes_player_ids() {
        let authors = load_authors();
        let exclude = vec!["soseki".to_string(), "akutagawa".to_string(), "dazai".to_string()];
        let opp = opponent_for_seed(&authors, 7, &exclude);
        for a in &opp {
            assert!(!exclude.contains(&a.id), "opponent should not include excluded id {}", a.id);
        }
    }

    #[test]
    fn score_card_sums_stats() {
        let a = make_author("x", AuthorStats { literary: 10, prolific: 20, influence: 30, longevity: 40 });
        assert_eq!(score_card(&a), 100);
    }
}
