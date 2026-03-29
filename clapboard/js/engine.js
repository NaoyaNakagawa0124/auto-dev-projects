// ClapBoard 🎬 — Movie production time tracker
// Tasks = Scenes, Projects = Productions, Retries = Takes

const GENRES = [
  { id: "dev", name: "Development", icon: "💻", color: "#6b5ce7" },
  { id: "meeting", name: "Meeting", icon: "🎙️", color: "#e94560" },
  { id: "design", name: "Design", icon: "🎨", color: "#feca57" },
  { id: "writing", name: "Writing", icon: "✍️", color: "#48dbfb" },
  { id: "review", name: "Review", icon: "🔍", color: "#ff6b6b" },
  { id: "admin", name: "Admin", icon: "📋", color: "#a29bfe" },
  { id: "research", name: "Research", icon: "🔬", color: "#55efc4" },
  { id: "break", name: "Break", icon: "☕", color: "#636e72" },
];

const DIRECTOR_QUOTES = [
  "\"Action is the foundational key to all success.\" — Pablo Picasso",
  "\"Cut! That's the one.\" — Every great director",
  "\"In the middle of difficulty lies opportunity.\" — Albert Einstein",
  "\"The best way to predict the future is to create it.\" — Peter Drucker",
  "\"Lights, camera, productivity!\"",
  "\"Every great production starts with a single scene.\"",
  "\"The show must go on — and so must your focus.\"",
  "\"Roll camera. Roll sound. And... action!\"",
];

const WRAP_MESSAGES = [
  "🎬 That's a wrap on today's production! Great work, Director.",
  "🌟 Another day in the can! The dailies look fantastic.",
  "🏆 And... CUT! Award-worthy effort today.",
  "🎥 Today's footage is in the can. Rest up for tomorrow's shoot.",
  "✨ Brilliant performance today. The critics would approve.",
];

function createDefaultState() {
  return {
    productions: [],
    activeScene: null,
    todayScenes: [],
    totalScenes: 0,
    totalMinutes: 0,
    totalTakes: 0,
    currentProduction: null,
    streak: 0,
    bestStreak: 0,
    lastActiveDate: null,
    history: [], // daily summaries
  };
}

function createProduction(state, name) {
  if (!name || name.trim().length === 0) return { state, success: false, message: "Production needs a name!" };
  const prod = {
    id: "PROD-" + String(state.productions.length + 1).padStart(3, "0"),
    name: name.trim(),
    createdAt: new Date().toISOString(),
    scenes: 0,
    totalMinutes: 0,
    status: "in-production",
  };
  state.productions.push(prod);
  state.currentProduction = prod.id;
  return { state, success: true, message: "🎬 Production '" + prod.name + "' is greenlit!", production: prod };
}

function startScene(state, title, genreId) {
  if (state.activeScene) return { state, success: false, message: "A scene is already rolling! Say 'Cut!' first." };
  if (!title || title.trim().length === 0) return { state, success: false, message: "Scene needs a title!" };

  const genre = GENRES.find(g => g.id === genreId) || GENRES[0];
  state.activeScene = {
    title: title.trim(),
    genre: genre.id,
    production: state.currentProduction,
    startedAt: new Date().toISOString(),
    take: 1,
  };
  return { state, success: true, message: "🎬 Action! Scene: " + title, quote: getRandomQuote(0) };
}

function cutScene(state, timestamp) {
  if (!state.activeScene) return { state, success: false, message: "No scene is rolling. Say 'Action!' first." };

  const now = timestamp || new Date().toISOString();
  const startTime = new Date(state.activeScene.startedAt).getTime();
  const endTime = new Date(now).getTime();
  const durationMs = Math.max(0, endTime - startTime);
  const durationMin = Math.round(durationMs / 60000 * 10) / 10;

  const scene = {
    ...state.activeScene,
    endedAt: now,
    durationMin,
  };

  state.todayScenes.push(scene);
  state.totalScenes++;
  state.totalMinutes += durationMin;
  state.totalTakes += scene.take;

  // Update production stats
  if (scene.production) {
    const prod = state.productions.find(p => p.id === scene.production);
    if (prod) {
      prod.scenes++;
      prod.totalMinutes += durationMin;
    }
  }

  state.activeScene = null;

  return {
    state, success: true, scene,
    message: "✂️ Cut! Scene '" + scene.title + "' — " + durationMin + " min (Take " + scene.take + ")",
  };
}

function retakeScene(state) {
  if (!state.activeScene) return { state, success: false, message: "No scene to retake." };
  state.activeScene.take++;
  state.activeScene.startedAt = new Date().toISOString();
  return { state, success: true, message: "🔄 Take " + state.activeScene.take + "! Action!" };
}

function wrapDay(state) {
  const today = new Date().toISOString().split('T')[0];
  const scenes = state.todayScenes;
  const totalMin = scenes.reduce((sum, s) => sum + s.durationMin, 0);
  const genreCounts = {};
  scenes.forEach(s => { genreCounts[s.genre] = (genreCounts[s.genre] || 0) + 1; });

  const summary = {
    date: today,
    scenes: scenes.length,
    totalMinutes: Math.round(totalMin * 10) / 10,
    genres: genreCounts,
    topGenre: Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
    productions: [...new Set(scenes.map(s => s.production).filter(Boolean))].length,
  };

  state.history.push(summary);
  if (state.history.length > 30) state.history = state.history.slice(-30);

  // Streak
  if (state.lastActiveDate) {
    const last = new Date(state.lastActiveDate);
    const now = new Date(today);
    const diff = Math.floor((now - last) / 86400000);
    if (diff === 1) state.streak++;
    else if (diff > 1) state.streak = 1;
  } else {
    state.streak = 1;
  }
  if (state.streak > state.bestStreak) state.bestStreak = state.streak;
  state.lastActiveDate = today;

  state.todayScenes = [];

  const wrapMsg = WRAP_MESSAGES[Math.floor(Math.random() * WRAP_MESSAGES.length)];
  return { state, success: true, summary, message: wrapMsg };
}

function getDailies(state) {
  const scenes = state.todayScenes;
  if (scenes.length === 0) return "📽️ No scenes shot today yet. Time for Action!";

  const totalMin = scenes.reduce((sum, s) => sum + s.durationMin, 0);
  const genreCounts = {};
  scenes.forEach(s => {
    const genre = GENRES.find(g => g.id === s.genre);
    const name = genre ? genre.icon + " " + genre.name : s.genre;
    genreCounts[name] = (genreCounts[name] || 0) + 1;
  });

  let report = "📽️ TODAY'S DAILIES\n";
  report += "━━━━━━━━━━━━━━━━━━━\n";
  report += "Scenes: " + scenes.length + " | Time: " + Math.round(totalMin) + " min\n\n";

  scenes.forEach((s, i) => {
    const genre = GENRES.find(g => g.id === s.genre);
    report += (i + 1) + ". " + (genre ? genre.icon : "🎬") + " " + s.title;
    report += " (" + s.durationMin + "min, Take " + s.take + ")\n";
  });

  report += "\nBy Genre:\n";
  Object.entries(genreCounts).forEach(([name, count]) => {
    report += "  " + name + ": " + count + " scene(s)\n";
  });

  return report;
}

function getActiveSceneDuration(state, now) {
  if (!state.activeScene) return 0;
  const start = new Date(state.activeScene.startedAt).getTime();
  const end = (now || new Date()).getTime();
  return Math.max(0, Math.round((end - start) / 60000 * 10) / 10);
}

function getCareerStats(state) {
  return {
    totalScenes: state.totalScenes,
    totalMinutes: Math.round(state.totalMinutes),
    totalHours: Math.round(state.totalMinutes / 60 * 10) / 10,
    totalTakes: state.totalTakes,
    avgTakesPerScene: state.totalScenes > 0 ? Math.round(state.totalTakes / state.totalScenes * 10) / 10 : 0,
    productions: state.productions.length,
    streak: state.streak,
    bestStreak: state.bestStreak,
    daysWorked: state.history.length,
  };
}

function getDirectorRank(totalScenes) {
  if (totalScenes >= 500) return { rank: "Legendary Director", icon: "👑" };
  if (totalScenes >= 200) return { rank: "Executive Producer", icon: "🌟" };
  if (totalScenes >= 100) return { rank: "Senior Director", icon: "🎬" };
  if (totalScenes >= 50) return { rank: "Director", icon: "🎥" };
  if (totalScenes >= 20) return { rank: "Assistant Director", icon: "📋" };
  if (totalScenes >= 5) return { rank: "Camera Operator", icon: "📷" };
  return { rank: "Intern", icon: "🎓" };
}

function getRandomQuote(seed) {
  const idx = typeof seed === 'number' ? Math.abs(seed) % DIRECTOR_QUOTES.length : Math.floor(Math.random() * DIRECTOR_QUOTES.length);
  return DIRECTOR_QUOTES[idx];
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GENRES, DIRECTOR_QUOTES, WRAP_MESSAGES,
    createDefaultState, createProduction, startScene, cutScene, retakeScene,
    wrapDay, getDailies, getActiveSceneDuration, getCareerStats,
    getDirectorRank, getRandomQuote,
  };
}
