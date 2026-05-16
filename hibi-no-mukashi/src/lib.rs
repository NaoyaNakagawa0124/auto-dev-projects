//! Public API exposed to JS via wasm-bindgen.

#![cfg_attr(not(target_arch = "wasm32"), allow(unused_imports))]

pub mod vignettes;
pub mod select;
pub mod motifs;

use wasm_bindgen::prelude::*;
use serde::Serialize;

use crate::vignettes::Vignette;
use crate::select::{select_for_iso, next_md, prev_md, Selection};

#[derive(Serialize)]
struct VignetteOut {
    date_md: &'static str,
    year: u16,
    title: &'static str,
    body: &'static str,
    motif: &'static str,
    mood: &'static str,
}

impl From<&'static Vignette> for VignetteOut {
    fn from(v: &'static Vignette) -> Self {
        VignetteOut {
            date_md: v.date_md, year: v.year, title: v.title,
            body: v.body, motif: v.motif, mood: v.mood,
        }
    }
}

#[derive(Serialize)]
struct SelectionOut {
    vignette: VignetteOut,
    is_nearby: bool,
    requested_md: String,
}

impl From<Selection> for SelectionOut {
    fn from(s: Selection) -> Self {
        SelectionOut {
            vignette: VignetteOut::from(s.vignette),
            is_nearby: s.is_nearby,
            requested_md: s.requested_md,
        }
    }
}

#[wasm_bindgen]
pub fn vignette_for(date_iso: &str) -> Result<JsValue, JsValue> {
    let Some(sel) = select_for_iso(date_iso) else {
        return Err(JsValue::from_str("invalid date"));
    };
    serde_wasm_bindgen::to_value(&SelectionOut::from(sel))
        .map_err(|e| JsValue::from_str(&format!("serialize: {e}")))
}

#[wasm_bindgen]
pub fn motif_svg(motif_id: &str) -> String {
    crate::motifs::motif_svg(motif_id).to_string()
}

#[wasm_bindgen]
pub fn available_mds() -> JsValue {
    let mds = crate::vignettes::available_mds();
    serde_wasm_bindgen::to_value(&mds).unwrap_or(JsValue::NULL)
}

#[wasm_bindgen]
pub fn next_md_after(md: &str) -> Option<String> {
    next_md(md)
}

#[wasm_bindgen]
pub fn prev_md_before(md: &str) -> Option<String> {
    prev_md(md)
}

#[wasm_bindgen]
pub fn known_motifs() -> JsValue {
    serde_wasm_bindgen::to_value(crate::motifs::known_motifs()).unwrap_or(JsValue::NULL)
}
