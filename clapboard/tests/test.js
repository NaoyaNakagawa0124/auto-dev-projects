// ClapBoard Test Suite
const {
  GENRES, DIRECTOR_QUOTES, WRAP_MESSAGES,
  createDefaultState, createProduction, startScene, cutScene, retakeScene,
  wrapDay, getDailies, getActiveSceneDuration, getCareerStats,
  getDirectorRank, getRandomQuote,
} = require('../js/engine.js');

let passed=0,failed=0; const failures=[];
function assert(c,n){if(c)passed++;else{failed++;failures.push(n);console.log('  FAIL: '+n);}}
function assertEqual(e,a,n){if(e===a)passed++;else{failed++;failures.push(`${n}(e=${e},g=${a})`);console.log(`  FAIL: ${n}(e=${e},g=${a})`);}}
function assertGt(a,b,n){assert(a>b,`${n}(${a}>${b})`);}
function assertGte(a,b,n){assert(a>=b,`${n}(${a}>=${b})`);}

console.log('=== ClapBoard Test Suite ===\n');

// ---- Data ----
console.log('[Data Tests]');
assertEqual(8,GENRES.length,'8 genres');
GENRES.forEach(g=>{assert(g.id.length>0,`Genre ${g.id} has id`);assert(g.name.length>0,`Genre ${g.id} has name`);assert(g.icon.length>0,`Genre ${g.id} has icon`);assert(g.color.length>0,`Genre ${g.id} has color`);});
const gids=GENRES.map(g=>g.id);assertEqual(gids.length,new Set(gids).size,'Genre IDs unique');
assertGt(DIRECTOR_QUOTES.length,5,'5+ quotes');
assertGt(WRAP_MESSAGES.length,3,'3+ wrap messages');
DIRECTOR_QUOTES.forEach((q,i)=>assert(q.length>0,`Quote ${i} not empty`));
WRAP_MESSAGES.forEach((m,i)=>assert(m.length>0,`Wrap ${i} not empty`));
console.log('  Data tests complete.\n');

// ---- State ----
console.log('[State Tests]');
const ds=createDefaultState();
assertEqual(null,ds.activeScene,'No active scene');
assertEqual(0,ds.totalScenes,'0 scenes');
assertEqual(0,ds.totalMinutes,'0 minutes');
assertEqual(0,ds.streak,'0 streak');
assert(Array.isArray(ds.productions),'Productions array');
assert(Array.isArray(ds.todayScenes),'Today scenes array');
console.log('  State tests complete.\n');

// ---- Productions ----
console.log('[Production Tests]');
let s1=createDefaultState();
let rp=createProduction(s1,'My Movie');
assert(rp.success,'Create production');
assertEqual(1,s1.productions.length,'1 production');
assertEqual('My Movie',s1.productions[0].name,'Name set');
assert(s1.productions[0].id.startsWith('PROD-'),'Has PROD- id');
assertEqual(s1.productions[0].id,s1.currentProduction,'Current production set');

let rp2=createProduction(s1,'');
assert(!rp2.success,'Empty name rejected');
let rp3=createProduction(s1,'  ');
assert(!rp3.success,'Whitespace name rejected');

createProduction(s1,'Second Movie');
assertEqual(2,s1.productions.length,'2 productions');
console.log('  Production tests complete.\n');

// ---- Start Scene ----
console.log('[Start Scene Tests]');
let s2=createDefaultState();
let rs=startScene(s2,'Fix bug','dev');
assert(rs.success,'Start scene');
assert(s2.activeScene!==null,'Active scene set');
assertEqual('Fix bug',s2.activeScene.title,'Title set');
assertEqual('dev',s2.activeScene.genre,'Genre set');
assertEqual(1,s2.activeScene.take,'Take 1');

// Can't start second scene
let rs2=startScene(s2,'Another','meeting');
assert(!rs2.success,'Can\'t start while active');

// Empty title
let s3=createDefaultState();
assert(!startScene(s3,'','dev').success,'Empty title rejected');
assert(!startScene(s3,'  ','dev').success,'Whitespace title rejected (trimmed empty)');

// Default genre
let s4=createDefaultState();
startScene(s4,'Test','nonexistent');
assertEqual('dev',s4.activeScene.genre,'Defaults to dev genre');
console.log('  Start scene tests complete.\n');

// ---- Cut Scene ----
console.log('[Cut Scene Tests]');
let s5=createDefaultState();
startScene(s5,'Task 1','dev');
const startTime=s5.activeScene.startedAt;
// Simulate 5 minutes later
const fiveMinLater=new Date(new Date(startTime).getTime()+5*60000).toISOString();
let rc=cutScene(s5,fiveMinLater);
assert(rc.success,'Cut scene');
assertEqual(null,s5.activeScene,'Scene cleared');
assertEqual(1,s5.totalScenes,'1 total scene');
assertGte(s5.totalMinutes,4.9,'~5 min logged');
assertEqual(1,s5.todayScenes.length,'1 today scene');
assertEqual('Task 1',s5.todayScenes[0].title,'Scene title in log');
assertGte(s5.todayScenes[0].durationMin,4.9,'Duration ~5min');

// Can't cut without active
assert(!cutScene(s5).success,'Can\'t cut without active');

// Production stats updated
let s6=createDefaultState();
createProduction(s6,'TestProd');
startScene(s6,'Scene1','meeting');
cutScene(s6,new Date(new Date(s6.activeScene.startedAt).getTime()+120000).toISOString());
assertEqual(1,s6.productions[0].scenes,'Production scene count');
assertGt(s6.productions[0].totalMinutes,0,'Production minutes tracked');
console.log('  Cut scene tests complete.\n');

// ---- Retake ----
console.log('[Retake Tests]');
let s7=createDefaultState();
startScene(s7,'Hard task','dev');
assertEqual(1,s7.activeScene.take,'Take 1');
retakeScene(s7);
assertEqual(2,s7.activeScene.take,'Take 2');
retakeScene(s7);
assertEqual(3,s7.activeScene.take,'Take 3');

// Can't retake without active
let s8=createDefaultState();
assert(!retakeScene(s8).success,'Can\'t retake without active');
console.log('  Retake tests complete.\n');

// ---- Wrap Day ----
console.log('[Wrap Day Tests]');
let s9=createDefaultState();
// Log 3 scenes
for(let i=0;i<3;i++){
  startScene(s9,'Scene '+(i+1),GENRES[i].id);
  cutScene(s9,new Date(new Date(s9.activeScene.startedAt).getTime()+600000).toISOString());
}
assertEqual(3,s9.todayScenes.length,'3 today scenes before wrap');

let rw=wrapDay(s9);
assert(rw.success,'Wrap successful');
assertEqual(0,s9.todayScenes.length,'Today scenes cleared');
assertEqual(1,s9.history.length,'1 day in history');
assertEqual(3,rw.summary.scenes,'Summary: 3 scenes');
assertGt(rw.summary.totalMinutes,0,'Summary: has minutes');
assertEqual(1,s9.streak,'Streak is 1');
assert(rw.message.length>0,'Wrap has message');

// History caps at 30
let s10=createDefaultState();
for(let d=0;d<35;d++){
  startScene(s10,'S','dev');
  cutScene(s10,new Date(new Date(s10.activeScene.startedAt).getTime()+60000).toISOString());
  s10.lastActiveDate='2026-03-'+String(d+1).padStart(2,'0');
  wrapDay(s10);
}
assertEqual(30,s10.history.length,'History capped at 30');
console.log('  Wrap day tests complete.\n');

// ---- Dailies ----
console.log('[Dailies Tests]');
let s11=createDefaultState();
assert(getDailies(s11).includes('No scenes'),'Empty dailies message');

startScene(s11,'Task A','dev');
cutScene(s11,new Date(new Date(s11.activeScene.startedAt).getTime()+300000).toISOString());
startScene(s11,'Task B','meeting');
cutScene(s11,new Date(new Date(s11.activeScene.startedAt).getTime()+600000).toISOString());

const dailies=getDailies(s11);
assert(dailies.includes('DAILIES'),'Has DAILIES header');
assert(dailies.includes('Task A'),'Includes Task A');
assert(dailies.includes('Task B'),'Includes Task B');
assert(dailies.includes('2'),'Shows 2 scenes');
console.log('  Dailies tests complete.\n');

// ---- Duration ----
console.log('[Duration Tests]');
let s12=createDefaultState();
assertEqual(0,getActiveSceneDuration(s12),'No active = 0');
startScene(s12,'Test','dev');
const now=new Date(new Date(s12.activeScene.startedAt).getTime()+180000);
const dur=getActiveSceneDuration(s12,now);
assertGte(dur,2.9,'3min duration');
console.log('  Duration tests complete.\n');

// ---- Career Stats ----
console.log('[Career Stats Tests]');
let s13=createDefaultState();
let cs=getCareerStats(s13);
assertEqual(0,cs.totalScenes,'0 scenes');
assertEqual(0,cs.totalHours,'0 hours');
assertEqual(0,cs.productions,'0 productions');

// After some activity
createProduction(s13,'P1');
for(let i=0;i<5;i++){
  startScene(s13,'S'+(i+1),'dev');
  cutScene(s13,new Date(new Date(s13.activeScene.startedAt).getTime()+600000).toISOString());
}
cs=getCareerStats(s13);
assertEqual(5,cs.totalScenes,'5 scenes');
assertGt(cs.totalMinutes,0,'Has minutes');
assertEqual(1,cs.productions,'1 production');
assertEqual(5,cs.totalTakes,'5 takes (1 each)');
assertEqual(1,cs.avgTakesPerScene,'1 avg take');
console.log('  Career stats tests complete.\n');

// ---- Director Rank ----
console.log('[Rank Tests]');
assertEqual('Intern',getDirectorRank(0).rank,'0 = Intern');
assertEqual('Camera Operator',getDirectorRank(5).rank,'5 = Camera Operator');
assertEqual('Assistant Director',getDirectorRank(20).rank,'20 = AD');
assertEqual('Director',getDirectorRank(50).rank,'50 = Director');
assertEqual('Senior Director',getDirectorRank(100).rank,'100 = Senior');
assertEqual('Executive Producer',getDirectorRank(200).rank,'200 = EP');
assertEqual('Legendary Director',getDirectorRank(500).rank,'500 = Legendary');

for(let s=0;s<=600;s+=50){
  const r=getDirectorRank(s);
  assert(r.rank.length>0,`Rank at ${s} has name`);
  assert(r.icon.length>0,`Rank at ${s} has icon`);
}
console.log('  Rank tests complete.\n');

// ---- Quotes ----
console.log('[Quote Tests]');
for(let i=0;i<DIRECTOR_QUOTES.length;i++){
  assertEqual(DIRECTOR_QUOTES[i],getRandomQuote(i),'Quote index '+i);
}
assert(getRandomQuote(999).length>0,'Large index wraps');
console.log('  Quote tests complete.\n');

// ---- Integration ----
console.log('[Integration Tests]');
let sim=createDefaultState();
createProduction(sim,'Sprint 42');

// Simulate a work day
const tasks=[
  {title:'Standup',genre:'meeting',min:15},
  {title:'Code review',genre:'review',min:30},
  {title:'Feature dev',genre:'dev',min:90},
  {title:'Coffee break',genre:'break',min:10},
  {title:'Design sync',genre:'meeting',min:20},
  {title:'Bug fix',genre:'dev',min:45},
  {title:'Write docs',genre:'writing',min:25},
];

tasks.forEach(t=>{
  startScene(sim,t.title,t.genre);
  if(t.title==='Bug fix')retakeScene(sim); // retake once
  cutScene(sim,new Date(new Date(sim.activeScene.startedAt).getTime()+t.min*60000).toISOString());
});

assertEqual(7,sim.todayScenes.length,'Integration: 7 scenes');
assertEqual(7,sim.totalScenes,'Integration: 7 total');
assertGt(sim.totalMinutes,200,'Integration: 200+ min');
assertEqual(8,sim.totalTakes,'Integration: 8 takes (7+1 retake)');
assertEqual(7,sim.productions[0].scenes,'Integration: production has 7 scenes');

const daily=getDailies(sim);
assert(daily.includes('7'),'Integration: dailies shows 7');
assert(daily.includes('Standup'),'Integration: dailies has first task');

wrapDay(sim);
assertEqual(0,sim.todayScenes.length,'Integration: cleared after wrap');
assertEqual(1,sim.history.length,'Integration: 1 history entry');

const finalStats=getCareerStats(sim);
assertEqual(7,finalStats.totalScenes,'Integration: career 7 scenes');
assertEqual(1,finalStats.daysWorked,'Integration: 1 day worked');
console.log('  Integration tests complete.\n');

console.log('================================');
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('================================');
if(failures.length>0){console.log('\nFailures:');failures.forEach(f=>console.log('  - '+f));}
process.exit(failed>0?1:0);
