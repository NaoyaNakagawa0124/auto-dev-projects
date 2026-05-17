#![warn(clippy::all)]

pub mod banned;
pub mod case;
pub mod cause;
pub mod score;
pub mod verdict;

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::case::{all_cases, cases_in_chapter, find_case, Chapter, ALL_CHAPTERS};
use crate::cause::Cause;
use crate::score::{compute, CaseResult};
use crate::verdict::judge;

#[wasm_bindgen(start)]
pub fn _start() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[derive(Serialize, Deserialize)]
struct ChapterSummary {
    id: String,
    label: String,
    case_ids: Vec<String>,
}

fn chapter_id(ch: Chapter) -> &'static str {
    match ch {
        Chapter::Houseplant => "houseplant",
        Chapter::Cactus => "cactus",
        Chapter::Herb => "herb",
        Chapter::Succulent => "succulent",
    }
}

fn chapter_from_id(s: &str) -> Option<Chapter> {
    match s {
        "houseplant" => Some(Chapter::Houseplant),
        "cactus" => Some(Chapter::Cactus),
        "herb" => Some(Chapter::Herb),
        "succulent" => Some(Chapter::Succulent),
        _ => None,
    }
}

#[wasm_bindgen(js_name = listChapters)]
pub fn list_chapters() -> Result<JsValue, JsValue> {
    let chapters: Vec<ChapterSummary> = ALL_CHAPTERS
        .iter()
        .map(|&ch| ChapterSummary {
            id: chapter_id(ch).to_string(),
            label: ch.label().to_string(),
            case_ids: cases_in_chapter(ch).into_iter().map(|c| c.id).collect(),
        })
        .collect();
    serde_wasm_bindgen::to_value(&chapters).map_err(jserr)
}

#[wasm_bindgen(js_name = listAllCases)]
pub fn list_all_cases() -> Result<JsValue, JsValue> {
    serde_wasm_bindgen::to_value(&all_cases()).map_err(jserr)
}

#[wasm_bindgen(js_name = getCase)]
pub fn get_case(case_id: &str) -> Result<JsValue, JsValue> {
    let c = find_case(case_id).ok_or_else(|| JsValue::from_str("case not found"))?;
    serde_wasm_bindgen::to_value(&c).map_err(jserr)
}

#[wasm_bindgen(js_name = submitVerdict)]
pub fn submit_verdict(case_id: &str, accused_str: &str) -> Result<JsValue, JsValue> {
    let case = find_case(case_id).ok_or_else(|| JsValue::from_str("case not found"))?;
    let accused = parse_cause(accused_str)?;
    let v = judge(&case, accused);
    serde_wasm_bindgen::to_value(&v).map_err(jserr)
}

#[wasm_bindgen(js_name = computeScore)]
pub fn compute_score(results_js: JsValue, time_ms: f64) -> Result<JsValue, JsValue> {
    let results: Vec<CaseResult> = serde_wasm_bindgen::from_value(results_js).map_err(jserr)?;
    let report = compute(&results, time_ms.max(0.0) as u64);
    serde_wasm_bindgen::to_value(&report).map_err(jserr)
}

#[wasm_bindgen(js_name = causeLabel)]
pub fn cause_label(s: &str) -> Result<String, JsValue> {
    Ok(parse_cause(s)?.label().to_string())
}

#[wasm_bindgen(js_name = causeAlibi)]
pub fn cause_alibi(s: &str) -> Result<String, JsValue> {
    Ok(parse_cause(s)?.alibi().to_string())
}

#[wasm_bindgen(js_name = chapterLabel)]
pub fn chapter_label(s: &str) -> Result<String, JsValue> {
    chapter_from_id(s)
        .map(|c| c.label().to_string())
        .ok_or_else(|| JsValue::from_str("unknown chapter"))
}

#[wasm_bindgen(js_name = chapterUnlocked)]
pub fn chapter_unlocked_js(results_js: JsValue, chapter_id_str: &str) -> Result<bool, JsValue> {
    let results: Vec<CaseResult> = serde_wasm_bindgen::from_value(results_js).map_err(jserr)?;
    let ch = chapter_from_id(chapter_id_str)
        .ok_or_else(|| JsValue::from_str("unknown chapter"))?;
    Ok(score::chapter_unlocked(&results, ch))
}

fn parse_cause(s: &str) -> Result<Cause, JsValue> {
    match s {
        "Dryness" => Ok(Cause::Dryness),
        "Overwatering" => Ok(Cause::Overwatering),
        "RootRot" => Ok(Cause::RootRot),
        "LowLight" => Ok(Cause::LowLight),
        "Cold" => Ok(Cause::Cold),
        "Pest" => Ok(Cause::Pest),
        "FertilizerBurn" => Ok(Cause::FertilizerBurn),
        _ => Err(JsValue::from_str("unknown cause")),
    }
}

fn jserr<E: std::fmt::Display>(e: E) -> JsValue {
    JsValue::from_str(&format!("{}", e))
}
