use hachi_kenshi::banned::{audit_all, find};
use hachi_kenshi::case::all_cases;
use hachi_kenshi::cause::ALL_CAUSES;

#[test]
fn find_hit() {
    assert_eq!(find("殺人犯 が 来る"), Some("殺人犯"));
    assert!(find("お前 を 起訴 する").is_some());
}

#[test]
fn find_miss_on_clean_text() {
    assert!(find("過湿 死").is_none());
    assert!(find("葉 が 黄色く 変色").is_none());
    // "殺す" alone is intentionally NOT in BANNED_WORDS (allowed as plant verb)
    // but we don't have it in our actual text either
}

#[test]
fn case_texts_are_clean() {
    let mut strings: Vec<String> = Vec::new();
    for c in all_cases() {
        strings.push(c.victim.clone());
        strings.push(c.age.clone());
        strings.push(c.found_at.clone());
        strings.push(c.conditions.clone());
        strings.push(c.explanation.clone());
        for e in &c.evidence {
            strings.push(e.clone());
        }
    }
    let hits = audit_all(strings.iter().map(|s| s.as_str()));
    assert!(hits.is_empty(), "banned words in case data: {:?}", hits);
}

#[test]
fn cause_labels_and_alibis_clean() {
    let mut strings: Vec<String> = Vec::new();
    for &c in ALL_CAUSES {
        strings.push(c.label().to_string());
        strings.push(c.alibi().to_string());
    }
    let hits = audit_all(strings.iter().map(|s| s.as_str()));
    assert!(hits.is_empty(), "banned in cause data: {:?}", hits);
}

#[test]
fn ui_strings_are_clean() {
    let ui = [
        "鉢検視",
        "事件 を 開く",
        "起訴 する",
        "正解",
        "誤起訴",
        "次 の 事件",
        "ホーム へ 戻る",
        "PB 更新!",
        "全 事件 完了",
    ];
    let hits = audit_all(ui.iter().copied());
    assert!(hits.is_empty(), "banned in UI: {:?}", hits);
}
