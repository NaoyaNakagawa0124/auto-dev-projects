/**
 * Core game logic for Laika's Journey.
 */

const { PLANETS } = require("../data/planets");
const db = require("./database");

const XP_PER_CHALLENGE = 15;
const XP_PER_EXPLORE = 10;
const XP_PER_CARE = 5;
const HAPPINESS_DECAY = 5;
const ENERGY_COST_EXPLORE = 20;
const ENERGY_COST_CHALLENGE = 10;

function adoptDog(userId, guildId, dogName) {
  const existing = db.getPlayer(userId);
  if (existing) {
    return { success: false, reason: `You already have a space dog named **${existing.dog_name}**!` };
  }

  db.createPlayer(userId, guildId, dogName);
  return {
    success: true,
    dog: { name: dogName, emoji: "🐕" },
    message: `**${dogName}** has been adopted! 🐕🚀\nYour journey through the solar system begins at **${PLANETS[0].name}** ${PLANETS[0].emoji}`,
  };
}

function getDogStatus(userId) {
  const player = db.getPlayer(userId);
  if (!player) return null;

  const planet = PLANETS[Math.min(player.current_planet, PLANETS.length - 1)];
  const mood = player.happiness > 70 ? "Happy 😊" : player.happiness > 40 ? "Okay 😐" : "Sad 😢";
  const energyBar = "█".repeat(Math.floor(player.energy / 10)) + "░".repeat(10 - Math.floor(player.energy / 10));

  return {
    name: player.dog_name,
    emoji: player.dog_emoji,
    happiness: player.happiness,
    energy: player.energy,
    mood,
    energyBar,
    xp: player.xp,
    currentPlanet: planet,
    planetsExplored: player.planets_explored,
    challengesCorrect: player.challenges_correct,
    challengesTotal: player.challenges_total,
    rank: getRank(player.xp),
  };
}

function getRank(xp) {
  if (xp >= 200) return "🌟 Star Captain";
  if (xp >= 150) return "🚀 Voyager";
  if (xp >= 100) return "🛸 Explorer";
  if (xp >= 50) return "🐾 Space Pup";
  return "🌱 Recruit";
}

function explore(userId) {
  const player = db.getPlayer(userId);
  if (!player) return { success: false, reason: "You need to `/adopt` a space dog first!" };

  if (player.energy < ENERGY_COST_EXPLORE) {
    return { success: false, reason: `**${player.dog_name}** is too tired! Use \`/feed\` to restore energy.` };
  }

  const nextPlanetIdx = player.current_planet + 1;
  if (nextPlanetIdx >= PLANETS.length) {
    return { success: false, reason: "🎉 You've explored the entire solar system! You and your dog are true space masters!" };
  }

  const planet = PLANETS[nextPlanetIdx];
  const fact = planet.facts[Math.floor(Math.random() * planet.facts.length)];

  db.updatePlayer(userId, {
    current_planet: nextPlanetIdx,
    planets_explored: player.planets_explored + 1,
    energy: Math.max(0, player.energy - ENERGY_COST_EXPLORE),
    xp: player.xp + XP_PER_EXPLORE,
  });

  db.addDiscovery(userId, planet.id, fact);

  return {
    success: true,
    planet,
    fact,
    xpGained: XP_PER_EXPLORE,
    newXP: player.xp + XP_PER_EXPLORE,
  };
}

function getChallenge(userId) {
  const player = db.getPlayer(userId);
  if (!player) return { success: false, reason: "You need to `/adopt` a space dog first!" };

  if (player.energy < ENERGY_COST_CHALLENGE) {
    return { success: false, reason: `**${player.dog_name}** needs rest! Use \`/feed\` to restore energy.` };
  }

  const planet = PLANETS[Math.min(player.current_planet, PLANETS.length - 1)];
  const challenge = planet.challenges[Math.floor(Math.random() * planet.challenges.length)];

  return {
    success: true,
    planet,
    challenge,
  };
}

function answerChallenge(userId, planetId, questionText, selectedIndex) {
  const player = db.getPlayer(userId);
  if (!player) return { success: false, reason: "No player found." };

  const planet = PLANETS.find((p) => p.id === planetId);
  if (!planet) return { success: false, reason: "Planet not found." };

  const challenge = planet.challenges.find((c) => c.q === questionText);
  if (!challenge) return { success: false, reason: "Challenge not found." };

  const correct = selectedIndex === challenge.answer;
  const updates = {
    challenges_total: player.challenges_total + 1,
    energy: Math.max(0, player.energy - ENERGY_COST_CHALLENGE),
  };

  if (correct) {
    updates.challenges_correct = player.challenges_correct + 1;
    updates.xp = player.xp + XP_PER_CHALLENGE;

    const newFact = planet.facts[Math.floor(Math.random() * planet.facts.length)];
    db.addDiscovery(userId, planetId, newFact);
  }

  db.updatePlayer(userId, updates);

  return {
    success: true,
    correct,
    correctAnswer: challenge.options[challenge.answer],
    xpGained: correct ? XP_PER_CHALLENGE : 0,
    newXP: correct ? player.xp + XP_PER_CHALLENGE : player.xp,
    bonusFact: correct ? planet.facts[Math.floor(Math.random() * planet.facts.length)] : null,
  };
}

function feedDog(userId) {
  const player = db.getPlayer(userId);
  if (!player) return { success: false, reason: "You need to `/adopt` a space dog first!" };

  const energyGain = 30;
  const newEnergy = Math.min(100, player.energy + energyGain);

  db.updatePlayer(userId, {
    energy: newEnergy,
    xp: player.xp + XP_PER_CARE,
  });

  return {
    success: true,
    name: player.dog_name,
    newEnergy,
    xpGained: XP_PER_CARE,
  };
}

function playWithDog(userId) {
  const player = db.getPlayer(userId);
  if (!player) return { success: false, reason: "You need to `/adopt` a space dog first!" };

  const happinessGain = 20;
  const newHappiness = Math.min(100, player.happiness + happinessGain);

  db.updatePlayer(userId, {
    happiness: newHappiness,
    xp: player.xp + XP_PER_CARE,
  });

  return {
    success: true,
    name: player.dog_name,
    newHappiness,
    xpGained: XP_PER_CARE,
  };
}

function getJournal(userId) {
  const player = db.getPlayer(userId);
  if (!player) return null;

  const discoveries = db.getDiscoveries(userId);
  const grouped = {};

  for (const d of discoveries) {
    if (!grouped[d.planet_id]) grouped[d.planet_id] = [];
    grouped[d.planet_id].push(d.fact);
  }

  return {
    dogName: player.dog_name,
    totalFacts: discoveries.length,
    byPlanet: grouped,
  };
}

function getLeaderboard(guildId) {
  return db.getLeaderboard(guildId);
}

module.exports = {
  adoptDog,
  getDogStatus,
  getRank,
  explore,
  getChallenge,
  answerChallenge,
  feedDog,
  playWithDog,
  getJournal,
  getLeaderboard,
  XP_PER_CHALLENGE,
  XP_PER_EXPLORE,
  XP_PER_CARE,
  ENERGY_COST_EXPLORE,
  ENERGY_COST_CHALLENGE,
};
