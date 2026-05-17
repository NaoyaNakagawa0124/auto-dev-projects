use sokkou_deck::banned::{audit_all, find};
use sokkou_deck::deck::all_decks;

#[test]
fn find_hit() {
    assert!(find("ダメ人間").is_some());
    assert!(find("お前 は 弱い").is_some());
}

#[test]
fn find_miss() {
    assert!(find("頑張ろう").is_none());
    assert!(find("PB 更新").is_none());
    assert!(find("速攻デッキ").is_none());
}

#[test]
fn audit_decks_have_no_banned_words() {
    let mut strings: Vec<String> = Vec::new();
    for d in all_decks() {
        strings.push(d.name.clone());
        strings.push(d.description.clone());
        for c in &d.cards {
            strings.push(c.prompt.clone());
            for a in &c.answers {
                strings.push(a.clone());
            }
        }
    }
    let hits = audit_all(strings.iter().map(|s| s.as_str()));
    assert!(hits.is_empty(), "banned words in decks: {:?}", hits);
}

#[test]
fn ui_strings_are_clean() {
    let ui = [
        "速攻デッキ",
        "デッキ を 選ぶ",
        "any%",
        "100%",
        "コンシステンシー",
        "PB を 更新!",
        "もう 1 回",
        "ホーム へ 戻る",
        "結果",
        "リトライ",
        "正解",
        "不正解",
    ];
    let hits = audit_all(ui.iter().copied());
    assert!(hits.is_empty(), "banned in UI: {:?}", hits);
}
