//! Three voices — quiet, friend, mother. Each transforms an object word into
//! a complete prompt line. Voices are intentionally short, soft, and explicit
//! about ending ("…だけでいい" / "それでいい" / "それで十分").

use serde::Serialize;

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize)]
pub enum Voice {
    Quiet,
    Friend,
    Mother,
}

impl Voice {
    pub fn from_key(k: &str) -> Voice {
        match k {
            "friend" => Voice::Friend,
            "mother" => Voice::Mother,
            _ => Voice::Quiet,
        }
    }

    pub fn key(self) -> &'static str {
        match self {
            Voice::Quiet => "quiet",
            Voice::Friend => "friend",
            Voice::Mother => "mother",
        }
    }

    pub fn label(self) -> &'static str {
        match self {
            Voice::Quiet => "静か",
            Voice::Friend => "友達",
            Voice::Mother => "おかあさん",
        }
    }

    pub fn farewell(self) -> &'static str {
        match self {
            Voice::Quiet => "ありがとう。 ここまでで、 十分です。",
            Voice::Friend => "ありがとう、 ここまでで十分だよ。",
            Voice::Mother => "ありがとうね。 もう、 ここまでで十分だよ。",
        }
    }
}

/// Render a prompt for a given object word in the chosen voice.
/// Output is a single short line, no period style varies by voice.
pub fn render(object: &str, voice: Voice) -> String {
    match voice {
        Voice::Quiet => format!("視界にある {} を、 ひとつだけ、 元の場所に。", object),
        Voice::Friend => format!("{} を ひとつ、 戻してみない?  それだけでいいよ。", object),
        Voice::Mother => format!("ねえ、 {} を ひとつだけ、 そっと戻してあげてみない?", object),
    }
}

pub static ALL_VOICES: &[Voice] = &[Voice::Quiet, Voice::Friend, Voice::Mother];
