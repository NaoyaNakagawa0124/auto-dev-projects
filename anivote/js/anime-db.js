/**
 * AniVote — Sample anime database for quick-add suggestions.
 */
(function (exports) {
  'use strict';

  const GENRES = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mecha', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Thriller'];

  const SAMPLE_ANIME = [
    { title: 'Attack on Titan', episodes: 87, genre: 'Action', emoji: '\u2694\uFE0F' },
    { title: 'Demon Slayer', episodes: 44, genre: 'Action', emoji: '\uD83D\uDD25' },
    { title: 'Spy x Family', episodes: 37, genre: 'Comedy', emoji: '\uD83D\uDD75\uFE0F' },
    { title: 'Jujutsu Kaisen', episodes: 47, genre: 'Action', emoji: '\uD83D\uDC7E' },
    { title: 'My Hero Academia', episodes: 138, genre: 'Action', emoji: '\uD83E\uDDB8' },
    { title: 'One Punch Man', episodes: 24, genre: 'Comedy', emoji: '\uD83E\uDD1C' },
    { title: 'Mob Psycho 100', episodes: 37, genre: 'Action', emoji: '\uD83E\uDDE0' },
    { title: 'Chainsaw Man', episodes: 12, genre: 'Action', emoji: '\uD83E\uDE93' },
    { title: 'Bocchi the Rock!', episodes: 12, genre: 'Comedy', emoji: '\uD83C\uDFB8' },
    { title: 'Frieren', episodes: 28, genre: 'Fantasy', emoji: '\uD83E\uDDD9' },
    { title: 'Violet Evergarden', episodes: 13, genre: 'Drama', emoji: '\uD83D\uDC8C' },
    { title: 'Steins;Gate', episodes: 24, genre: 'Sci-Fi', emoji: '\u231A' },
    { title: 'Death Note', episodes: 37, genre: 'Thriller', emoji: '\uD83D\uDCD3' },
    { title: 'Fullmetal Alchemist: Brotherhood', episodes: 64, genre: 'Action', emoji: '\u2699\uFE0F' },
    { title: 'Cowboy Bebop', episodes: 26, genre: 'Sci-Fi', emoji: '\uD83D\uDE80' },
    { title: 'Neon Genesis Evangelion', episodes: 26, genre: 'Mecha', emoji: '\uD83E\uDD16' },
    { title: 'Your Lie in April', episodes: 22, genre: 'Romance', emoji: '\uD83C\uDFB9' },
    { title: 'Haikyuu!!', episodes: 85, genre: 'Sports', emoji: '\uD83C\uDFD0' },
    { title: 'Made in Abyss', episodes: 25, genre: 'Fantasy', emoji: '\uD83D\uDD73\uFE0F' },
    { title: 'Mushoku Tensei', episodes: 34, genre: 'Fantasy', emoji: '\uD83C\uDF0D' },
    { title: 'Vinland Saga', episodes: 48, genre: 'Action', emoji: '\u2693' },
    { title: 'March Comes in Like a Lion', episodes: 44, genre: 'Drama', emoji: '\u265F\uFE0F' },
    { title: 'Odd Taxi', episodes: 13, genre: 'Mystery', emoji: '\uD83D\uDE95' },
    { title: 'Ranking of Kings', episodes: 23, genre: 'Fantasy', emoji: '\uD83D\uDC51' },
    { title: 'Nichijou', episodes: 26, genre: 'Comedy', emoji: '\uD83C\uDF1F' },
    { title: 'Monster', episodes: 74, genre: 'Thriller', emoji: '\uD83D\uDC79' },
    { title: 'Ping Pong the Animation', episodes: 11, genre: 'Sports', emoji: '\uD83C\uDFD3' },
    { title: 'Psycho-Pass', episodes: 41, genre: 'Sci-Fi', emoji: '\uD83D\uDD2B' },
    { title: 'Erased', episodes: 12, genre: 'Mystery', emoji: '\u23F3' },
    { title: 'A Place Further Than the Universe', episodes: 13, genre: 'Drama', emoji: '\uD83C\uDFD4\uFE0F' },
  ];

  function getSuggestions(query) {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return SAMPLE_ANIME.filter(a => a.title.toLowerCase().includes(q)).slice(0, 5);
  }

  function getByTitle(title) {
    return SAMPLE_ANIME.find(a => a.title.toLowerCase() === title.toLowerCase()) || null;
  }

  function getRandomPicks(n) {
    const shuffled = [...SAMPLE_ANIME].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n || 3);
  }

  exports.GENRES = GENRES;
  exports.SAMPLE_ANIME = SAMPLE_ANIME;
  exports.getSuggestions = getSuggestions;
  exports.getByTitle = getByTitle;
  exports.getRandomPicks = getRandomPicks;

})(typeof window !== 'undefined' ? window : module.exports);
