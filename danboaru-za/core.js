// Pure logic for danboaru-za. Importable from both the browser and Node tests.

// FNV-1a-ish 32-bit hash. Stable across browsers and Node.
export function hashLabel(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// Mulberry32 PRNG seeded from a u32.
export function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export const SIZE_MAGNITUDE = Object.freeze({
  small: 0.55,
  medium: 1.0,
  large: 1.6,
});

// Place a star deterministically. Returns normalized x/y (0..1) plus magnitude
// (relative size), twinkle, phase, and hue (warm range).
export function placeStar(label, size = 'medium') {
  const seed = hashLabel(label || '');
  const rng = mulberry32(seed);
  const x = 0.04 + rng() * 0.92;
  const y = 0.06 + rng() * 0.78;
  const tw = 0.4 + rng() * 1.2;
  const phase = rng() * Math.PI * 2;
  // Warm starlight hues: 25..60 (orange) and 200..220 (cool blue) — pick one
  const cool = rng() < 0.25;
  const hue = cool ? 200 + rng() * 20 : 28 + rng() * 32;
  return {
    x,
    y,
    magnitude: SIZE_MAGNITUDE[size] ?? 1.0,
    twinkle: tw,
    phase,
    hue,
  };
}

// Connect each star to its k nearest neighbors. Returns deduped [i, j] pairs.
export function nearestNeighborEdges(stars, k = 2) {
  const edges = new Set();
  const n = stars.length;
  for (let i = 0; i < n; i++) {
    const distances = [];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const dx = stars[j].x - stars[i].x;
      const dy = stars[j].y - stars[i].y;
      distances.push([j, dx * dx + dy * dy]);
    }
    distances.sort((a, b) => a[1] - b[1]);
    for (let m = 0; m < Math.min(k, distances.length); m++) {
      const [j] = distances[m];
      const a = i < j ? i : j;
      const b = i < j ? j : i;
      edges.add(`${a}-${b}`);
    }
  }
  return [...edges].map((s) => s.split('-').map(Number));
}

// Generate a Latin-style "catalogue name" for the registered set, deterministic
// from the joined labels. Examples: "DBZ-148", "DBZ-Cn-22-Major".
const ROMANS = [
  'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta',
  'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron',
  'Pi', 'Rho', 'Sigma', 'Tau', 'Phi', 'Chi', 'Psi', 'Omega',
];
const SUFFIXES = ['Borealis', 'Australis', 'Major', 'Minor', 'Apartmentis', 'Domus', 'Maris'];

export function catalogueName(boxes) {
  if (boxes.length === 0) return '';
  const seedSrc = boxes.map((b) => b.label).sort().join('|');
  const rng = mulberry32(hashLabel(seedSrc));
  const r = ROMANS[Math.floor(rng() * ROMANS.length)];
  const num = 10 + Math.floor(rng() * 990);
  const suf = SUFFIXES[Math.floor(rng() * SUFFIXES.length)];
  return `${r} ${num} ${suf}`;
}

function newId() {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return 'b-' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
}

// Mutable store for boxes. Boxes are: {id, label, size, opened, registeredAt}.
export class BoxStore {
  constructor(initial = []) {
    this.boxes = Array.isArray(initial) ? [...initial] : [];
  }

  add({ label, size = 'medium' }) {
    const trimmed = String(label ?? '').trim();
    if (!trimmed) throw new Error('label required');
    if (!['small', 'medium', 'large'].includes(size)) {
      throw new Error('size must be small | medium | large');
    }
    const box = {
      id: newId(),
      label: trimmed,
      size,
      opened: false,
      registeredAt: Date.now(),
    };
    this.boxes.push(box);
    return box;
  }

  open(id) {
    const b = this.boxes.find((x) => x.id === id);
    if (!b) return null;
    if (b.opened) return b;
    b.opened = true;
    b.openedAt = Date.now();
    return b;
  }

  remove(id) {
    const before = this.boxes.length;
    this.boxes = this.boxes.filter((x) => x.id !== id);
    return this.boxes.length < before;
  }

  reset() { this.boxes = []; }

  get unopened() { return this.boxes.filter((b) => !b.opened); }
  get openedBoxes() { return this.boxes.filter((b) => b.opened); }
  get total() { return this.boxes.length; }
  get isClear() { return this.total > 0 && this.unopened.length === 0; }

  averageMagnitude() {
    if (this.boxes.length === 0) return null;
    const sum = this.boxes.reduce(
      (a, b) => a + (SIZE_MAGNITUDE[b.size] ?? 1),
      0,
    );
    return sum / this.boxes.length;
  }

  toJSON() { return this.boxes; }

  static fromJSON(arr) {
    const s = new BoxStore();
    s.boxes = (arr || []).filter(
      (b) => b && typeof b.id === 'string' && typeof b.label === 'string',
    );
    return s;
  }
}
