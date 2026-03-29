import 'package:sleepcraft/sleepcraft.dart';
import 'package:test/test.dart';

void main() {
  group('Models', () {
    test('SleepLog calculates duration', () {
      final log = SleepLog(
        date: DateTime(2026, 3, 29),
        bedtime: DateTime(2026, 3, 29, 23, 0),
        wakeTime: DateTime(2026, 3, 30, 7, 0),
        qualityRating: 4,
      );
      expect(log.sleepHours, equals(8.0));
      expect(log.sleepDuration.inHours, equals(8));
    });

    test('SleepLog toJson', () {
      final log = SleepLog(
        date: DateTime(2026, 3, 29),
        bedtime: DateTime(2026, 3, 29, 23, 0),
        wakeTime: DateTime(2026, 3, 30, 7, 0),
        qualityRating: 4,
        thoughtJournal: 'Feeling good',
        didBreathing: true,
        breathingType: 'four_seven_eight',
      );
      final json = log.toJson();
      expect(json['qualityRating'], equals(4));
      expect(json['didBreathing'], isTrue);
      expect(json['thoughtJournal'], equals('Feeling good'));
    });

    test('SleepLog handles short sleep', () {
      final log = SleepLog(
        date: DateTime(2026, 3, 29),
        bedtime: DateTime(2026, 3, 30, 2, 0),
        wakeTime: DateTime(2026, 3, 30, 5, 30),
        qualityRating: 2,
      );
      expect(log.sleepHours, equals(3.5));
    });
  });

  group('Breathing', () {
    test('has at least 5 techniques', () {
      expect(techniques.length, greaterThanOrEqualTo(5));
    });

    test('each technique has valid structure', () {
      for (final t in techniques) {
        expect(t.id.isNotEmpty, isTrue);
        expect(t.name.isNotEmpty, isTrue);
        expect(t.description.isNotEmpty, isTrue);
        expect(t.secretSkill.isNotEmpty, isTrue);
        expect(t.steps.isNotEmpty, isTrue);
        expect(t.recommendedCycles, greaterThan(0));
        expect(t.cycleDurationSeconds, greaterThan(0));
        expect(t.totalDurationSeconds, greaterThan(0));
      }
    });

    test('getTechniqueById returns correct technique', () {
      final t = getTechniqueById('four_seven_eight');
      expect(t.name, equals('4-7-8 Breathing'));
      expect(t.cycleDurationSeconds, equals(19)); // 4+7+8
    });

    test('getTechniqueById falls back to first', () {
      final t = getTechniqueById('nonexistent');
      expect(t.id, equals('four_seven_eight'));
    });

    test('getTechniqueForNight rotates through techniques', () {
      final ids = <String>{};
      for (int i = 0; i < techniques.length; i++) {
        ids.add(getTechniqueForNight(i).id);
      }
      expect(ids.length, equals(techniques.length));
    });

    test('box breathing has 4 equal steps', () {
      final t = getTechniqueById('box_breathing');
      expect(t.steps.length, equals(4));
      expect(t.steps.every((s) => s.seconds == 4), isTrue);
    });
  });

  group('Lessons', () {
    test('has at least 14 lessons', () {
      expect(lessons.length, greaterThanOrEqualTo(14));
    });

    test('each lesson has valid structure', () {
      for (final l in lessons) {
        expect(l.id.isNotEmpty, isTrue);
        expect(l.category.isNotEmpty, isTrue);
        expect(l.tip.isNotEmpty, isTrue);
        expect(l.secretLesson.isNotEmpty, isTrue);
        expect(l.evidence.isNotEmpty, isTrue);
      }
    });

    test('getLessonForDay rotates', () {
      final ids = <String>{};
      for (int i = 0; i < lessons.length; i++) {
        ids.add(getLessonForDay(i).id);
      }
      expect(ids.length, equals(lessons.length));
    });

    test('getLessonsByCategory returns matching', () {
      final hygiene = getLessonsByCategory('Sleep Hygiene');
      expect(hygiene.isNotEmpty, isTrue);
      expect(hygiene.every((l) => l.category == 'Sleep Hygiene'), isTrue);
    });

    test('getCategories returns unique set', () {
      final cats = getCategories();
      expect(cats.length, greaterThanOrEqualTo(4));
      expect(cats.toSet().length, equals(cats.length));
    });

    test('unique lesson IDs', () {
      final ids = lessons.map((l) => l.id).toSet();
      expect(ids.length, equals(lessons.length));
    });
  });

  group('Scoring', () {
    test('scoreSleepLog with good sleep', () {
      final log = SleepLog(
        date: DateTime(2026, 3, 29),
        bedtime: DateTime(2026, 3, 29, 23, 0),
        wakeTime: DateTime(2026, 3, 30, 7, 0),
        qualityRating: 5,
      );
      final score = scoreSleepLog(log);
      expect(score.efficiency, equals(100));
      expect(score.duration, equals(100));
      expect(score.grade, equals('A'));
      expect(score.overall, greaterThan(80));
    });

    test('scoreSleepLog with poor sleep', () {
      final log = SleepLog(
        date: DateTime(2026, 3, 29),
        bedtime: DateTime(2026, 3, 30, 3, 0),
        wakeTime: DateTime(2026, 3, 30, 5, 0),
        qualityRating: 1,
      );
      final score = scoreSleepLog(log);
      expect(score.efficiency, equals(20));
      expect(score.duration, equals(50));
      expect(score.overall, lessThan(50));
    });

    test('scoreMultipleLogs empty', () {
      final score = scoreMultipleLogs([]);
      expect(score.overall, equals(0));
      expect(score.grade, equals('F'));
    });

    test('scoreMultipleLogs with data', () {
      final logs = List.generate(7, (i) => SleepLog(
        date: DateTime(2026, 3, 22 + i),
        bedtime: DateTime(2026, 3, 22 + i, 23, 0),
        wakeTime: DateTime(2026, 3, 23 + i, 7, 0),
        qualityRating: 4,
      ));
      final score = scoreMultipleLogs(logs);
      expect(score.overall, greaterThan(60));
      expect(score.consistency, greaterThan(50));
    });

    test('calculateStreak with consecutive days', () {
      final logs = List.generate(5, (i) => SleepLog(
        date: DateTime(2026, 3, 25 + i),
        bedtime: DateTime(2026, 3, 25 + i, 23, 0),
        wakeTime: DateTime(2026, 3, 26 + i, 7, 0),
        qualityRating: 4,
      ));
      final streak = calculateStreak(logs);
      expect(streak.currentStreak, equals(5));
      expect(streak.longestStreak, equals(5));
      expect(streak.totalDays, equals(5));
      expect(streak.consistency, equals(100));
    });

    test('calculateStreak with gap', () {
      final logs = [
        SleepLog(date: DateTime(2026, 3, 25), bedtime: DateTime(2026, 3, 25, 23, 0), wakeTime: DateTime(2026, 3, 26, 7, 0), qualityRating: 4),
        SleepLog(date: DateTime(2026, 3, 26), bedtime: DateTime(2026, 3, 26, 23, 0), wakeTime: DateTime(2026, 3, 27, 7, 0), qualityRating: 4),
        SleepLog(date: DateTime(2026, 3, 29), bedtime: DateTime(2026, 3, 29, 23, 0), wakeTime: DateTime(2026, 3, 30, 7, 0), qualityRating: 3),
      ];
      final streak = calculateStreak(logs);
      expect(streak.currentStreak, equals(1));
      expect(streak.longestStreak, equals(2));
      expect(streak.totalDays, equals(3));
    });

    test('calculateStreak empty', () {
      final streak = calculateStreak([]);
      expect(streak.currentStreak, equals(0));
      expect(streak.longestStreak, equals(0));
      expect(streak.totalDays, equals(0));
    });

    test('grade boundaries', () {
      final makeLog = (int q, double h) => SleepLog(
        date: DateTime(2026, 3, 29),
        bedtime: DateTime(2026, 3, 29, 23, 0),
        wakeTime: DateTime(2026, 3, 29, 23, 0).add(Duration(minutes: (h * 60).round())),
        qualityRating: q,
      );
      expect(scoreSleepLog(makeLog(5, 8)).grade, equals('A'));
      expect(scoreSleepLog(makeLog(1, 4)).grade, isIn(['D', 'F']));
    });
  });

  group('SleepWindow', () {
    test('basic calculation', () {
      final w = calculateSleepWindow(
        avgSleepHours: 7.0,
        desiredWakeHour: 7,
        desiredWakeMinute: 0,
      );
      expect(w.wakeHour, equals(7));
      expect(w.wakeMinute, equals(0));
      expect(w.windowHours, equals(7.0));
      expect(w.bedtimeHour, equals(0)); // midnight
      expect(w.bedtimeMinute, equals(0));
    });

    test('clamps minimum to 5.5 hours', () {
      final w = calculateSleepWindow(
        avgSleepHours: 3.0,
        desiredWakeHour: 7,
        desiredWakeMinute: 0,
      );
      expect(w.windowHours, equals(5.5));
    });

    test('clamps maximum to 9 hours', () {
      final w = calculateSleepWindow(
        avgSleepHours: 12.0,
        desiredWakeHour: 7,
        desiredWakeMinute: 0,
      );
      expect(w.windowHours, equals(9.0));
    });

    test('handles midnight crossing', () {
      final w = calculateSleepWindow(
        avgSleepHours: 8.0,
        desiredWakeHour: 6,
        desiredWakeMinute: 0,
      );
      expect(w.bedtimeHour, equals(22)); // 10pm
    });

    test('bedtimeString and wakeString formatting', () {
      final w = calculateSleepWindow(
        avgSleepHours: 7.5,
        desiredWakeHour: 7,
        desiredWakeMinute: 30,
      );
      expect(w.wakeString, equals('07:30'));
      expect(w.bedtimeString.length, equals(5));
    });

    test('checkAdjustment expand', () {
      final adj = checkAdjustment(7.0, 90);
      expect(adj.action, equals('expand'));
      expect(adj.minutes, equals(15));
    });

    test('checkAdjustment contract', () {
      final adj = checkAdjustment(8.0, 70);
      expect(adj.action, equals('contract'));
      expect(adj.minutes, equals(15));
    });

    test('checkAdjustment maintain', () {
      final adj = checkAdjustment(7.5, 82);
      expect(adj.action, equals('maintain'));
      expect(adj.minutes, equals(0));
    });

    test('no contract below 5.5h', () {
      final adj = checkAdjustment(5.5, 70);
      expect(adj.action, equals('maintain'));
    });

    test('no expand above 9h', () {
      final adj = checkAdjustment(9.0, 90);
      expect(adj.action, equals('maintain'));
    });
  });
}
