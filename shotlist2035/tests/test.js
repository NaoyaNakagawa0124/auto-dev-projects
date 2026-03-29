// ShotList2035 Test Suite
const {
  VISUAL_STYLES, SHOT_TEMPLATES, SKILL_LEVELS,
  seededRandom, generateShotList, generateAINote,
  getStyleStats, getDifficultyBreakdown, getAverageViralPotential, getShotListSummary,
} = require('../src/engine.js');

let passed=0,failed=0; const failures=[];
function assert(c,n){if(c)passed++;else{failed++;failures.push(n);console.log('  FAIL: '+n);}}
function assertEqual(e,a,n){if(e===a)passed++;else{failed++;failures.push(`${n}(e=${e},g=${a})`);console.log(`  FAIL: ${n}(e=${e},g=${a})`);}}
function assertGt(a,b,n){assert(a>b,`${n}(${a}>${b})`);}
function assertBetween(v,lo,hi,n){assert(v>=lo&&v<=hi,`${n}(${lo}<=${v}<=${hi})`);}

console.log('=== ShotList2035 Test Suite ===\n');

// ---- Data ----
console.log('[Data Tests]');
assertEqual(10,VISUAL_STYLES.length,'10 visual styles');
assertGt(SHOT_TEMPLATES.length,20,'20+ shot templates');
assertEqual(4,SKILL_LEVELS.length,'4 skill levels');

VISUAL_STYLES.forEach(s=>{
  assert(s.id.length>0,`Style ${s.id} has id`);
  assert(s.name.length>0,`Style ${s.id} has name`);
  assert(s.icon.length>0,`Style ${s.id} has icon`);
  assertBetween(s.trend,0,100,`Style ${s.id} trend 0-100`);
  assert(s.description.length>0,`Style ${s.id} has desc`);
});
const sids=VISUAL_STYLES.map(s=>s.id);
assertEqual(sids.length,new Set(sids).size,'Style IDs unique');

SHOT_TEMPLATES.forEach((t,i)=>{
  assert(t.title.length>0,`Template ${i} has title`);
  assert(t.description.length>0,`Template ${i} has desc`);
  assert(sids.includes(t.style),`Template ${i} valid style`);
  assertBetween(t.difficulty,1,5,`Template ${i} diff 1-5`);
  assert(t.gear.length>0,`Template ${i} has gear`);
});

// All styles have at least 1 template
sids.forEach(sid=>{
  const count=SHOT_TEMPLATES.filter(t=>t.style===sid).length;
  assertGt(count,0,`Style ${sid} has templates`);
});

SKILL_LEVELS.forEach(s=>{
  assert(s.id.length>0,`Skill ${s.id} has id`);
  assertGt(s.maxDifficulty,0,`Skill ${s.id} has maxDiff`);
});
console.log('  Data tests complete.\n');

// ---- Shot Generation ----
console.log('[Shot Generation Tests]');

const shots1=generateShotList({count:5},42);
assertEqual(5,shots1.length,'5 shots generated');
shots1.forEach((s,i)=>{
  assertEqual(i+1,s.rank,`Shot ${i} rank`);
  assert(s.title.length>0,`Shot ${i} title`);
  assert(s.description.length>0,`Shot ${i} desc`);
  assert(s.styleName.length>0,`Shot ${i} style name`);
  assert(s.styleIcon.length>0,`Shot ${i} style icon`);
  assertBetween(s.difficulty,1,5,`Shot ${i} difficulty`);
  assertBetween(s.trendScore,0,100,`Shot ${i} trend`);
  assertBetween(s.viralPotential,0,100,`Shot ${i} viral`);
  assert(s.gear.length>0,`Shot ${i} gear`);
  assert(s.aiNote.length>0,`Shot ${i} AI note`);
});

// Style filter
const neonOnly=generateShotList({styles:['neon'],count:10},42);
neonOnly.forEach(s=>assertEqual('neon',s.style,`Neon filter: ${s.title} is neon`));

// Skill filter
const beginnerShots=generateShotList({skillLevel:'beginner',count:20},42);
beginnerShots.forEach(s=>assert(s.difficulty<=2,`Beginner diff <= 2: ${s.title}`));

const advancedShots=generateShotList({skillLevel:'advanced',count:20},42);
// Advanced allows up to 4
advancedShots.forEach(s=>assert(s.difficulty<=4,`Advanced diff <= 4: ${s.title}`));

// Count respects limits
assertEqual(1,generateShotList({count:1},42).length,'Min 1 shot');
assertEqual(20,generateShotList({count:20},42).length,'Max 20 shots');
assertEqual(5,generateShotList({count:0},42).length,'0 → default 5');
assertEqual(20,generateShotList({count:99},42).length,'99 → 20');

// Deterministic
const a=generateShotList({count:5},42);
const b=generateShotList({count:5},42);
for(let i=0;i<5;i++)assertEqual(a[i].title,b[i].title,`Same seed shot ${i}`);

// Different seed = different results
const c=generateShotList({count:5},99);
assert(a[0].title!==c[0].title||a[1].title!==c[1].title,'Diff seed = diff shots');

// Null/empty preferences
const nullShots=generateShotList(null,42);
assertGt(nullShots.length,0,'Null prefs works');
const emptyShots=generateShotList({},42);
assertGt(emptyShots.length,0,'Empty prefs works');

// Empty style filter falls back
const noStyle=generateShotList({styles:[],count:5},42);
assertEqual(5,noStyle.length,'Empty styles = all styles');

console.log('  Shot generation tests complete.\n');

// ---- Stats ----
console.log('[Stats Tests]');

const testShots=generateShotList({count:10},42);

const styleStats=getStyleStats(testShots);
assertGt(styleStats.length,0,'Has style stats');
styleStats.forEach(s=>{
  assert(s.style.length>0,`Stat style`);
  assert(s.name.length>0,`Stat name`);
  assertGt(s.count,0,`Stat count > 0`);
});
// Sorted by count descending
for(let i=1;i<styleStats.length;i++){
  assert(styleStats[i-1].count>=styleStats[i].count,`Stats sorted ${i}`);
}

const diffBreak=getDifficultyBreakdown(testShots);
assertEqual(5,diffBreak.length,'5 difficulty levels');
const totalDiff=diffBreak.reduce((a,b)=>a+b,0);
assertEqual(testShots.length,totalDiff,'Diff breakdown sums to total');

const avgViral=getAverageViralPotential(testShots);
assertBetween(avgViral,0,100,'Avg viral 0-100');
assertEqual(0,getAverageViralPotential([]),'Empty avg = 0');

const summary=getShotListSummary(testShots);
assert(summary.includes('AI DIRECTOR'),'Summary has header');
assert(summary.includes('Shots:'),'Summary has shot count');
assert(summary.includes('Viral'),'Summary has viral');
assert(summary.includes('Style Mix'),'Summary has style mix');
assert(summary.includes('Gear'),'Summary has gear');

console.log('  Stats tests complete.\n');

// ---- Random ----
console.log('[Random Tests]');
const r1=seededRandom(42);
const v1=[r1(),r1(),r1()];
const r2=seededRandom(42);
const v2=[r2(),r2(),r2()];
for(let i=0;i<3;i++)assertEqual(v1[i],v2[i],`Deterministic ${i}`);
for(let i=0;i<100;i++){assertBetween(seededRandom(i)(),0,1.1,`Random ${i} in range`);}
console.log('  Random tests complete.\n');

// ---- Integration ----
console.log('[Integration Tests]');

// Generate for each style individually
VISUAL_STYLES.forEach(vs=>{
  const shots=generateShotList({styles:[vs.id],count:5},42);
  assertGt(shots.length,0,`${vs.name}: has shots`);
  shots.forEach(s=>assertEqual(vs.id,s.style,`${vs.name}: correct style`));
});

// Generate for each skill level
SKILL_LEVELS.forEach(sl=>{
  const shots=generateShotList({skillLevel:sl.id,count:10},42);
  assertGt(shots.length,0,`${sl.name}: has shots`);
  shots.forEach(s=>assert(s.difficulty<=sl.maxDifficulty,`${sl.name}: diff within limit`));
});

// Full pipeline
const fullShots=generateShotList({styles:['cinematic','neon','retro'],skillLevel:'intermediate',count:8},777);
assertEqual(8,fullShots.length,'Full pipeline: 8 shots');
const fullSummary=getShotListSummary(fullShots);
assertGt(fullSummary.length,100,'Full pipeline: substantial summary');

console.log('  Integration tests complete.\n');

console.log('================================');
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('================================');
if(failures.length>0){console.log('\nFailures:');failures.forEach(f=>console.log('  - '+f));}
process.exit(failed>0?1:0);
