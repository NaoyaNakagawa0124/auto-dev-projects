use sokkou_deck::deck::{all_decks, find_deck};

#[test]
fn five_decks_built_in() {
    assert_eq!(all_decks().len(), 5);
}

#[test]
fn each_deck_has_unique_id() {
    let mut ids: Vec<_> = all_decks().iter().map(|d| d.id.clone()).collect();
    ids.sort();
    ids.dedup();
    assert_eq!(ids.len(), 5);
}

#[test]
fn each_deck_has_minimum_cards() {
    for d in all_decks() {
        assert!(d.cards.len() >= 30, "{} too few cards", d.id);
    }
}

#[test]
fn card_ids_unique_within_deck() {
    for d in all_decks() {
        let mut ids: Vec<_> = d.cards.iter().map(|c| c.id.clone()).collect();
        ids.sort();
        let before = ids.len();
        ids.dedup();
        assert_eq!(before, ids.len(), "deck {} has duplicate card ids", d.id);
    }
}

#[test]
fn cards_have_nonempty_prompts_and_answers() {
    for d in all_decks() {
        for c in &d.cards {
            assert!(!c.prompt.is_empty(), "{}/{} empty prompt", d.id, c.id);
            assert!(!c.answers.is_empty(), "{}/{} no answers", d.id, c.id);
            for a in &c.answers {
                assert!(!a.is_empty(), "{}/{} empty answer", d.id, c.id);
            }
        }
    }
}

#[test]
fn find_deck_known_id() {
    assert!(find_deck("toeic-600").is_some());
    assert!(find_deck("it-pass").is_some());
    assert!(find_deck("elements").is_some());
    assert!(find_deck("jlpt-n1").is_some());
    assert!(find_deck("pm").is_some());
}

#[test]
fn find_deck_unknown_id_returns_none() {
    assert!(find_deck("does-not-exist").is_none());
}

#[test]
fn answers_match_prompts_round_trip() {
    use sokkou_deck::normalize::is_correct;
    for d in all_decks() {
        for c in &d.cards {
            // Each canonical answer should be considered correct
            for a in &c.answers {
                let first_alt = a.split(['/', '、', ',']).next().unwrap_or(a);
                assert!(
                    is_correct(first_alt, &c.answers),
                    "{}/{}: '{}' not matched by own answer set",
                    d.id,
                    c.id,
                    first_alt
                );
            }
        }
    }
}
