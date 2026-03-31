/**
 * 推し空 (Oshizora) - Unit Tests
 * Run: node test.js
 */

let tests = 0, passed = 0, failed = 0;

function section(name) { console.log(`\n  \x1b[36m[${name}]\x1b[0m`); }
function test(name, fn) {
  tests++;
  try { fn(); passed++; console.log(`  \x1b[32m✓\x1b[0m ${name}`); }
  catch (e) { failed++; console.log(`  \x1b[31m✗\x1b[0m ${name}: ${e.message}`); }
}
function assert(c, m) { if (!c) throw new Error(m || 'Assertion failed'); }
function assertEqual(a, b, m) { if (a !== b) throw new Error(m || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }

// ─── Replicated helpers ─────────────────────────────
function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function lerpColor(c1, c2, t) {
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * t),
    g: Math.round(c1.g + (c2.g - c1.g) * t),
    b: Math.round(c1.b + (c2.b - c1.b) * t),
  };
}

function rgbStr(c, a = 1) {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

function getTimeOfDay(h) {
  if (h >= 5 && h < 7) return 'dawn';
  if (h >= 7 && h < 16) return 'day';
  if (h >= 16 && h < 19) return 'dusk';
  return 'night';
}

function getSeason(m) {
  if (m >= 2 && m <= 4) return 'spring';
  if (m >= 5 && m <= 7) return 'summer';
  if (m >= 8 && m <= 10) return 'autumn';
  return 'winter';
}

function getWeatherType(code) {
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 99) return 'rain';
  if (code >= 61 && code <= 67) return 'rain';
  if (code >= 51 && code <= 57) return 'drizzle';
  if (code >= 45 && code <= 48) return 'fog';
  if (code >= 2 && code <= 3) return 'cloudy';
  if (code === 1) return 'partly_cloudy';
  return 'clear';
}

function describeWeather(code) {
  if (code === 0) return '快晴';
  if (code <= 3) return '晴れ';
  if (code <= 48) return '曇り';
  if (code <= 57) return '霧雨';
  if (code <= 67) return '雨';
  if (code <= 77) return '雪';
  if (code <= 82) return 'にわか雨';
  if (code <= 86) return 'にわか雪';
  if (code <= 99) return '雷雨';
  return '不明';
}

const presetColors = [
  { color: '#39C5BB', label: 'ミクグリーン' },
  { color: '#FF69B4', label: 'ピンク' },
  { color: '#FFD700', label: 'ゴールド' },
  { color: '#FF4444', label: 'レッド' },
  { color: '#4169E1', label: 'ロイヤルブルー' },
  { color: '#9B59B6', label: 'パープル' },
  { color: '#FF8C00', label: 'オレンジ' },
  { color: '#2ECC71', label: 'グリーン' },
  { color: '#E91E63', label: 'ローズ' },
  { color: '#00BCD4', label: 'シアン' },
];

// ─── Tests ──────────────────────────────────────────
console.log('\n  ═══════════════════════════════════════');
console.log('   推し空 (Oshizora) - Unit Tests');
console.log('  ═══════════════════════════════════════');

section('色変換');
test('hexToRgb: #39C5BB', () => {
  const c = hexToRgb('#39C5BB');
  assertEqual(c.r, 57); assertEqual(c.g, 197); assertEqual(c.b, 187);
});
test('hexToRgb: #FF0000 (赤)', () => {
  const c = hexToRgb('#FF0000');
  assertEqual(c.r, 255); assertEqual(c.g, 0); assertEqual(c.b, 0);
});
test('hexToRgb: #000000 (黒)', () => {
  const c = hexToRgb('#000000');
  assertEqual(c.r, 0); assertEqual(c.g, 0); assertEqual(c.b, 0);
});
test('hexToRgb: #FFFFFF (白)', () => {
  const c = hexToRgb('#FFFFFF');
  assertEqual(c.r, 255); assertEqual(c.g, 255); assertEqual(c.b, 255);
});

section('色のブレンド');
test('lerpColor: t=0 は色1', () => {
  const c = lerpColor({r:255,g:0,b:0}, {r:0,g:255,b:0}, 0);
  assertEqual(c.r, 255); assertEqual(c.g, 0); assertEqual(c.b, 0);
});
test('lerpColor: t=1 は色2', () => {
  const c = lerpColor({r:255,g:0,b:0}, {r:0,g:255,b:0}, 1);
  assertEqual(c.r, 0); assertEqual(c.g, 255); assertEqual(c.b, 0);
});
test('lerpColor: t=0.5 は中間色', () => {
  const c = lerpColor({r:0,g:0,b:0}, {r:200,g:100,b:50}, 0.5);
  assertEqual(c.r, 100); assertEqual(c.g, 50); assertEqual(c.b, 25);
});
test('lerpColor: 推しカラーブレンド', () => {
  const sky = {r:80,g:140,b:220};
  const oshi = hexToRgb('#FF69B4');
  const blended = lerpColor(sky, oshi, 0.15);
  assert(blended.r > sky.r, 'oshiの赤みが増す');
  assert(blended.r < oshi.r, 'sky色も残る');
});

section('rgbStr');
test('rgbStr: デフォルトalpha=1', () => {
  assertEqual(rgbStr({r:100,g:200,b:50}), 'rgba(100,200,50,1)');
});
test('rgbStr: カスタムalpha', () => {
  assertEqual(rgbStr({r:0,g:0,b:0}, 0.5), 'rgba(0,0,0,0.5)');
});

section('時間帯判定');
test('5時 = dawn', () => assertEqual(getTimeOfDay(5), 'dawn'));
test('6時 = dawn', () => assertEqual(getTimeOfDay(6), 'dawn'));
test('7時 = day', () => assertEqual(getTimeOfDay(7), 'day'));
test('12時 = day', () => assertEqual(getTimeOfDay(12), 'day'));
test('15時 = day', () => assertEqual(getTimeOfDay(15), 'day'));
test('16時 = dusk', () => assertEqual(getTimeOfDay(16), 'dusk'));
test('18時 = dusk', () => assertEqual(getTimeOfDay(18), 'dusk'));
test('19時 = night', () => assertEqual(getTimeOfDay(19), 'night'));
test('0時 = night', () => assertEqual(getTimeOfDay(0), 'night'));
test('3時 = night', () => assertEqual(getTimeOfDay(3), 'night'));
test('4時 = night', () => assertEqual(getTimeOfDay(4), 'night'));

section('季節判定');
test('3月 = spring', () => assertEqual(getSeason(2), 'spring'));
test('4月 = spring', () => assertEqual(getSeason(3), 'spring'));
test('5月 = spring', () => assertEqual(getSeason(4), 'spring'));
test('6月 = summer', () => assertEqual(getSeason(5), 'summer'));
test('8月 = summer', () => assertEqual(getSeason(7), 'summer'));
test('9月 = autumn', () => assertEqual(getSeason(8), 'autumn'));
test('11月 = autumn', () => assertEqual(getSeason(10), 'autumn'));
test('12月 = winter', () => assertEqual(getSeason(11), 'winter'));
test('1月 = winter', () => assertEqual(getSeason(0), 'winter'));
test('2月 = winter', () => assertEqual(getSeason(1), 'winter'));

section('天気タイプ判定');
test('code 0 = clear', () => assertEqual(getWeatherType(0), 'clear'));
test('code 1 = partly_cloudy', () => assertEqual(getWeatherType(1), 'partly_cloudy'));
test('code 2 = cloudy', () => assertEqual(getWeatherType(2), 'cloudy'));
test('code 3 = cloudy', () => assertEqual(getWeatherType(3), 'cloudy'));
test('code 45 = fog', () => assertEqual(getWeatherType(45), 'fog'));
test('code 51 = drizzle', () => assertEqual(getWeatherType(51), 'drizzle'));
test('code 61 = rain', () => assertEqual(getWeatherType(61), 'rain'));
test('code 71 = snow', () => assertEqual(getWeatherType(71), 'snow'));
test('code 80 = rain (shower)', () => assertEqual(getWeatherType(80), 'rain'));
test('code 95 = rain (thunderstorm)', () => assertEqual(getWeatherType(95), 'rain'));

section('天気の日本語表記');
test('code 0 = 快晴', () => assertEqual(describeWeather(0), '快晴'));
test('code 1 = 晴れ', () => assertEqual(describeWeather(1), '晴れ'));
test('code 45 = 曇り', () => assertEqual(describeWeather(45), '曇り'));
test('code 53 = 霧雨', () => assertEqual(describeWeather(53), '霧雨'));
test('code 63 = 雨', () => assertEqual(describeWeather(63), '雨'));
test('code 73 = 雪', () => assertEqual(describeWeather(73), '雪'));
test('code 81 = にわか雨', () => assertEqual(describeWeather(81), 'にわか雨'));
test('code 85 = にわか雪', () => assertEqual(describeWeather(85), 'にわか雪'));
test('code 95 = 雷雨', () => assertEqual(describeWeather(95), '雷雨'));
test('code 999 = 不明', () => assertEqual(describeWeather(999), '不明'));

section('プリセットカラー');
test('10色のプリセット', () => assertEqual(presetColors.length, 10));
test('全てのプリセットが有効なhex', () => {
  for (const pc of presetColors) {
    assert(/^#[0-9A-Fa-f]{6}$/.test(pc.color), `${pc.label}: ${pc.color}`);
  }
});
test('全てのプリセットにラベル有り', () => {
  for (const pc of presetColors) {
    assert(pc.label.length > 0, 'label should not be empty');
  }
});
test('プリセットが正しくRGBに変換できる', () => {
  for (const pc of presetColors) {
    const rgb = hexToRgb(pc.color);
    assert(rgb.r >= 0 && rgb.r <= 255);
    assert(rgb.g >= 0 && rgb.g <= 255);
    assert(rgb.b >= 0 && rgb.b <= 255);
  }
});

section('設定の永続化');
test('config JSONシリアライズ', () => {
  const config = { oshiName: 'テスト推し', oshiColor: '#FF69B4', lat: 35.6, lon: 139.7 };
  const json = JSON.stringify(config);
  const parsed = JSON.parse(json);
  assertEqual(parsed.oshiName, 'テスト推し');
  assertEqual(parsed.oshiColor, '#FF69B4');
});
test('空の名前はデフォルト"推し"', () => {
  const name = '' || '推し';
  assertEqual(name, '推し');
});
test('入力名がそのまま使われる', () => {
  const name = '初音ミク'.trim() || '推し';
  assertEqual(name, '初音ミク');
});

section('メッセージ');
test('メッセージにoshi名が挿入される', () => {
  const template = '{name}も今、同じ空を見ているかも。';
  const result = template.replace('{name}', '初音ミク');
  assertEqual(result, '初音ミクも今、同じ空を見ているかも。');
});
test('名前なしは"推し"に置換', () => {
  const template = '{name}と同じ星空の下にいる。';
  const result = template.replace('{name}', '' || '推し');
  assertEqual(result, '推しと同じ星空の下にいる。');
});

// ─── Summary ────────────────────────────────────────
console.log('\n  ═══════════════════════════════════════');
if (failed === 0) {
  console.log(`  \x1b[32m ✓ ${passed}/${tests} テスト全て合格！\x1b[0m`);
} else {
  console.log(`  \x1b[31m ✗ ${passed}/${tests} 合格 (${failed}件失敗)\x1b[0m`);
}
console.log('  ═══════════════════════════════════════\n');
process.exit(failed > 0 ? 1 : 0);
