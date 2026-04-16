/**
 * Color Palettes — Japanese-inspired and modern themes
 * Colors are [r, g, b] normalized to 0-1 range for the fluid sim
 */

const PALETTES = {
  wabi: {
    name: '侘寂',
    colors: [
      { name: '墨', hex: '#2c2c2c', rgb: [0.17, 0.17, 0.17] },
      { name: '錆', hex: '#8b6d5c', rgb: [0.55, 0.43, 0.36] },
      { name: '苔', hex: '#6b7c5e', rgb: [0.42, 0.49, 0.37] },
      { name: '灰', hex: '#9e9e8e', rgb: [0.62, 0.62, 0.56] },
      { name: '紅殻', hex: '#8f4e3b', rgb: [0.56, 0.31, 0.23] },
    ],
    background: '#f5f0e8',
  },
  sakura: {
    name: '桜',
    colors: [
      { name: '桜', hex: '#f5b2c8', rgb: [0.96, 0.70, 0.78] },
      { name: '桃', hex: '#e88da4', rgb: [0.91, 0.55, 0.64] },
      { name: '薄紅', hex: '#f7d1d5', rgb: [0.97, 0.82, 0.84] },
      { name: '若草', hex: '#a8c97f', rgb: [0.66, 0.79, 0.50] },
      { name: '藤', hex: '#b8a9c9', rgb: [0.72, 0.66, 0.79] },
    ],
    background: '#fef6f0',
  },
  ocean: {
    name: '海',
    colors: [
      { name: '紺碧', hex: '#1e5799', rgb: [0.12, 0.34, 0.60] },
      { name: '浅葱', hex: '#48929b', rgb: [0.28, 0.57, 0.61] },
      { name: '白波', hex: '#d4e9ed', rgb: [0.83, 0.91, 0.93] },
      { name: '深海', hex: '#0d2b45', rgb: [0.05, 0.17, 0.27] },
      { name: '珊瑚', hex: '#e87461', rgb: [0.91, 0.45, 0.38] },
    ],
    background: '#e8f0f5',
  },
  sunset: {
    name: '夕焼け',
    colors: [
      { name: '茜', hex: '#c0392b', rgb: [0.75, 0.22, 0.17] },
      { name: '蜜柑', hex: '#e67e22', rgb: [0.90, 0.49, 0.13] },
      { name: '金', hex: '#f1c40f', rgb: [0.95, 0.77, 0.06] },
      { name: '紫', hex: '#6c3483', rgb: [0.42, 0.20, 0.51] },
      { name: '群青', hex: '#2c3e7b', rgb: [0.17, 0.24, 0.48] },
    ],
    background: '#f5e6d0',
  },
  neon: {
    name: 'ネオン',
    colors: [
      { name: '電紫', hex: '#a855f7', rgb: [0.66, 0.33, 0.97] },
      { name: '蛍光', hex: '#22d3ee', rgb: [0.13, 0.83, 0.93] },
      { name: '閃光', hex: '#f43f5e', rgb: [0.96, 0.25, 0.37] },
      { name: '発光', hex: '#4ade80', rgb: [0.29, 0.87, 0.50] },
      { name: '灼熱', hex: '#facc15', rgb: [0.98, 0.80, 0.08] },
    ],
    background: '#0a0a12',
  },
  mono: {
    name: '墨',
    colors: [
      { name: '漆黒', hex: '#1a1a1a', rgb: [0.10, 0.10, 0.10] },
      { name: '墨色', hex: '#3d3d3d', rgb: [0.24, 0.24, 0.24] },
      { name: '灰色', hex: '#6b6b6b', rgb: [0.42, 0.42, 0.42] },
      { name: '銀鼠', hex: '#9a9a9a', rgb: [0.60, 0.60, 0.60] },
      { name: '白磁', hex: '#e5e5e5', rgb: [0.90, 0.90, 0.90] },
    ],
    background: '#f5f0e8',
  },
};

function getPalette(name) {
  return PALETTES[name] || PALETTES.wabi;
}

function getAllPaletteNames() {
  return Object.keys(PALETTES);
}
