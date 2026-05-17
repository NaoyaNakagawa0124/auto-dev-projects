#![warn(clippy::all)]

pub mod banned;
pub mod deck;
pub mod normalize;
pub mod run;
pub mod stats;

use serde::Deserialize;
use wasm_bindgen::prelude::*;

use crate::deck::{find_deck, DeckSummary};
use crate::run::{Run, RunMode};
use crate::stats::PersonalBest;

#[wasm_bindgen(start)]
pub fn _start() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[wasm_bindgen(js_name = listDecks)]
pub fn list_decks() -> Result<JsValue, JsValue> {
    let summaries: Vec<DeckSummary> = deck::all_decks().iter().map(DeckSummary::from).collect();
    serde_wasm_bindgen::to_value(&summaries).map_err(jserr)
}

#[wasm_bindgen(js_name = getDeck)]
pub fn get_deck(deck_id: &str) -> Result<JsValue, JsValue> {
    let deck = find_deck(deck_id).ok_or_else(|| JsValue::from_str("deck not found"))?;
    serde_wasm_bindgen::to_value(&deck).map_err(jserr)
}

#[wasm_bindgen(js_name = startRun)]
pub fn start_run(deck_id: &str, mode_str: &str, started_at_ms: f64) -> Result<JsValue, JsValue> {
    let deck = find_deck(deck_id).ok_or_else(|| JsValue::from_str("deck not found"))?;
    let mode = parse_mode(mode_str)?;
    let run = Run::start(&deck, mode, started_at_ms as u64);
    serde_wasm_bindgen::to_value(&run).map_err(jserr)
}

#[wasm_bindgen(js_name = submitAnswer)]
pub fn submit_answer(run_json: JsValue, answer: &str, now_ms: f64) -> Result<JsValue, JsValue> {
    let mut run: Run = serde_wasm_bindgen::from_value(run_json).map_err(jserr)?;
    let deck = find_deck(&run.deck_id).ok_or_else(|| JsValue::from_str("deck not found"))?;
    let outcome = run.submit_answer(&deck, answer, now_ms as u64);
    let resp = SubmitResponse {
        run,
        outcome: outcome_label(outcome),
    };
    serde_wasm_bindgen::to_value(&resp).map_err(jserr)
}

#[wasm_bindgen(js_name = computeResult)]
pub fn compute_result(run_json: JsValue, pb_json: JsValue) -> Result<JsValue, JsValue> {
    let run: Run = serde_wasm_bindgen::from_value(run_json).map_err(jserr)?;
    let pb: Option<PersonalBest> = if pb_json.is_null() || pb_json.is_undefined() {
        None
    } else {
        serde_wasm_bindgen::from_value(pb_json).map_err(jserr)?
    };
    let result = stats::compute_result(&run, pb.as_ref());
    serde_wasm_bindgen::to_value(&result).map_err(jserr)
}

#[wasm_bindgen(js_name = normalizeAnswer)]
pub fn normalize_answer_js(s: &str) -> String {
    normalize::normalize_answer(s)
}

#[wasm_bindgen(js_name = formatTime)]
pub fn format_time_js(ms: f64) -> String {
    stats::format_time_ms(ms.max(0.0) as u64)
}

#[wasm_bindgen(js_name = formatDelta)]
pub fn format_delta_js(delta_ms: f64) -> String {
    stats::format_delta(delta_ms as i64)
}

#[wasm_bindgen(js_name = consistencyTarget)]
pub fn consistency_target_js(deck_size: usize) -> usize {
    run::consistency_target(deck_size)
}

fn parse_mode(s: &str) -> Result<RunMode, JsValue> {
    match s {
        "any%" | "AnyPercent" | "any" => Ok(RunMode::AnyPercent),
        "100%" | "HundredPercent" | "hundred" => Ok(RunMode::HundredPercent),
        "consistency" | "Consistency" => Ok(RunMode::Consistency),
        _ => Err(JsValue::from_str("unknown mode")),
    }
}

fn outcome_label(o: run::SubmitOutcome) -> String {
    match o {
        run::SubmitOutcome::NextCard => "next",
        run::SubmitOutcome::Finished => "finished",
        run::SubmitOutcome::Failed => "failed",
        run::SubmitOutcome::Penalty => "penalty",
        run::SubmitOutcome::AlreadyDone => "already-done",
    }
    .to_string()
}

fn jserr<E: std::fmt::Display>(e: E) -> JsValue {
    JsValue::from_str(&format!("{}", e))
}

#[derive(serde::Serialize, Deserialize)]
struct SubmitResponse {
    run: Run,
    outcome: String,
}
