import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hashLabel,
  mulberry32,
  placeStar,
  nearestNeighborEdges,
  catalogueName,
  BoxStore,
  SIZE_MAGNITUDE,
} from '../core.js';

// ─── hashLabel ─────────────────────────────────────────
test('hashLabel is deterministic', () => {
  assert.equal(hashLabel('本'), hashLabel('本'));
  assert.equal(hashLabel('miscellaneous boxes'), hashLabel('miscellaneous boxes'));
});

test('hashLabel differs for different inputs', () => {
  assert.notEqual(hashLabel('本'), hashLabel('服'));
  assert.notEqual(hashLabel('a'), hashLabel('b'));
});

test('hashLabel returns u32', () => {
  const h = hashLabel('alpha');
  assert.ok(Number.isInteger(h));
  assert.ok(h >= 0 && h <= 0xffffffff);
});

// ─── mulberry32 ────────────────────────────────────────
test('mulberry32 is deterministic', () => {
  const a = mulberry32(42);
  const b = mulberry32(42);
  for (let i = 0; i < 10; i++) {
    assert.equal(a(), b());
  }
});

test('mulberry32 emits values in [0,1)', () => {
  const r = mulberry32(123);
  for (let i = 0; i < 200; i++) {
    const v = r();
    assert.ok(v >= 0 && v < 1, `out of range: ${v}`);
  }
});

// ─── placeStar ─────────────────────────────────────────
test('placeStar is deterministic for the same label and size', () => {
  const a = placeStar('本', 'medium');
  const b = placeStar('本', 'medium');
  assert.deepEqual(a, b);
});

test('placeStar differs across labels', () => {
  const a = placeStar('本');
  const b = placeStar('服');
  assert.notEqual(a.x, b.x);
});

test('placeStar coordinates are within [0,1] area', () => {
  for (const lbl of ['a', 'box', '段ボール', '謎の箱', '本']) {
    const s = placeStar(lbl);
    assert.ok(s.x >= 0 && s.x <= 1);
    assert.ok(s.y >= 0 && s.y <= 1);
    assert.ok(s.magnitude > 0);
  }
});

test('placeStar size affects magnitude', () => {
  const sm = placeStar('foo', 'small');
  const md = placeStar('foo', 'medium');
  const lg = placeStar('foo', 'large');
  assert.ok(sm.magnitude < md.magnitude);
  assert.ok(md.magnitude < lg.magnitude);
});

// ─── nearestNeighborEdges ──────────────────────────────
test('nearestNeighborEdges returns no edges for 0 or 1 stars', () => {
  assert.deepEqual(nearestNeighborEdges([]), []);
  assert.deepEqual(nearestNeighborEdges([{ x: 0.5, y: 0.5 }]), []);
});

test('nearestNeighborEdges connects 2 stars with one edge', () => {
  const e = nearestNeighborEdges([
    { x: 0.1, y: 0.1 },
    { x: 0.9, y: 0.9 },
  ]);
  assert.deepEqual(e, [[0, 1]]);
});

test('nearestNeighborEdges deduplicates pairs', () => {
  const e = nearestNeighborEdges([
    { x: 0.1, y: 0.1 },
    { x: 0.2, y: 0.1 },
    { x: 0.3, y: 0.1 },
    { x: 0.4, y: 0.1 },
  ], 2);
  // every edge appears at most once
  const seen = new Set();
  for (const [a, b] of e) {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    assert.ok(!seen.has(k));
    seen.add(k);
  }
});

test('nearestNeighborEdges connects every star to at least one neighbor', () => {
  const stars = [];
  let s = 7;
  for (let i = 0; i < 8; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    stars.push({ x: ((s >>> 8) / (1 << 24)), y: ((s >>> 16) / (1 << 16)) % 1 });
  }
  const edges = nearestNeighborEdges(stars, 2);
  const touched = new Set();
  for (const [a, b] of edges) { touched.add(a); touched.add(b); }
  assert.equal(touched.size, stars.length);
});

// ─── catalogueName ─────────────────────────────────────
test('catalogueName empty for no boxes', () => {
  assert.equal(catalogueName([]), '');
});

test('catalogueName is deterministic for the same set', () => {
  const a = catalogueName([{ label: '本' }, { label: '服' }]);
  const b = catalogueName([{ label: '服' }, { label: '本' }]);
  assert.equal(a, b, 'order should not affect catalogueName');
});

// ─── BoxStore ──────────────────────────────────────────
test('BoxStore.add registers a new box', () => {
  const s = new BoxStore();
  const b = s.add({ label: '本', size: 'small' });
  assert.equal(s.total, 1);
  assert.equal(s.unopened.length, 1);
  assert.equal(b.opened, false);
  assert.equal(b.size, 'small');
  assert.equal(b.label, '本');
  assert.equal(typeof b.id, 'string');
  assert.ok(b.id.length > 0);
});

test('BoxStore.add rejects empty label', () => {
  const s = new BoxStore();
  assert.throws(() => s.add({ label: '   ' }));
  assert.throws(() => s.add({ label: '' }));
});

test('BoxStore.add rejects unknown size', () => {
  const s = new BoxStore();
  assert.throws(() => s.add({ label: 'x', size: 'huge' }));
});

test('BoxStore.open marks a box opened', () => {
  const s = new BoxStore();
  const b = s.add({ label: '本' });
  s.open(b.id);
  assert.equal(s.unopened.length, 0);
  assert.equal(s.openedBoxes.length, 1);
});

test('BoxStore.isClear true only when total>0 and all opened', () => {
  const s = new BoxStore();
  assert.equal(s.isClear, false, 'empty store is not clear');
  const b = s.add({ label: '本' });
  assert.equal(s.isClear, false);
  s.open(b.id);
  assert.equal(s.isClear, true);
});

test('BoxStore.remove drops a box', () => {
  const s = new BoxStore();
  const a = s.add({ label: '本' });
  const c = s.add({ label: '服' });
  assert.equal(s.remove(a.id), true);
  assert.equal(s.total, 1);
  assert.equal(s.boxes[0].id, c.id);
});

test('BoxStore.toJSON / fromJSON roundtrip', () => {
  const s = new BoxStore();
  s.add({ label: '本' });
  s.add({ label: '服', size: 'large' });
  const json = JSON.parse(JSON.stringify(s.toJSON()));
  const s2 = BoxStore.fromJSON(json);
  assert.equal(s2.total, 2);
  assert.equal(s2.boxes[0].label, '本');
  assert.equal(s2.boxes[1].size, 'large');
});

test('BoxStore.fromJSON tolerates corrupted entries', () => {
  const s = BoxStore.fromJSON([
    { id: 'x', label: '本', size: 'medium', opened: false, registeredAt: 0 },
    null,
    'broken',
    { label: 'no id' },
  ]);
  assert.equal(s.total, 1);
});

test('BoxStore.averageMagnitude reflects sizes', () => {
  const s = new BoxStore();
  assert.equal(s.averageMagnitude(), null);
  s.add({ label: 'a', size: 'small' });
  s.add({ label: 'b', size: 'large' });
  const avg = s.averageMagnitude();
  const expected = (SIZE_MAGNITUDE.small + SIZE_MAGNITUDE.large) / 2;
  assert.equal(avg, expected);
});
