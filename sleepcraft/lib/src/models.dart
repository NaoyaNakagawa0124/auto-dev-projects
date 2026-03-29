/// SleepCraft data models.

class SleepLog {
  final DateTime date;
  final DateTime bedtime;
  final DateTime wakeTime;
  final int qualityRating; // 1-5
  final String? thoughtJournal;
  final bool didBreathing;
  final String? breathingType;

  SleepLog({
    required this.date,
    required this.bedtime,
    required this.wakeTime,
    required this.qualityRating,
    this.thoughtJournal,
    this.didBreathing = false,
    this.breathingType,
  });

  Duration get sleepDuration => wakeTime.difference(bedtime);
  double get sleepHours => sleepDuration.inMinutes / 60.0;

  Map<String, dynamic> toJson() => {
    'date': date.toIso8601String(),
    'bedtime': bedtime.toIso8601String(),
    'wakeTime': wakeTime.toIso8601String(),
    'qualityRating': qualityRating,
    'thoughtJournal': thoughtJournal,
    'didBreathing': didBreathing,
    'breathingType': breathingType,
  };
}

class BreathingSession {
  final String technique;
  final int durationSeconds;
  final DateTime completedAt;
  final int cycles;

  BreathingSession({
    required this.technique,
    required this.durationSeconds,
    required this.completedAt,
    required this.cycles,
  });
}

class DayStreak {
  final int currentStreak;
  final int longestStreak;
  final int totalDays;
  final double consistency; // 0-100%

  DayStreak({
    required this.currentStreak,
    required this.longestStreak,
    required this.totalDays,
    required this.consistency,
  });
}
