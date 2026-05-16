//! 40 object words. The voice module renders them into full sentences.

use crate::voice::Voice;

pub static OBJECTS: &[&str] = &[
    "コップ",       "本",           "紙",           "ペン",         "リモコン",
    "靴下",         "ハンカチ",     "皿",           "鉛筆",         "鞄",
    "羽織",         "封筒",         "メモ",         "鍵",           "眼鏡",
    "薬",           "缶",           "瓶",           "袋",           "箱",
    "充電器",       "イヤホン",     "雑誌",         "化粧品",       "髪ゴム",
    "クッション",   "枕カバー",     "タオル",       "コースター",   "鏡",
    "領収書",       "葉書",         "ティッシュ箱", "リップ",       "靴",
    "傘",           "電池",         "メガネケース", "ペンキャップ", "栞",
];

/// Words that must never appear in any prompt or voice render — runs as a
/// `cargo test` integrity check. Keep this in sync with CLAUDE.md.
pub static BANNED_WORDS: &[&str] = &[
    "頑張", "怠け", "汚", "ダメ", "クリア", "達成", "完了",
    "やり遂げ", "諦めず", "努力",
];

pub fn total() -> usize { OBJECTS.len() }

/// Pick an object deterministically from a tap index. Wraps modulo total.
pub fn object_for(index: u32) -> &'static str {
    OBJECTS[(index as usize) % OBJECTS.len()]
}

/// Render the full sentence given a tap index and a voice.
pub fn prompt_for(index: u32, voice: Voice) -> String {
    let obj = object_for(index);
    crate::voice::render(obj, voice)
}
