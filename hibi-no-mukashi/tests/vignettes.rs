use hibi_no_mukashi::vignettes::{available_mds, vignettes_for_md, VIGNETTES};

#[test]
fn dataset_is_not_empty() {
    assert!(!VIGNETTES.is_empty());
    assert!(VIGNETTES.len() >= 30);
}

#[test]
fn every_vignette_has_valid_fields() {
    for v in VIGNETTES {
        assert_eq!(v.date_md.len(), 5, "date_md must be MM-DD: {:?}", v);
        assert_eq!(&v.date_md[2..3], "-");
        let mm: u8 = v.date_md[0..2].parse().expect("mm");
        let dd: u8 = v.date_md[3..5].parse().expect("dd");
        assert!(mm >= 1 && mm <= 12, "mm out of range: {:?}", v);
        assert!(dd >= 1 && dd <= 31, "dd out of range: {:?}", v);
        assert!(v.year >= 1500 && v.year <= 2025, "year out of range: {:?}", v);
        assert!(!v.title.is_empty());
        assert!(!v.body.is_empty());
        assert!(v.body.chars().count() >= 30 && v.body.chars().count() <= 200,
            "body length should be 30-200 chars: {} → {:?}", v.body.chars().count(), v.title);
    }
}

#[test]
fn motifs_are_known() {
    use hibi_no_mukashi::motifs::known_motifs;
    let known: std::collections::HashSet<&str> =
        known_motifs().iter().copied().collect();
    for v in VIGNETTES {
        assert!(known.contains(v.motif),
            "unknown motif id: {} in {:?}", v.motif, v.title);
    }
}

#[test]
fn moods_are_valid() {
    let allowed: std::collections::HashSet<&str> = [
        "spring", "summer", "autumn", "winter", "dawn", "dusk", "night",
    ].iter().copied().collect();
    for v in VIGNETTES {
        assert!(allowed.contains(v.mood),
            "unknown mood: {} in {:?}", v.mood, v.title);
    }
}

#[test]
fn vignettes_for_md_returns_matching_only() {
    let target = "05-17";
    let got = vignettes_for_md(target);
    assert!(!got.is_empty());
    for v in &got {
        assert_eq!(v.date_md, target);
    }
}

#[test]
fn available_mds_is_sorted_and_unique() {
    let mds = available_mds();
    let mut sorted = mds.clone();
    sorted.sort();
    sorted.dedup();
    assert_eq!(sorted, mds);
}

#[test]
fn dataset_spreads_across_months() {
    let mut months: std::collections::HashSet<&str> = std::collections::HashSet::new();
    for v in VIGNETTES {
        months.insert(&v.date_md[0..2]);
    }
    // We want at least 10 different months covered
    assert!(months.len() >= 10,
        "dataset should span >= 10 months, got {}", months.len());
}

#[test]
fn no_war_or_death_keywords_in_bodies() {
    // The tone is calm domestic. Reject heavy keywords.
    let banned = ["戦死", "殺", "戦争"];
    for v in VIGNETTES {
        for kw in banned.iter() {
            assert!(!v.body.contains(kw),
                "banned keyword '{}' found in {:?}", kw, v.title);
        }
    }
}
