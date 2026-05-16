import { TOPICS_BY_KEY } from "./topics.ts";
import { isTransferStation, type Network, type Station } from "./network.ts";
import type { Weather } from "./weather.ts";

export interface DayResult {
  /** views earned today across all stations */
  views: number;
  /** views per station (id → views) */
  per_station: Record<string, number>;
  /** new subscribers gained today (0.05% conversion baseline) */
  subscribers_delta: number;
  /** updated ages */
  ages_after: Record<string, number>;
}

/** Per-station age decay: views falls off after ~7 days. */
export function ageDecay(age_days: number): number {
  // smooth decay: day 0 = 1.0, day 7 ≈ 0.5, day 30 ≈ 0.1
  return 1 / (1 + age_days * 0.18);
}

export function vibeMultiplier(vibe: number): number {
  // 1 → 0.4, 2 → 0.7, 3 → 1.0, 4 → 1.4, 5 → 2.0
  const table = [0, 0.4, 0.7, 1.0, 1.4, 2.0];
  return table[Math.max(1, Math.min(5, vibe))]!;
}

export function lineBonus(s: Station, net: Network): number {
  // Each line the station is on, where line.topic matches station.topic, gives +30%.
  // Transfer stations (>=2 lines) get an extra +50% even if lines mismatch.
  let bonus = 1.0;
  for (const lid of s.line_ids) {
    const line = net.lines.find(l => l.id === lid);
    if (!line) continue;
    if (line.topic === s.topic) bonus += 0.30;
    else bonus += 0.10;  // weak cross-topic bonus
  }
  if (isTransferStation(s)) bonus += 0.50;
  return bonus;
}

export function weatherMultiplier(s: Station, w: Weather): number {
  let m = w.topic_multipliers[s.topic] ?? 1.0;
  if (w.low_vibe_penalty && s.vibe <= w.low_vibe_penalty.max_vibe) {
    m *= w.low_vibe_penalty.factor;
  }
  return m;
}

export function simulateDay(net: Network, weather: Weather): DayResult {
  const per_station: Record<string, number> = {};
  const ages_after: Record<string, number> = {};
  let total_views = 0;

  for (const s of net.stations) {
    const base = TOPICS_BY_KEY[s.topic].base_views;
    const v = base
            * vibeMultiplier(s.vibe)
            * ageDecay(s.age_days)
            * lineBonus(s, net)
            * weatherMultiplier(s, weather);
    const views = Math.max(0, Math.round(v));
    per_station[s.id] = views;
    total_views += views;
    ages_after[s.id] = weather.reset_ages ? 0 : s.age_days + 1;
  }
  // Subscriber conversion: 1 sub per 200 views, +5 bonus per transfer station
  let subs = Math.floor(total_views / 200);
  const transfer_count = net.stations.filter(isTransferStation).length;
  subs += transfer_count * 5;

  return {
    views: total_views,
    per_station,
    subscribers_delta: subs,
    ages_after,
  };
}

/** Apply a DayResult back to the network (mutates ages and returns nothing). */
export function applyDay(net: Network, result: DayResult): void {
  for (const s of net.stations) {
    if (result.ages_after[s.id] !== undefined) {
      s.age_days = result.ages_after[s.id]!;
    }
  }
}
