/// 12星座データベース — カラーパレット・運勢・特性
library;

class Constellation {
  final String name;
  final String symbol;
  final String element; // 火・地・風・水
  final String period;
  final List<int> primaryColor; // [r, g, b]
  final List<int> secondaryColor;
  final List<String> traits;
  final String luckyItem;

  const Constellation({
    required this.name,
    required this.symbol,
    required this.element,
    required this.period,
    required this.primaryColor,
    required this.secondaryColor,
    required this.traits,
    required this.luckyItem,
  });

  /// Calculate color distance (Euclidean in RGB space)
  double colorDistance(int r, int g, int b) {
    final dr = (r - primaryColor[0]).toDouble();
    final dg = (g - primaryColor[1]).toDouble();
    final db = (b - primaryColor[2]).toDouble();
    final d1 = dr * dr + dg * dg + db * db;

    final dr2 = (r - secondaryColor[0]).toDouble();
    final dg2 = (g - secondaryColor[1]).toDouble();
    final db2 = (b - secondaryColor[2]).toDouble();
    final d2 = dr2 * dr2 + dg2 * dg2 + db2 * db2;

    // Use the closer match (weighted average favoring primary)
    return d1 * 0.6 + d2 * 0.4;
  }
}

const constellations = [
  Constellation(
    name: '牡羊座',
    symbol: '♈',
    element: '火',
    period: '3/21〜4/19',
    primaryColor: [220, 50, 50],   // 情熱の赤
    secondaryColor: [255, 120, 50],
    traits: ['情熱的', '行動力', 'リーダーシップ', '勇敢'],
    luckyItem: '赤いアクセサリー',
  ),
  Constellation(
    name: '牡牛座',
    symbol: '♉',
    element: '地',
    period: '4/20〜5/20',
    primaryColor: [120, 180, 80],  // 大地の緑
    secondaryColor: [180, 140, 80],
    traits: ['安定志向', '忍耐力', '美的センス', '堅実'],
    luckyItem: '観葉植物',
  ),
  Constellation(
    name: '双子座',
    symbol: '♊',
    element: '風',
    period: '5/21〜6/21',
    primaryColor: [255, 220, 50],  // 輝く黄色
    secondaryColor: [200, 255, 150],
    traits: ['知的好奇心', '社交的', '柔軟性', '多才'],
    luckyItem: '黄色い手帳',
  ),
  Constellation(
    name: '蟹座',
    symbol: '♋',
    element: '水',
    period: '6/22〜7/22',
    primaryColor: [200, 220, 240],  // 月の白銀
    secondaryColor: [150, 180, 220],
    traits: ['家庭的', '感受性', '思いやり', '直感力'],
    luckyItem: '真珠のアクセサリー',
  ),
  Constellation(
    name: '獅子座',
    symbol: '♌',
    element: '火',
    period: '7/23〜8/22',
    primaryColor: [255, 180, 0],   // 太陽のゴールド
    secondaryColor: [255, 100, 0],
    traits: ['カリスマ性', '創造力', '自信', '寛大'],
    luckyItem: 'ゴールドのリング',
  ),
  Constellation(
    name: '乙女座',
    symbol: '♍',
    element: '地',
    period: '8/23〜9/22',
    primaryColor: [100, 140, 100],  // 森のグリーン
    secondaryColor: [180, 160, 120],
    traits: ['分析力', '几帳面', '実用的', '奉仕精神'],
    luckyItem: 'ラベンダーのサシェ',
  ),
  Constellation(
    name: '天秤座',
    symbol: '♎',
    element: '風',
    period: '9/23〜10/23',
    primaryColor: [200, 150, 200],  // エレガントな薄紫
    secondaryColor: [240, 200, 220],
    traits: ['バランス感覚', '社交性', '公平', '洗練'],
    luckyItem: 'ローズクォーツ',
  ),
  Constellation(
    name: '蠍座',
    symbol: '♏',
    element: '水',
    period: '10/24〜11/22',
    primaryColor: [100, 0, 50],    // 深紅・ダークレッド
    secondaryColor: [50, 0, 80],
    traits: ['洞察力', '集中力', '神秘的', '情熱'],
    luckyItem: 'ガーネットの石',
  ),
  Constellation(
    name: '射手座',
    symbol: '♐',
    element: '火',
    period: '11/23〜12/21',
    primaryColor: [100, 50, 200],   // 紫・インディゴ
    secondaryColor: [150, 100, 255],
    traits: ['冒険心', '楽観的', '哲学的', '自由'],
    luckyItem: 'ターコイズのブレスレット',
  ),
  Constellation(
    name: '山羊座',
    symbol: '♑',
    element: '地',
    period: '12/22〜1/19',
    primaryColor: [60, 60, 70],    // 岩のグレー
    secondaryColor: [100, 80, 60],
    traits: ['責任感', '忍耐力', '野心', '規律'],
    luckyItem: 'レザーの財布',
  ),
  Constellation(
    name: '水瓶座',
    symbol: '♒',
    element: '風',
    period: '1/20〜2/18',
    primaryColor: [50, 150, 220],   // 空のブルー
    secondaryColor: [0, 200, 200],
    traits: ['独創性', '人道的', '革新', '自由'],
    luckyItem: 'アメジストのペンダント',
  ),
  Constellation(
    name: '魚座',
    symbol: '♓',
    element: '水',
    period: '2/19〜3/20',
    primaryColor: [100, 200, 180],  // 海のターコイズ
    secondaryColor: [150, 180, 220],
    traits: ['共感力', '想像力', '直感', '優しさ'],
    luckyItem: 'アクアマリンの指輪',
  ),
];

/// Find the constellation that best matches a given RGB color
Constellation findMatchingConstellation(int r, int g, int b) {
  Constellation best = constellations[0];
  double bestDist = double.infinity;

  for (final c in constellations) {
    final dist = c.colorDistance(r, g, b);
    if (dist < bestDist) {
      bestDist = dist;
      best = c;
    }
  }

  return best;
}

/// Get constellation by name
Constellation? getConstellationByName(String name) {
  for (final c in constellations) {
    if (c.name == name) return c;
  }
  return null;
}

/// Get all constellation names
List<String> getAllConstellationNames() {
  return constellations.map((c) => c.name).toList();
}
