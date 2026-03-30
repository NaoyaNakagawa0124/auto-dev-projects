// Quiz questions and scoring logic

export const quizQuestions = [
  {
    id: 1,
    question: "休日の朝、まず何がしたい？",
    options: [
      { label: "何か作りたい！", value: "create", scores: { creative: 3, learning: 1 } },
      { label: "外に出て体を動かす", value: "move", scores: { physical: 3, relaxation: 1 } },
      { label: "友達と会いたい", value: "social", scores: { social: 3, physical: 1 } },
      { label: "新しいことを学びたい", value: "learn", scores: { learning: 3, creative: 1 } },
      { label: "のんびり過ごしたい", value: "relax", scores: { relaxation: 3, social: 1 } },
    ],
  },
  {
    id: 2,
    question: "一人と大勢、どっちが好き？",
    options: [
      { label: "断然ひとり！集中できるし", value: "solo", scores: { creative: 2, relaxation: 2, learning: 1 } },
      { label: "少人数がちょうどいい", value: "small", scores: { social: 1, learning: 2, creative: 1 } },
      { label: "大勢でワイワイが最高！", value: "group", scores: { social: 3, physical: 1 } },
      { label: "気分による", value: "depends", scores: { creative: 1, physical: 1, social: 1, learning: 1, relaxation: 1 } },
    ],
  },
  {
    id: 3,
    question: "お金をかけるなら何に？",
    options: [
      { label: "道具や材料", value: "tools", scores: { creative: 3, learning: 1 } },
      { label: "体験やアクティビティ", value: "experience", scores: { physical: 2, social: 2 } },
      { label: "本やコース", value: "education", scores: { learning: 3, creative: 1 } },
      { label: "癒しグッズ", value: "wellness", scores: { relaxation: 3, creative: 1 } },
      { label: "あまりお金はかけたくない", value: "free", scores: { physical: 2, relaxation: 1, learning: 1 } },
    ],
  },
  {
    id: 4,
    question: "体を動かすのは？",
    options: [
      { label: "大好き！毎日でもOK", value: "love", scores: { physical: 3, social: 1 } },
      { label: "たまにならいいかな", value: "sometimes", scores: { physical: 1, relaxation: 1, social: 1 } },
      { label: "インドア派です...", value: "indoor", scores: { creative: 2, learning: 2, relaxation: 1 } },
      { label: "ゆるい運動なら", value: "gentle", scores: { relaxation: 2, physical: 1, social: 1 } },
    ],
  },
  {
    id: 5,
    question: "新しいことを覚えるのは？",
    options: [
      { label: "ワクワクする！知識欲の塊", value: "excited", scores: { learning: 3, creative: 1 } },
      { label: "実用的なことなら", value: "practical", scores: { learning: 2, physical: 1, creative: 1 } },
      { label: "手を動かしながら覚えたい", value: "hands_on", scores: { creative: 2, physical: 2 } },
      { label: "あまり難しいのは...", value: "easy", scores: { relaxation: 2, social: 2 } },
    ],
  },
];

// Calculate category scores from quiz answers
export function calculateQuizScores(answers) {
  const scores = { creative: 0, physical: 0, social: 0, learning: 0, relaxation: 0 };

  for (const answer of answers) {
    const question = quizQuestions.find((q) => q.id === answer.questionId);
    if (!question) continue;
    const option = question.options.find((o) => o.value === answer.value);
    if (!option) continue;

    for (const [category, score] of Object.entries(option.scores)) {
      scores[category] = (scores[category] || 0) + score;
    }
  }

  return scores;
}

// Get the top category from scores
export function getTopCategory(scores) {
  let topCategory = "creative";
  let topScore = 0;
  for (const [category, score] of Object.entries(scores)) {
    if (score > topScore) {
      topScore = score;
      topCategory = category;
    }
  }
  return topCategory;
}

// Get sorted categories by score
export function getSortedCategories(scores) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([category, score]) => ({ category, score }));
}
