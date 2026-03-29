// Shrine data model and customization options
export const THEMES = [
  { id: 'pink', name: 'ピンク', primary: '#ff69b4', secondary: '#ff1493', bg: '#1a0010', star: '#ff69b4' },
  { id: 'blue', name: 'ブルー', primary: '#00bfff', secondary: '#1e90ff', bg: '#000a1a', star: '#87ceeb' },
  { id: 'purple', name: 'パープル', primary: '#da70d6', secondary: '#9932cc', bg: '#0d001a', star: '#dda0dd' },
  { id: 'gold', name: 'ゴールド', primary: '#ffd700', secondary: '#ff8c00', bg: '#1a1400', star: '#ffe066' },
  { id: 'green', name: 'グリーン', primary: '#00ff7f', secondary: '#32cd32', bg: '#001a0d', star: '#90ee90' },
  { id: 'red', name: 'レッド', primary: '#ff4444', secondary: '#dc143c', bg: '#1a0000', star: '#ff6b6b' },
];

export const BADGES = [
  { id: 'heart', emoji: '💗', name: '推しへの愛' },
  { id: 'star', emoji: '⭐', name: 'スター' },
  { id: 'crown', emoji: '👑', name: '王者' },
  { id: 'fire', emoji: '🔥', name: '情熱' },
  { id: 'sparkle', emoji: '✨', name: 'キラキラ' },
  { id: 'rainbow', emoji: '🌈', name: 'レインボー' },
  { id: 'music', emoji: '🎵', name: '音楽' },
  { id: 'flower', emoji: '🌸', name: '桜' },
];

export const TITLES = [
  '永遠の推し',
  '世界一の推し',
  '運命の推し',
  '最強の推し',
  '至高の推し',
  '唯一の推し',
];

const STORAGE_KEY = 'oshishrine_data';

export function loadShrine() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return {
    oshiName: '',
    catchphrase: '',
    themeId: 'pink',
    badges: ['heart', 'star', 'sparkle'],
    title: '永遠の推し',
    visitorCount: Math.floor(Math.random() * 9000) + 1000,
    guestbookEntries: [
      { name: '通りすがりのオタク', text: 'この推し、最高すぎます！！', date: '2003/04/15' },
      { name: 'ファン歴10年', text: '素敵なサイトですね✨', date: '2005/08/22' },
    ],
    createdAt: new Date().toISOString(),
  };
}

export function saveShrine(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

export function getTheme(id) {
  return THEMES.find(t => t.id === id) || THEMES[0];
}

export function incrementVisitor(data) {
  data.visitorCount += 1;
  saveShrine(data);
}

export function addGuestbookEntry(data, name, text) {
  const fakeYear = 2000 + Math.floor(Math.random() * 8);
  const fakeMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const fakeDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  data.guestbookEntries.push({
    name: name || '名無しさん',
    text,
    date: `${fakeYear}/${fakeMonth}/${fakeDay}`,
  });
  saveShrine(data);
}
