const {
  WEATHER_STATES,
  intensityToState,
  intensityToLabel,
  intensityToEmoji,
  getTimeOfDay
} = require('../js/weather-engine.js');

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  FAIL: ${msg}`);
  }
}

console.log('Weather Engine Tests');
console.log('====================');

// intensityToState
console.log('\n--- intensityToState ---');
assert(intensityToState(0) === WEATHER_STATES.CLEAR, '0 -> clear');
assert(intensityToState(10) === WEATHER_STATES.CLEAR, '10 -> clear');
assert(intensityToState(20) === WEATHER_STATES.CLEAR, '20 -> clear');
assert(intensityToState(21) === WEATHER_STATES.PARTLY_CLOUDY, '21 -> partly_cloudy');
assert(intensityToState(40) === WEATHER_STATES.PARTLY_CLOUDY, '40 -> partly_cloudy');
assert(intensityToState(41) === WEATHER_STATES.CLOUDY, '41 -> cloudy');
assert(intensityToState(60) === WEATHER_STATES.CLOUDY, '60 -> cloudy');
assert(intensityToState(61) === WEATHER_STATES.RAINY, '61 -> rainy');
assert(intensityToState(80) === WEATHER_STATES.RAINY, '80 -> rainy');
assert(intensityToState(81) === WEATHER_STATES.STORMY, '81 -> stormy');
assert(intensityToState(100) === WEATHER_STATES.STORMY, '100 -> stormy');

// intensityToLabel
console.log('\n--- intensityToLabel ---');
assert(intensityToLabel(0).includes('Clear'), '0 -> label contains Clear');
assert(intensityToLabel(50).includes('Overcast'), '50 -> label contains Overcast');
assert(intensityToLabel(90).includes('Stormy'), '90 -> label contains Stormy');

// intensityToEmoji
console.log('\n--- intensityToEmoji ---');
assert(typeof intensityToEmoji(0) === 'string', '0 -> returns string');
assert(typeof intensityToEmoji(50) === 'string', '50 -> returns string');
assert(typeof intensityToEmoji(100) === 'string', '100 -> returns string');
assert(intensityToEmoji(0) !== intensityToEmoji(100), 'different emojis for 0 vs 100');

// getTimeOfDay
console.log('\n--- getTimeOfDay ---');
const tod = getTimeOfDay();
assert(['dawn', 'day', 'dusk', 'night'].includes(tod), `getTimeOfDay returns valid value: ${tod}`);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
