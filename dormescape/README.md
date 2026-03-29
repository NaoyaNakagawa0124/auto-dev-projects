# DormEscape

A Rust+WASM text adventure where a student at 2am navigates finding their first apartment after graduation. Each of 7 chapters teaches a real estate concept through story choices. Based on real 2026 housing data.

## Lessons Taught

1. Early apartment hunting vs procrastination
2. The 30% rent-to-income rule ($915/bed avg, $42K salary)
3. Reading your lease (43% of renters miss surprise fees)
4. Credit scores and negotiation (680 = Good, 720+ = leverage)
5. Move-in costs and secondhand furniture (73% buy used in 2026)
6. Emergency funds ($5,400-$10,800 recommended)
7. Financial independence reflection

## Build & Run

```bash
wasm-pack build --target web && python3 -m http.server 8080
```

## Test

```bash
cargo test
```
