// Story chapters and narrative content for RunwayRise

const CHAPTERS = [
  {
    id: 0,
    title: "The Intern",
    role: "Fashion Intern",
    xpRequired: 0,
    outfit: { top: "Plain White Tee", bottom: "Basic Jeans", shoes: "Old Sneakers", accessory: "Lanyard Badge" },
    outfitEmoji: "👕👖👟",
    color: "#9CA3AF", // gray
    narrative: [
      "Welcome to Maison Lumière, the most prestigious fashion house in Paris.",
      "You're the new intern — fresh off the bus, wearing yesterday's gym clothes.",
      "The creative director, Celeste Noir, barely glances at you.",
      "\"You smell like ambition and cheap laundry detergent,\" she says.",
      "\"If you want to survive here, you'll need more than talent. You need ENERGY.\"",
      "She hands you a stack of fabric swatches taller than your confidence.",
      "Your journey begins. Every workout fuels your rise."
    ],
    milestone: "Complete your first workout to prove you belong."
  },
  {
    id: 1,
    title: "The Assistant",
    role: "Design Assistant",
    xpRequired: 100,
    outfit: { top: "Fitted Black Blouse", bottom: "Tailored Trousers", shoes: "Chelsea Boots", accessory: "Measuring Tape Bracelet" },
    outfitEmoji: "👔👗👢",
    color: "#0047AB", // cobalt
    narrative: [
      "Celeste noticed you. Not because you're talented — because you showed up.",
      "\"Consistency is the rarest fabric in fashion,\" she tells you.",
      "You've been promoted to Design Assistant. The swatches are yours to sort.",
      "You're learning the language of color: cobalt blues that sing, reds that roar.",
      "The Spring 2026 collection is being planned. Everyone is stressed.",
      "But you? You're in the best shape of your life. It shows.",
      "\"You have energy the others don't,\" Celeste observes. \"Don't lose it.\""
    ],
    milestone: "Reach Level 5 to earn Celeste's trust."
  },
  {
    id: 2,
    title: "The Stylist",
    role: "Junior Stylist",
    xpRequired: 350,
    outfit: { top: "Cherry Red Blazer", bottom: "High-Waist Skirt", shoes: "Pointed Flats", accessory: "Silk Scarf" },
    outfitEmoji: "🧥👠🧣",
    color: "#DE3163", // cherry red
    narrative: [
      "Your first styling assignment: a photoshoot for Vogue Paris.",
      "The model is difficult. The photographer is worse. The deadline is yesterday.",
      "But you've been training — not just your eye, but your body and mind.",
      "You move through the chaos like a choreographed dance.",
      "Cherry red dominates the Spring 2026 mood boards. You make it YOUR signature.",
      "The photos come out stunning. Your name appears in the credits for the first time.",
      "Celeste sends you a single text: \"Not bad, rookie.\""
    ],
    milestone: "Style your first major photoshoot."
  },
  {
    id: 3,
    title: "The Designer",
    role: "Associate Designer",
    xpRequired: 750,
    outfit: { top: "Canary Yellow Statement Jacket", bottom: "Wide-Leg Palazzo Pants", shoes: "Platform Loafers", accessory: "Oversized Sunglasses" },
    outfitEmoji: "🎨👓✨",
    color: "#FFEF00", // canary yellow
    narrative: [
      "You've been given your own design brief. A capsule collection. Six pieces.",
      "The theme? \"Energy.\" How fitting.",
      "You sketch late into the night, fueled by the same discipline that gets you to the gym.",
      "Canary yellow becomes your breakthrough color — bold, unapologetic, alive.",
      "The other designers whisper. Some are jealous. Some are inspired.",
      "At the design review, Celeste stands, examines your sketches, and says nothing for 30 seconds.",
      "Then: \"This is the first interesting thing I've seen all season. Continue.\""
    ],
    milestone: "Present your first capsule collection."
  },
  {
    id: 4,
    title: "The Lead",
    role: "Lead Designer",
    xpRequired: 1500,
    outfit: { top: "Violet Draped Blouse", bottom: "Architectural Culottes", shoes: "Metallic Heeled Boots", accessory: "Statement Chain Necklace" },
    outfitEmoji: "💜👗💎",
    color: "#7F00FF", // violet
    narrative: [
      "Fashion Week is in three months. You're leading the team.",
      "Twelve designers look to you for direction. The pressure is immense.",
      "But pressure is just another rep. You've been training for this.",
      "Violet — the color of royalty, transformation, and ambition — defines the collection.",
      "Sleepless nights, impossible deadlines, fabric that won't drape right.",
      "You push through. Not because you're fearless, but because you're disciplined.",
      "The collection comes together like a symphony reaching its crescendo."
    ],
    milestone: "Lead a team through Fashion Week preparation."
  },
  {
    id: 5,
    title: "The Director",
    role: "Creative Director",
    xpRequired: 3000,
    outfit: { top: "Bespoke Cobalt Suit Jacket", bottom: "Matching Cigarette Pants", shoes: "Italian Leather Oxfords", accessory: "Vintage Brooch" },
    outfitEmoji: "👑🎭🌟",
    color: "#1E3A5F", // deep cobalt
    narrative: [
      "Celeste calls you to her office. The view of the Seine sparkles below.",
      "\"I'm retiring,\" she says. \"And I'm recommending you as my replacement.\"",
      "The board is skeptical. You're young. Unconventional. An outsider.",
      "But your track record speaks: five seasons, each one better than the last.",
      "Your secret? The same thing that got you through those first awkward workouts.",
      "Showing up. Every. Single. Day.",
      "The board votes unanimously. You are the new Creative Director of Maison Lumière."
    ],
    milestone: "Earn the title of Creative Director."
  },
  {
    id: 6,
    title: "The Legend",
    role: "Fashion Legend",
    xpRequired: 5000,
    outfit: { top: "Custom Couture Masterpiece", bottom: "Signature Collection Piece", shoes: "Hand-Crafted Originals", accessory: "The Lumière Pin" },
    outfitEmoji: "🏆💫🌈",
    color: "#FFD700", // gold
    narrative: [
      "Five years later. Your name is synonymous with transformation.",
      "Not just in fashion — in the way people think about themselves.",
      "Your autobiography, \"Runway Rise,\" outsells every fashion memoir in history.",
      "Chapter 1 begins: \"I was a fitness beginner who kept quitting everything.\"",
      "\"Until I realized that every great collection starts with a single stitch.\"",
      "\"Every great body starts with a single rep.\"",
      "\"And every great story starts with showing up.\""
    ],
    milestone: "Complete your legendary journey. You've become unstoppable."
  }
];

const ACHIEVEMENTS = [
  { id: "first_workout", name: "First Stitch", description: "Log your first workout", icon: "🧵", condition: (stats) => stats.totalWorkouts >= 1 },
  { id: "streak_3", name: "Three-Day Streak", description: "Work out 3 days in a row", icon: "🔥", condition: (stats) => stats.bestStreak >= 3 },
  { id: "streak_7", name: "Fashion Week Ready", description: "7-day workout streak", icon: "💪", condition: (stats) => stats.bestStreak >= 7 },
  { id: "streak_30", name: "Season Survivor", description: "30-day workout streak", icon: "👑", condition: (stats) => stats.bestStreak >= 30 },
  { id: "workouts_10", name: "Fabric Collector", description: "Complete 10 workouts", icon: "🧶", condition: (stats) => stats.totalWorkouts >= 10 },
  { id: "workouts_50", name: "Runway Regular", description: "Complete 50 workouts", icon: "🏃", condition: (stats) => stats.totalWorkouts >= 50 },
  { id: "workouts_100", name: "Iron Thread", description: "Complete 100 workouts", icon: "⚡", condition: (stats) => stats.totalWorkouts >= 100 },
  { id: "xp_1000", name: "Rising Star", description: "Earn 1,000 total XP", icon: "⭐", condition: (stats) => stats.totalXP >= 1000 },
  { id: "xp_5000", name: "Fashion Icon", description: "Earn 5,000 total XP", icon: "🌟", condition: (stats) => stats.totalXP >= 5000 },
  { id: "chapter_3", name: "Mid-Season Debut", description: "Reach Chapter 3", icon: "🎨", condition: (stats) => stats.chapter >= 3 },
  { id: "chapter_6", name: "Legend Status", description: "Reach the final chapter", icon: "🏆", condition: (stats) => stats.chapter >= 6 },
  { id: "variety_5", name: "Cross-Trainer", description: "Try 5 different workout types", icon: "🎯", condition: (stats) => stats.uniqueTypes >= 5 },
  { id: "long_workout", name: "Marathon Session", description: "Log a 60+ minute workout", icon: "⏱️", condition: (stats) => stats.longestWorkout >= 60 },
  { id: "early_bird", name: "Dawn Couture", description: "Log a workout before 7am", icon: "🌅", condition: (stats) => stats.earlyWorkouts >= 1 },
  { id: "night_owl", name: "Midnight Atelier", description: "Log a workout after 10pm", icon: "🌙", condition: (stats) => stats.lateWorkouts >= 1 },
];

const WORKOUT_TYPES = [
  { id: "run", name: "Running", icon: "🏃", xpPerMin: 2.0, flavor: "Sprinting through the fashion district" },
  { id: "walk", name: "Walking", icon: "🚶", xpPerMin: 1.0, flavor: "A casual stroll past the ateliers" },
  { id: "strength", name: "Strength Training", icon: "💪", xpPerMin: 2.5, flavor: "Building the strength to carry fabric bolts" },
  { id: "yoga", name: "Yoga", icon: "🧘", xpPerMin: 1.5, flavor: "Finding your inner balance, like a perfect hemline" },
  { id: "cycling", name: "Cycling", icon: "🚴", xpPerMin: 2.0, flavor: "Racing to the studio on two wheels" },
  { id: "swim", name: "Swimming", icon: "🏊", xpPerMin: 2.5, flavor: "Gliding through water like silk" },
  { id: "dance", name: "Dance", icon: "💃", xpPerMin: 2.0, flavor: "Moving like you're on the runway" },
  { id: "hiit", name: "HIIT", icon: "⚡", xpPerMin: 3.0, flavor: "High intensity, just like Fashion Week" },
  { id: "stretch", name: "Stretching", icon: "🤸", xpPerMin: 1.0, flavor: "Limbering up for another creative day" },
  { id: "sports", name: "Sports", icon: "⚽", xpPerMin: 2.0, flavor: "Team spirit, like a design crew" },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CHAPTERS, ACHIEVEMENTS, WORKOUT_TYPES };
}
