// Hazard database organized by room type and child age group
// Age groups: 0-1, 1-3, 3-6, 6-12

const ROOM_TYPES = [
  { id: 'living', name: 'リビング', icon: '🛋️', color: '#A8D8EA' },
  { id: 'kitchen', name: 'キッチン', icon: '🍳', color: '#FFD3B6' },
  { id: 'bedroom', name: '寝室', icon: '🛏️', color: '#D5C4E0' },
  { id: 'bathroom', name: '浴室', icon: '🛁', color: '#B5EAD7' },
  { id: 'kidsroom', name: '子ども部屋', icon: '🧸', color: '#FFEEAD' },
  { id: 'entrance', name: '玄関', icon: '🚪', color: '#FFB7B2' },
  { id: 'balcony', name: 'バルコニー', icon: '🌿', color: '#C7CEEA' },
  { id: 'stairs', name: '階段', icon: '🪜', color: '#E2F0CB' },
  { id: 'washroom', name: '洗面所', icon: '🪥', color: '#B5D8EB' },
  { id: 'toilet', name: 'トイレ', icon: '🚽', color: '#E8D5B7' },
  { id: 'storage', name: '収納・物置', icon: '📦', color: '#D4C5A9' },
  { id: 'garage', name: 'ガレージ', icon: '🚗', color: '#C9C9C9' },
];

const HAZARD_DATABASE = {
  living: {
    '0-1': [
      { text: 'コンセントカバーの設置', priority: 'high' },
      { text: '家具の転倒防止金具の取付', priority: 'high' },
      { text: 'テーブル角のコーナーガード', priority: 'high' },
      { text: '小物・ボタン電池の片付け（誤飲防止）', priority: 'high' },
      { text: 'ブラインドの紐の処理（首巻き防止）', priority: 'medium' },
      { text: '観葉植物の安全確認（有毒植物の除去）', priority: 'medium' },
      { text: 'テレビの固定', priority: 'medium' },
      { text: 'リモコンの電池カバー確認', priority: 'low' },
    ],
    '1-3': [
      { text: 'コンセントカバーの設置', priority: 'high' },
      { text: '家具の転倒防止金具の取付', priority: 'high' },
      { text: '窓の転落防止柵', priority: 'high' },
      { text: '引き出しロックの設置', priority: 'medium' },
      { text: 'テレビ台の安定確認', priority: 'medium' },
      { text: '小さな置物・ガラス製品の移動', priority: 'medium' },
      { text: 'カーペットの滑り止め', priority: 'low' },
    ],
    '3-6': [
      { text: '窓の転落防止対策', priority: 'high' },
      { text: '家具の転倒防止', priority: 'medium' },
      { text: 'ハサミ等の文房具の管理', priority: 'medium' },
      { text: '電化製品のコード整理', priority: 'low' },
      { text: 'カーテンの紐の安全確認', priority: 'low' },
    ],
    '6-12': [
      { text: '家具の転倒防止確認', priority: 'medium' },
      { text: '電化製品の正しい使い方の説明', priority: 'low' },
      { text: '緊急時の連絡先の掲示', priority: 'low' },
    ],
  },
  kitchen: {
    '0-1': [
      { text: 'ベビーゲートの設置（キッチン入口）', priority: 'high' },
      { text: '包丁・刃物のチャイルドロック付き収納', priority: 'high' },
      { text: '洗剤・薬品の高所保管', priority: 'high' },
      { text: 'コンロのガード設置', priority: 'high' },
      { text: 'ゴミ箱のロック', priority: 'medium' },
      { text: '冷蔵庫のチャイルドロック', priority: 'medium' },
      { text: '炊飯器・ポットの蒸気対策', priority: 'medium' },
      { text: '引き出し・棚のロック', priority: 'medium' },
    ],
    '1-3': [
      { text: '包丁・刃物の安全な収納', priority: 'high' },
      { text: 'コンロのガード・ロック', priority: 'high' },
      { text: '洗剤の保管場所確認', priority: 'high' },
      { text: '炊飯器・電気ポットの蒸気対策', priority: 'high' },
      { text: '食器棚の転倒防止', priority: 'medium' },
      { text: 'ゴミ箱のロック', priority: 'medium' },
      { text: 'ラップ・アルミホイルのカッター注意', priority: 'low' },
    ],
    '3-6': [
      { text: '包丁の安全管理', priority: 'high' },
      { text: 'コンロの使用ルール', priority: 'high' },
      { text: '洗剤の保管', priority: 'medium' },
      { text: '電子レンジの使い方指導', priority: 'medium' },
      { text: 'やけど防止（鍋の取っ手の向き）', priority: 'medium' },
    ],
    '6-12': [
      { text: '包丁の安全な使い方指導', priority: 'medium' },
      { text: '火の取り扱い指導', priority: 'medium' },
      { text: '食品衛生の教育', priority: 'low' },
    ],
  },
  bedroom: {
    '0-1': [
      { text: 'ベビーベッドの安全基準確認', priority: 'high' },
      { text: '窒息防止（枕・布団の管理）', priority: 'high' },
      { text: 'コンセントカバー', priority: 'high' },
      { text: '家具の転倒防止', priority: 'high' },
      { text: 'ベッドからの転落防止', priority: 'medium' },
      { text: 'カーテンの紐の処理', priority: 'medium' },
      { text: '小物の片付け', priority: 'medium' },
    ],
    '1-3': [
      { text: 'ベッドガードの設置', priority: 'high' },
      { text: '窓のロック', priority: 'high' },
      { text: '家具の転倒防止', priority: 'high' },
      { text: '引き出しのロック', priority: 'medium' },
      { text: 'コンセントカバー', priority: 'medium' },
      { text: 'クローゼットのロック', priority: 'low' },
    ],
    '3-6': [
      { text: '窓のロック確認', priority: 'high' },
      { text: 'ベッドの安全確認', priority: 'medium' },
      { text: '家具の固定確認', priority: 'medium' },
      { text: '照明器具の安全確認', priority: 'low' },
    ],
    '6-12': [
      { text: '窓の安全確認', priority: 'medium' },
      { text: '電化製品の安全使用', priority: 'low' },
      { text: '就寝時の安全確認', priority: 'low' },
    ],
  },
  bathroom: {
    '0-1': [
      { text: 'ドアロック（外からの解錠可能確認）', priority: 'high' },
      { text: '浴槽の残り湯を必ず抜く', priority: 'high' },
      { text: '滑り止めマットの設置', priority: 'high' },
      { text: '温度調節（48度以下設定）', priority: 'high' },
      { text: '洗剤・シャンプーの保管', priority: 'medium' },
      { text: 'カミソリの保管', priority: 'medium' },
      { text: '浴室の換気', priority: 'low' },
    ],
    '1-3': [
      { text: '浴槽の残り湯処理', priority: 'high' },
      { text: '滑り止めの確認', priority: 'high' },
      { text: '温度調節の確認', priority: 'high' },
      { text: 'ドアロックの確認', priority: 'medium' },
      { text: '洗剤の保管場所', priority: 'medium' },
      { text: 'カミソリの安全管理', priority: 'medium' },
    ],
    '3-6': [
      { text: '滑り止めの確認', priority: 'high' },
      { text: '温度調節の確認', priority: 'medium' },
      { text: '一人入浴のルール', priority: 'medium' },
      { text: '洗剤の管理', priority: 'low' },
    ],
    '6-12': [
      { text: '滑り止めの確認', priority: 'medium' },
      { text: '入浴時の安全ルール', priority: 'low' },
      { text: '温度管理の教育', priority: 'low' },
    ],
  },
  kidsroom: {
    '0-1': [
      { text: 'ベビーベッド/サークルの安全確認', priority: 'high' },
      { text: 'おもちゃの対象年齢確認（誤飲サイズ）', priority: 'high' },
      { text: 'コンセントカバー', priority: 'high' },
      { text: '窓のロック', priority: 'high' },
      { text: '家具の転倒防止', priority: 'high' },
      { text: 'モビール等の固定確認', priority: 'medium' },
    ],
    '1-3': [
      { text: 'おもちゃの安全確認（小さい部品）', priority: 'high' },
      { text: '窓のロック', priority: 'high' },
      { text: '家具の転倒防止', priority: 'high' },
      { text: 'ベッドガード', priority: 'high' },
      { text: 'コンセントカバー', priority: 'medium' },
      { text: '棚・引き出しのロック', priority: 'medium' },
      { text: '絵本棚の安定性', priority: 'low' },
    ],
    '3-6': [
      { text: '窓のロック確認', priority: 'high' },
      { text: 'おもちゃの安全性（年齢適合）', priority: 'medium' },
      { text: 'ベッドの安全確認', priority: 'medium' },
      { text: 'ハサミ・文房具の管理', priority: 'medium' },
      { text: '家具の固定', priority: 'medium' },
    ],
    '6-12': [
      { text: '窓の安全確認', priority: 'medium' },
      { text: 'デスク周りの整理', priority: 'low' },
      { text: '電子機器の安全使用', priority: 'low' },
      { text: '学習用品の管理', priority: 'low' },
    ],
  },
  entrance: {
    '0-1': [
      { text: 'ベビーゲートの設置', priority: 'high' },
      { text: '段差の安全対策', priority: 'high' },
      { text: '靴箱の転倒防止', priority: 'medium' },
      { text: '鍵・小物の片付け', priority: 'medium' },
      { text: '傘立ての固定', priority: 'low' },
    ],
    '1-3': [
      { text: '段差の安全対策', priority: 'high' },
      { text: 'ドアの指挟み防止', priority: 'high' },
      { text: '靴箱の安定性', priority: 'medium' },
      { text: '飛び出し防止（ドアロック）', priority: 'medium' },
    ],
    '3-6': [
      { text: '飛び出し防止の教育', priority: 'high' },
      { text: 'ドアの指挟み防止', priority: 'medium' },
      { text: '段差の注意', priority: 'low' },
    ],
    '6-12': [
      { text: '鍵の管理教育', priority: 'medium' },
      { text: '防犯意識の教育', priority: 'medium' },
    ],
  },
  balcony: {
    '0-1': [
      { text: 'バルコニーへの出入り防止', priority: 'high' },
      { text: '手すりの隙間確認（11cm以下）', priority: 'high' },
      { text: '足がかりになる物の撤去', priority: 'high' },
    ],
    '1-3': [
      { text: '転落防止柵の確認', priority: 'high' },
      { text: '足がかりになる物の撤去', priority: 'high' },
      { text: 'バルコニードアのロック', priority: 'high' },
      { text: '手すりの強度確認', priority: 'medium' },
    ],
    '3-6': [
      { text: '転落防止の教育', priority: 'high' },
      { text: '手すり・柵の確認', priority: 'high' },
      { text: '足がかりの除去', priority: 'medium' },
    ],
    '6-12': [
      { text: '転落防止の注意喚起', priority: 'high' },
      { text: '手すりの確認', priority: 'medium' },
    ],
  },
  stairs: {
    '0-1': [
      { text: 'ベビーゲートの設置（上下）', priority: 'high' },
      { text: '階段への単独アクセス防止', priority: 'high' },
      { text: '滑り止めの設置', priority: 'medium' },
    ],
    '1-3': [
      { text: 'ベビーゲートの設置', priority: 'high' },
      { text: '滑り止めの設置', priority: 'high' },
      { text: '手すりの設置・確認', priority: 'medium' },
      { text: '照明の確認', priority: 'low' },
    ],
    '3-6': [
      { text: '滑り止めの確認', priority: 'high' },
      { text: '手すりの使用習慣', priority: 'medium' },
      { text: '階段での遊び禁止ルール', priority: 'medium' },
    ],
    '6-12': [
      { text: '滑り止めの確認', priority: 'medium' },
      { text: '手すりの確認', priority: 'low' },
    ],
  },
  washroom: {
    '0-1': [
      { text: '洗濯機のチャイルドロック', priority: 'high' },
      { text: '洗剤の高所保管', priority: 'high' },
      { text: '滑り止め', priority: 'medium' },
      { text: 'ドライヤー等のコード管理', priority: 'medium' },
    ],
    '1-3': [
      { text: '洗剤の安全管理', priority: 'high' },
      { text: '洗濯機のロック', priority: 'high' },
      { text: 'ドライヤーの管理', priority: 'medium' },
      { text: '滑り止め', priority: 'medium' },
    ],
    '3-6': [
      { text: '洗剤の管理', priority: 'medium' },
      { text: '電化製品の安全使用', priority: 'medium' },
      { text: '滑り止め', priority: 'low' },
    ],
    '6-12': [
      { text: '電化製品の安全な使い方', priority: 'low' },
      { text: '洗剤の適切な使用', priority: 'low' },
    ],
  },
  toilet: {
    '0-1': [
      { text: 'トイレのドアロック', priority: 'high' },
      { text: '便器の蓋ロック', priority: 'medium' },
      { text: '洗剤の保管', priority: 'medium' },
    ],
    '1-3': [
      { text: '便器への転落防止', priority: 'high' },
      { text: '洗剤の安全管理', priority: 'medium' },
      { text: 'ドアの指挟み防止', priority: 'medium' },
    ],
    '3-6': [
      { text: '洗剤の管理', priority: 'medium' },
      { text: 'トイレの衛生管理', priority: 'low' },
    ],
    '6-12': [
      { text: '衛生習慣の教育', priority: 'low' },
    ],
  },
  storage: {
    '0-1': [
      { text: '収納扉のチャイルドロック', priority: 'high' },
      { text: '危険物の高所保管', priority: 'high' },
      { text: '棚の転倒防止', priority: 'medium' },
    ],
    '1-3': [
      { text: 'チャイルドロックの確認', priority: 'high' },
      { text: '危険物の管理', priority: 'high' },
      { text: '棚の安定性', priority: 'medium' },
    ],
    '3-6': [
      { text: '危険物の保管確認', priority: 'medium' },
      { text: '棚の安定性', priority: 'medium' },
    ],
    '6-12': [
      { text: '整理整頓の習慣', priority: 'low' },
    ],
  },
  garage: {
    '0-1': [
      { text: 'ガレージへのアクセス防止', priority: 'high' },
      { text: '工具・薬品の施錠保管', priority: 'high' },
    ],
    '1-3': [
      { text: 'ガレージへのアクセス制限', priority: 'high' },
      { text: '工具・薬品の施錠', priority: 'high' },
      { text: '車両周りの安全確認', priority: 'medium' },
    ],
    '3-6': [
      { text: '工具の管理', priority: 'high' },
      { text: '車両の安全教育', priority: 'medium' },
      { text: '薬品の保管', priority: 'medium' },
    ],
    '6-12': [
      { text: '工具の安全な使い方', priority: 'medium' },
      { text: '車両周りの安全意識', priority: 'medium' },
    ],
  },
};

const AGE_GROUPS = [
  { id: '0-1', label: '0〜1歳' },
  { id: '1-3', label: '1〜3歳' },
  { id: '3-6', label: '3〜6歳' },
  { id: '6-12', label: '6〜12歳' },
];

function getHazardsForRoom(roomType, ageGroup) {
  const roomHazards = HAZARD_DATABASE[roomType];
  if (!roomHazards) return [];
  return roomHazards[ageGroup] || [];
}

function calculateRoomScore(hazardItems) {
  if (!hazardItems || hazardItems.length === 0) return 100;
  const weights = { high: 3, medium: 2, low: 1 };
  let totalWeight = 0;
  let checkedWeight = 0;
  for (const item of hazardItems) {
    const w = weights[item.priority] || 1;
    totalWeight += w;
    if (item.checked) checkedWeight += w;
  }
  return totalWeight === 0 ? 100 : Math.round((checkedWeight / totalWeight) * 100);
}

function calculateOverallScore(rooms) {
  if (!rooms || rooms.length === 0) return 100;
  let totalWeight = 0;
  let totalChecked = 0;
  const weights = { high: 3, medium: 2, low: 1 };
  for (const room of rooms) {
    if (!room.hazards) continue;
    for (const h of room.hazards) {
      const w = weights[h.priority] || 1;
      totalWeight += w;
      if (h.checked) totalChecked += w;
    }
  }
  return totalWeight === 0 ? 100 : Math.round((totalChecked / totalWeight) * 100);
}

function getPriorityActions(rooms, limit = 10) {
  const actions = [];
  for (const room of rooms) {
    if (!room.hazards) continue;
    const roomType = ROOM_TYPES.find(r => r.id === room.type);
    for (const h of room.hazards) {
      if (!h.checked) {
        actions.push({
          roomName: room.name || (roomType ? roomType.name : room.type),
          roomIcon: roomType ? roomType.icon : '🏠',
          ...h,
        });
      }
    }
  }
  // Sort by priority: high > medium > low
  const order = { high: 0, medium: 1, low: 2 };
  actions.sort((a, b) => (order[a.priority] || 2) - (order[b.priority] || 2));
  return actions.slice(0, limit);
}

module.exports = {
  ROOM_TYPES,
  HAZARD_DATABASE,
  AGE_GROUPS,
  getHazardsForRoom,
  calculateRoomScore,
  calculateOverallScore,
  getPriorityActions,
};
