use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum Cause {
    Dryness,
    Overwatering,
    RootRot,
    LowLight,
    Cold,
    Pest,
    FertilizerBurn,
}

impl Cause {
    pub fn label(&self) -> &'static str {
        match self {
            Cause::Dryness => "乾燥死",
            Cause::Overwatering => "過湿死",
            Cause::RootRot => "根腐れ",
            Cause::LowLight => "光 不足",
            Cause::Cold => "寒さ",
            Cause::Pest => "害虫",
            Cause::FertilizerBurn => "肥料 焼け",
        }
    }

    pub fn alibi(&self) -> &'static str {
        match self {
            Cause::Dryness => "私 が 犯人 なら 葉 は カラ カラ で 縁 から 茶 色く なる はず。 鉢底 から 水 が 滲み 出て いれ ば 私 で は ない。",
            Cause::Overwatering => "鉢 底 の 滲み や 土 表面 の カビ、 茎 の 付け 根 の ふやけ は 私 を 示す 痕跡。",
            Cause::RootRot => "根 を 触れ た とき に 黒 ずん で 崩れる の は 私 の 仕事。 通常 過湿 と 連鎖 する。",
            Cause::LowLight => "茎 が ひょろ 長く 徒長 し、 葉 色 が 薄く 黄緑 化 する。 鉢 底 が 乾いて いる の が 自然。",
            Cause::Cold => "葉 が 黒 ずん で 萎れる、 凍結 痕 が 出る。 室温 が 5°C を 切る 環境 で 私 は 動く。",
            Cause::Pest => "葉 裏 の 黒 点、 蜘蛛 の 巣 状 の 糸、 ベタ つき で 私 と 分かる。 痕跡 が 無い な ら 立証 不能。",
            Cause::FertilizerBurn => "葉 の 縁 が 焦げ茶 で カリカリ、 土 に 白い 結晶 が 浮く の が 私 の サイン。",
        }
    }
}

pub const ALL_CAUSES: &[Cause] = &[
    Cause::Dryness,
    Cause::Overwatering,
    Cause::RootRot,
    Cause::LowLight,
    Cause::Cold,
    Cause::Pest,
    Cause::FertilizerBurn,
];
