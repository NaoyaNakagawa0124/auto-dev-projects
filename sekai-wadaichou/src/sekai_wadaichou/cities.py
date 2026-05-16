"""Static city data — 12 cities spaced roughly around the equator.

Each entry includes a today's-cultural-tilt event line and an interview
talking-point — both deliberately gentle (no 「頑張」「絶対」「勝ち組」 etc).
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class City:
    id: str
    jp: str
    lon: float          # longitude in degrees, east-positive
    event: str
    talking_point: str


CITIES: tuple[City, ...] = (
    City(
        id="newyork",
        jp="ニューヨーク",
        lon=-74.0,
        event="ブロードウェイの夏季公演が組まれ始める時期で、 5 月の夜の劇場街は人で賑わいます。",
        talking_point="「人を惹きつける物語の構造」 をブロードウェイから学べるという視点は、 営業/企画の面接で使えます。",
    ),
    City(
        id="saopaulo",
        jp="サンパウロ",
        lon=-46.6,
        event="この時期は秋の入口で、 ビエンナーレや音楽フェスが開かれる落ち着いた季節です。",
        talking_point="ブラジルは資源と多様な民族構成を併せ持つ国で、 商社や食品メーカーの志望動機に厚みを足せます。",
    ),
    City(
        id="london",
        jp="ロンドン",
        lon=-0.1,
        event="チェルシー・フラワーショーの準備期間で、 庭園文化がメディアを賑わせます。",
        talking_point="英国の「庭」 はパブリック空間設計の思想に直結する話題で、 不動産/都市計画系で重宝されます。",
    ),
    City(
        id="paris",
        jp="パリ",
        lon=2.4,
        event="カンヌ国際映画祭の真っ最中で、 街のカフェの話題は映画一色になりやすい時期です。",
        talking_point="映画祭は配給/版権/PR の意思決定の場でもあり、 メディア・広告業界の志望理由に厚みが出ます。",
    ),
    City(
        id="berlin",
        jp="ベルリン",
        lon=13.4,
        event="緑が増える季節で、 街中のビアガルテンと自転車レーンが本格稼働します。",
        talking_point="ドイツの 自動車/エネルギー転換 は世界の脱炭素の試金石、 重工/インフラ志望でよく問われます。",
    ),
    City(
        id="istanbul",
        jp="イスタンブール",
        lon=29.0,
        event="ボスポラス海峡を渡るフェリーから見える夕景が一年で最も柔らかくなる季節です。",
        talking_point="イスタンブールは欧州・中東・アジアを物流で結ぶ要所で、 商社/海運の志望理由を立体化できます。",
    ),
    City(
        id="mumbai",
        jp="ムンバイ",
        lon=72.8,
        event="モンスーン前の蒸し暑い時期で、 ストリートの紅茶屋台が一年で最も忙しくなります。",
        talking_point="インドの中間層拡大は IT/消費財メーカーの中期戦略に直接効くテーマで、 業界研究で外せません。",
    ),
    City(
        id="singapore",
        jp="シンガポール",
        lon=103.8,
        event="ハワカー文化遺産デーが近く、 屋台街の歴史を学ぶイベントが組まれる時期です。",
        talking_point="シンガポールは多国籍企業の APAC ハブで、 金融/総合商社/物流の志望動機に深みが出ます。",
    ),
    City(
        id="shanghai",
        jp="上海",
        lon=121.5,
        event="蘇州河沿いのカフェ文化が定着し、 旧倉庫のリノベ店舗が休日に賑わう時期です。",
        talking_point="上海の都市更新は東京の渋谷再開発と比較しやすく、 不動産/小売の業界研究で具体例として使えます。",
    ),
    City(
        id="tokyo",
        jp="東京",
        lon=139.7,
        event="新入社員研修が一段落し、 都内の書店では業界研究本のコーナーが薄くなる時期です。",
        talking_point="春採用と秋採用の境界期で、 採用市場の二期化の話題は人事/コンサルでよく拾われます。",
    ),
    City(
        id="sydney",
        jp="シドニー",
        lon=151.2,
        event="南半球は秋の終わりで、 ビビッド・シドニー (光の祭典) の準備が街角で始まる時期です。",
        talking_point="観光×テクノロジー の事例として、 ビビッドは旅行/エンタメ系の業界研究で外せない話題です。",
    ),
    City(
        id="johannesburg",
        jp="ヨハネスブルグ",
        lon=28.0,
        event="鉱山博物館の特別展や、 アフリカ大陸の音楽祭の前夜祭がメディアに出始める時期です。",
        talking_point="アフリカは資源価格と若年人口で投資テーマが続き、 商社/インフラ/金融で必須の地域知識です。",
    ),
)


def by_id(city_id: str) -> City | None:
    for c in CITIES:
        if c.id == city_id:
            return c
    return None


def sorted_by_longitude() -> list[City]:
    """Cities in west-to-east longitude order — used as the rotation order."""
    return sorted(CITIES, key=lambda c: c.lon)


BANNED_WORDS: tuple[str, ...] = (
    "頑張", "努力", "がんばれ", "絶対", "成功", "勝ち組",
    "受かる!", "正解はこれ", "確実",
)
