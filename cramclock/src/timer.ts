/**
 * CramClock — Timer and session logic.
 */

export interface Session {
  id: string;
  type: "study" | "break";
  startedAt: string;
  durationMinutes: number;
  completedAt?: string;
  completed: boolean;
}

export interface ExamCountdown {
  subject: string;
  examDate: string;
}

export interface CramState {
  sessions: Session[];
  exams: ExamCountdown[];
  totalStudyMinutes: number;
  totalBreakMinutes: number;
  currentStreak: number;
  longestStreak: number;
}

export function createState(): CramState {
  return {
    sessions: [],
    exams: [],
    totalStudyMinutes: 0,
    totalBreakMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
  };
}

export function createSession(type: "study" | "break", durationMinutes: number): Session {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    type,
    startedAt: new Date().toISOString(),
    durationMinutes,
    completed: false,
  };
}

export function completeSession(state: CramState, sessionId: string): CramState {
  const session = state.sessions.find((s) => s.id === sessionId);
  if (!session || session.completed) return state;

  session.completed = true;
  session.completedAt = new Date().toISOString();

  if (session.type === "study") {
    state.totalStudyMinutes += session.durationMinutes;
    state.currentStreak++;
    if (state.currentStreak > state.longestStreak) {
      state.longestStreak = state.currentStreak;
    }
  } else {
    state.totalBreakMinutes += session.durationMinutes;
  }

  return state;
}

export function startSession(state: CramState, type: "study" | "break", minutes: number): { state: CramState; session: Session } {
  const session = createSession(type, minutes);
  state.sessions.push(session);
  return { state, session };
}

export function addExam(state: CramState, subject: string, examDate: string): CramState {
  state.exams.push({ subject, examDate });
  return state;
}

export function removeExam(state: CramState, subject: string): CramState {
  state.exams = state.exams.filter((e) => e.subject !== subject);
  return state;
}

export function getExamCountdown(exam: ExamCountdown): { hours: number; minutes: number; days: number; passed: boolean } {
  const now = new Date();
  const examTime = new Date(exam.examDate);
  const diff = examTime.getTime() - now.getTime();

  if (diff <= 0) return { hours: 0, minutes: 0, days: 0, passed: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, passed: false };
}

export function getRecentSessions(state: CramState, n: number): Session[] {
  return state.sessions.slice(-n);
}

export function getStudySessions(state: CramState): Session[] {
  return state.sessions.filter((s) => s.type === "study");
}

export function getCompletedCount(state: CramState): number {
  return state.sessions.filter((s) => s.completed).length;
}

export function getTodaySessions(state: CramState): Session[] {
  const today = new Date().toISOString().split("T")[0];
  return state.sessions.filter((s) => s.startedAt.startsWith(today));
}

export function getTodayStudyMinutes(state: CramState): number {
  return getTodaySessions(state)
    .filter((s) => s.type === "study" && s.completed)
    .reduce((sum, s) => sum + s.durationMinutes, 0);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getMotivationalQuote(): string {
  const quotes = [
    "⏰ You're still awake. That's already winning.",
    "⏰ Every minute of study is an investment in tomorrow.",
    "⏰ The night is darkest before the dawn... and the exam.",
    "⏰ Future you will thank present you. Keep going.",
    "⏰ One more session. You've got this.",
    "⏰ Coffee + focus = unstoppable.",
    "⏰ The alarm clock fears YOU.",
    "⏰ 2am scholars are built different.",
    "⏰ This session counts. They all count.",
    "⏰ Your brain is a sponge at 2am. (Citation needed.)",
    "⏰ Break time isn't lazy — it's strategic.",
    "⏰ You're not procrastinating. You're marinating.",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getStats(state: CramState) {
  const totalSessions = state.sessions.length;
  const completedSessions = getCompletedCount(state);
  const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
  const todayMinutes = getTodayStudyMinutes(state);

  return {
    totalSessions,
    completedSessions,
    completionRate,
    totalStudyMinutes: state.totalStudyMinutes,
    totalBreakMinutes: state.totalBreakMinutes,
    totalStudyHours: Math.round(state.totalStudyMinutes / 60 * 10) / 10,
    currentStreak: state.currentStreak,
    longestStreak: state.longestStreak,
    todayMinutes,
    todayFormatted: formatDuration(todayMinutes),
    exams: state.exams.length,
  };
}
