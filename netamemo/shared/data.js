// shared/data.js — Default data, categories, constants

export const CATEGORIES = {
  tutorial: { label: "チュートリアル", emoji: "📖", color: "#4ECDC4" },
  review:   { label: "レビュー",       emoji: "⭐", color: "#FFB347" },
  vlog:     { label: "Vlog",           emoji: "🎥", color: "#FF6B6B" },
  short:    { label: "ショート",       emoji: "⚡", color: "#A855F7" },
  collab:   { label: "コラボ",         emoji: "🤝", color: "#3B82F6" },
  other:    { label: "その他",         emoji: "💡", color: "#6B7280" },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES);

export const SORT_OPTIONS = {
  newest:    "新しい順",
  potential: "ポテンシャル高い順",
  votes:     "投票多い順",
  trend:     "トレンド順",
};

export const RATING_LABELS = {
  potential: { label: "ポテンシャル", desc: "どれくらいバズりそう？",     color: "#FF6B6B" },
  effort:    { label: "工数",         desc: "作るのにかかる手間は？",     color: "#FFB347" },
  trend:     { label: "トレンド度",   desc: "今のトレンドに乗ってる？",   color: "#4ECDC4" },
};

export const DEFAULT_SETTINGS = {
  username: "",
};

export function generateId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : "xxxx-xxxx-xxxx".replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
}

export function createIdea(overrides = {}) {
  return {
    id: generateId(),
    title: "",
    url: "",
    description: "",
    thumbnail: null,
    category: "other",
    ratings: {
      potential: 3,
      effort: 3,
      trend: 3,
    },
    votes: {
      up: [],
      down: [],
    },
    createdBy: "",
    createdAt: new Date().toISOString(),
    source: "manual",
    ...overrides,
  };
}
