// Five constellations as graphs of points + edges in a 0..1 unit square.
// Total points across the five: 7 + 5 + 5 + 7 + 4 = 28 — fewer than CARDS so
// a session can finish if every card is recalled, but not by too wide a margin.

export const CONSTELLATIONS = [
  {
    id: "orion",
    jp: "オリオン",
    points: [
      { x: 0.20, y: 0.20 },  // 0 — Betelgeuse
      { x: 0.55, y: 0.18 },  // 1 — Bellatrix
      { x: 0.36, y: 0.40 },  // 2 — Mintaka
      { x: 0.45, y: 0.46 },  // 3 — Alnilam
      { x: 0.54, y: 0.52 },  // 4 — Alnitak
      { x: 0.28, y: 0.74 },  // 5 — Saiph
      { x: 0.66, y: 0.78 },  // 6 — Rigel
    ],
    edges: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]],
  },
  {
    id: "cygnus",
    jp: "はくちょう",
    points: [
      { x: 0.50, y: 0.10 },  // head
      { x: 0.50, y: 0.40 },  // body
      { x: 0.20, y: 0.42 },  // left wing
      { x: 0.80, y: 0.42 },  // right wing
      { x: 0.50, y: 0.80 },  // tail
    ],
    edges: [[0, 1], [1, 2], [1, 3], [1, 4]],
  },
  {
    id: "cassiopeia",
    jp: "カシオペア",
    points: [
      { x: 0.10, y: 0.50 },
      { x: 0.30, y: 0.30 },
      { x: 0.50, y: 0.50 },
      { x: 0.70, y: 0.30 },
      { x: 0.90, y: 0.50 },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    id: "ursaminor",
    jp: "こぐま",
    points: [
      { x: 0.30, y: 0.20 },  // Polaris
      { x: 0.40, y: 0.32 },
      { x: 0.52, y: 0.40 },
      { x: 0.66, y: 0.42 },
      { x: 0.72, y: 0.60 },  // bowl
      { x: 0.56, y: 0.70 },
      { x: 0.48, y: 0.58 },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 2]],
  },
  {
    id: "pegasus_square",
    jp: "ペガサスの大四辺形",
    points: [
      { x: 0.20, y: 0.20 },
      { x: 0.80, y: 0.20 },
      { x: 0.80, y: 0.80 },
      { x: 0.20, y: 0.80 },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0]],
  },
];

export function totalPointCount() {
  return CONSTELLATIONS.reduce((s, c) => s + c.points.length, 0);
}

export function constellationById(id) {
  return CONSTELLATIONS.find(c => c.id === id) || null;
}
