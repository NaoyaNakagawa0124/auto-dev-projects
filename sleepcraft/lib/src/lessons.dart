/// SleepCraft — CBT-I micro-lesson database.
/// Each lesson is disguised as a "sleep tip" but teaches real therapy techniques.

class MicroLesson {
  final String id;
  final String category;
  final String tip;           // What the user sees (friendly)
  final String secretLesson;  // The actual CBT-I technique being taught
  final String evidence;      // Brief scientific backing

  const MicroLesson({
    required this.id,
    required this.category,
    required this.tip,
    required this.secretLesson,
    required this.evidence,
  });
}

const lessons = [
  // Sleep Hygiene
  MicroLesson(
    id: 'sh1', category: 'Sleep Hygiene',
    tip: 'Keep your bedroom cool — around 65-68°F (18-20°C).',
    secretLesson: 'Temperature regulation is a core CBT-I sleep hygiene practice.',
    evidence: 'Core body temperature must drop 2-3°F to initiate sleep (Walker, 2017).',
  ),
  MicroLesson(
    id: 'sh2', category: 'Sleep Hygiene',
    tip: 'No screens 30 minutes before bed. Try a book instead.',
    secretLesson: 'Blue light suppression — standard CBT-I recommendation.',
    evidence: 'Blue light delays melatonin release by up to 3 hours (Harvard Health).',
  ),
  MicroLesson(
    id: 'sh3', category: 'Sleep Hygiene',
    tip: 'Use your bed only for sleep. Move other activities elsewhere.',
    secretLesson: 'Stimulus control — the bed becomes a cue for sleep only.',
    evidence: 'Bootzin stimulus control is one of the most effective CBT-I components.',
  ),
  MicroLesson(
    id: 'sh4', category: 'Sleep Hygiene',
    tip: 'Skip caffeine after 2pm. It has a 6-hour half-life.',
    secretLesson: 'Substance control — removing sleep-interfering chemicals.',
    evidence: 'Caffeine blocks adenosine receptors for 5-7 hours (Clark & Landolt, 2017).',
  ),

  // Sleep Restriction
  MicroLesson(
    id: 'sr1', category: 'Sleep Window',
    tip: 'Try going to bed only when truly sleepy, not just tired.',
    secretLesson: 'Sleep restriction therapy — increasing sleep drive (homeostatic pressure).',
    evidence: 'Sleep restriction increases sleep efficiency from ~70% to >85% (Spielman et al.).',
  ),
  MicroLesson(
    id: 'sr2', category: 'Sleep Window',
    tip: 'Wake up at the same time every day, even weekends.',
    secretLesson: 'Circadian anchor — strengthening the internal clock.',
    evidence: 'Consistent wake time is the strongest zeitgeber for circadian rhythm.',
  ),
  MicroLesson(
    id: 'sr3', category: 'Sleep Window',
    tip: 'If you cant sleep after 20 minutes, get up and do something calm.',
    secretLesson: 'The 20-minute rule — preventing conditioned arousal in bed.',
    evidence: 'Prevents the bed from becoming associated with wakefulness (CBT-I core).',
  ),

  // Cognitive Restructuring
  MicroLesson(
    id: 'cr1', category: 'Thought Journal',
    tip: 'Write down worries before bed to "close the loop" on racing thoughts.',
    secretLesson: 'Cognitive restructuring — externalizing anxious thoughts reduces rumination.',
    evidence: 'Constructive worry journaling reduced sleep onset latency by 9 min (Harvey, 2002).',
  ),
  MicroLesson(
    id: 'cr2', category: 'Thought Journal',
    tip: 'Notice thoughts like "Ill never sleep tonight" and reframe them.',
    secretLesson: 'Cognitive defusion — detaching from catastrophic sleep beliefs.',
    evidence: 'Dysfunctional beliefs about sleep are a key CBT-I treatment target (Morin, 1993).',
  ),
  MicroLesson(
    id: 'cr3', category: 'Thought Journal',
    tip: 'List 3 things that went well today. Gratitude quiets the mind.',
    secretLesson: 'Positive cognitive appraisal — shifting pre-sleep cognition.',
    evidence: 'Gratitude journaling improved sleep quality in multiple RCTs (Digdon & Koble, 2011).',
  ),

  // Relaxation
  MicroLesson(
    id: 'rx1', category: 'Wind-Down',
    tip: 'Try tensing each muscle group for 5 seconds, then releasing.',
    secretLesson: 'Progressive Muscle Relaxation (PMR) — systematic tension release.',
    evidence: 'PMR reduces sleep onset latency by ~15 minutes on average (Jacobson, 1938).',
  ),
  MicroLesson(
    id: 'rx2', category: 'Wind-Down',
    tip: 'Visualize a peaceful place — a beach, forest, or cozy room.',
    secretLesson: 'Guided imagery — cognitive distraction from pre-sleep worry.',
    evidence: 'Imagery distraction reduced sleep onset latency (Harvey & Payne, 2002).',
  ),

  // Chronobiology
  MicroLesson(
    id: 'ch1', category: 'Night Owl Tips',
    tip: 'Get bright light first thing in the morning to shift your clock earlier.',
    secretLesson: 'Light therapy — phase-advancing the circadian rhythm.',
    evidence: 'Morning bright light shifts the circadian phase by 1-2 hours/week.',
  ),
  MicroLesson(
    id: 'ch2', category: 'Night Owl Tips',
    tip: 'Dim all lights after sunset. Your brain needs darkness cues.',
    secretLesson: 'Scotopic signaling — supporting natural melatonin onset.',
    evidence: 'Dim light in the evening advances melatonin onset by 30-60 minutes.',
  ),
];

MicroLesson getLessonForDay(int dayOfYear) {
  return lessons[dayOfYear % lessons.length];
}

List<MicroLesson> getLessonsByCategory(String category) {
  return lessons.where((l) => l.category == category).toList();
}

List<String> getCategories() {
  return lessons.map((l) => l.category).toSet().toList();
}
