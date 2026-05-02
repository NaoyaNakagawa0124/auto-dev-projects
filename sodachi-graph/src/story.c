#include "story.h"
#include <stddef.h>

const Chapter STORY[CHAPTER_COUNT] = {
    {
        .title = "第一章　いのちのはじまり",
        .age_range = "0〜2歳",
        .intro_1 = "はじめての我が子。喜びと不安が、毎日を交互に染めていく。",
        .intro_2 = "夜中の授乳、抱っこ、おむつ替え。すべてが新しい挑戦だ。",
        .choices = {
            {
                .prompt = "深夜2時。子どもが激しく泣いている。",
                .opt_a = "A. すぐ抱き上げて、優しく寝かしつける",
                .opt_b = "B. 少し様子を見て、自分で落ち着くのを待つ",
                .response_a = "腕の中で、すやすやと眠る我が子。安心の温もりが流れ込む。",
                .response_b = "数分後、自分で泣き止んだ。たくましさの芽がそこにある。",
                .delta_a = {0, 0, 4, 7},
                .delta_b = {5, 6, 0, 0}
            },
            {
                .prompt = "はじめての離乳食。何を作ろうか。",
                .opt_a = "A. 旬の野菜をすりつぶし、栄養を最優先",
                .opt_b = "B. 色とりどりに盛り付け、見た目を楽しく",
                .response_a = "もぐもぐとよく食べてくれる。健やかな身体の基礎ができていく。",
                .response_b = "色彩に目を輝かせる我が子。感性のスイッチが、確かに入った。",
                .delta_a = {2, 0, 9, 0},
                .delta_b = {3, 0, 0, 7}
            }
        }
    },
    {
        .title = "第二章　はじめての社会",
        .age_range = "3〜5歳",
        .intro_1 = "歩き、話し、自我が芽生える時期。子どもの世界が、ぐんと広がっていく。",
        .intro_2 = "公園、保育園、絵本、テレビ。さまざまな刺激に触れる毎日だ。",
        .choices = {
            {
                .prompt = "公園で、他の子のおもちゃを取ろうとしている。",
                .opt_a = "A. その場で「貸してと言おうね」と諭す",
                .opt_b = "B. 一緒に遊べるよう、橋渡しをする",
                .response_a = "ちゃんと「貸して」と言えた我が子。礼節の芽が伸びていく。",
                .response_b = "二人で笑顔になる。共感する力が、静かに育っていく。",
                .delta_a = {3, 9, 0, 0},
                .delta_b = {0, 5, 0, 6}
            },
            {
                .prompt = "雨の日。外で遊びたいと泣いている。",
                .opt_a = "A. 室内で工作や絵本を一緒に",
                .opt_b = "B. レインコートを着せて、思い切り外へ",
                .response_a = "色紙を切ったり貼ったり。頭をフル回転させる時間。",
                .response_b = "水たまりを跳ね、全身ずぶ濡れに。生命力の発露だ。",
                .delta_a = {8, 0, 0, 4},
                .delta_b = {0, 0, 9, 3}
            }
        }
    },
    {
        .title = "第三章　学校という冒険",
        .age_range = "6〜8歳",
        .intro_1 = "小学校に入学し、新しい人間関係が始まった。",
        .intro_2 = "宿題、習い事、友達との遊び。子どものスケジュールも忙しくなる。",
        .choices = {
            {
                .prompt = "宿題そっちのけで、ゲームに夢中になっている。",
                .opt_a = "A. ルールを決めて、時間管理を一緒に考える",
                .opt_b = "B. ゲームに混ざってやり込み、それから話す",
                .response_a = "タイマーをセットし、自分で切り替える術を覚えた。",
                .response_b = "信頼できる味方として、本音で語り合えた夜。",
                .delta_a = {5, 6, 0, 0},
                .delta_b = {0, 3, 0, 8}
            },
            {
                .prompt = "友達と喧嘩。しょげて帰ってきた。",
                .opt_a = "A. じっくり話を聞き、気持ちを整理する",
                .opt_b = "B. スポーツで気分転換、外で一緒に走ろう",
                .response_a = "話すうちに、自分の気持ちが少しずつ見えてきた。",
                .response_b = "汗を流したら、いつのまにか笑顔が戻っていた。",
                .delta_a = {0, 3, 0, 9},
                .delta_b = {0, 0, 8, 3}
            }
        }
    },
    {
        .title = "第四章　自分という発見",
        .age_range = "9〜11歳",
        .intro_1 = "高学年になり、子どもは少し大人びてきた。",
        .intro_2 = "苦手なこと、得意なこと。子ども自身が「自分」を意識し始める頃だ。",
        .choices = {
            {
                .prompt = "苦手な算数のテスト、点数が良くなかった。",
                .opt_a = "A. 一緒に丁寧に解き直す",
                .opt_b = "B. 「次がんばろう」とサッカーへ誘う",
                .response_a = "間違えた問題が腑に落ちた瞬間、目が輝いた。",
                .response_b = "ボールを蹴るうちに、気持ちが切り替わっていった。",
                .delta_a = {9, 0, 0, 3},
                .delta_b = {0, 0, 6, 5}
            },
            {
                .prompt = "地域のボランティア。行きたくないと言う。",
                .opt_a = "A. 行く価値を話し、そっと背中を押す",
                .opt_b = "B. 本人の意思を尊重し、家で過ごす",
                .response_a = "終わったあと、誇らしげな顔をしていた。",
                .response_b = "今日は休む。それも大切な選択だと、共に学んだ。",
                .delta_a = {3, 8, 0, 0},
                .delta_b = {5, 0, 0, 5}
            }
        }
    },
    {
        .title = "第五章　旅立ちの予感",
        .age_range = "12〜15歳",
        .intro_1 = "中学生になり、思春期の入口。子どもは親から、少しずつ離れていく。",
        .intro_2 = "寂しさを感じながら、新しい関わり方を模索する時期だ。",
        .choices = {
            {
                .prompt = "反抗期。最近、口数が減ってきた。",
                .opt_a = "A. 距離を保ちつつ、毎日一言だけ声をかける",
                .opt_b = "B. 共通の趣味の時間を、意識的に作る",
                .response_a = "短い返事でも、つながりは確かに残っている。",
                .response_b = "並んで何かをする時間が、絆を深く育てた。",
                .delta_a = {0, 3, 0, 9},
                .delta_b = {0, 0, 6, 5}
            },
            {
                .prompt = "進路で悩んでいる。相談に来た。",
                .opt_a = "A. データと現実を見せ、選択肢を整理",
                .opt_b = "B. 心の声に共感し、選んだ道を後押し",
                .response_a = "情報をもとに、自分で決めることができた。",
                .response_b = "心が決まった瞬間、目に光が戻った。",
                .delta_a = {9, 4, 0, 0},
                .delta_b = {0, 5, 0, 7}
            }
        }
    }
};

const Ending ALL_ENDINGS[] = {
    {.min_chi = 80, .min_toku = 0, .min_tai = 0, .min_jou = 0, .dominance_threshold = 12,
     .title = "学究の徒",
     .body = "知の世界を切り拓く人になりました。\n本に囲まれ、疑問を追い、真実に手を伸ばす。\nその知性が、いつか誰かの道しるべになるでしょう。"},
    {.min_chi = 0, .min_toku = 80, .min_tai = 0, .min_jou = 0, .dominance_threshold = 12,
     .title = "支える人",
     .body = "人々を支える存在として、社会に光を届ける人になりました。\n誰かの困難に手を差し伸べ、正しさを行動で示す。\nその誠実さが、世界を少しずつ温めていきます。"},
    {.min_chi = 0, .min_toku = 0, .min_tai = 80, .min_jou = 0, .dominance_threshold = 12,
     .title = "躍動する人",
     .body = "強く、しなやかな身体で、世界を駆け抜ける人になりました。\nグラウンドで、山で、海で。\nその生命力が、見る人すべてに勇気を与えるでしょう。"},
    {.min_chi = 0, .min_toku = 0, .min_tai = 0, .min_jou = 80, .dominance_threshold = 12,
     .title = "感性の人",
     .body = "豊かな感性で、人の心を動かす人になりました。\n音楽、絵、言葉、写真。\nその表現が、誰かの夜に灯をともすでしょう。"},
    {.min_chi = 70, .min_toku = 70, .min_tai = 0, .min_jou = 0, .dominance_threshold = 999,
     .title = "賢者",
     .body = "知性と徳を兼ね備え、正しく導く存在になりました。\nリーダーとして、教育者として、研究者として。\nその知恵と誠実さが、組織や地域を支えていくでしょう。"},
    {.min_chi = 70, .min_toku = 0, .min_tai = 70, .min_jou = 0, .dominance_threshold = 999,
     .title = "文武両道の人",
     .body = "理論と実践を兼ね備えた人になりました。\nスポーツ科学者、医師、技術者。\nその両輪が、自分にも世界にも力を与えるでしょう。"},
    {.min_chi = 70, .min_toku = 0, .min_tai = 0, .min_jou = 70, .dominance_threshold = 999,
     .title = "知と感性のクリエイター",
     .body = "知性と感性を融合させたクリエイターになりました。\nゲーム、映画、メディア、アート。\n論理と詩情が同居する作品で、世界を驚かせるでしょう。"},
    {.min_chi = 0, .min_toku = 70, .min_tai = 70, .min_jou = 0, .dominance_threshold = 999,
     .title = "行動するリーダー",
     .body = "仲間を率いる、行動の人になりました。\nスポーツチーム、地域、現場。\nその誠実さと体力が、人を引きつけるでしょう。"},
    {.min_chi = 0, .min_toku = 70, .min_tai = 0, .min_jou = 70, .dominance_threshold = 999,
     .title = "寄り添う支え手",
     .body = "共感する人として、誰かの人生に寄り添う人になりました。\n看護、介護、心理、教育。\nその温かさが、傷ついた人の安心になるでしょう。"},
    {.min_chi = 0, .min_toku = 0, .min_tai = 70, .min_jou = 70, .dominance_threshold = 999,
     .title = "全身で表現する人",
     .body = "全身で表現する、生命力の人になりました。\nダンス、舞台、パフォーマンス。\nその躍動が、観客の魂を揺さぶるでしょう。"},
    {.min_chi = 60, .min_toku = 60, .min_tai = 60, .min_jou = 60, .dominance_threshold = 999,
     .title = "全人格的な大人",
     .body = "知・徳・体・情。すべてが調和した人になりました。\nどんな道でも歩める、しなやかな強さがあります。\nあなたが手渡したものは、確かに次の世代へ受け継がれていくでしょう。"},
    {.min_chi = 0, .min_toku = 0, .min_tai = 0, .min_jou = 0, .dominance_threshold = 999,
     .title = "自分の道を歩む人",
     .body = "派手な肩書きはないかもしれません。\nでも、自分の歩幅で、毎日を積み重ねていく人になりました。\nそれは、何より尊い育ちのかたちです。"}
};

const int ALL_ENDINGS_COUNT = (int)(sizeof(ALL_ENDINGS) / sizeof(ALL_ENDINGS[0]));

static int max4(int a, int b, int c, int d) {
    int m = a;
    if (b > m) m = b;
    if (c > m) m = c;
    if (d > m) m = d;
    return m;
}

const Ending *select_ending(Stats s) {
    int top = max4(s.chi, s.toku, s.tai, s.jou);
    int min_v = s.chi;
    if (s.toku < min_v) min_v = s.toku;
    if (s.tai < min_v) min_v = s.tai;
    if (s.jou < min_v) min_v = s.jou;

    if (top - min_v <= 8 && s.chi >= 60 && s.toku >= 60 && s.tai >= 60 && s.jou >= 60) {
        return &ALL_ENDINGS[10];
    }

    int high_count = 0;
    int high_chi = (s.chi >= top - 4);
    int high_toku = (s.toku >= top - 4);
    int high_tai = (s.tai >= top - 4);
    int high_jou = (s.jou >= top - 4);
    high_count = high_chi + high_toku + high_tai + high_jou;

    if (high_count == 1 && top >= 75) {
        if (high_chi) return &ALL_ENDINGS[0];
        if (high_toku) return &ALL_ENDINGS[1];
        if (high_tai) return &ALL_ENDINGS[2];
        if (high_jou) return &ALL_ENDINGS[3];
    }
    if (high_count == 2) {
        if (high_chi && high_toku) return &ALL_ENDINGS[4];
        if (high_chi && high_tai) return &ALL_ENDINGS[5];
        if (high_chi && high_jou) return &ALL_ENDINGS[6];
        if (high_toku && high_tai) return &ALL_ENDINGS[7];
        if (high_toku && high_jou) return &ALL_ENDINGS[8];
        if (high_tai && high_jou) return &ALL_ENDINGS[9];
    }

    return &ALL_ENDINGS[11];
}
