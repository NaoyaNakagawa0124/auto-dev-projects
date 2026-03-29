/**
 * MealRoll — Spin Logic
 * Handles the spin animation timing and state.
 */
(function (exports) {
  'use strict';

  const SPIN_DURATION = 2000;    /* ms */
  const SPIN_ROTATIONS = 4;     /* full rotations during spin */

  function createSpinState() {
    return {
      spinning: false,
      startTime: 0,
      currentAngle: 0,
      targetRecipe: null,
      onComplete: null
    };
  }

  function startSpin(state, recipe, onComplete) {
    state.spinning = true;
    state.startTime = Date.now();
    state.targetRecipe = recipe;
    state.onComplete = onComplete;
    return state;
  }

  function updateSpin(state) {
    if (!state.spinning) return state;

    const elapsed = Date.now() - state.startTime;
    const progress = Math.min(elapsed / SPIN_DURATION, 1);

    /* Ease out cubic */
    const eased = 1 - Math.pow(1 - progress, 3);
    state.currentAngle = eased * SPIN_ROTATIONS * 360;

    if (progress >= 1) {
      state.spinning = false;
      if (state.onComplete) {
        state.onComplete(state.targetRecipe);
      }
    }

    return state;
  }

  function isSpinning(state) {
    return state.spinning;
  }

  function getSpinProgress(state) {
    if (!state.spinning) return 1;
    return Math.min((Date.now() - state.startTime) / SPIN_DURATION, 1);
  }

  exports.SPIN_DURATION = SPIN_DURATION;
  exports.SPIN_ROTATIONS = SPIN_ROTATIONS;
  exports.createSpinState = createSpinState;
  exports.startSpin = startSpin;
  exports.updateSpin = updateSpin;
  exports.isSpinning = isSpinning;
  exports.getSpinProgress = getSpinProgress;

})(typeof window !== 'undefined' ? window : module.exports);
