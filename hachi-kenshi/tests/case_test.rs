use hachi_kenshi::case::{all_cases, cases_in_chapter, find_case, Chapter, ALL_CHAPTERS};

#[test]
fn has_12_cases() {
    assert_eq!(all_cases().len(), 12);
}

#[test]
fn case_ids_unique() {
    let mut ids: Vec<_> = all_cases().iter().map(|c| c.id.clone()).collect();
    ids.sort();
    let before = ids.len();
    ids.dedup();
    assert_eq!(before, ids.len());
}

#[test]
fn each_chapter_has_three_cases() {
    for &ch in ALL_CHAPTERS {
        let n = cases_in_chapter(ch).len();
        assert_eq!(n, 3, "chapter {:?} has {} cases (expected 3)", ch, n);
    }
}

#[test]
fn culprit_is_in_suspects() {
    for c in all_cases() {
        assert!(
            c.suspects.contains(&c.culprit),
            "case {} culprit not among suspects",
            c.id
        );
    }
}

#[test]
fn each_case_has_at_least_4_suspects() {
    for c in all_cases() {
        assert!(c.suspects.len() >= 4, "case {} has too few suspects", c.id);
    }
}

#[test]
fn each_case_has_5_plus_evidence() {
    for c in all_cases() {
        assert!(c.evidence.len() >= 5, "case {} has too few evidence", c.id);
    }
}

#[test]
fn each_case_has_explanation() {
    for c in all_cases() {
        assert!(c.explanation.len() >= 20, "case {} explanation too short", c.id);
    }
}

#[test]
fn find_case_known_returns_some() {
    for c in all_cases() {
        assert!(find_case(&c.id).is_some());
    }
}

#[test]
fn find_case_unknown_returns_none() {
    assert!(find_case("c99").is_none());
}

#[test]
fn chapter_labels_non_empty() {
    for &ch in ALL_CHAPTERS {
        assert!(!ch.label().is_empty());
    }
}

#[test]
fn cases_have_unique_suspects_lists() {
    // each case's suspects should be unique (no dups within one case)
    for c in all_cases() {
        let mut s = c.suspects.clone();
        let before = s.len();
        s.sort_by_key(|x| format!("{:?}", x));
        s.dedup();
        assert_eq!(before, s.len(), "case {} has dup suspects", c.id);
    }
}

#[test]
fn chapter_distribution_correct() {
    let mut house = 0;
    let mut cactus = 0;
    let mut herb = 0;
    let mut succulent = 0;
    for c in all_cases() {
        match c.chapter {
            Chapter::Houseplant => house += 1,
            Chapter::Cactus => cactus += 1,
            Chapter::Herb => herb += 1,
            Chapter::Succulent => succulent += 1,
        }
    }
    assert_eq!(house, 3);
    assert_eq!(cactus, 3);
    assert_eq!(herb, 3);
    assert_eq!(succulent, 3);
}
