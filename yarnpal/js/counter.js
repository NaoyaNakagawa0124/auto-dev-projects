/**
 * YarnPal — Row & Stitch Counter
 */
(function (exports) {
  'use strict';

  const STORAGE_KEY = 'yarnpal_counter';

  function createCounter() {
    return { rows: 0, stitches: 0, targetRows: 0, history: [] };
  }

  function incrementRows(counter) {
    counter.rows++;
    counter.history.push({ action: 'row+', value: counter.rows, time: Date.now() });
    return counter;
  }

  function decrementRows(counter) {
    if (counter.rows > 0) {
      counter.rows--;
      counter.history.push({ action: 'row-', value: counter.rows, time: Date.now() });
    }
    return counter;
  }

  function incrementStitches(counter) {
    counter.stitches++;
    counter.history.push({ action: 'stitch+', value: counter.stitches, time: Date.now() });
    return counter;
  }

  function decrementStitches(counter) {
    if (counter.stitches > 0) {
      counter.stitches--;
      counter.history.push({ action: 'stitch-', value: counter.stitches, time: Date.now() });
    }
    return counter;
  }

  function resetCounter(counter) {
    counter.rows = 0;
    counter.stitches = 0;
    counter.history = [];
    return counter;
  }

  function setTarget(counter, target) {
    counter.targetRows = Math.max(0, target);
    return counter;
  }

  function getProgress(counter) {
    if (counter.targetRows <= 0) return 0;
    return Math.min(100, Math.round((counter.rows / counter.targetRows) * 100));
  }

  function undoLast(counter) {
    if (counter.history.length === 0) return counter;
    const last = counter.history.pop();
    if (last.action === 'row+') counter.rows = Math.max(0, counter.rows - 1);
    else if (last.action === 'row-') counter.rows++;
    else if (last.action === 'stitch+') counter.stitches = Math.max(0, counter.stitches - 1);
    else if (last.action === 'stitch-') counter.stitches++;
    return counter;
  }

  function saveCounter(counter) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counter));
  }

  function loadCounter() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return data || createCounter();
    } catch { return createCounter(); }
  }

  exports.createCounter = createCounter;
  exports.incrementRows = incrementRows;
  exports.decrementRows = decrementRows;
  exports.incrementStitches = incrementStitches;
  exports.decrementStitches = decrementStitches;
  exports.resetCounter = resetCounter;
  exports.setTarget = setTarget;
  exports.getProgress = getProgress;
  exports.undoLast = undoLast;
  exports.saveCounter = saveCounter;
  exports.loadCounter = loadCounter;

})(typeof window !== 'undefined' ? window : module.exports);
