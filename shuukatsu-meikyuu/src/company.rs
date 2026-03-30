use serde::{Deserialize, Serialize};
use crate::data::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Company {
    pub name: String,
    pub industry: String,
    pub size: String,
    /// Which stat is primarily tested
    pub primary_stat: StatType,
    /// Difficulty modifier (-10 to +10)
    pub difficulty_mod: i32,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub enum StatType {
    Communication,
    Technical,
    Presentation,
}

impl Company {
    pub fn generate(seed: u64) -> Company {
        let prefix_idx = (seed % COMPANY_PREFIXES.len() as u64) as usize;
        let suffix_idx = ((seed / 10) % COMPANY_SUFFIXES.len() as u64) as usize;
        let industry_idx = ((seed / 100) % INDUSTRIES.len() as u64) as usize;
        let size_idx = ((seed / 1000) % COMPANY_SIZES.len() as u64) as usize;
        let stat_idx = ((seed.wrapping_mul(7) / 13) % 3) as usize;
        let difficulty_mod = ((seed % 21) as i32) - 10;

        let name = format!("{}{}", COMPANY_PREFIXES[prefix_idx], COMPANY_SUFFIXES[suffix_idx]);
        let industry = INDUSTRIES[industry_idx].to_string();
        let size = COMPANY_SIZES[size_idx].to_string();
        let primary_stat = match stat_idx {
            0 => StatType::Communication,
            1 => StatType::Technical,
            _ => StatType::Presentation,
        };

        Company {
            name,
            industry,
            size,
            primary_stat,
            difficulty_mod,
        }
    }

    pub fn description(&self) -> String {
        let stat_name = match self.primary_stat {
            StatType::Communication => "コミュ力",
            StatType::Technical => "技術力",
            StatType::Presentation => "表現力",
        };
        format!(
            "【{}】{}・{}\n重視するスキル: {}",
            self.size, self.name, self.industry, stat_name
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_company_generation_deterministic() {
        let c1 = Company::generate(42);
        let c2 = Company::generate(42);
        assert_eq!(c1.name, c2.name);
        assert_eq!(c1.industry, c2.industry);
    }

    #[test]
    fn test_company_generation_varies() {
        let c1 = Company::generate(42);
        let c2 = Company::generate(999);
        // Different seeds should usually produce different companies
        assert!(c1.name != c2.name || c1.industry != c2.industry);
    }

    #[test]
    fn test_company_name_not_empty() {
        for seed in 0..100 {
            let c = Company::generate(seed);
            assert!(!c.name.is_empty());
            assert!(!c.industry.is_empty());
            assert!(!c.size.is_empty());
        }
    }

    #[test]
    fn test_company_description_contains_name() {
        let c = Company::generate(42);
        let desc = c.description();
        assert!(desc.contains(&c.name));
    }

    #[test]
    fn test_difficulty_mod_range() {
        for seed in 0..100 {
            let c = Company::generate(seed);
            assert!(c.difficulty_mod >= -10 && c.difficulty_mod <= 10);
        }
    }

    #[test]
    fn test_all_stat_types_reachable() {
        let mut found_comm = false;
        let mut found_tech = false;
        let mut found_pres = false;
        for seed in 0..100 {
            let c = Company::generate(seed);
            match c.primary_stat {
                StatType::Communication => found_comm = true,
                StatType::Technical => found_tech = true,
                StatType::Presentation => found_pres = true,
            }
        }
        assert!(found_comm && found_tech && found_pres);
    }
}
