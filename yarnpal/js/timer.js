/**
 * YarnPal — Knitting Session Timer
 */
(function (exports) {
  'use strict';

  function createTimer() {
    return { running: false, startTime: 0, elapsed: 0, sessions: [] };
  }

  function startTimer(timer) {
    if (timer.running) return timer;
    timer.running = true;
    timer.startTime = Date.now();
    return timer;
  }

  function stopTimer(timer) {
    if (!timer.running) return timer;
    timer.running = false;
    const sessionTime = Date.now() - timer.startTime;
    timer.elapsed += sessionTime;
    timer.sessions.push({ duration: sessionTime, endedAt: new Date().toISOString() });
    return timer;
  }

  function resetTimer(timer) {
    return createTimer();
  }

  function getElapsed(timer) {
    let total = timer.elapsed;
    if (timer.running) {
      total += Date.now() - timer.startTime;
    }
    return total;
  }

  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}h ${String(minutes).padStart(2, '0')}m`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  function getTotalSessionTime(timer) {
    return timer.sessions.reduce((sum, s) => sum + s.duration, 0);
  }

  function getSessionCount(timer) {
    return timer.sessions.length;
  }

  exports.createTimer = createTimer;
  exports.startTimer = startTimer;
  exports.stopTimer = stopTimer;
  exports.resetTimer = resetTimer;
  exports.getElapsed = getElapsed;
  exports.formatTime = formatTime;
  exports.getTotalSessionTime = getTotalSessionTime;
  exports.getSessionCount = getSessionCount;

})(typeof window !== 'undefined' ? window : module.exports);
