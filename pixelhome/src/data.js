// Moving tasks and furniture definitions
// Each task unlocks a piece of pixel furniture when completed

export const TASKS = [
  // Essential moving tasks
  { id: 'address', name: '住所変更届を出す', category: 'essential', furniture: 'mailbox' },
  { id: 'internet', name: 'インターネット開通', category: 'essential', furniture: 'computer' },
  { id: 'gas', name: 'ガス開栓の手続き', category: 'essential', furniture: 'stove' },
  { id: 'electricity', name: '電気の契約', category: 'essential', furniture: 'lamp' },
  { id: 'water', name: '水道の開始届', category: 'essential', furniture: 'plant' },

  // Shopping tasks
  { id: 'curtain', name: 'カーテンを買う', category: 'shopping', furniture: 'curtain' },
  { id: 'bed', name: 'ベッド/布団を準備', category: 'shopping', furniture: 'bed' },
  { id: 'fridge', name: '冷蔵庫を設置', category: 'shopping', furniture: 'fridge' },
  { id: 'wash', name: '洗濯機を設置', category: 'shopping', furniture: 'washer' },
  { id: 'table', name: 'テーブルを置く', category: 'shopping', furniture: 'table' },

  // Setting up tasks
  { id: 'unpack', name: '段ボールを全部開ける', category: 'setup', furniture: 'bookshelf' },
  { id: 'clean', name: '部屋を掃除する', category: 'setup', furniture: 'rug' },
  { id: 'greet', name: '近所に挨拶する', category: 'setup', furniture: 'doormat' },
  { id: 'cook', name: '初めての自炊をする', category: 'setup', furniture: 'kitchenware' },
  { id: 'relax', name: '新居でゆっくりくつろぐ', category: 'setup', furniture: 'sofa' },
];

// Secret meme items unlocked by conditions
export const SECRETS = [
  { id: 'nyancat', name: 'にゃんキャット', condition: 'complete_5', desc: '5つのタスクを完了' },
  { id: 'doge', name: '柴犬ミーム', condition: 'complete_10', desc: '10つのタスクを完了' },
  { id: 'this_is_fine', name: 'This is Fine 犬', condition: 'complete_all', desc: '全タスク完了' },
  { id: 'pixel_cat', name: 'ピクセル猫', condition: 'first_task', desc: '最初のタスクを完了' },
];

// Pixel art furniture definitions (drawn on canvas)
// Each is a function that draws on a 2D context at (x, y) with given scale
export const FURNITURE = {
  // Essential
  mailbox:     { x: 20,  y: 140, w: 16, h: 20, color: '#e74c3c', label: 'ポスト' },
  computer:    { x: 140, y: 90,  w: 24, h: 18, color: '#3498db', label: 'PC' },
  stove:       { x: 260, y: 120, w: 20, h: 16, color: '#e67e22', label: 'コンロ' },
  lamp:        { x: 80,  y: 60,  w: 10, h: 24, color: '#f1c40f', label: 'ライト' },
  plant:       { x: 300, y: 100, w: 14, h: 20, color: '#27ae60', label: '観葉植物' },

  // Shopping
  curtain:     { x: 160, y: 30,  w: 40, h: 40, color: '#9b59b6', label: 'カーテン' },
  bed:         { x: 40,  y: 90,  w: 36, h: 24, color: '#e8d5b7', label: 'ベッド' },
  fridge:      { x: 240, y: 80,  w: 18, h: 28, color: '#ecf0f1', label: '冷蔵庫' },
  washer:      { x: 280, y: 88,  w: 18, h: 22, color: '#bdc3c7', label: '洗濯機' },
  table:       { x: 130, y: 120, w: 30, h: 16, color: '#8B4513', label: 'テーブル' },

  // Setup
  bookshelf:   { x: 10,  y: 50,  w: 22, h: 36, color: '#795548', label: '本棚' },
  rug:         { x: 100, y: 140, w: 60, h: 20, color: '#c0392b', label: 'ラグ' },
  doormat:     { x: 170, y: 155, w: 24, h: 8,  color: '#7f8c8d', label: '玄関マット' },
  kitchenware: { x: 250, y: 108, w: 12, h: 10, color: '#d35400', label: '調理器具' },
  sofa:        { x: 80,  y: 110, w: 40, h: 22, color: '#2980b9', label: 'ソファ' },

  // Secrets
  nyancat:     { x: 200, y: 35,  w: 20, h: 12, color: '#ff69b4', label: 'にゃんキャット' },
  doge:        { x: 310, y: 140, w: 14, h: 14, color: '#f0c040', label: '柴犬' },
  this_is_fine:{ x: 100, y: 40,  w: 14, h: 16, color: '#ff4500', label: 'This is Fine' },
  pixel_cat:   { x: 220, y: 145, w: 12, h: 12, color: '#888', label: 'ピクセル猫' },
};

export const CATEGORIES = {
  essential: { name: '手続き系', emoji: '📋', color: '#e74c3c' },
  shopping:  { name: '買い物系', emoji: '🛒', color: '#3498db' },
  setup:     { name: '生活準備', emoji: '🏠', color: '#27ae60' },
};

export function checkSecrets(completedCount, totalTasks) {
  const unlocked = [];
  if (completedCount >= 1) unlocked.push('pixel_cat');
  if (completedCount >= 5) unlocked.push('nyancat');
  if (completedCount >= 10) unlocked.push('doge');
  if (completedCount >= totalTasks) unlocked.push('this_is_fine');
  return unlocked;
}
