use hibi_no_mukashi::motifs::{known_motifs, motif_svg};

#[test]
fn all_known_motifs_return_non_empty_svg() {
    for m in known_motifs() {
        let svg = motif_svg(m);
        assert!(svg.contains("<g"), "motif {} missing <g>: {}", m, svg);
        assert!(svg.contains("currentColor"),
            "motif {} should use currentColor for theming", m);
    }
}

#[test]
fn unknown_motif_returns_fallback() {
    let svg = motif_svg("does-not-exist");
    assert!(svg.contains("<g"));
}

#[test]
fn at_least_ten_motifs() {
    assert!(known_motifs().len() >= 10);
}
