/**
 * Question Engine — Psychology-backed prompts for travel journaling
 *
 * Based on nostalgia research: sensory details, social connections,
 * and meaning-making increase the emotional value of memories.
 */

export interface Question {
  text: string;
  category: "sensory" | "emotion" | "social" | "meaning" | "nostalgia" | "discovery";
  phase: "start" | "middle" | "end" | "any";
  timeOfDay?: "morning" | "afternoon" | "evening" | "night";
}

export const QUESTIONS: Question[] = [
  // ===== 旅の始まり (Start) =====
  { text: "この旅で、一番楽しみにしていることは何ですか？", category: "emotion", phase: "start" },
  { text: "家を出る時、最後に振り返った景色はどんなものでしたか？", category: "nostalgia", phase: "start" },
  { text: "今、どんな気持ちで旅の第一歩を踏み出しましたか？", category: "emotion", phase: "start" },
  { text: "この街に来ようと思った、一番小さなきっかけは何でしたか？", category: "meaning", phase: "start" },
  { text: "空港や駅で見かけた、印象に残った人はいましたか？", category: "social", phase: "start" },

  // ===== 旅の途中 (Middle) — 五感 =====
  { text: "今、目を閉じたら聞こえてくる音は何ですか？", category: "sensory", phase: "middle" },
  { text: "この街の匂いを一言で表すなら？", category: "sensory", phase: "middle" },
  { text: "今日、手で触れたもので一番記憶に残ったものは？", category: "sensory", phase: "middle" },
  { text: "ここの光は、あなたの街とどう違いますか？", category: "sensory", phase: "middle" },
  { text: "今日食べたもので、一番心に残った味は？", category: "sensory", phase: "middle" },
  { text: "窓の外の景色を、誰かに伝えるとしたらどう描写しますか？", category: "sensory", phase: "middle" },

  // ===== 旅の途中 — 感情 =====
  { text: "今日、一番心が動いた瞬間はいつでしたか？", category: "emotion", phase: "middle" },
  { text: "ふと寂しくなった瞬間はありましたか？それはいつ？", category: "emotion", phase: "middle" },
  { text: "思わず笑顔になった出来事はありましたか？", category: "emotion", phase: "middle" },
  { text: "今、一番伝えたい人に何と言いたいですか？", category: "emotion", phase: "middle" },
  { text: "この瞬間を、10年後の自分はどう思い出すでしょうか？", category: "nostalgia", phase: "middle" },
  { text: "もし時間が止まるなら、今日のどの瞬間で止めたいですか？", category: "emotion", phase: "middle" },

  // ===== 旅の途中 — 人との出会い =====
  { text: "今日、言葉を交わした人はいましたか？どんな会話でしたか？", category: "social", phase: "middle" },
  { text: "地元の人の何気ない仕草で、印象に残ったものはありますか？", category: "social", phase: "middle" },
  { text: "一人でいることの良さを感じた瞬間はありましたか？", category: "social", phase: "middle" },
  { text: "誰かと一緒に見たかった景色はありましたか？", category: "social", phase: "middle" },

  // ===== 旅の途中 — 発見 =====
  { text: "ガイドブックに載っていない、あなただけの発見はありましたか？", category: "discovery", phase: "middle" },
  { text: "期待と違ったけれど、それが良かったと思えることは？", category: "discovery", phase: "middle" },
  { text: "この旅で、自分について新しく気づいたことはありますか？", category: "meaning", phase: "middle" },
  { text: "道に迷ったり、予定が変わったりしましたか？それはどんな時間でしたか？", category: "discovery", phase: "middle" },

  // ===== 旅の途中 — 意味 =====
  { text: "この旅が、あなたの何かを変えている気がしますか？", category: "meaning", phase: "middle" },
  { text: "いつもの自分と、旅の自分は、どこが違いますか？", category: "meaning", phase: "middle" },
  { text: "この場所に「ただいま」と言える日は来るでしょうか？", category: "nostalgia", phase: "middle" },

  // ===== 時間帯 =====
  { text: "おはようございます。窓を開けたら、どんな朝でしたか？", category: "sensory", phase: "any", timeOfDay: "morning" },
  { text: "昼下がりの今、何をしていますか？", category: "emotion", phase: "any", timeOfDay: "afternoon" },
  { text: "夕暮れの色はどんな色でしたか？", category: "sensory", phase: "any", timeOfDay: "evening" },
  { text: "夜、一人の部屋で何を考えていますか？", category: "emotion", phase: "any", timeOfDay: "night" },
  { text: "今夜の空に、星は見えますか？", category: "sensory", phase: "any", timeOfDay: "night" },

  // ===== ノスタルジア =====
  { text: "この景色を見て、ふと思い出した記憶はありますか？", category: "nostalgia", phase: "any" },
  { text: "故郷の何かを恋しいと思いましたか？", category: "nostalgia", phase: "any" },
  { text: "この旅で撮った写真の中で、一番見返したくなるのはどれですか？", category: "nostalgia", phase: "any" },
  { text: "帰ったら最初にしたいことは何ですか？", category: "nostalgia", phase: "any" },

  // ===== 旅の終わり (End) =====
  { text: "この旅を一つの色で表すなら、何色ですか？", category: "meaning", phase: "end" },
  { text: "持ってきた荷物の中で、一番役に立ったものは何でしたか？", category: "discovery", phase: "end" },
  { text: "この旅で出会った人の中で、もう一度会いたい人はいますか？", category: "social", phase: "end" },
  { text: "旅の前の自分に、何か伝えたいことはありますか？", category: "meaning", phase: "end" },
  { text: "この場所の何が、一番あなたの心に残りましたか？", category: "emotion", phase: "end" },
  { text: "さようならの代わりに、この街に何と言いますか？", category: "nostalgia", phase: "end" },
];

export const MOODS = [
  { key: "joyful", label: "嬉しい", emoji: "😊" },
  { key: "peaceful", label: "穏やか", emoji: "🌿" },
  { key: "excited", label: "わくわく", emoji: "✨" },
  { key: "nostalgic", label: "懐かしい", emoji: "🌅" },
  { key: "lonely", label: "少し寂しい", emoji: "🌙" },
  { key: "grateful", label: "感謝", emoji: "🙏" },
  { key: "moved", label: "感動", emoji: "💧" },
  { key: "curious", label: "好奇心", emoji: "🔍" },
  { key: "tired", label: "疲れた", emoji: "😴" },
  { key: "free", label: "自由", emoji: "🕊️" },
];

/**
 * Get the current time-of-day category
 */
export function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

/**
 * Determine trip phase based on entry count and trip duration
 */
export function getTripPhase(entryCount: number, tripDays: number): "start" | "middle" | "end" {
  if (entryCount <= 2) return "start";
  if (tripDays >= 3 && entryCount >= tripDays * 2) return "end";
  return "middle";
}

/**
 * Select a contextually appropriate question
 */
export function pickQuestion(entryCount: number, tripDays: number, usedQuestions: string[] = []): Question {
  const phase = getTripPhase(entryCount, tripDays);
  const timeOfDay = getTimeOfDay();

  // Filter by phase
  let candidates = QUESTIONS.filter(q => q.phase === phase || q.phase === "any");

  // Prefer time-of-day matches
  const timeCandidates = candidates.filter(q => q.timeOfDay === timeOfDay || !q.timeOfDay);
  if (timeCandidates.length > 0) {
    candidates = timeCandidates;
  }

  // Filter out recently used questions
  if (usedQuestions.length > 0) {
    const unused = candidates.filter(q => !usedQuestions.includes(q.text));
    if (unused.length > 0) {
      candidates = unused;
    }
  }

  // Random selection
  const idx = Math.floor(Math.random() * candidates.length);
  return candidates[idx];
}

/**
 * Get mood by key
 */
export function getMoodByKey(key: string) {
  return MOODS.find(m => m.key === key) || null;
}
