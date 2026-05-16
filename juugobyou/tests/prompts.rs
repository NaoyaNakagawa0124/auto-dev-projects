use juugobyou::prompts::{object_for, BANNED_WORDS, OBJECTS, prompt_for, total};
use juugobyou::voice::{ALL_VOICES, Voice};

#[test]
fn forty_or_more_objects() {
    assert!(total() >= 40, "want >= 40 objects, got {}", total());
}

#[test]
fn every_object_is_non_empty_short() {
    for obj in OBJECTS {
        let n = obj.chars().count();
        assert!(n >= 1 && n <= 10, "object out of range ({} chars): {:?}", n, obj);
    }
}

#[test]
fn objects_are_unique() {
    let mut sorted: Vec<&&str> = OBJECTS.iter().collect();
    sorted.sort();
    let unique_count = {
        let mut s: std::collections::HashSet<&&str> = std::collections::HashSet::new();
        for o in OBJECTS.iter() { s.insert(o); }
        s.len()
    };
    assert_eq!(unique_count, OBJECTS.len(), "objects must be unique");
}

#[test]
fn no_banned_words_in_any_render() {
    for index in 0..total() as u32 {
        for v in ALL_VOICES {
            let s = prompt_for(index, *v);
            for bw in BANNED_WORDS {
                assert!(!s.contains(bw),
                    "banned word '{}' found in render: {}", bw, s);
            }
        }
    }
}

#[test]
fn no_banned_words_in_farewells() {
    for v in ALL_VOICES {
        let f = v.farewell();
        for bw in BANNED_WORDS {
            assert!(!f.contains(bw),
                "banned word '{}' found in {:?} farewell: {}", bw, v, f);
        }
    }
}

#[test]
fn object_for_wraps_index() {
    assert_eq!(object_for(0), OBJECTS[0]);
    assert_eq!(object_for(total() as u32), OBJECTS[0]);
    assert_eq!(object_for((total() * 2) as u32), OBJECTS[0]);
}

#[test]
fn renders_are_compact() {
    for v in ALL_VOICES {
        for i in 0..total() as u32 {
            let s = prompt_for(i, *v);
            let n = s.chars().count();
            assert!(n >= 10 && n <= 60, "render out of range ({} chars): {}", n, s);
        }
    }
}

#[test]
fn renders_contain_the_object() {
    for v in ALL_VOICES {
        for (i, obj) in OBJECTS.iter().enumerate() {
            let s = prompt_for(i as u32, *v);
            assert!(s.contains(obj),
                "voice {:?} render for {:?} doesn't contain it: {}", v, obj, s);
        }
    }
}
