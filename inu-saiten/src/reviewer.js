import { applyBias, getDog, PHRASES } from "./characters.js";
import { makeRng, seedFromString } from "./rand.js";
import { scoreIngredients, starsToText } from "./scorer.js";

/**
 * Build a full review object from a list of detected entries, a dog id, and a
 * url (used as seed). Deterministic for (url, dog, entries) tuple.
 *
 * @returns { score, stars, dog, lines: string[], lovePicks, dangerPicks, mehPicks }
 */
export function buildReview({ entries, dogId, seedKey }) {
  const dog = getDog(dogId);
  const scored = scoreIngredients(entries);
  if (!scored) {
    return {
      score: null,
      stars: 0,
      dog,
      paragraph: "",
      lovePicks: [],
      dangerPicks: [],
      mehPicks: [],
      empty: true,
    };
  }
  const biased = applyBias(scored.score, dog);
  const stars = scored.stars; // stars based on raw score for stability
  const voice = PHRASES[dog.voice];
  const rng = makeRng(seedFromString(seedKey + "|" + dog.id));

  const love = entries.filter((e) => e.category === "love").sort((a, b) => b.score - a.score);
  const danger = entries.filter((e) => e.category === "danger");
  const meh = entries.filter((e) => e.category === "meh").sort((a, b) => b.score - a.score);

  // Opening sentence based on biased score
  let opener;
  if (biased >= 80) opener = rng.pick(voice.open_great);
  else if (biased >= 50) opener = rng.pick(voice.open_mid);
  else opener = rng.pick(voice.open_bad);

  const sentences = [opener];

  // Add love mention (max 1)
  if (love.length > 0) {
    const tpl = rng.pick(voice.love_brag);
    sentences.push(fill(tpl, love[0].name));
  }

  // Add danger mention (max 1)
  if (danger.length > 0) {
    const tpl = rng.pick(voice.danger);
    sentences.push(fill(tpl, danger[0].name));
  }

  // Add meh resignation (sometimes)
  if (meh.length >= 2 && love.length === 0) {
    const tpl = rng.pick(voice.meh_resign);
    sentences.push(fill(tpl, meh[0].name));
  }

  // Sign-off
  sentences.push(voice.sign);

  const paragraph = sentences.join(" ");

  return {
    score: biased,
    stars,
    starsText: starsToText(stars),
    dog,
    paragraph,
    lovePicks: love.slice(0, 4),
    dangerPicks: danger.slice(0, 4),
    mehPicks: meh.slice(0, 4),
    empty: false,
    counts: {
      love: love.length,
      meh: meh.length,
      danger: danger.length,
      total: entries.length,
    },
  };
}

function fill(tpl, name) {
  return tpl.replace("{name}", name);
}
