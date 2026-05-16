export type TopicKey = "cooking" | "gaming" | "vlog" | "edu" | "comedy" | "shorts";

export interface Topic {
  key: TopicKey;
  name: string;     // Japanese display
  color: string;    // hex
  shape: string;    // single-cell glyph used in CLI / fallback
  base_views: number;  // per-day baseline before multipliers
}

export const TOPICS: Topic[] = [
  { key: "cooking", name: "料理",       color: "#d49a3f", shape: "○", base_views: 80 },
  { key: "gaming",  name: "ゲーム",     color: "#6b6f9c", shape: "□", base_views: 100 },
  { key: "vlog",    name: "Vlog",       color: "#c47b76", shape: "△", base_views: 60 },
  { key: "edu",     name: "学び",       color: "#4a7d5a", shape: "✕", base_views: 70 },
  { key: "comedy",  name: "笑い",       color: "#b8945b", shape: "◇", base_views: 90 },
  { key: "shorts",  name: "ショート",   color: "#a08abf", shape: "▽", base_views: 140 },
];

export const TOPICS_BY_KEY: Record<TopicKey, Topic> =
  Object.fromEntries(TOPICS.map(t => [t.key, t])) as Record<TopicKey, Topic>;

export function getTopic(key: TopicKey): Topic {
  return TOPICS_BY_KEY[key];
}
