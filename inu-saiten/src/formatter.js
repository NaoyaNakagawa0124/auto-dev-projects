import { starsToText } from "./scorer.js";

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Build the overlay HTML as a string (DOM-free). Caller injects via innerHTML.
 *
 * @param {object} review — output of buildReview
 * @returns {string} HTML
 */
export function buildOverlayHtml(review) {
  if (!review || review.empty) return "";
  const { score, stars, starsText, dog, paragraph, lovePicks, dangerPicks, mehPicks } = review;

  const loveChips = lovePicks
    .map(
      (e) =>
        `<span class="inu-saiten-chip inu-saiten-chip--love">${escapeHtml(e.name)} <em>(${e.score})</em></span>`
    )
    .join("");
  const dangerChips = dangerPicks
    .map(
      (e) =>
        `<span class="inu-saiten-chip inu-saiten-chip--danger">${escapeHtml(e.name)}</span>`
    )
    .join("");
  const mehChips = mehPicks
    .map(
      (e) =>
        `<span class="inu-saiten-chip inu-saiten-chip--meh">${escapeHtml(e.name)} <em>(${e.score})</em></span>`
    )
    .join("");

  return `
<div class="inu-saiten-card" role="dialog" aria-label="犬 が 採点 した レシピ 評価">
  <div class="inu-saiten-card__head">
    <div class="inu-saiten-card__brand">
      <span class="inu-saiten-card__mark">🐕</span>
      <div>
        <div class="inu-saiten-card__title">あなた の 犬 の 評価</div>
        <div class="inu-saiten-card__sub">${escapeHtml(dog.name)} · ${escapeHtml(dog.breed)} · ${escapeHtml(dog.sign)}</div>
      </div>
    </div>
    <div class="inu-saiten-card__score">
      <div class="inu-saiten-card__stars" aria-label="${stars} 星">${starsText}</div>
      <div class="inu-saiten-card__points">${score} / 100</div>
    </div>
    <button class="inu-saiten-card__close" aria-label="閉じる" data-inu-close>×</button>
  </div>
  <div class="inu-saiten-card__body">
    <blockquote class="inu-saiten-card__quote">${escapeHtml(paragraph)}</blockquote>
    ${loveChips ? `<div class="inu-saiten-row"><span class="inu-saiten-row__label">🐕 命 を 賭ける</span><div class="inu-saiten-row__chips">${loveChips}</div></div>` : ""}
    ${dangerChips ? `<div class="inu-saiten-row"><span class="inu-saiten-row__label">⚠️ 部屋 の 隅 に 退避</span><div class="inu-saiten-row__chips">${dangerChips}</div></div>` : ""}
    ${mehChips ? `<div class="inu-saiten-row"><span class="inu-saiten-row__label">😴 正直 どう でも</span><div class="inu-saiten-row__chips">${mehChips}</div></div>` : ""}
    <div class="inu-saiten-card__foot">これ は コメディ 拡張 で あって、 飼育 助言 で は あり ません。</div>
  </div>
</div>`.trim();
}
