/**
 * CivicSky Policy Cards
 * Renders policy information as scrollable cards.
 */

(function (exports) {
  'use strict';

  function createPolicyCard(policy) {
    const card = document.createElement('div');
    card.className = 'policy-card';
    card.dataset.category = policy.category;

    const severityClass = 'severity-' + policy.severity;
    const catClass = 'cat-' + policy.category;
    const categoryLabel = (exports.CATEGORY_LABELS || {})[policy.category] || policy.category;
    const categoryIcon = (exports.CATEGORY_ICONS || {})[policy.category] || '';

    const effDate = new Date(policy.effectiveDate).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });

    card.innerHTML = `
      <div class="${severityClass} severity-bar"></div>
      <div class="card-header">
        <span class="card-category ${catClass}">${categoryIcon} ${categoryLabel}</span>
        <span class="card-severity">${policy.severity}</span>
      </div>
      <div class="card-title">${escapeHtml(policy.title)}</div>
      <div class="card-summary">${escapeHtml(policy.summary)}</div>
      <div class="card-meta">
        <span>Effective: ${effDate}</span>
        <a class="card-link" href="${policy.source}" target="_blank" rel="noopener">Source &rarr;</a>
      </div>
    `;

    return card;
  }

  function renderCards(container, policies) {
    container.innerHTML = '';
    if (policies.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'text-align:center;opacity:0.6;font-size:15px;padding:40px;';
      empty.textContent = 'No policies match your filters. Try adjusting your state or categories.';
      container.appendChild(empty);
      return;
    }

    // Sort by severity score descending
    const sorted = [...policies].sort((a, b) => (b.severityScore || 0) - (a.severityScore || 0));
    sorted.forEach(p => {
      container.appendChild(createPolicyCard(p));
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  exports.createPolicyCard = createPolicyCard;
  exports.renderCards = renderCards;

})(typeof window !== 'undefined' ? window : module.exports);
