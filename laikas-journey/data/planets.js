/**
 * Planet data with real astronomy facts and trivia questions.
 * Each planet has facts the player discovers and challenges to complete.
 */

const PLANETS = [
  {
    id: "mercury",
    name: "Mercury",
    emoji: "☿️",
    color: 0xb0b0b0,
    distance: 1,
    description: "The smallest planet and closest to the Sun. A scorched, cratered world.",
    facts: [
      "Mercury's surface temperature swings from -180°C at night to 430°C during the day.",
      "A day on Mercury (sunrise to sunrise) lasts 176 Earth days.",
      "Mercury has no atmosphere, so the sky is always black even during daytime.",
      "Despite being closest to the Sun, Mercury is NOT the hottest planet — Venus is.",
    ],
    challenges: [
      { q: "Mercury is the ___ planet from the Sun.", options: ["1st", "2nd", "3rd"], answer: 0 },
      { q: "Which planet is actually hotter than Mercury?", options: ["Mars", "Venus", "Jupiter"], answer: 1 },
      { q: "How long is a Mercury day in Earth days?", options: ["59", "176", "365"], answer: 1 },
    ],
  },
  {
    id: "venus",
    name: "Venus",
    emoji: "♀️",
    color: 0xffa500,
    distance: 2,
    description: "Earth's toxic twin. A hellish greenhouse world shrouded in acid clouds.",
    facts: [
      "Venus rotates backwards compared to most planets — the Sun rises in the west.",
      "Venus's surface pressure is 90 times Earth's — like being 900m underwater.",
      "Venus is the hottest planet at 465°C, hot enough to melt lead.",
      "A day on Venus (243 Earth days) is longer than its year (225 Earth days).",
    ],
    challenges: [
      { q: "Venus rotates in which direction?", options: ["Same as Earth", "Backwards", "It doesn't rotate"], answer: 1 },
      { q: "What is Venus's surface temperature?", options: ["200°C", "465°C", "100°C"], answer: 1 },
      { q: "Venus's atmosphere is mostly made of:", options: ["Nitrogen", "Carbon dioxide", "Oxygen"], answer: 1 },
    ],
  },
  {
    id: "earth",
    name: "Earth",
    emoji: "🌍",
    color: 0x4488ff,
    distance: 3,
    description: "Our home planet. The only known world with liquid water on its surface.",
    facts: [
      "Earth is the densest planet in the solar system at 5.51 g/cm³.",
      "Earth's magnetic field protects us from solar wind — without it, our atmosphere would be stripped away like Mars's.",
      "71% of Earth's surface is covered by water, but 97% of that is saltwater.",
      "Earth is the only planet not named after a Greek or Roman deity.",
    ],
    challenges: [
      { q: "What percentage of Earth's surface is water?", options: ["51%", "71%", "91%"], answer: 1 },
      { q: "Earth is the ___ densest planet.", options: ["Least", "Most", "3rd most"], answer: 1 },
      { q: "Earth's atmosphere is protected by its:", options: ["Ozone layer only", "Magnetic field", "Distance from Sun"], answer: 1 },
    ],
  },
  {
    id: "mars",
    name: "Mars",
    emoji: "♂️",
    color: 0xff4444,
    distance: 4,
    description: "The Red Planet. A dusty, cold desert with the tallest mountain in the solar system.",
    facts: [
      "Olympus Mons on Mars is 21.9 km tall — nearly 3x the height of Mt. Everest.",
      "Mars has seasons like Earth because its axis is tilted at a similar 25° angle.",
      "Mars's atmosphere is 96% carbon dioxide and only 0.13% oxygen.",
      "Dust storms on Mars can engulf the entire planet for months.",
    ],
    challenges: [
      { q: "What is the tallest mountain on Mars called?", options: ["Olympus Mons", "Elysium Mons", "Ascraeus Mons"], answer: 0 },
      { q: "Mars appears red because of:", options: ["Lava", "Iron oxide (rust)", "Copper deposits"], answer: 1 },
      { q: "How many moons does Mars have?", options: ["0", "1", "2"], answer: 2 },
    ],
  },
  {
    id: "jupiter",
    name: "Jupiter",
    emoji: "♃",
    color: 0xd4a574,
    distance: 5,
    description: "The king of planets. A gas giant with a storm bigger than Earth.",
    facts: [
      "Jupiter's Great Red Spot is a storm that has raged for at least 350 years.",
      "Jupiter has at least 95 known moons, including the four Galilean moons.",
      "Jupiter's magnetic field is 20,000 times stronger than Earth's.",
      "If Jupiter were 80x more massive, it would have become a star.",
    ],
    challenges: [
      { q: "Jupiter's Great Red Spot is a:", options: ["Volcano", "Storm", "Mountain"], answer: 1 },
      { q: "How many Galilean moons does Jupiter have?", options: ["2", "4", "8"], answer: 1 },
      { q: "Jupiter is mostly made of:", options: ["Rock", "Ice", "Hydrogen and helium"], answer: 2 },
    ],
  },
  {
    id: "saturn",
    name: "Saturn",
    emoji: "🪐",
    color: 0xffd700,
    distance: 6,
    description: "The ringed jewel. A gas giant with spectacular ice and rock rings.",
    facts: [
      "Saturn's rings are mostly made of ice chunks ranging from tiny grains to house-sized boulders.",
      "Saturn is so light it would float in water (density 0.687 g/cm³).",
      "Saturn's moon Titan has a thicker atmosphere than Earth and lakes of liquid methane.",
      "New simulations suggest Saturn's rings formed from a shattered moon called Chrysalis.",
    ],
    challenges: [
      { q: "Saturn's rings are mostly made of:", options: ["Rock", "Ice", "Gas"], answer: 1 },
      { q: "Which moon of Saturn has lakes of liquid methane?", options: ["Enceladus", "Titan", "Rhea"], answer: 1 },
      { q: "Saturn would ___ in water.", options: ["Float", "Sink", "Dissolve"], answer: 0 },
    ],
  },
  {
    id: "uranus",
    name: "Uranus",
    emoji: "⛢",
    color: 0x88ddff,
    distance: 7,
    description: "The ice giant that rolls on its side. A pale blue world of extreme cold.",
    facts: [
      "Uranus rotates on its side — its axis is tilted 98°, likely from an ancient collision.",
      "Uranus was the first planet discovered with a telescope, by William Herschel in 1781.",
      "Uranus has 13 known rings, discovered in 1977.",
      "Winds on Uranus can reach 900 km/h despite receiving very little solar energy.",
    ],
    challenges: [
      { q: "Uranus's axis is tilted at:", options: ["23°", "45°", "98°"], answer: 2 },
      { q: "Who discovered Uranus?", options: ["Galileo", "William Herschel", "Copernicus"], answer: 1 },
      { q: "Uranus is classified as a:", options: ["Gas giant", "Ice giant", "Rocky planet"], answer: 1 },
    ],
  },
  {
    id: "neptune",
    name: "Neptune",
    emoji: "🔵",
    color: 0x4444ff,
    distance: 8,
    description: "The windiest planet. A deep blue ice giant at the edge of the solar system.",
    facts: [
      "Neptune has the fastest winds in the solar system, reaching 2,100 km/h.",
      "Neptune's moon Triton orbits backwards and is likely a captured Kuiper Belt object.",
      "Neptune was predicted mathematically before it was observed — found in 1846.",
      "It takes Neptune 165 Earth years to orbit the Sun once.",
    ],
    challenges: [
      { q: "Neptune has the solar system's fastest:", options: ["Rotation", "Winds", "Orbit"], answer: 1 },
      { q: "Neptune was discovered through:", options: ["Telescope survey", "Mathematical prediction", "Space probe"], answer: 1 },
      { q: "Neptune's orbit takes ___ Earth years.", options: ["84", "165", "248"], answer: 1 },
    ],
  },
];

module.exports = { PLANETS };
