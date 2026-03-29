// Mood definitions with Japanese names, colors, and HSL values for p5.js
export const moods = [
  { id: 'joy',     name: '喜び',   emoji: '😊', color: '#fbbf24', h: 43,  s: 96, l: 56 },
  { id: 'calm',    name: '穏やか', emoji: '😌', color: '#60a5fa', h: 217, s: 94, l: 68 },
  { id: 'energy',  name: '元気',   emoji: '🔥', color: '#f97316', h: 25,  s: 95, l: 53 },
  { id: 'love',    name: '愛',     emoji: '💗', color: '#f472b6', h: 330, s: 87, l: 70 },
  { id: 'sad',     name: '悲しみ', emoji: '😢', color: '#6366f1', h: 239, s: 84, l: 67 },
  { id: 'anger',   name: '怒り',   emoji: '😤', color: '#ef4444', h: 0,   s: 84, l: 60 },
  { id: 'anxious', name: '不安',   emoji: '😰', color: '#8b5cf6', h: 258, s: 90, l: 66 },
  { id: 'neutral', name: 'ふつう', emoji: '😐', color: '#94a3b8', h: 215, s: 16, l: 65 },
];

export function getMoodById(id) {
  return moods.find(m => m.id === id);
}

export function getMoodColor(id) {
  const mood = getMoodById(id);
  return mood ? mood.color : '#94a3b8';
}
