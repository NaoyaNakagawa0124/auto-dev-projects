/**
 * CivicSky Scoring Engine
 * Calculates regulatory intensity (0-100) from a set of policies.
 */

(function (exports) {
  'use strict';

  const SEVERITY_WEIGHTS = {
    mild: 1,
    moderate: 2,
    significant: 3,
    severe: 4
  };

  /**
   * Calculate overall regulatory intensity from a list of policies.
   * Factors: count, severity mix, recency of effective dates.
   * Returns a value 0-100.
   */
  function calculateIntensity(policies, referenceDate) {
    if (!policies || policies.length === 0) return 0;

    const ref = new Date(referenceDate || Date.now());
    let totalWeight = 0;
    let recencyBonus = 0;

    policies.forEach(p => {
      const weight = SEVERITY_WEIGHTS[p.severity] || 1;
      totalWeight += weight;

      // Policies effective within 30 days get a recency boost
      const effDate = new Date(p.effectiveDate);
      const daysDiff = Math.abs((ref - effDate) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 30) {
        recencyBonus += weight * (1 - daysDiff / 30);
      }
    });

    // Base score: weighted count normalized to 0-70 range
    // 20 policies at max severity (80 weight) → 70
    const baseScore = Math.min(70, (totalWeight / 80) * 70);

    // Recency bonus adds up to 30 more points
    const recencyScore = Math.min(30, (recencyBonus / 12) * 30);

    return Math.round(Math.min(100, baseScore + recencyScore));
  }

  /**
   * Calculate per-day intensity for a 5-day forecast.
   * Groups policies by their effective dates and scores each day.
   */
  function calculateForecast(policies, startDate, days) {
    days = days || 5;
    const start = new Date(startDate || Date.now());
    const forecast = [];

    for (let i = 0; i < days; i++) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      const dayStr = day.toISOString().split('T')[0];

      // Policies effective on this exact day
      const dayPolicies = policies.filter(p => p.effectiveDate === dayStr);

      // Policies effective within 7 days of this day
      const nearbyPolicies = policies.filter(p => {
        const diff = Math.abs((new Date(p.effectiveDate) - day) / (1000 * 60 * 60 * 24));
        return diff <= 7;
      });

      const intensity = calculateIntensity(nearbyPolicies, day);

      forecast.push({
        date: dayStr,
        dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
        intensity: intensity,
        newPolicies: dayPolicies,
        nearbyCount: nearbyPolicies.length
      });
    }

    return forecast;
  }

  /**
   * Get severity label from a numeric score.
   */
  function severityFromScore(score) {
    if (score <= 25) return 'mild';
    if (score <= 50) return 'moderate';
    if (score <= 75) return 'significant';
    return 'severe';
  }

  exports.SEVERITY_WEIGHTS = SEVERITY_WEIGHTS;
  exports.calculateIntensity = calculateIntensity;
  exports.calculateForecast = calculateForecast;
  exports.severityFromScore = severityFromScore;

})(typeof window !== 'undefined' ? window : module.exports);
