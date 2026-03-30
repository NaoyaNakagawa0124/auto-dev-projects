// Mole ASCII art variations and personality lines

export const moleArt = {
  happy: (message) => `\`\`\`
    ∩ ∩
   (・ω・)  < ${message}
   /  つ♪
\`\`\``,
  digging: `\`\`\`
    ∩ ∩
   (・ω・)つ ザクザク...
   /  |  ⛏️
\`\`\``,
  excited: (message) => `\`\`\`
    ∩ ∩
   (＞ω＜)  < ${message}
   ノ  つ✨
\`\`\``,
  sleepy: `\`\`\`
    ∩ ∩
   (－ω－) zzz...
   /  つ
\`\`\``,
  thinking: `\`\`\`
    ∩ ∩
   (・ω・) 🤔
   /  つ...
\`\`\``,
};

// Personality lines for different contexts
export const moleLines = {
  dig: [
    "地下深くから掘り出してきたよ！",
    "おっ、いいの見つけた！これどう？",
    "ザクザク...お、これは面白そう！",
    "土の中にこんな宝物が埋まってた！",
    "今回のはちょっと変わり種だよ🕳️",
    "掘って掘って...はい、出ました！",
    "地下300mから持ってきたよ（嘘）",
    "これ、意外とハマる人多いんだよね",
    "モグラの目利き、信じてみて！",
    "今日のおすすめはこれだ〜！",
  ],
  quiz: [
    "うーん、あなたのタイプは...",
    "分析中...モグラの勘は鋭いよ？",
    "なるほどなるほど...見えてきた！",
    "地下のデータベースと照合中...",
  ],
  challenge: [
    "今日のチャレンジ、やってみる？",
    "サボったらトンネル崩すよ？（冗談）",
    "小さな一歩が大きな趣味になるかも！",
    "今日も一緒に頑張ろう！",
  ],
  streak: [
    "{n}日連続！すごいじゃん！",
    "{n}日目！もはやプロだね！",
    "連続{n}日...モグラも見習わないと",
    "{n}日継続中！地下世界でも噂になってるよ",
  ],
  encouragement: [
    "退屈な時間は新しい趣味への入り口だよ",
    "何もしない日があってもいい。でも、ちょっとだけ冒険してみない？",
    "モグラだって穴掘りを趣味にしてるんだから、何でもアリだよ",
    "新しいことを始めるのに遅すぎることはないよ！",
  ],
  noHobbies: [
    "まだ趣味コレクションが空っぽだ...掘りに行こう！",
    "コレクションがゼロ？よし、まずは /dig してみよう！",
  ],
  rated: [
    "評価ありがとう！参考にするね",
    "了解！メモメモ...📝",
    "なるほど、そういう感想か〜",
    "フィードバック大事！ありがとね",
  ],
  error: [
    "あわわ...何かおかしいよ。もう一回試してみて！",
    "トンネルが崩れた...じゃなくてエラーだよ。もう一回！",
    "モグラの穴に落ちちゃった...リトライしてね",
  ],
};

// Pick a random line from a category
export function pickLine(category) {
  const lines = moleLines[category];
  if (!lines || lines.length === 0) return "";
  return lines[Math.floor(Math.random() * lines.length)];
}

// Pick a streak line with the number substituted
export function pickStreakLine(n) {
  const line = pickLine("streak");
  return line.replace("{n}", String(n));
}
