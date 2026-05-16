#include "film.h"

#include <stddef.h>

static const Film FILMS[FILM_COUNT] = {
    { .title="氷の都",        .director="北原 真理子",  .genre=GENRE_ACTION,     .month=1,  .budget_oku=80, .hype=72, .seed_return_x10=14, .pitch="極寒の都市で繰り広げられる雪上アクション" },
    { .title="日常の地層",    .director="ファン・グェン",.genre=GENRE_DRAMA,      .month=2,  .budget_oku=18, .hype=58, .seed_return_x10=18, .pitch="3 世代 100 年を 1 つの団地で描く家族劇" },
    { .title="ロボットと俺",  .director="ジョン・パーカー",.genre=GENRE_COMEDY,   .month=3,  .budget_oku=24, .hype=66, .seed_return_x10=12, .pitch="壊れたロボットと中年男が織りなす春" },
    { .title="深い森の声",    .director="アナ・カーソン",.genre=GENRE_HORROR,     .month=4,  .budget_oku=12, .hype=80, .seed_return_x10=22, .pitch="森に消えた配信者の最後の動画が…" },
    { .title="月面ピクニック",.director="ヘニー・W・カー", .genre=GENRE_SF,       .month=5,  .budget_oku=150,.hype=88, .seed_return_x10=20, .pitch="2058 年、月の表で家族 4 人が出会うもの" },
    { .title="絵筆と都市",    .director="高峰 千尋",    .genre=GENRE_ANIMATION,  .month=6,  .budget_oku=60, .hype=90, .seed_return_x10=24, .pitch="絵筆で建物を蘇らせる少女のロードムービー" },
    { .title="海底の図書館",  .director="エルザ・ロビン", .genre=GENRE_DRAMA,    .month=7,  .budget_oku=42, .hype=54, .seed_return_x10=10, .pitch="沈没した豪華客船の図書室を舞台にした静謐な群像劇" },
    { .title="氷河発電所",    .director="ヤン・モリス", .genre=GENRE_DOCUMENTARY,.month=8,  .budget_oku=6,  .hype=32, .seed_return_x10=16, .pitch="氷河直下に建設中の発電所を 5 年追ったドキュメント" },
    { .title="赤い列車",      .director="斎藤 慎平",    .genre=GENRE_ACTION,     .month=9,  .budget_oku=72, .hype=68, .seed_return_x10=15, .pitch="満員列車を舞台にした密室クライム" },
    { .title="ねむれない王女",.director="ソフィア・キム", .genre=GENRE_ANIMATION,.month=10, .budget_oku=38, .hype=78, .seed_return_x10=19, .pitch="眠れない王女のための、世界を旅する子守歌" },
    { .title="星の検査官",    .director="マハト・サミー",.genre=GENRE_SF,         .month=11, .budget_oku=110,.hype=84, .seed_return_x10=21, .pitch="銀河系全惑星の品質を検査する公務員の話" },
    { .title="灯火少女",      .director="森 桃子",      .genre=GENRE_DRAMA,      .month=12, .budget_oku=22, .hype=62, .seed_return_x10=17, .pitch="冬至の夜、街の灯を点しに歩く 17 歳の物語" },
};

const Film *film_get(int index) {
    if (index < 0 || index >= FILM_COUNT) return NULL;
    return &FILMS[index];
}

int film_count(void) { return FILM_COUNT; }

const char *genre_label_jp(Genre g) {
    switch (g) {
        case GENRE_ACTION:      return "アクション";
        case GENRE_DRAMA:       return "ドラマ";
        case GENRE_COMEDY:      return "コメディ";
        case GENRE_HORROR:      return "ホラー";
        case GENRE_SF:          return "SF";
        case GENRE_ANIMATION:   return "アニメ";
        case GENRE_DOCUMENTARY: return "ドキュメンタリー";
    }
    return "?";
}
