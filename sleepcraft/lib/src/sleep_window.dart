/// SleepCraft — Sleep Window (Sleep Restriction Therapy logic).
/// Disguised as "optimal bedtime calculator."

class SleepWindow {
  final int bedtimeHour;
  final int bedtimeMinute;
  final int wakeHour;
  final int wakeMinute;
  final double windowHours;

  SleepWindow({
    required this.bedtimeHour,
    required this.bedtimeMinute,
    required this.wakeHour,
    required this.wakeMinute,
    required this.windowHours,
  });

  String get bedtimeString =>
      '${bedtimeHour.toString().padLeft(2, '0')}:${bedtimeMinute.toString().padLeft(2, '0')}';

  String get wakeString =>
      '${wakeHour.toString().padLeft(2, '0')}:${wakeMinute.toString().padLeft(2, '0')}';
}

/// Calculate recommended sleep window based on average sleep and wake time.
/// This is a simplified version of sleep restriction therapy.
///
/// Rules:
/// - Initial window = average actual sleep time (not time in bed)
/// - Minimum window = 5.5 hours (safety floor)
/// - Maximum window = 9 hours
/// - Anchor on wake time (most important circadian cue)
SleepWindow calculateSleepWindow({
  required double avgSleepHours,
  required int desiredWakeHour,
  required int desiredWakeMinute,
}) {
  // Clamp to safe range
  var windowHours = avgSleepHours.clamp(5.5, 9.0);

  // Calculate bedtime by subtracting window from wake time
  final wakeMinutes = desiredWakeHour * 60 + desiredWakeMinute;
  var bedMinutes = wakeMinutes - (windowHours * 60).round();

  // Handle midnight crossing
  if (bedMinutes < 0) bedMinutes += 24 * 60;

  final bedHour = (bedMinutes ~/ 60) % 24;
  final bedMin = bedMinutes % 60;

  return SleepWindow(
    bedtimeHour: bedHour,
    bedtimeMinute: bedMin,
    wakeHour: desiredWakeHour,
    wakeMinute: desiredWakeMinute,
    windowHours: windowHours,
  );
}

/// Should the sleep window be adjusted?
/// If sleep efficiency > 85%, expand by 15 min.
/// If sleep efficiency < 80%, contract by 15 min (but not below 5.5h).
SleepWindowAdjustment checkAdjustment(double currentWindowHours, double sleepEfficiency) {
  if (sleepEfficiency >= 85 && currentWindowHours < 9.0) {
    return SleepWindowAdjustment(
      action: 'expand',
      minutes: 15,
      reason: 'Your sleep efficiency is great! Expanding your window by 15 min.',
    );
  } else if (sleepEfficiency < 80 && currentWindowHours > 5.5) {
    return SleepWindowAdjustment(
      action: 'contract',
      minutes: 15,
      reason: 'Tightening your window slightly to increase sleep pressure.',
    );
  }
  return SleepWindowAdjustment(
    action: 'maintain',
    minutes: 0,
    reason: 'Your current window is working well. Keep it up!',
  );
}

class SleepWindowAdjustment {
  final String action; // 'expand', 'contract', 'maintain'
  final int minutes;
  final String reason;

  SleepWindowAdjustment({
    required this.action,
    required this.minutes,
    required this.reason,
  });
}
