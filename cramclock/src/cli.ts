#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * CramClock ⏰ — CLI for late-night study sessions.
 */

import {
  createState, startSession, completeSession, addExam, removeExam,
  getExamCountdown, getRecentSessions, getStats, getMotivationalQuote,
  formatDuration, type CramState,
} from "./timer.ts";

const DATA_DIR = Deno.env.get("HOME") + "/.cramclock";
const DATA_FILE = DATA_DIR + "/data.json";

function loadState(): CramState {
  try {
    const data = Deno.readTextFileSync(DATA_FILE);
    return JSON.parse(data);
  } catch {
    return createState();
  }
}

function saveState(state: CramState): void {
  try { Deno.mkdirSync(DATA_DIR, { recursive: true }); } catch { /* exists */ }
  Deno.writeTextFileSync(DATA_FILE, JSON.stringify(state, null, 2));
}

const args = Deno.args;
const command = args[0] || "help";
const state = loadState();

switch (command) {
  case "start": {
    const minutes = parseInt(args[1] || "25");
    const { state: newState, session } = startSession(state, "study", minutes);
    completeSession(newState, session.id); // Auto-complete for CLI (no real timer)
    saveState(newState);
    console.log(`\n  ⏰ Study session: ${minutes} minutes`);
    console.log(`  📚 Session #${newState.sessions.length} logged!`);
    console.log(`  🔥 Streak: ${newState.currentStreak} sessions`);
    console.log(`\n  ${getMotivationalQuote()}\n`);
    break;
  }

  case "break": {
    const minutes = parseInt(args[1] || "5");
    const { state: newState, session } = startSession(state, "break", minutes);
    completeSession(newState, session.id);
    saveState(newState);
    console.log(`\n  ☕ Break: ${minutes} minutes`);
    console.log(`  💡 Rest is part of learning.\n`);
    break;
  }

  case "exam": {
    const subject = args[1];
    const date = args[2];
    if (!subject || !date) {
      console.log('\n  Usage: cramclock exam "Math" "2026-04-01 09:00"\n');
      break;
    }
    addExam(state, subject, date);
    saveState(state);
    const countdown = getExamCountdown({ subject, examDate: date });
    console.log(`\n  📅 Exam added: ${subject}`);
    console.log(`  ⏰ ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m remaining\n`);
    break;
  }

  case "status": {
    const stats = getStats(state);
    console.log("\n  ⏰ CRAMCLOCK STATUS");
    console.log("  ─────────────────────");
    console.log(`  📚 Today: ${stats.todayFormatted} studied`);
    console.log(`  🔥 Streak: ${stats.currentStreak} sessions`);
    console.log(`  📊 Total: ${formatDuration(stats.totalStudyMinutes)} studied`);

    if (state.exams.length > 0) {
      console.log("\n  📅 UPCOMING EXAMS:");
      for (const exam of state.exams) {
        const cd = getExamCountdown(exam);
        if (cd.passed) {
          console.log(`     ✅ ${exam.subject} — DONE`);
        } else {
          console.log(`     ⏰ ${exam.subject} — ${cd.days}d ${cd.hours}h ${cd.minutes}m`);
        }
      }
    }
    console.log("");
    break;
  }

  case "history": {
    const n = parseInt(args[1] || "10");
    const recent = getRecentSessions(state, n);
    if (recent.length === 0) {
      console.log("\n  No sessions yet. Run: cramclock start\n");
      break;
    }
    console.log("\n  ⏰ RECENT SESSIONS:");
    console.log("  ─────────────────────");
    for (const s of recent.reverse()) {
      const icon = s.type === "study" ? "📚" : "☕";
      const status = s.completed ? "✅" : "⏳";
      const date = s.startedAt.split("T")[0];
      console.log(`  ${icon} ${date} — ${s.durationMinutes}m ${s.type} ${status}`);
    }
    console.log("");
    break;
  }

  case "stats": {
    const stats = getStats(state);
    console.log("\n  ╔════════════════════════════════╗");
    console.log("  ║     ⏰ CRAMCLOCK STATS          ║");
    console.log("  ╠════════════════════════════════╣");
    console.log(`  ║  Sessions:    ${String(stats.totalSessions).padStart(14)}  ║`);
    console.log(`  ║  Completed:   ${String(stats.completedSessions).padStart(14)}  ║`);
    console.log(`  ║  Rate:        ${(stats.completionRate + "%").padStart(14)}  ║`);
    console.log(`  ║  Study time:  ${formatDuration(stats.totalStudyMinutes).padStart(14)}  ║`);
    console.log(`  ║  Break time:  ${formatDuration(stats.totalBreakMinutes).padStart(14)}  ║`);
    console.log(`  ║  Streak:      ${String(stats.currentStreak).padStart(14)}  ║`);
    console.log(`  ║  Best streak: ${String(stats.longestStreak).padStart(14)}  ║`);
    console.log(`  ║  Exams set:   ${String(stats.exams).padStart(14)}  ║`);
    console.log("  ╚════════════════════════════════╝\n");
    break;
  }

  case "help":
  default:
    console.log(`
  ⏰ CRAMCLOCK — Late-night study companion

  Commands:
    start [min]              Log a study session (default: 25 min)
    break [min]              Log a break (default: 5 min)
    exam <subject> <date>    Set exam countdown
    status                   Current status + exam countdowns
    history [n]              Recent sessions
    stats                    Full statistics
    help                     Show this help

  Examples:
    cramclock start 45
    cramclock exam "Physics" "2026-04-02 10:00"
    cramclock status
`);
}
