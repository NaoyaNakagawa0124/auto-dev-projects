// BlindBite - Core engine
// The anti-DoorDash: one mystery pick, no reviews, no photos

const CUISINES = [
  { id: "italian", name: "Italian", icon: "🍝", vibe: "Cozy and classic" },
  { id: "japanese", name: "Japanese", icon: "🍣", vibe: "Precise and artful" },
  { id: "mexican", name: "Mexican", icon: "🌮", vibe: "Bold and vibrant" },
  { id: "thai", name: "Thai", icon: "🍜", vibe: "Sweet, sour, spicy" },
  { id: "indian", name: "Indian", icon: "🍛", vibe: "Rich and aromatic" },
  { id: "chinese", name: "Chinese", icon: "🥡", vibe: "Wok-fired perfection" },
  { id: "french", name: "French", icon: "🥐", vibe: "Elegant simplicity" },
  { id: "korean", name: "Korean", icon: "🍱", vibe: "Fermented and fiery" },
  { id: "american", name: "American", icon: "🍔", vibe: "Hearty and familiar" },
  { id: "mediterranean", name: "Mediterranean", icon: "🫒", vibe: "Sun-kissed flavors" },
  { id: "vietnamese", name: "Vietnamese", icon: "🍲", vibe: "Fresh and fragrant" },
  { id: "ethiopian", name: "Ethiopian", icon: "🫓", vibe: "Communal and soulful" },
];

const RESTAURANT_NAMES = {
  italian: ["Bella Luna", "Trattoria Verde", "La Piazza", "Nonna's Kitchen", "Olive & Vine"],
  japanese: ["Sakura House", "Zen Ramen", "Koi Garden", "Haru Sushi", "Matcha Corner"],
  mexican: ["Casa del Sol", "El Jardín", "Cantina Luna", "Taco Fuego", "Salsa Verde"],
  thai: ["Golden Lotus", "Bangkok Street", "Pad & Pour", "Basil Garden", "Siam Kitchen"],
  indian: ["Spice Route", "Tandoor House", "Masala Junction", "Chai & Naan", "Saffron Plate"],
  chinese: ["Dragon Pearl", "Wok & Roll", "Jade Garden", "Golden Phoenix", "Lucky Dumpling"],
  french: ["Le Petit Bistro", "Café Lumière", "Boulangerie Belle", "Chez Marie", "La Fourchette"],
  korean: ["Seoul Kitchen", "Kimchi House", "BBQ Garden", "Bap & Bowl", "Gangnam Grill"],
  american: ["The Local Diner", "Main Street Grill", "Liberty Kitchen", "Blue Plate", "Corner Café"],
  mediterranean: ["Olive Branch", "Aegean Table", "Fig & Feta", "Levant Kitchen", "Mezze House"],
  vietnamese: ["Pho Corner", "Saigon Street", "Banh Mi Bar", "Lotus Kitchen", "Little Vietnam"],
  ethiopian: ["Addis Table", "Queen of Sheba", "Injera House", "Habesha Kitchen", "Abyssinia"],
};

const SUPPLY_CHAIN_FACTS = [
  { ingredient: "Tomatoes", fact: "The average tomato in a US restaurant travels 1,500 miles from farm to plate. Italy's San Marzano tomatoes travel 5,000+ miles.", origin: "California or Italy" },
  { ingredient: "Rice", fact: "90% of the world's rice is grown and consumed in Asia. A single grain takes 120 days to grow.", origin: "Thailand, Vietnam, or California" },
  { ingredient: "Coffee", fact: "Your espresso traveled through 4 countries before reaching your cup: grown in Ethiopia, processed in Colombia, roasted in Germany, brewed here.", origin: "Ethiopia, Colombia, or Brazil" },
  { ingredient: "Avocados", fact: "Mexico supplies 80% of US avocados. One avocado needs 60 gallons of water to grow.", origin: "Michoacán, Mexico" },
  { ingredient: "Olive Oil", fact: "70% of the world's olive oil comes from Spain, but only 4% of Americans know this.", origin: "Spain, Italy, or Greece" },
  { ingredient: "Chocolate", fact: "Cacao beans travel 6,000+ miles from West Africa. 70% of the world's cocoa comes from just 4 countries.", origin: "Côte d'Ivoire or Ghana" },
  { ingredient: "Shrimp", fact: "75% of shrimp consumed in the US is imported, mostly from Southeast Asia. Each pound has traveled 8,000+ miles.", origin: "Thailand, India, or Ecuador" },
  { ingredient: "Vanilla", fact: "Real vanilla is the second most expensive spice after saffron. 80% comes from Madagascar.", origin: "Madagascar" },
  { ingredient: "Soy Sauce", fact: "Traditional soy sauce takes 6-8 months to ferment. Japan produces over 1 billion liters annually.", origin: "Japan or China" },
  { ingredient: "Black Pepper", fact: "Called 'black gold' in medieval times. Vietnam now produces 35% of the world's supply.", origin: "Vietnam or India" },
  { ingredient: "Limes", fact: "Mexico produces 2.5 million tons of limes annually — more than any other country.", origin: "Mexico" },
  { ingredient: "Parmesan", fact: "Real Parmigiano-Reggiano must age 12+ months. Italian banks accept cheese wheels as loan collateral.", origin: "Emilia-Romagna, Italy" },
  { ingredient: "Saffron", fact: "The world's most expensive spice: $5,000/lb. Each flower produces only 3 tiny stigmas, hand-picked at dawn.", origin: "Iran (90% of global supply)" },
  { ingredient: "Salmon", fact: "Your salmon may have been caught in Alaska, frozen on the boat, shipped to China for processing, then shipped back to the US.", origin: "Alaska, Norway, or Chile" },
  { ingredient: "Cinnamon", fact: "True Ceylon cinnamon comes from Sri Lanka. Most 'cinnamon' in the US is actually cassia from China.", origin: "Sri Lanka or Indonesia" },
];

const FOOD_DELIVERY_DOMAINS = [
  "doordash.com", "ubereats.com", "grubhub.com", "postmates.com",
  "seamless.com", "caviar.com", "instacart.com",
  "yelp.com", "tripadvisor.com", "opentable.com",
];

const MYSTERY_MESSAGES = [
  "The universe has chosen for you.",
  "Trust your taste buds, not the algorithm.",
  "No stars. No reviews. Just vibes.",
  "Your next favorite meal awaits.",
  "Decision fatigue? Cured.",
  "86% of Gen Z have menu anxiety. Not you. Not today.",
  "The best meals are the ones you didn't plan.",
  "Close your eyes. Open your mouth. (At the restaurant.)",
];

function seededRandom(seed) {
  let s = Math.abs(seed) || 1;
  return function() {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s >>> 16) / 32767;
  };
}

function generatePick(preferences, seed) {
  const rng = seededRandom(seed || Date.now());

  // Filter cuisines by preferences
  let available = [...CUISINES];
  if (preferences && preferences.excludeCuisines && preferences.excludeCuisines.length > 0) {
    available = available.filter(c => !preferences.excludeCuisines.includes(c.id));
  }
  if (available.length === 0) available = [...CUISINES];

  // Pick cuisine
  const cuisine = available[Math.floor(rng() * available.length)];

  // Pick restaurant
  const names = RESTAURANT_NAMES[cuisine.id] || ["Mystery Spot"];
  const restaurant = names[Math.floor(rng() * names.length)];

  // Pick distance (0.3 - 5.0 miles)
  const distance = (0.3 + rng() * 4.7).toFixed(1);

  // Pick supply chain fact
  const fact = SUPPLY_CHAIN_FACTS[Math.floor(rng() * SUPPLY_CHAIN_FACTS.length)];

  // Pick mystery message
  const message = MYSTERY_MESSAGES[Math.floor(rng() * MYSTERY_MESSAGES.length)];

  return {
    restaurant,
    cuisine: cuisine.name,
    cuisineIcon: cuisine.icon,
    vibe: cuisine.vibe,
    distance: parseFloat(distance),
    supplyChainFact: fact,
    mysteryMessage: message,
  };
}

function createDefaultPreferences() {
  return {
    excludeCuisines: [],
    maxDistance: 5.0,
    adventureLevel: "medium", // low, medium, high
    picksToday: 0,
    totalPicks: 0,
    totalTrusted: 0, // times they went with the pick
    streak: 0,
    bestStreak: 0,
    history: [],
  };
}

function recordPick(prefs, pick, trusted) {
  prefs.picksToday++;
  prefs.totalPicks++;
  if (trusted) {
    prefs.totalTrusted++;
    prefs.streak++;
    if (prefs.streak > prefs.bestStreak) prefs.bestStreak = prefs.streak;
  } else {
    prefs.streak = 0;
  }
  prefs.history.push({
    restaurant: pick.restaurant,
    cuisine: pick.cuisine,
    trusted,
    date: new Date().toISOString().split('T')[0],
  });
  if (prefs.history.length > 50) prefs.history = prefs.history.slice(-50);
  return prefs;
}

function getTrustScore(prefs) {
  if (prefs.totalPicks === 0) return 0;
  return Math.round(prefs.totalTrusted / prefs.totalPicks * 100);
}

function getTrustLevel(score) {
  if (score >= 80) return { level: "Blind Faith", icon: "🙈", badge: "You eat with your eyes closed" };
  if (score >= 60) return { level: "Adventurer", icon: "🧭", badge: "You trust the universe (mostly)" };
  if (score >= 40) return { level: "Curious", icon: "🤔", badge: "One foot in, one foot out" };
  if (score >= 20) return { level: "Skeptic", icon: "🧐", badge: "You still read Yelp reviews" };
  return { level: "Control Freak", icon: "📋", badge: "You brought a spreadsheet to dinner" };
}

function isFoodDeliverySite(hostname) {
  return FOOD_DELIVERY_DOMAINS.some(d => hostname.includes(d));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CUISINES, RESTAURANT_NAMES, SUPPLY_CHAIN_FACTS, FOOD_DELIVERY_DOMAINS, MYSTERY_MESSAGES,
    seededRandom, generatePick, createDefaultPreferences, recordPick,
    getTrustScore, getTrustLevel, isFoodDeliverySite,
  };
}
