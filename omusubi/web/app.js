/**
 * 🍙 おむすび — Web App
 */

// ===== Data (mirrors Dart lib) =====
const REACTIONS = {
  'おにぎり': { msg: 'おっ、仲間だ！おにぎり美味しいよね！', face: '🤩', emoji: '🍙' },
  'おむすび': { msg: 'おっ、仲間だ！おにぎり美味しいよね！', face: '🤩', emoji: '🍙' },
  'カレー': { msg: 'カレーの日だね！みんな大好きカレー！', face: '😋', emoji: '🍛' },
  'ラーメン': { msg: 'ラーメン！体があったまるね〜', face: '😋', emoji: '🍜' },
  'お寿司': { msg: 'お寿司！贅沢だね〜いいな〜', face: '🤩', emoji: '🍣' },
  'パスタ': { msg: 'パスタおしゃれだね！', face: '😊', emoji: '🍝' },
  'ピザ': { msg: 'ピザ！シェアしたいな〜', face: '😊', emoji: '🍕' },
  'ハンバーグ': { msg: 'がっつり系だね！元気出る！', face: '😋', emoji: '🍔' },
  'サラダ': { msg: 'ヘルシー！体に気をつけてるんだね', face: '😊', emoji: '🥗' },
  'ケーキ': { msg: '甘いもの！幸せだよね〜', face: '😋', emoji: '🍰' },
  'お鍋': { msg: 'お鍋！一緒に食べたいな...', face: '🥺', emoji: '🍲' },
  'コンビニ': { msg: 'たまにはいいけど...ちゃんと食べてる？', face: '😟', emoji: '🏪' },
};

const RECIPES = [
  { name: 'おにぎり', emoji: '🍙', difficulty: '簡単', minutes: 15, ingredients: ['ご飯','塩','海苔','好きな具材'], tip: '同じ具材で握って、食べ比べしてみよう！' },
  { name: 'カレーライス', emoji: '🍛', difficulty: '普通', minutes: 45, ingredients: ['カレールー','肉','じゃがいも','にんじん','玉ねぎ'], tip: '同じルーを使えば、離れていても同じ味に！' },
  { name: 'パスタ・ナポリタン', emoji: '🍝', difficulty: '簡単', minutes: 20, ingredients: ['スパゲッティ','ケチャップ','ウインナー','ピーマン','玉ねぎ'], tip: '懐かしい味を二人で楽しもう' },
  { name: 'オムライス', emoji: '🍳', difficulty: '普通', minutes: 30, ingredients: ['ご飯','卵','ケチャップ','鶏肉','玉ねぎ'], tip: 'ケチャップでメッセージを書いて写真を送り合おう！' },
  { name: 'ホットケーキ', emoji: '🥞', difficulty: '簡単', minutes: 20, ingredients: ['ホットケーキミックス','卵','牛乳','バター'], tip: '焼き上がりの写真を送り合おう。上手に焼けたかな？' },
  { name: 'チャーハン', emoji: '🍚', difficulty: '簡単', minutes: 15, ingredients: ['ご飯','卵','ネギ','チャーシュー','醤油'], tip: '冷蔵庫の残り物で勝負！何が入ったか当てっこ' },
];

// ===== State =====
let meals = JSON.parse(localStorage.getItem('omusubi_meals') || '[]');
let currentPerson = 'A';

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  render();
  initEvents();
  showRecipe();
});

function initEvents() {
  document.getElementById('btn-person-a').addEventListener('click', () => setPerson('A'));
  document.getElementById('btn-person-b').addEventListener('click', () => setPerson('B'));
  document.getElementById('btn-log').addEventListener('click', logMeal);
  document.getElementById('food-input').addEventListener('keydown', e => { if (e.key === 'Enter') logMeal(); });
}

function setPerson(p) {
  currentPerson = p;
  document.querySelectorAll('.person-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.person-btn[data-person="${p}"]`).classList.add('active');
}

function logMeal() {
  const input = document.getElementById('food-input');
  const food = input.value.trim();
  if (!food) return;

  const entry = { food, person: currentPerson, timestamp: new Date().toISOString() };
  meals.push(entry);
  localStorage.setItem('omusubi_meals', JSON.stringify(meals));
  input.value = '';

  // Mascot reaction
  const reaction = getReaction(food);
  showMascotReaction(reaction);

  render();
}

function getReaction(food) {
  for (const [key, val] of Object.entries(REACTIONS)) {
    if (food.includes(key)) return val;
  }
  return { msg: `${food}だね！おいしそう！`, face: '😋', emoji: '🍽️' };
}

function showMascotReaction(reaction) {
  const face = document.getElementById('mascot-face');
  const msg = document.getElementById('mascot-message');
  face.textContent = reaction.face;
  msg.textContent = `${reaction.emoji} ${reaction.msg}`;
  face.style.transform = 'scale(1.2)';
  setTimeout(() => { face.style.transform = 'scale(1)'; }, 300);
}

// ===== Render =====
function render() {
  const today = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(m => m.timestamp.startsWith(today));
  const mealsA = todayMeals.filter(m => m.person === 'A');
  const mealsB = todayMeals.filter(m => m.person === 'B');

  // Render meal lists
  document.getElementById('meals-a').innerHTML = mealsA.length === 0
    ? '<p style="color:#ccc;font-size:13px">まだ記録なし</p>'
    : mealsA.map(m => renderMealItem(m)).join('');

  document.getElementById('meals-b').innerHTML = mealsB.length === 0
    ? '<p style="color:#ccc;font-size:13px">まだ記録なし</p>'
    : mealsB.map(m => renderMealItem(m)).join('');

  // Together meals
  const together = findTogetherMeals(todayMeals);
  const togetherEl = document.getElementById('together-meals');
  if (together.length > 0) {
    togetherEl.innerHTML = `<div class="together-banner">💕 今日 ${together.length}回 一緒にごはんしたよ！</div>`;
  } else if (mealsA.length > 0 && mealsB.length > 0) {
    togetherEl.innerHTML = '<div class="together-banner">今日はすれ違いごはん...明日は一緒に食べよう！</div>';
  } else {
    togetherEl.innerHTML = '';
  }

  // Stats
  const streak = calculateStreak();
  document.getElementById('stat-total').textContent = meals.length;
  document.getElementById('stat-together').textContent = findTogetherMeals(meals).length;
  document.getElementById('stat-streak').textContent = streak;
  document.getElementById('streak-count').textContent = streak;

  // Food ranking
  renderRanking();
}

function renderMealItem(m) {
  const t = new Date(m.timestamp);
  const time = `${t.getHours().toString().padStart(2,'0')}:${t.getMinutes().toString().padStart(2,'0')}`;
  return `<div class="meal-item"><span>${m.food}</span> <span class="time">${time}</span></div>`;
}

function findTogetherMeals(list) {
  const a = list.filter(m => m.person === 'A');
  const b = list.filter(m => m.person === 'B');
  const together = [];
  for (const ma of a) {
    for (const mb of b) {
      const diff = Math.abs(new Date(ma.timestamp) - new Date(mb.timestamp)) / 60000;
      if (diff <= 120) together.push({ a: ma, b: mb });
    }
  }
  return together;
}

function calculateStreak() {
  const togetherDays = new Set();
  const together = findTogetherMeals(meals);
  for (const t of together) {
    togetherDays.add(new Date(t.a.timestamp).toISOString().split('T')[0]);
  }
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today - i * 86400000);
    if (togetherDays.has(d.toISOString().split('T')[0])) streak++;
    else if (i > 0) break;
  }
  return streak;
}

function renderRanking() {
  const counts = {};
  for (const m of meals) counts[m.food] = (counts[m.food] || 0) + 1;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const el = document.getElementById('food-ranking');
  if (sorted.length === 0) { el.innerHTML = '<p style="color:#ccc;font-size:13px">まだデータなし</p>'; return; }
  el.innerHTML = sorted.map(([food, count]) =>
    `<div class="rank-item"><span>${food}</span><span class="rank-count">${count}回</span></div>`
  ).join('');
}

function showRecipe() {
  const recipe = RECIPES[new Date().getDate() % RECIPES.length];
  document.getElementById('recipe-area').innerHTML = `
    <div class="recipe-card">
      <div class="recipe-emoji">${recipe.emoji}</div>
      <div class="recipe-info">
        <h3>${recipe.name}</h3>
        <div class="recipe-meta">${recipe.difficulty} ・ ${recipe.minutes}分</div>
        <div class="recipe-ingredients">${recipe.ingredients.map(i => `<span class="ingredient-tag">${i}</span>`).join('')}</div>
        <p class="recipe-tip">💡 ${recipe.tip}</p>
      </div>
    </div>
  `;
}
