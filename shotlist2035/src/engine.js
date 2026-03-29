// ShotList2035 — AI Director of Photography Engine

const VISUAL_STYLES = [
  { id: "cinematic", name: "Cinematic", icon: "🎬", trend: 95, description: "Movie-grade framing, filmic lighting, letterbox crops, rich color grading" },
  { id: "neon", name: "Neon Portrait", icon: "💜", trend: 88, description: "RGB lights, gels, reflections, futuristic neon glow on faces" },
  { id: "boldcolor", name: "Bold & Vivid", icon: "🎨", trend: 85, description: "Striking colors — neon reds, deep purples, electric blues" },
  { id: "candid", name: "Candid Authentic", icon: "📸", trend: 82, description: "Raw, spontaneous, grain, blur, unposed, documentary-feel" },
  { id: "retro", name: "Retro Film", icon: "📷", trend: 80, description: "35mm grain, muted tones, warm light leaks, nostalgic feel" },
  { id: "screenshot", name: "Screenshot Aesthetic", icon: "📱", trend: 78, description: "TikTok UI overlays, chat bubbles, timestamps, layered grabs" },
  { id: "minimal", name: "Minimal Clean", icon: "🤍", trend: 70, description: "Negative space, muted palette, geometric composition" },
  { id: "golden", name: "Golden Hour", icon: "🌅", trend: 75, description: "Warm backlit portraits, sun flares, long shadows" },
  { id: "moody", name: "Moody Dark", icon: "🌑", trend: 72, description: "Low-key lighting, deep shadows, desaturated tones" },
  { id: "aerial", name: "Aerial/Drone", icon: "🚁", trend: 68, description: "Bird's-eye patterns, scale contrast, geometric landscapes" },
];

const SHOT_TEMPLATES = [
  // Cinematic
  { style: "cinematic", title: "The Long Take", description: "One continuous composition showing depth — foreground, mid, background all in focus", difficulty: 3, gear: "Tripod, wide lens (24mm)" },
  { style: "cinematic", title: "Anamorphic Flare", description: "Shoot into a light source with lens flare stretching horizontally across the frame", difficulty: 4, gear: "Anamorphic lens or streak filter" },
  { style: "cinematic", title: "Dutch Angle Portrait", description: "Tilted frame 15-30°, subject off-center, dramatic lighting from one side", difficulty: 2, gear: "Any camera, one key light" },
  { style: "cinematic", title: "Silhouette Against Window", description: "Subject backlit by large window, expose for highlights only", difficulty: 1, gear: "Any camera" },
  // Neon
  { style: "neon", title: "RGB Split Light", description: "Two colored gels (red left, blue right) illuminating the subject's face", difficulty: 3, gear: "2 RGB lights or gelled flashes" },
  { style: "neon", title: "Neon Sign Reflection", description: "Find a neon sign, position subject so neon reflects in their eyes/glasses", difficulty: 2, gear: "Any camera, neon location" },
  { style: "neon", title: "Cyberpunk Alley", description: "Rain-wet street reflecting neon signage, subject silhouetted or partially lit", difficulty: 3, gear: "Any camera, rainy night, city" },
  // Bold Color
  { style: "boldcolor", title: "Color Block Portrait", description: "Solid color background matching subject's outfit — monochromatic impact", difficulty: 2, gear: "Colored backdrop or wall" },
  { style: "boldcolor", title: "Complementary Clash", description: "Orange subject against blue background (or red vs green)", difficulty: 2, gear: "Colored props/backgrounds" },
  { style: "boldcolor", title: "Paint Splash", description: "Subject interacting with thrown colored powder or paint", difficulty: 4, gear: "Holi powder, fast shutter, outdoor" },
  // Candid
  { style: "candid", title: "Through the Window", description: "Shoot through a dirty or rain-speckled window at your subject", difficulty: 1, gear: "Any camera, a window" },
  { style: "candid", title: "Mid-Laugh Capture", description: "Tell a joke, capture the genuine laugh reaction at peak expression", difficulty: 2, gear: "Fast autofocus camera" },
  { style: "candid", title: "Walking Away Shot", description: "Subject walking away from camera on an empty street, shot from behind", difficulty: 1, gear: "Any camera" },
  // Retro
  { style: "retro", title: "Film Grain Overlay", description: "Shoot digital, add convincing 35mm grain and slight color shift in post", difficulty: 2, gear: "Digital camera, editing software" },
  { style: "retro", title: "Light Leak Portrait", description: "Use a prism or crystal near the lens to create organic light leaks", difficulty: 2, gear: "Crystal prism, any camera" },
  { style: "retro", title: "Disposable Camera Look", description: "Flash-on, slight vignette, washed-out greens, party setting", difficulty: 1, gear: "On-camera flash, any lens" },
  // Screenshot
  { style: "screenshot", title: "Fake Notification", description: "Photo with overlaid text/notification UI elements as part of the composition", difficulty: 1, gear: "Phone + editing app" },
  { style: "screenshot", title: "Screen-in-Screen", description: "Photograph a phone screen displaying a photo, creating recursive frame", difficulty: 1, gear: "Two phones or phone + camera" },
  // Minimal
  { style: "minimal", title: "One Object, Infinite Space", description: "Single small object centered in vast negative space", difficulty: 2, gear: "Clean background, macro optional" },
  { style: "minimal", title: "Shadow Lines", description: "Hard shadows from blinds or architecture creating geometric patterns", difficulty: 2, gear: "Strong directional sunlight" },
  // Golden Hour
  { style: "golden", title: "Sun Behind Hair", description: "Subject facing away from low sun, hair glowing with backlight rim", difficulty: 2, gear: "Any camera, golden hour timing" },
  { style: "golden", title: "Long Shadow Self-Portrait", description: "Your elongated shadow stretching across a surface at sunset", difficulty: 1, gear: "Any camera, low sun" },
  // Moody
  { style: "moody", title: "One Light Source", description: "Single practical light (lamp, candle, phone screen) illuminating face in darkness", difficulty: 2, gear: "One light source, dark room" },
  { style: "moody", title: "Fog Machine Portrait", description: "Subject emerging from haze/fog with backlight creating volume", difficulty: 3, gear: "Fog machine or incense, backlight" },
  // Aerial
  { style: "aerial", title: "Flat Lay from Above", description: "Objects arranged flat, shot directly from above for pattern/symmetry", difficulty: 1, gear: "Stepladder or drone" },
  { style: "aerial", title: "Tiny Human, Big Landscape", description: "Small figure in vast landscape showing scale", difficulty: 3, gear: "Drone or elevated vantage point" },
];

const SKILL_LEVELS = [
  { id: "beginner", name: "Beginner", maxDifficulty: 2 },
  { id: "intermediate", name: "Intermediate", maxDifficulty: 3 },
  { id: "advanced", name: "Advanced", maxDifficulty: 4 },
  { id: "pro", name: "Professional", maxDifficulty: 5 },
];

function seededRandom(seed) {
  let s = Math.abs(seed) || 1;
  return function() { s = (s * 1103515245 + 12345) & 0x7fffffff; return (s >>> 16) / 32767; };
}

function generateShotList(preferences, seed) {
  const rng = seededRandom(seed || Date.now());
  const { styles, skillLevel, count } = preferences || {};
  const numShots = Math.max(1, Math.min(20, count || 5));
  const skill = SKILL_LEVELS.find(s => s.id === skillLevel) || SKILL_LEVELS[1];

  // Filter templates by style preference and difficulty
  let available = [...SHOT_TEMPLATES];
  if (styles && styles.length > 0) {
    available = available.filter(t => styles.includes(t.style));
  }
  available = available.filter(t => t.difficulty <= skill.maxDifficulty);

  if (available.length === 0) available = [...SHOT_TEMPLATES];

  // Shuffle and pick
  available.sort(() => rng() - 0.5);
  const selected = available.slice(0, numShots);

  // Score each shot
  return selected.map((shot, i) => {
    const style = VISUAL_STYLES.find(s => s.id === shot.style);
    const trendScore = style ? style.trend : 50;
    const viralPotential = Math.round(trendScore * (1 + (5 - shot.difficulty) * 0.1) * (0.8 + rng() * 0.4));

    return {
      rank: i + 1,
      ...shot,
      styleName: style ? style.name : shot.style,
      styleIcon: style ? style.icon : "📌",
      trendScore,
      viralPotential: Math.min(100, viralPotential),
      aiNote: generateAINote(shot, trendScore, rng),
    };
  });
}

function generateAINote(shot, trendScore, rng) {
  const notes = [
    `Trending ${trendScore}% — high social media engagement predicted.`,
    `This style is gaining momentum on TikTok photo trends.`,
    `Strong portfolio piece. Pair with ${shot.style === 'cinematic' ? 'moody' : 'golden hour'} for variety.`,
    `Practice this 3x before sharing. The best version is never the first.`,
    `Post at golden hour for maximum engagement (6-8pm local).`,
    `Consider a 3-photo series with this style for storytelling impact.`,
  ];
  return notes[Math.floor(rng() * notes.length)];
}

function getStyleStats(shots) {
  const counts = {};
  shots.forEach(s => { counts[s.style] = (counts[s.style] || 0) + 1; });
  return Object.entries(counts).map(([style, count]) => {
    const vs = VISUAL_STYLES.find(v => v.id === style);
    return { style, name: vs ? vs.name : style, icon: vs ? vs.icon : "📌", count };
  }).sort((a, b) => b.count - a.count);
}

function getDifficultyBreakdown(shots) {
  const counts = [0, 0, 0, 0, 0]; // difficulty 1-5
  shots.forEach(s => { if (s.difficulty >= 1 && s.difficulty <= 5) counts[s.difficulty - 1]++; });
  return counts;
}

function getAverageViralPotential(shots) {
  if (shots.length === 0) return 0;
  return Math.round(shots.reduce((sum, s) => sum + s.viralPotential, 0) / shots.length);
}

function getShotListSummary(shots) {
  const avgViral = getAverageViralPotential(shots);
  const styleStats = getStyleStats(shots);
  const diffBreak = getDifficultyBreakdown(shots);

  let summary = "🤖 AI DIRECTOR v12.0 — SHOT LIST ANALYSIS\n";
  summary += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
  summary += `Shots: ${shots.length} | Avg Viral Potential: ${avgViral}%\n\n`;

  summary += "Style Mix:\n";
  styleStats.forEach(s => { summary += `  ${s.icon} ${s.name}: ${s.count} shot(s)\n`; });

  summary += "\nDifficulty Spread:\n";
  const labels = ["Easy", "Medium", "Hard", "Expert", "Master"];
  diffBreak.forEach((count, i) => {
    if (count > 0) summary += `  ${labels[i]}: ${"█".repeat(count)} (${count})\n`;
  });

  summary += `\nGear needed: ${[...new Set(shots.map(s => s.gear))].join(" | ")}\n`;

  if (avgViral >= 80) summary += "\n🔥 This is a high-impact list. Execute with confidence.";
  else if (avgViral >= 60) summary += "\n✨ Solid creative direction. Focus on your top 3.";
  else summary += "\n🌱 Good practice material. Skill-building focus.";

  return summary;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    VISUAL_STYLES, SHOT_TEMPLATES, SKILL_LEVELS,
    seededRandom, generateShotList, generateAINote,
    getStyleStats, getDifficultyBreakdown, getAverageViralPotential, getShotListSummary,
  };
}
