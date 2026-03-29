/**
 * CivicSky 5-Day Forecast
 * Renders the forecast bar with weather icons per day.
 */

(function (exports) {
  'use strict';

  function renderForecast(container, forecastData) {
    container.innerHTML = '';

    forecastData.forEach(day => {
      const emoji = exports.intensityToEmoji
        ? exports.intensityToEmoji(day.intensity)
        : '\u2601\uFE0F';

      const el = document.createElement('div');
      el.className = 'forecast-day';

      let tooltipHtml = `<strong>${day.date}</strong><br>Intensity: ${day.intensity}/100`;
      if (day.newPolicies && day.newPolicies.length > 0) {
        tooltipHtml += '<br><br>New policies:';
        day.newPolicies.forEach(p => {
          tooltipHtml += `<br>&bull; ${escapeHtml(p.title)}`;
        });
      } else {
        tooltipHtml += '<br>No new policies this day';
      }

      el.innerHTML = `
        <span class="day-name">${day.dayName}</span>
        <span class="weather-icon">${emoji}</span>
        <span class="day-count">${day.nearbyCount} active</span>
        <div class="day-tooltip">${tooltipHtml}</div>
      `;

      el.style.position = 'relative';
      container.appendChild(el);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  exports.renderForecast = renderForecast;

})(typeof window !== 'undefined' ? window : module.exports);
