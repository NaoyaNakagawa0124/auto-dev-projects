/// SleepCraft — Sleep scoring and streak calculations.

import 'models.dart';

class SleepScore {
  final double efficiency;     // % of time in bed actually sleeping
  final double consistency;    // How regular your sleep schedule is
  final double duration;       // How close to 7-9 hours
  final double overall;        // Weighted average
  final String grade;          // A-F

  SleepScore({
    required this.efficiency,
    required this.consistency,
    required this.duration,
    required this.overall,
    required this.grade,
  });
}

/// Calculate sleep score for a single night.
SleepScore scoreSleepLog(SleepLog log, {double targetHours = 8.0}) {
  // Efficiency: ratio of sleep to time in bed (assume they slept most of it)
  // For simplicity: quality rating maps to efficiency
  final efficiency = (log.qualityRating / 5.0) * 100;

  // Duration: how close to target (7-9 hours is ideal)
  final hours = log.sleepHours;
  double durationScore;
  if (hours >= 7 && hours <= 9) {
    durationScore = 100;
  } else if (hours >= 6 && hours < 7) {
    durationScore = 70;
  } else if (hours > 9 && hours <= 10) {
    durationScore = 80;
  } else {
    durationScore = 50;
  }

  // Consistency placeholder (needs multiple nights)
  const consistencyScore = 80.0;

  // Weighted overall
  final overall = efficiency * 0.4 + durationScore * 0.35 + consistencyScore * 0.25;

  return SleepScore(
    efficiency: efficiency,
    consistency: consistencyScore,
    duration: durationScore,
    overall: overall,
    grade: _gradeFromScore(overall),
  );
}

/// Calculate sleep score from multiple logs.
SleepScore scoreMultipleLogs(List<SleepLog> logs, {double targetHours = 8.0}) {
  if (logs.isEmpty) {
    return SleepScore(efficiency: 0, consistency: 0, duration: 0, overall: 0, grade: 'F');
  }

  // Average quality
  final avgQuality = logs.map((l) => l.qualityRating).reduce((a, b) => a + b) / logs.length;
  final efficiency = (avgQuality / 5.0) * 100;

  // Average duration score
  double durationTotal = 0;
  for (final log in logs) {
    final h = log.sleepHours;
    if (h >= 7 && h <= 9) durationTotal += 100;
    else if (h >= 6 && h < 7) durationTotal += 70;
    else if (h > 9 && h <= 10) durationTotal += 80;
    else durationTotal += 50;
  }
  final durationScore = durationTotal / logs.length;

  // Consistency: standard deviation of bedtime hours
  if (logs.length < 2) {
    final overall = efficiency * 0.4 + durationScore * 0.35 + 80 * 0.25;
    return SleepScore(
      efficiency: efficiency, consistency: 80, duration: durationScore,
      overall: overall, grade: _gradeFromScore(overall),
    );
  }

  final bedtimeHours = logs.map((l) => l.bedtime.hour + l.bedtime.minute / 60.0).toList();
  // Adjust for midnight crossing
  final adjusted = bedtimeHours.map((h) => h < 12 ? h + 24 : h).toList();
  final mean = adjusted.reduce((a, b) => a + b) / adjusted.length;
  final variance = adjusted.map((h) => (h - mean) * (h - mean)).reduce((a, b) => a + b) / adjusted.length;
  final stdDev = _sqrt(variance);
  // Lower std dev = higher consistency (max 100 when stdDev = 0)
  final consistencyScore = (100 - stdDev * 20).clamp(0, 100).toDouble();

  final overall = efficiency * 0.4 + durationScore * 0.35 + consistencyScore * 0.25;

  return SleepScore(
    efficiency: efficiency,
    consistency: consistencyScore,
    duration: durationScore,
    overall: overall,
    grade: _gradeFromScore(overall),
  );
}

/// Calculate streak from a list of sleep logs (sorted by date).
DayStreak calculateStreak(List<SleepLog> logs) {
  if (logs.isEmpty) {
    return DayStreak(currentStreak: 0, longestStreak: 0, totalDays: 0, consistency: 0);
  }

  final sorted = List<SleepLog>.from(logs)
    ..sort((a, b) => a.date.compareTo(b.date));

  int current = 1;
  int longest = 1;
  final totalDays = sorted.length;

  for (int i = 1; i < sorted.length; i++) {
    final diff = sorted[i].date.difference(sorted[i - 1].date).inDays;
    if (diff == 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }

  final first = sorted.first.date;
  final last = sorted.last.date;
  final span = last.difference(first).inDays + 1;
  final consistency = span > 0 ? (totalDays / span * 100).clamp(0, 100).toDouble() : 0.0;

  return DayStreak(
    currentStreak: current,
    longestStreak: longest,
    totalDays: totalDays,
    consistency: consistency,
  );
}

String _gradeFromScore(double score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

double _sqrt(double x) {
  if (x <= 0) return 0;
  double guess = x / 2;
  for (int i = 0; i < 20; i++) {
    guess = (guess + x / guess) / 2;
  }
  return guess;
}
