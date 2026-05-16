import { emptyNetwork, resetIdCounter, type Network } from "./network.ts";
import { simulateDay, applyDay } from "./traffic.ts";
import { nextWeather, getWeather, WEATHERS, type Weather, type WeatherKey } from "./weather.ts";
import { RNG } from "./rng.ts";

export interface GameState {
  network: Network;
  day: number;            // 1-indexed
  week: number;
  subscribers: number;
  total_views: number;
  action_points: number;
  weather: WeatherKey;
  unlocked: { shorts_line: boolean; series_line: boolean; collab: boolean };
  history: { day: number; views: number; subs: number; weather: WeatherKey }[];
}

export function newGame(): GameState {
  resetIdCounter();
  return {
    network: emptyNetwork(),
    day: 1,
    week: 1,
    subscribers: 100,    // start with a small base — feels like a real channel
    total_views: 0,
    action_points: 3,
    weather: "calm",
    unlocked: { shorts_line: false, series_line: false, collab: false },
    history: [],
  };
}

export function maxActionPoints(state: GameState): number {
  if (state.subscribers >= 100_000) return 6;
  if (state.subscribers >= 10_000) return 5;
  if (state.subscribers >= 1_000) return 4;
  return 3;
}

export function advanceDay(state: GameState, rng: RNG): GameState {
  const weather = getWeather(state.weather);
  const result = simulateDay(state.network, weather);
  applyDay(state.network, result);

  const next = {
    ...state,
    day: state.day + 1,
    total_views: state.total_views + result.views,
    subscribers: state.subscribers + result.subscribers_delta,
    action_points: maxActionPoints(state),  // reset using current subs (pre-day)
    history: [
      ...state.history,
      { day: state.day, views: result.views, subs: result.subscribers_delta, weather: state.weather },
    ],
  };
  // Update AP based on new subs (so checkpoint feels good)
  next.action_points = maxActionPoints(next);

  // Roll new weather every 7 days
  if (next.day % 7 === 0) {
    next.week += 1;
    next.weather = nextWeather(next.week, rng).key;
  }

  // Unlock checkpoints
  next.unlocked = { ...state.unlocked };
  if (next.subscribers >= 1_000)  next.unlocked.shorts_line = true;
  if (next.subscribers >= 10_000) next.unlocked.series_line = true;
  if (next.subscribers >= 100_000) next.unlocked.collab = true;

  return next;
}

/** Returns the recent N entries of history (most recent first). */
export function recentHistory(state: GameState, n: number = 7): GameState["history"] {
  return [...state.history].slice(-n).reverse();
}
