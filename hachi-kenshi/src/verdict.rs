use serde::{Deserialize, Serialize};

use crate::case::{find_case, Case};
use crate::cause::Cause;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Verdict {
    pub case_id: String,
    pub accused: Cause,
    pub correct: bool,
    pub culprit: Cause,
    pub explanation: String,
}

pub fn judge(case: &Case, accused: Cause) -> Verdict {
    Verdict {
        case_id: case.id.clone(),
        accused,
        correct: accused == case.culprit,
        culprit: case.culprit,
        explanation: case.explanation.clone(),
    }
}

pub fn judge_by_id(case_id: &str, accused: Cause) -> Option<Verdict> {
    find_case(case_id).map(|c| judge(&c, accused))
}
