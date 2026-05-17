use serde::{Deserialize, Serialize};

use crate::cause::Cause;

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum Chapter {
    Houseplant,
    Cactus,
    Herb,
    Succulent,
}

impl Chapter {
    pub fn label(&self) -> &'static str {
        match self {
            Chapter::Houseplant => "観葉",
            Chapter::Cactus => "サボテン",
            Chapter::Herb => "ハーブ",
            Chapter::Succulent => "多肉",
        }
    }
}

pub const ALL_CHAPTERS: &[Chapter] = &[
    Chapter::Houseplant,
    Chapter::Cactus,
    Chapter::Herb,
    Chapter::Succulent,
];

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Case {
    pub id: String,
    pub chapter: Chapter,
    pub victim: String,
    pub age: String,
    pub found_at: String,
    pub conditions: String,
    pub evidence: Vec<String>,
    pub suspects: Vec<Cause>,
    pub culprit: Cause,
    pub explanation: String,
}

fn s(v: &str) -> String { v.to_string() }
fn vs(v: &[&str]) -> Vec<String> { v.iter().map(|x| x.to_string()).collect() }

pub fn all_cases() -> Vec<Case> {
    vec![
        // ── 観葉 編 ──────────────────────────
        Case {
            id: s("c01"),
            chapter: Chapter::Houseplant,
            victim: s("ポトス (Epipremnum aureum)"),
            age: s("8 ヶ月"),
            found_at: s("2026-05-15"),
            conditions: s("室温 19°C、 湿度 32%、 北 向き 窓辺、 暖房 直撃"),
            evidence: vs(&[
                "葉 全体 が 黄色 く 変色、 茎 の 付け 根 が ふやけて いる",
                "鉢 底 から 水 が 滲み 出て いる",
                "直近 2 週間 の 水やり 履歴 — 3 日 おき に 200 ml",
                "土 表面 に 白い カビ が 点在",
                "根 を 軽く 触れる と 黒 ずん で 崩れる、 害虫 痕跡 なし",
            ]),
            suspects: vec![Cause::Dryness, Cause::Overwatering, Cause::Cold, Cause::Pest, Cause::FertilizerBurn],
            culprit: Cause::Overwatering,
            explanation: s("鉢 底 から の 滲み・ 茎 の ふやけ・ 土 表面 の カビ は 過湿 の 三 点 セット。 根 の 黒 ずみ は 過湿 から の 根腐れ 連鎖 で あり、 直接 の 死因 は 過湿。 ポトス は 半 月 に 1 回 程度 で 十分。"),
        },
        Case {
            id: s("c02"),
            chapter: Chapter::Houseplant,
            victim: s("モンステラ (Monstera deliciosa)"),
            age: s("1 年 2 ヶ月"),
            found_at: s("2026-05-10"),
            conditions: s("室温 22°C、 湿度 28%、 玄関、 ほぼ 自然 光 なし"),
            evidence: vs(&[
                "新葉 が 小 ぶり で 切れ込み が 入ら ない",
                "茎 が ひょろ 長く 徒長、 葉 色 は 薄い 黄緑",
                "水やり は 月 2 回、 鉢 底 は 乾燥",
                "土 表面 に カビ なし、 害虫 痕跡 なし、 葉 縁 の 焦げ なし",
                "室温 は 安定 し て 寒 さ 無し",
            ]),
            suspects: vec![Cause::Dryness, Cause::Overwatering, Cause::LowLight, Cause::Cold, Cause::FertilizerBurn],
            culprit: Cause::LowLight,
            explanation: s("新葉 が 小 さく 切れ込み が 出 ない、 徒長、 葉 色 が 薄い — モンステラ の 光 不足 の 典型。 鉢 底 が 乾いて いる ので 過湿 で は ない。 玄関 の 自然 光 無し が 致命 的。"),
        },
        Case {
            id: s("c03"),
            chapter: Chapter::Houseplant,
            victim: s("シェフ レラ (Schefflera arboricola)"),
            age: s("2 年"),
            found_at: s("2026-05-08"),
            conditions: s("室温 25°C、 湿度 50%、 リビング 中央、 エアコン 風 直撃"),
            evidence: vs(&[
                "葉 が カラカラ に 干 から び、 縁 から 茶 色く 巻く",
                "鉢 を 持ち上げる と 軽い、 土 が ひび 割れて いる",
                "水やり は 月 1 回 程度 と 飼い主 が 申告",
                "葉 裏 を 拡大 鏡 で 確認 — 害虫 痕跡 なし",
                "エアコン 風 が 葉 に 当たり 続けて いた",
            ]),
            suspects: vec![Cause::Dryness, Cause::Overwatering, Cause::LowLight, Cause::Pest, Cause::FertilizerBurn],
            culprit: Cause::Dryness,
            explanation: s("葉 の カリカリ + 土 の ひび割れ + 鉢 の 軽さ + エアコン 風 直撃 — 乾燥死 の 教科書 通り。 シェフレラ は 表土 が 乾いたら しっかり 与え、 風 を 避ける の が 鉄則。"),
        },
        // ── サボテン 編 ──────────────────────────
        Case {
            id: s("c04"),
            chapter: Chapter::Cactus,
            victim: s("ウチワ サボテン (Opuntia)"),
            age: s("3 年"),
            found_at: s("2026-04-20"),
            conditions: s("室温 18°C、 湿度 45%、 南 向き 窓辺、 受け 皿 に 水 残留"),
            evidence: vs(&[
                "根元 が ぶよぶよ で 黒 ずん で いる",
                "受け 皿 に 常時 水 が 溜まり、 鉢 底 が 浸 水",
                "水やり は 週 1 回、 たっぷり と 飼い主 申告",
                "葉 (茎節) の 表面 は 緑 だ が 押す と へこむ",
                "害虫 ・ 凍害 ・ 肥料 痕跡 なし",
            ]),
            suspects: vec![Cause::Dryness, Cause::Overwatering, Cause::Cold, Cause::Pest, Cause::FertilizerBurn],
            culprit: Cause::Overwatering,
            explanation: s("サボテン は 「乾燥 に 強い」 と いう 誤解 で 過湿 死 さ せられる 筆頭。 週 1 回 + 受け 皿 滞水 は 完全 に 過剰。 春 - 秋 は 月 1-2 回、 冬 は 月 1 回 か 断水。 受け 皿 の 水 は 必ず 捨てる。"),
        },
        Case {
            id: s("c05"),
            chapter: Chapter::Cactus,
            victim: s("玉 サボテン (Mammillaria)"),
            age: s("4 年"),
            found_at: s("2026-02-08"),
            conditions: s("室温 4°C、 湿度 30%、 玄関 タタキ、 夜間 暖房 切")
            ,
            evidence: vs(&[
                "全体 が 黒 ずみ、 表面 が 萎れて いる",
                "鉢 底 は 乾燥、 過湿 痕跡 なし",
                "水やり は 11 月 末 で 既に 断水",
                "棘 の 間 に 黒 点 状 の 害虫 痕跡 なし",
                "玄関 は 夜間 0°C 近く まで 下がる、 凍結 痕 あり",
            ]),
            suspects: vec![Cause::Dryness, Cause::Overwatering, Cause::Cold, Cause::Pest, Cause::FertilizerBurn],
            culprit: Cause::Cold,
            explanation: s("黒 ずみ + 萎れ + 凍結 痕 + 5°C 以下 環境 — サボテン の 凍害。 多く の サボテン は 5°C を 切る と 細胞 が 凍結 し 死ぬ。 冬 は リビング 等 10°C 以上 を キープ する 必要 が ある。"),
        },
        Case {
            id: s("c06"),
            chapter: Chapter::Cactus,
            victim: s("柱 サボテン (Cereus)"),
            age: s("6 年"),
            found_at: s("2026-03-12"),
            conditions: s("室温 23°C、 湿度 40%、 リビング 窓辺、 光 十分"),
            evidence: vs(&[
                "茎 表面 に 白い 綿 状 の 物質 が 付着、 拡大 すると 微小 な 虫",
                "綿 を 取り除く と 茶 色 の 食害 痕",
                "根 元 は 健全、 鉢 内 は 乾燥",
                "葉 (茎) の カリカリ や ふやけ は ない",
                "凍害 や 肥料 痕跡 なし",
            ]),
            suspects: vec![Cause::Dryness, Cause::Overwatering, Cause::Pest, Cause::Cold, Cause::FertilizerBurn],
            culprit: Cause::Pest,
            explanation: s("白い 綿 状 = カイガラムシ の 典型。 食害 痕 が 表面 に 残り、 樹液 を 吸われて 衰弱 する。 アルコール 綿棒 で 物理 除去 + ベニカ 等 で 駆除 が 定石。"),
        },
        // ── ハーブ 編 ──────────────────────────
        Case {
            id: s("c07"),
            chapter: Chapter::Herb,
            victim: s("バジル (Ocimum basilicum)"),
            age: s("3 ヶ月"),
            found_at: s("2026-05-01"),
            conditions: s("室温 24°C、 湿度 60%、 ベランダ 半日 陰"),
            evidence: vs(&[
                "葉 の 縁 が 焦げ茶 色 で カリカリ、 中央 は 比較的 緑",
                "土 表面 に 白い 結晶 状 の 析出 物",
                "水やり は 毎日、 鉢 底 から 排水 確認 済み",
                "化成 肥料 を 月 4 回 (規定 の 4 倍) 施 用 と 飼い主 申告",
                "害虫 痕跡 なし、 凍害 なし",
            ]),
            suspects: vec![Cause::Dryness, Cause::Overwatering, Cause::Pest, Cause::FertilizerBurn, Cause::LowLight],
            culprit: Cause::FertilizerBurn,
            explanation: s("葉 縁 の 焦げ + 土 表面 の 白い 結晶 = 肥料 焼け の 典型。 肥料 を 規定 量 の 4 倍 施 用 する と 根 が 浸透 圧 で 水 を 吸え ず 葉 端 から 枯れる。 大量 灌水 で 塩 を 流す か 植え替え が 必要。"),
        },
        Case {
            id: s("c08"),
            chapter: Chapter::Herb,
            victim: s("ローズマリー (Salvia rosmarinus)"),
            age: s("1 年"),
            found_at: s("2026-04-25"),
            conditions: s("室温 22°C、 湿度 35%、 室内 南 窓辺、 鉢 サイズ 小"),
            evidence: vs(&[
                "葉 が グレー がかった 色 で 触る と ぽろぽろ 落ちる",
                "茎 の 木質 化 部分 は 脆く 折れる",
                "土 は ひび 割れ、 鉢 全体 が 軽い",
                "水やり は 「週 1 回 程度」 と 申告 だが 直近 12 日 与え 忘れ",
                "肥料 ・ 害虫 痕跡 なし、 鉢 底 滲み なし",
            ]),
            suspects: vec![Cause::Dryness, Cause::Overwatering, Cause::Pest, Cause::FertilizerBurn, Cause::LowLight],
            culprit: Cause::Dryness,
            explanation: s("葉 の グレー 化 + ぽろぽろ + 12 日 与え 忘れ + 鉢 軽い — 乾燥死。 ローズマリー は 乾燥 に 比較的 強い と は いえ 小 鉢 で は 1 週間 程度 で 限界 を 迎える。 表土 が 乾いたら 鉢 底 から 流れる まで 与える の が 基本。"),
        },
        Case {
            id: s("c09"),
            chapter: Chapter::Herb,
            victim: s("ミント (Mentha)"),
            age: s("6 ヶ月"),
            found_at: s("2026-01-15"),
            conditions: s("室温 6°C、 湿度 50%、 屋外 ベランダ、 朝 霜 が 降りる 環境"),
            evidence: vs(&[
                "地上 部 が 真っ黒 に 萎れ、 触る と とろり と 崩れる",
                "土 表面 に 朝 の 霜 が 確認 さ れた",
                "鉢 内 の 湿り 気 は 普通、 過湿 痕跡 なし",
                "害虫 ・ 肥料 ・ 光 不足 の 痕跡 なし",
                "茎 を 切る と 一部 緑 が 残る (根 は 健在)",
            ]),
            suspects: vec![Cause::Dryness, Cause::Overwatering, Cause::Cold, Cause::Pest, Cause::FertilizerBurn],
            culprit: Cause::Cold,
            explanation: s("葉 の 真っ黒 化 + 霜 + 6°C 環境 = 凍害。 ミント は 宿根 性 で 地上 部 が 凍 死 し ても 根 が 残れば 春 に 復活 する。 越冬 に は 防 寒 が 必要。"),
        },
        // ── 多肉 編 ──────────────────────────
        Case {
            id: s("c10"),
            chapter: Chapter::Succulent,
            victim: s("エケベリア (Echeveria)"),
            age: s("1 年 半"),
            found_at: s("2026-05-05"),
            conditions: s("室温 24°C、 湿度 55%、 リビング、 受け 皿 に 水 残留"),
            evidence: vs(&[
                "下葉 が 透明 化 し、 触れる と ぐじゅ ぐじゅ と 崩れる",
                "中央 の 葉 は 比較的 健全、 ロゼット の 中 央 部 に 水 が 溜まった 痕跡",
                "鉢 底 から 滲み あり、 受け 皿 滞水",
                "土 表面 は 常時 湿って いる、 水やり は 週 2 回 と 申告",
                "葉 上 部 から 水やり、 葉 の 隙間 に 水 が 溜まった 形跡",
            ]),
            suspects: vec![Cause::Dryness, Cause::Overwatering, Cause::RootRot, Cause::Pest, Cause::FertilizerBurn],
            culprit: Cause::Overwatering,
            explanation: s("多肉 は サボテン と 並ぶ 過湿 被害 の 筆頭。 葉 の 透明 化 + 葉間 滞水 + 週 2 回 の 灌水 + 滞水 受け 皿 — 完全 な 過湿 シナリオ。 多肉 は 月 1-2 回、 葉 に かからない よう 鉢 縁 から 与える。"),
        },
        Case {
            id: s("c11"),
            chapter: Chapter::Succulent,
            victim: s("ハオルチア (Haworthia)"),
            age: s("2 年"),
            found_at: s("2026-04-12"),
            conditions: s("室温 22°C、 湿度 40%、 西 向き 窓辺、 7 月 以降 直射 日光"),
            evidence: vs(&[
                "茎 の 根 元 が 黒 ずみ、 押す と ぐにゃ り と へこむ",
                "葉 を 取り除く と 内部 が 茶 色 ペースト 状",
                "根 を 引き抜く と 黒 ずん で 崩れる、 異臭 あり",
                "1 ヶ月 前 に 鉢 を 大きい もの へ 植え替え、 直後 から 水やり 頻 度 上昇",
                "受け 皿 滞水 は 無い が 鉢 が 大きく 乾き きら ない",
            ]),
            suspects: vec![Cause::Dryness, Cause::Overwatering, Cause::RootRot, Cause::Cold, Cause::Pest],
            culprit: Cause::RootRot,
            explanation: s("大 鉢 への 植え替え + 水やり 頻 度 維持 → 土 が 乾き きら ず 慢性 過湿 → 根 が 酸欠 で 黒 ずみ 異臭 — 根腐れ の 連鎖。 根腐れ 自体 が 致命 傷 で、 過湿 と は 別 段 階。 植え替え 後 は 鉢 サイズ に 合わせて 灌水 間 隔 を 延ばす。"),
        },
        Case {
            id: s("c12"),
            chapter: Chapter::Succulent,
            victim: s("セダム (Sedum)"),
            age: s("3 年"),
            found_at: s("2026-03-30"),
            conditions: s("室温 20°C、 湿度 38%、 北 向き 窓辺、 ほぼ 日光 なし"),
            evidence: vs(&[
                "茎 が 異常 に ひょろ 長く、 葉 と 葉 の 間隔 が 広い",
                "葉 色 は 鮮緑 から 薄い 黄緑 へ",
                "鉢 底 は 乾燥、 滲み や カビ なし、 害虫 痕跡 なし",
                "葉 表面 の 焦げ や 縁 の 茶 色 化 なし、 肥料 痕跡 なし",
                "水やり は 月 1 回 で 適切",
            ]),
            suspects: vec![Cause::Dryness, Cause::Overwatering, Cause::LowLight, Cause::Pest, Cause::FertilizerBurn],
            culprit: Cause::LowLight,
            explanation: s("セダム は 強光 を 好む 多肉 で、 光 不足 で 顕著 に 徒長 する。 茎 の 異常 伸長 + 葉 間隔 拡大 + 緑 の 薄色 化 — 光 不足 の 典型 症状。 鉢 内 は 健全 で 他 の 死因 を 除外 できる。"),
        },
    ]
}

pub fn find_case(id: &str) -> Option<Case> {
    all_cases().into_iter().find(|c| c.id == id)
}

pub fn cases_in_chapter(chapter: Chapter) -> Vec<Case> {
    all_cases().into_iter().filter(|c| c.chapter == chapter).collect()
}
