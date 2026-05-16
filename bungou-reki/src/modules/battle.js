// 対戦ロジック — Rust 側 src-tauri/src/battle.rs と同等

const ROUND_AXES = ["literary", "prolific", "influence"];
const AXIS_LABEL = { literary: "文才", prolific: "多作", influence: "影響", longevity: "寿命" };

export function resolveBattle(playerDeck, opponentDeck) {
  if (playerDeck.length !== 3) throw new Error("プレイヤーデッキは3枚必要です");
  if (opponentDeck.length !== 3) throw new Error("相手デッキは3枚必要です");
  const rounds = [];
  let pw = 0, ow = 0;
  const xpTargets = [];
  for (let i = 0; i < 3; i++) {
    const axis = ROUND_AXES[i];
    const pc = playerDeck[i];
    const oc = opponentDeck[i];
    const pv = pc.stats[axis];
    const ov = oc.stats[axis];
    let outcome = "draw";
    if (pv > ov) { outcome = "win"; pw++; xpTargets.push(pc.id); }
    else if (pv < ov) { outcome = "loss"; ow++; }
    rounds.push({ axis, axis_label: AXIS_LABEL[axis], player_card: pc, player_value: pv, opponent_card: oc, opponent_value: ov, outcome });
  }
  const playerWon = pw > ow;
  const xpGained = pw * 10 + (playerWon ? 20 : 0);
  return {
    rounds,
    player_wins: pw,
    opponent_wins: ow,
    player_won: playerWon,
    xp_gained: xpGained,
    xp_targets: xpTargets,
  };
}

export function opponentForSeed(authors, seed, exclude = []) {
  if (authors.length === 0) return [];
  // seed は BigInt
  let state = (seed * 0x9E3779B97F4A7C15n + 1n) & 0xFFFFFFFFFFFFFFFFn;
  const deck = [];
  let attempts = 0;
  while (deck.length < 3 && attempts < authors.length * 4) {
    state ^= (state << 13n) & 0xFFFFFFFFFFFFFFFFn;
    state ^= (state >> 7n);
    state ^= (state << 17n) & 0xFFFFFFFFFFFFFFFFn;
    const idx = Number(state % BigInt(authors.length));
    const cand = authors[idx];
    if (!exclude.includes(cand.id) && !deck.some(a => a.id === cand.id)) {
      deck.push(cand);
    }
    attempts++;
  }
  let idx = 0;
  while (deck.length < 3 && idx < authors.length) {
    const cand = authors[idx++];
    if (!deck.some(a => a.id === cand.id)) deck.push(cand);
  }
  return deck;
}
