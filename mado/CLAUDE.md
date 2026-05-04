# CLAUDE.md — mado

## What to keep in mind when editing this project

- **The intent is "そっと寄り添う" (gentle/quiet)**. Don't add streaks, gamification, completion percentages, or notification-style UI. If a feature would make the user feel pressured, leave it out.
- All user-facing text is **Japanese**. Code identifiers stay English. Don't introduce English UI strings — even "OK" / "Cancel".
- The Rust scene engine is **data-driven by `scene_idx`**. Adding a 7th window = add a `match` arm in `gradient_for`, `silhouettes_for`, `particle_config`, `audio_recipe`, increment `SCENE_COUNT`, and add an entry in `data/windows.js`. Don't fork the engine.
- The WASM bundle in `pkg/` is **committed**. After Rust changes, run `wasm-pack build --target web --out-dir pkg --release` and commit the new `pkg/`.
- `mado.set_scene(idx)` **resets particles and time**. Code that just needs audio for another scene must use `mado.generate_audio_for(idx, ...)` which doesn't mutate state.
- Audio buffers are cached per-scene in `audioBufferCache`. Generation is fast (~ms) but caching keeps scene transitions snappy.

## Testing

```sh
cargo test --lib            # 8 Rust unit tests
node --check main.js        # JS syntax check
python3 -m http.server 8765 # serve locally for browser smoke test
```
