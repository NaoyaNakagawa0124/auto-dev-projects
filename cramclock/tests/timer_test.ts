import { assertEquals, assertNotEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  createState, createSession, startSession, completeSession,
  addExam, removeExam, getExamCountdown, getRecentSessions,
  getStudySessions, getCompletedCount, formatDuration,
  getMotivationalQuote, getStats, type CramState,
} from "../src/timer.ts";

Deno.test("createState returns empty state", () => {
  const s = createState();
  assertEquals(s.sessions.length, 0);
  assertEquals(s.exams.length, 0);
  assertEquals(s.totalStudyMinutes, 0);
  assertEquals(s.currentStreak, 0);
});

Deno.test("createSession creates valid session", () => {
  const session = createSession("study", 25);
  assertEquals(session.type, "study");
  assertEquals(session.durationMinutes, 25);
  assertEquals(session.completed, false);
  assertNotEquals(session.id, "");
});

Deno.test("startSession adds to state", () => {
  const state = createState();
  const { state: newState, session } = startSession(state, "study", 25);
  assertEquals(newState.sessions.length, 1);
  assertEquals(session.type, "study");
});

Deno.test("completeSession updates state", () => {
  const state = createState();
  const { state: s1, session } = startSession(state, "study", 30);
  const s2 = completeSession(s1, session.id);
  assertEquals(s2.totalStudyMinutes, 30);
  assertEquals(s2.currentStreak, 1);
  assertEquals(session.completed, true);
});

Deno.test("completeSession tracks streak", () => {
  let state = createState();
  for (let i = 0; i < 5; i++) {
    const { state: s, session } = startSession(state, "study", 25);
    state = completeSession(s, session.id);
  }
  assertEquals(state.currentStreak, 5);
  assertEquals(state.longestStreak, 5);
  assertEquals(state.totalStudyMinutes, 125);
});

Deno.test("break session tracks separately", () => {
  const state = createState();
  const { state: s1, session } = startSession(state, "break", 5);
  const s2 = completeSession(s1, session.id);
  assertEquals(s2.totalBreakMinutes, 5);
  assertEquals(s2.totalStudyMinutes, 0);
  assertEquals(s2.currentStreak, 0); // breaks don't count for streak
});

Deno.test("double complete is no-op", () => {
  const state = createState();
  const { state: s1, session } = startSession(state, "study", 25);
  completeSession(s1, session.id);
  completeSession(s1, session.id); // second call
  assertEquals(s1.totalStudyMinutes, 25); // not 50
});

Deno.test("addExam and removeExam", () => {
  const state = createState();
  addExam(state, "Math", "2026-04-01 09:00");
  addExam(state, "Physics", "2026-04-02 10:00");
  assertEquals(state.exams.length, 2);

  removeExam(state, "Math");
  assertEquals(state.exams.length, 1);
  assertEquals(state.exams[0].subject, "Physics");
});

Deno.test("getExamCountdown for future exam", () => {
  const cd = getExamCountdown({ subject: "Test", examDate: "2099-01-01 00:00" });
  assertEquals(cd.passed, false);
  assertNotEquals(cd.days, 0);
});

Deno.test("getExamCountdown for past exam", () => {
  const cd = getExamCountdown({ subject: "Test", examDate: "2020-01-01 00:00" });
  assertEquals(cd.passed, true);
  assertEquals(cd.hours, 0);
});

Deno.test("getRecentSessions returns last N", () => {
  const state = createState();
  for (let i = 0; i < 10; i++) {
    startSession(state, "study", 25);
  }
  const recent = getRecentSessions(state, 3);
  assertEquals(recent.length, 3);
});

Deno.test("getStudySessions filters correctly", () => {
  const state = createState();
  startSession(state, "study", 25);
  startSession(state, "break", 5);
  startSession(state, "study", 30);
  assertEquals(getStudySessions(state).length, 2);
});

Deno.test("getCompletedCount", () => {
  const state = createState();
  const { state: s1, session: sess1 } = startSession(state, "study", 25);
  startSession(s1, "study", 25); // not completed
  completeSession(s1, sess1.id);
  assertEquals(getCompletedCount(s1), 1);
});

Deno.test("formatDuration", () => {
  assertEquals(formatDuration(0), "0m");
  assertEquals(formatDuration(25), "25m");
  assertEquals(formatDuration(60), "1h");
  assertEquals(formatDuration(90), "1h 30m");
  assertEquals(formatDuration(150), "2h 30m");
});

Deno.test("getMotivationalQuote returns string", () => {
  const quote = getMotivationalQuote();
  assertNotEquals(quote, "");
  assertEquals(quote.includes("⏰"), true);
});

Deno.test("getStats comprehensive", () => {
  let state = createState();
  for (let i = 0; i < 3; i++) {
    const { state: s, session } = startSession(state, "study", 25);
    state = completeSession(s, session.id);
  }
  const { state: s2, session: brk } = startSession(state, "break", 5);
  state = completeSession(s2, brk.id);
  addExam(state, "Test", "2099-01-01");

  const stats = getStats(state);
  assertEquals(stats.totalSessions, 4);
  assertEquals(stats.completedSessions, 4);
  assertEquals(stats.completionRate, 100);
  assertEquals(stats.totalStudyMinutes, 75);
  assertEquals(stats.totalBreakMinutes, 5);
  assertEquals(stats.currentStreak, 3);
  assertEquals(stats.exams, 1);
});

Deno.test("unique session IDs", () => {
  const ids = new Set<string>();
  for (let i = 0; i < 100; i++) {
    const s = createSession("study", 25);
    ids.add(s.id);
  }
  assertEquals(ids.size, 100);
});
