import type { TopicKey } from "./topics.ts";
import type { RNG } from "./rng.ts";

export type WeatherKey =
  | "calm"
  | "vlog_season"
  | "gaming_chill"      // gaming -50%
  | "thumb_war"         // vibe 1 stations -30%
  | "algo_reset"        // age_days resets to 0
  | "shorts_storm"      // shorts +120%
  | "edu_renaissance";  // edu +80%

export interface Weather {
  key: WeatherKey;
  name: string;
  description: string;
  /** topic → multiplier (default 1.0 if missing) */
  topic_multipliers: Partial<Record<TopicKey, number>>;
  /** if true, on apply: reset all station ages */
  reset_ages: boolean;
  /** flat vibe-based penalty: stations with vibe<=N get factor */
  low_vibe_penalty?: { max_vibe: number; factor: number };
}

export const WEATHERS: Record<WeatherKey, Weather> = {
  calm: {
    key: "calm",
    name: "凪",
    description: "アルゴリズムは穏やか",
    topic_multipliers: {},
    reset_ages: false,
  },
  vlog_season: {
    key: "vlog_season",
    name: "Vlog 季節",
    description: "Vlog 系のトラフィックが伸びている",
    topic_multipliers: { vlog: 2.0 },
    reset_ages: false,
  },
  gaming_chill: {
    key: "gaming_chill",
    name: "ゲーム冷気",
    description: "ゲーム系が冷え込んでいる",
    topic_multipliers: { gaming: 0.5 },
    reset_ages: false,
  },
  thumb_war: {
    key: "thumb_war",
    name: "サムネ戦争",
    description: "vibe 1-2 の駅は伸びにくい",
    topic_multipliers: {},
    reset_ages: false,
    low_vibe_penalty: { max_vibe: 2, factor: 0.7 },
  },
  algo_reset: {
    key: "algo_reset",
    name: "アルゴリズム再構成",
    description: "全動画の age がリセット",
    topic_multipliers: {},
    reset_ages: true,
  },
  shorts_storm: {
    key: "shorts_storm",
    name: "ショート嵐",
    description: "ショートにものすごい風が吹いている",
    topic_multipliers: { shorts: 2.2 },
    reset_ages: false,
  },
  edu_renaissance: {
    key: "edu_renaissance",
    name: "学びルネサンス",
    description: "学び系が地味に伸びている",
    topic_multipliers: { edu: 1.8 },
    reset_ages: false,
  },
};

const _ALL_KEYS: WeatherKey[] = Object.keys(WEATHERS) as WeatherKey[];

export function nextWeather(_currentWeek: number, rng: RNG): Weather {
  // 30% chance of calm, 70% chance of any other (uniform)
  if (rng.chance(0.30)) return WEATHERS.calm;
  const non_calm = _ALL_KEYS.filter(k => k !== "calm");
  return WEATHERS[rng.pick(non_calm)];
}

export function getWeather(key: WeatherKey): Weather {
  return WEATHERS[key];
}
