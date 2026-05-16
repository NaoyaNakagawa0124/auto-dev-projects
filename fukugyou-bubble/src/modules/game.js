// 副業バブル — pure game logic (mirror of Rust crate).
// All inputs are explicit so the same module can run in browser, tests, or wasm.

export function upgradeCost(base, growth, count) {
  return base * Math.pow(growth, count);
}

export function autoIncomePerSec(config, state) {
  let total = 0;
  for (let i = 0; i < config.hustles.length; i++) {
    const def = config.hustles[i];
    const upgrades = (state.hustles[i] && state.hustles[i].upgrades) || 0;
    const base = def.base_income * upgrades;
    const mult = (state.viral.seconds_left > 0 && state.viral.hustle_id === def.id)
      ? state.viral.multiplier : 1;
    total += base * mult;
  }
  return total;
}

export function newState(config) {
  return {
    cash: 0,
    total_clicks: 0,
    hustles: config.hustles.map(() => ({ upgrades: 0 })),
    viral: { hustle_id: null, seconds_left: 0, multiplier: 1 },
    elapsed_sec: 0,
    time_since_last_viral: 0,
    won: false,
  };
}

export function findHustle(config, id) {
  return config.hustles.find(h => h.id === id);
}

export function click(config, state, hustleId) {
  const def = findHustle(config, hustleId);
  if (!def) return false;
  const mult = (state.viral.seconds_left > 0 && state.viral.hustle_id === hustleId)
    ? state.viral.multiplier : 1;
  state.cash += def.click_reward * mult;
  state.total_clicks += 1;
  checkWin(config, state);
  return true;
}

export function buyUpgrade(config, state, hustleId) {
  const idx = config.hustles.findIndex(h => h.id === hustleId);
  if (idx < 0) return null;
  const def = config.hustles[idx];
  const current = state.hustles[idx].upgrades || 0;
  const cost = upgradeCost(def.upgrade_base_cost, def.cost_growth, current);
  if (state.cash < cost) return null;
  state.cash -= cost;
  state.hustles[idx].upgrades = current + 1;
  return state.hustles[idx].upgrades;
}

export function step(config, state, deltaMs) {
  if (state.won) return;
  const deltaSec = deltaMs / 1000;
  state.cash += autoIncomePerSec(config, state) * deltaSec;
  state.elapsed_sec += deltaSec;
  if (state.viral.seconds_left > 0) {
    state.viral.seconds_left -= deltaSec;
    if (state.viral.seconds_left <= 0) {
      state.viral = { hustle_id: null, seconds_left: 0, multiplier: 1 };
    }
  } else {
    state.time_since_last_viral += deltaSec;
  }
  checkWin(config, state);
}

export function tryStartViral(config, state, rngValue) {
  if (state.viral.seconds_left > 0) return null;
  if (state.time_since_last_viral < config.viral_period_sec) return null;
  const n = config.hustles.length;
  if (n === 0) return null;
  const idx = Math.min(n - 1, Math.floor(Math.abs(rngValue - Math.floor(rngValue)) * n));
  const h = config.hustles[idx];
  state.viral = {
    hustle_id: h.id,
    seconds_left: config.viral_duration_sec,
    multiplier: config.viral_multiplier,
  };
  state.time_since_last_viral = 0;
  return h.id;
}

function checkWin(config, state) {
  if (state.cash >= config.win_target) state.won = true;
}

export function progressFraction(config, state) {
  return Math.min(1, state.cash / config.win_target);
}

export function formatYen(n) {
  if (!isFinite(n)) return "¥0";
  const abs = Math.abs(n);
  if (abs >= 100_000_000) return "¥" + (n / 100_000_000).toFixed(2) + "億";
  if (abs >= 1_000_000)   return "¥" + (n / 1_000_000).toFixed(2) + "M";
  if (abs >= 1_000)       return "¥" + (n / 1_000).toFixed(2) + "K";
  return "¥" + Math.floor(n).toLocaleString("ja-JP");
}
