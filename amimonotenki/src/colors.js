// Temperature-to-color mapping for knitting patterns
// Inspired by real temperature blanket color schemes

export const TEMP_RANGES = [
  { min: -20, max: -10, color: '#1a237e', yarn: '紺色', name: '極寒' },
  { min: -10, max: -5,  color: '#283593', yarn: '濃い青', name: '厳寒' },
  { min: -5,  max: 0,   color: '#1565c0', yarn: '青', name: '氷点下' },
  { min: 0,   max: 5,   color: '#1e88e5', yarn: '明るい青', name: '冷え込み' },
  { min: 5,   max: 10,  color: '#42a5f5', yarn: '水色', name: '肌寒い' },
  { min: 10,  max: 15,  color: '#4db6ac', yarn: 'ターコイズ', name: '涼しい' },
  { min: 15,  max: 20,  color: '#66bb6a', yarn: '緑', name: '快適' },
  { min: 20,  max: 25,  color: '#aed581', yarn: '黄緑', name: '暖かい' },
  { min: 25,  max: 30,  color: '#fdd835', yarn: '黄色', name: '暑い' },
  { min: 30,  max: 35,  color: '#ff8f00', yarn: 'オレンジ', name: '猛暑' },
  { min: 35,  max: 45,  color: '#e53935', yarn: '赤', name: '酷暑' },
];

export function tempToColor(temp) {
  for (const range of TEMP_RANGES) {
    if (temp >= range.min && temp < range.max) return range.color;
  }
  if (temp < -20) return TEMP_RANGES[0].color;
  return TEMP_RANGES[TEMP_RANGES.length - 1].color;
}

export function tempToRange(temp) {
  for (const range of TEMP_RANGES) {
    if (temp >= range.min && temp < range.max) return range;
  }
  if (temp < -20) return TEMP_RANGES[0];
  return TEMP_RANGES[TEMP_RANGES.length - 1];
}

export function tempToYarn(temp) {
  return tempToRange(temp).yarn;
}

// Get HSL values for p5.js
export function tempToHSL(temp) {
  const hex = tempToColor(temp);
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}
