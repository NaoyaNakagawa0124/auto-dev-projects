//! Public WASM API for juugobyou.

pub mod voice;
pub mod prompts;

use wasm_bindgen::prelude::*;
use serde::Serialize;

use crate::voice::{Voice, ALL_VOICES};

#[derive(Serialize)]
struct VoiceInfo {
    key: &'static str,
    label: &'static str,
    farewell: &'static str,
}

#[wasm_bindgen]
pub fn prompt(index: u32, voice_key: &str) -> String {
    let v = Voice::from_key(voice_key);
    crate::prompts::prompt_for(index, v)
}

#[wasm_bindgen]
pub fn farewell(voice_key: &str) -> String {
    Voice::from_key(voice_key).farewell().to_string()
}

#[wasm_bindgen]
pub fn voices() -> JsValue {
    let infos: Vec<VoiceInfo> = ALL_VOICES.iter()
        .map(|v| VoiceInfo { key: v.key(), label: v.label(), farewell: v.farewell() })
        .collect();
    serde_wasm_bindgen::to_value(&infos).unwrap_or(JsValue::NULL)
}

#[wasm_bindgen]
pub fn total_prompts() -> u32 {
    crate::prompts::total() as u32
}
