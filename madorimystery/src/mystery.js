// Mystery scenario generation engine
// Given a floor plan, generates a complete mystery with suspects, clues, and solution

export const ROOM_TYPES = [
  { id: 'living', name: 'リビング', emoji: '🛋️', color: '#4a6fa5' },
  { id: 'bedroom', name: '寝室', emoji: '🛏️', color: '#7a5195' },
  { id: 'kitchen', name: 'キッチン', emoji: '🍳', color: '#ef5675' },
  { id: 'bathroom', name: '浴室', emoji: '🚿', color: '#00b4d8' },
  { id: 'study', name: '書斎', emoji: '📚', color: '#2d6a4f' },
  { id: 'storage', name: '物置', emoji: '📦', color: '#6c757d' },
  { id: 'hallway', name: '廊下', emoji: '🚪', color: '#adb5bd' },
  { id: 'garden', name: '庭', emoji: '🌿', color: '#40916c' },
];

export const SUSPECTS = [
  { id: 's1', name: '佐藤 明', role: '被害者の配偶者', emoji: '🧑‍💼', alibi: '寝室にいたと主張' },
  { id: 's2', name: '田中 美咲', role: '被害者の秘書', emoji: '👩‍💻', alibi: '書斎で仕事をしていたと主張' },
  { id: 's3', name: '山本 健一', role: '被害者の弟', emoji: '👨‍🔧', alibi: 'キッチンで料理をしていたと主張' },
  { id: 's4', name: '鈴木 花子', role: '隣人', emoji: '👩‍🌾', alibi: '庭を散歩していたと主張' },
];

const WEAPONS = [
  { id: 'knife', name: '包丁', room_affinity: 'kitchen', emoji: '🔪' },
  { id: 'rope', name: 'ロープ', room_affinity: 'storage', emoji: '🪢' },
  { id: 'poison', name: '毒薬', room_affinity: 'bathroom', emoji: '☠️' },
  { id: 'candlestick', name: '燭台', room_affinity: 'living', emoji: '🕯️' },
  { id: 'bookend', name: 'ブックエンド', room_affinity: 'study', emoji: '📕' },
];

const MOTIVES = [
  '遺産相続をめぐる争い',
  '長年の恨み',
  '秘密を知られたくなかった',
  'ビジネスの裏切り',
  '嫉妬と愛憎',
];

const CLUE_TEMPLATES = [
  { type: 'footprint', name: '足跡', desc: '{room}に{suspect}の靴と一致する足跡が残っていた' },
  { type: 'fingerprint', name: '指紋', desc: '{weapon}から{suspect}の指紋が検出された' },
  { type: 'alibi_break', name: 'アリバイ崩壊', desc: '{suspect}の「{room}にいた」というアリバイが防犯カメラで否定された' },
  { type: 'witness', name: '目撃証言', desc: '深夜2時に{suspect}が{room}付近を歩いているのが目撃された' },
  { type: 'evidence', name: '物的証拠', desc: '{room}で{suspect}の私物が発見された' },
];

export function generateMystery(rooms) {
  if (rooms.length < 2) return null;

  const seed = rooms.map(r => r.type + r.x + r.y).join('');
  const rng = seededRandom(hashCode(seed));

  // Pick culprit
  const culpritIdx = Math.floor(rng() * SUSPECTS.length);
  const culprit = SUSPECTS[culpritIdx];

  // Pick weapon based on available rooms
  const availableWeapons = WEAPONS.filter(w =>
    rooms.some(r => r.type === w.room_affinity) || true
  );
  const weapon = availableWeapons[Math.floor(rng() * availableWeapons.length)];

  // Pick crime scene (a room)
  const crimeSceneRoom = rooms[Math.floor(rng() * rooms.length)];

  // Pick motive
  const motive = MOTIVES[Math.floor(rng() * MOTIVES.length)];

  // Generate clues (3-4 clues, placed in different rooms)
  const clues = [];
  const usedRooms = new Set();
  const clueCount = Math.min(3 + Math.floor(rng() * 2), rooms.length);

  for (let i = 0; i < clueCount && i < CLUE_TEMPLATES.length; i++) {
    const template = CLUE_TEMPLATES[i];
    let clueRoom;
    // Try to place in unused room
    const available = rooms.filter(r => !usedRooms.has(r.id));
    clueRoom = available.length > 0
      ? available[Math.floor(rng() * available.length)]
      : rooms[Math.floor(rng() * rooms.length)];
    usedRooms.add(clueRoom.id);

    const roomType = ROOM_TYPES.find(rt => rt.id === clueRoom.type);
    const desc = template.desc
      .replace('{room}', roomType ? roomType.name : clueRoom.type)
      .replace('{suspect}', culprit.name)
      .replace('{weapon}', weapon.name);

    clues.push({
      ...template,
      desc,
      roomId: clueRoom.id,
      found: false,
    });
  }

  // Red herring clue pointing to wrong suspect
  const innocentSuspect = SUSPECTS.filter(s => s.id !== culprit.id)[0];
  if (rooms.length > 1) {
    const herringRoom = rooms[Math.floor(rng() * rooms.length)];
    const roomType = ROOM_TYPES.find(rt => rt.id === herringRoom.type);
    clues.push({
      type: 'red_herring',
      name: 'ミスリード',
      desc: `${roomType ? roomType.name : ''}で${innocentSuspect.name}の手袋が見つかったが、実は先日忘れ物をしただけだった`,
      roomId: herringRoom.id,
      found: false,
      isRedHerring: true,
    });
  }

  return {
    title: `${getRoomTypeName(crimeSceneRoom.type)}の惨劇`,
    crimeScene: crimeSceneRoom.id,
    culprit: culprit.id,
    weapon,
    motive,
    suspects: SUSPECTS.map(s => ({ ...s })),
    clues,
    solution: `犯人は${culprit.name}。動機は「${motive}」。凶器は${weapon.emoji}${weapon.name}。${getRoomTypeName(crimeSceneRoom.type)}で犯行に及んだ。`,
  };
}

export function checkAccusation(mystery, suspectId) {
  return suspectId === mystery.culprit;
}

export function findClue(mystery, roomId) {
  const clue = mystery.clues.find(c => c.roomId === roomId && !c.found);
  if (clue) {
    clue.found = true;
    return clue;
  }
  return null;
}

export function getFoundClues(mystery) {
  return mystery.clues.filter(c => c.found);
}

export function allCluesFound(mystery) {
  return mystery.clues.every(c => c.found);
}

function getRoomTypeName(typeId) {
  const rt = ROOM_TYPES.find(r => r.id === typeId);
  return rt ? rt.name : typeId;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}
