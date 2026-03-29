/// SleepCraft — Breathing exercise engine.
/// Each technique is a real, evidence-based breathing method.

class BreathingStep {
  final String action; // 'inhale', 'hold', 'exhale'
  final int seconds;
  final String? instruction;

  const BreathingStep(this.action, this.seconds, [this.instruction]);
}

class BreathingTechnique {
  final String id;
  final String name;
  final String description;
  final String secretSkill; // What CBT-I technique this teaches
  final List<BreathingStep> steps;
  final int recommendedCycles;

  const BreathingTechnique({
    required this.id,
    required this.name,
    required this.description,
    required this.secretSkill,
    required this.steps,
    required this.recommendedCycles,
  });

  int get cycleDurationSeconds =>
      steps.fold(0, (sum, step) => sum + step.seconds);

  int get totalDurationSeconds => cycleDurationSeconds * recommendedCycles;
}

const techniques = [
  BreathingTechnique(
    id: 'four_seven_eight',
    name: '4-7-8 Breathing',
    description: 'A calming wind-down countdown',
    secretSkill: 'Activates parasympathetic nervous system, reduces anxiety',
    steps: [
      BreathingStep('inhale', 4, 'Breathe in through your nose'),
      BreathingStep('hold', 7, 'Hold gently'),
      BreathingStep('exhale', 8, 'Slow exhale through mouth'),
    ],
    recommendedCycles: 4,
  ),
  BreathingTechnique(
    id: 'box_breathing',
    name: 'Box Breathing',
    description: 'The steady square rhythm',
    secretSkill: 'Used by Navy SEALs for stress regulation',
    steps: [
      BreathingStep('inhale', 4, 'Breathe in'),
      BreathingStep('hold', 4, 'Hold'),
      BreathingStep('exhale', 4, 'Breathe out'),
      BreathingStep('hold', 4, 'Hold empty'),
    ],
    recommendedCycles: 5,
  ),
  BreathingTechnique(
    id: 'progressive_relaxation',
    name: 'Progressive Wind-Down',
    description: 'Breathe and release tension zone by zone',
    secretSkill: 'Progressive Muscle Relaxation (PMR) — reduces physical tension',
    steps: [
      BreathingStep('inhale', 5, 'Tense your shoulders'),
      BreathingStep('exhale', 5, 'Release completely'),
      BreathingStep('inhale', 5, 'Tense your hands'),
      BreathingStep('exhale', 5, 'Let them go soft'),
    ],
    recommendedCycles: 6,
  ),
  BreathingTechnique(
    id: 'three_part_breath',
    name: '3-Part Breath',
    description: 'Fill up, hold, empty out',
    secretSkill: 'Diaphragmatic breathing — improves sleep onset latency',
    steps: [
      BreathingStep('inhale', 3, 'Fill belly'),
      BreathingStep('inhale', 3, 'Fill chest'),
      BreathingStep('hold', 2, 'Pause at top'),
      BreathingStep('exhale', 6, 'Empty slowly'),
    ],
    recommendedCycles: 5,
  ),
  BreathingTechnique(
    id: 'moon_breath',
    name: 'Moon Breathing',
    description: 'Left-nostril calm for night owls',
    secretSkill: 'Chandra Bhedana — activates cooling, restful energy',
    steps: [
      BreathingStep('inhale', 4, 'In through left nostril'),
      BreathingStep('hold', 2, 'Brief pause'),
      BreathingStep('exhale', 6, 'Out through right nostril'),
    ],
    recommendedCycles: 8,
  ),
];

BreathingTechnique getTechniqueById(String id) {
  return techniques.firstWhere(
    (t) => t.id == id,
    orElse: () => techniques[0],
  );
}

BreathingTechnique getTechniqueForNight(int dayOfYear) {
  return techniques[dayOfYear % techniques.length];
}
