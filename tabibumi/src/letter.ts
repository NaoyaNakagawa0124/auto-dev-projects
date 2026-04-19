/**
 * Letter Generator — Compiles journal entries into a beautiful "letter to future self"
 */
import type { Trip, Entry } from "./db";
import { getMoodByKey, MOODS } from "./questions";

/**
 * Generate a "letter to future self" from trip entries
 */
export function generateLetter(trip: Trip, entries: Entry[]): string {
  if (entries.length === 0) {
    return "まだ記録がありません。旅の思い出を書き留めてみましょう。";
  }

  const destination = trip.destination;
  const startDate = formatDateJP(trip.startedAt);
  const endDate = trip.endedAt ? formatDateJP(trip.endedAt) : "（旅の途中）";
  const dayCount = getDayCount(trip);
  const now = formatDateJP(new Date().toISOString());

  let letter = "";

  // Header
  letter += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  letter += `\n`;
  letter += `  未来のあなたへ\n`;
  letter += `\n`;
  letter += `  ${destination}からの手紙\n`;
  letter += `  ${startDate} 〜 ${endDate}\n`;
  letter += `\n`;
  letter += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  letter += `\n`;

  // Opening
  letter += `未来の私へ。\n\n`;
  letter += `これを読んでいるあなたは、きっと日常の中にいるのでしょう。\n`;
  letter += `${destination}で過ごした${dayCount}日間のことを、覚えていますか？\n\n`;

  // Group entries by day
  const byDay = groupByDay(entries);
  const days = Object.keys(byDay).sort();

  for (let i = 0; i < days.length; i++) {
    const dayEntries = byDay[days[i]];
    const dayLabel = i === 0 ? "最初の日" : i === days.length - 1 ? "最後の日" : `${i + 1}日目`;

    letter += `── ${dayLabel} ──\n\n`;

    for (const entry of dayEntries) {
      const mood = entry.mood ? getMoodByKey(entry.mood) : null;
      const moodStr = mood ? ` ${mood.emoji}` : "";
      const time = formatTime(entry.createdAt);

      letter += `${time}${moodStr}\n`;
      letter += `「${entry.question}」と聞かれて、あなたはこう答えました。\n`;
      letter += `\n`;
      letter += `  ${entry.answer}\n`;
      letter += `\n`;
    }
  }

  // Emotional summary
  const moodSummary = buildMoodSummary(entries);
  if (moodSummary) {
    letter += `── 心の記録 ──\n\n`;
    letter += `${moodSummary}\n\n`;
  }

  // Closing
  letter += `── ──\n\n`;
  letter += `${destination}で感じたこと、見たもの、聞いた音。\n`;
  letter += `それはすべて、あなたの中に残っています。\n`;
  letter += `\n`;
  letter += `日常に戻っても、ふとした瞬間に\n`;
  letter += `あの場所の空気を思い出してください。\n`;
  letter += `\n`;
  letter += `${destination}のあなたより\n`;
  letter += `\n`;
  letter += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  letter += `  旅文 — ${now} に紡がれた手紙\n`;
  letter += `  記録: ${entries.length}通 ・ ${dayCount}日間\n`;
  letter += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  return letter;
}

/**
 * Export trip as Markdown
 */
export function exportMarkdown(trip: Trip, entries: Entry[]): string {
  const destination = trip.destination;
  const startDate = formatDateJP(trip.startedAt);
  const endDate = trip.endedAt ? formatDateJP(trip.endedAt) : "（旅の途中）";
  const dayCount = getDayCount(trip);

  let md = "";
  md += `# ${destination}の旅文\n\n`;
  md += `> ${startDate} 〜 ${endDate}（${dayCount}日間）\n\n`;

  const byDay = groupByDay(entries);
  const days = Object.keys(byDay).sort();

  for (let i = 0; i < days.length; i++) {
    const dayEntries = byDay[days[i]];
    md += `## ${i + 1}日目（${days[i]}）\n\n`;

    for (const entry of dayEntries) {
      const mood = entry.mood ? getMoodByKey(entry.mood) : null;
      const moodStr = mood ? ` ${mood.emoji} ${mood.label}` : "";
      const time = formatTime(entry.createdAt);
      const location = entry.location ? ` 📍 ${entry.location}` : "";

      md += `### ${time}${moodStr}${location}\n\n`;
      md += `**${entry.question}**\n\n`;
      md += `${entry.answer}\n\n`;
      md += `---\n\n`;
    }
  }

  // Stats
  const moodCounts = countMoods(entries);
  if (Object.keys(moodCounts).length > 0) {
    md += `## 心の記録\n\n`;
    for (const [key, count] of Object.entries(moodCounts)) {
      const mood = getMoodByKey(key);
      if (mood) {
        md += `- ${mood.emoji} ${mood.label}: ${count}回\n`;
      }
    }
    md += `\n`;
  }

  md += `---\n\n`;
  md += `*旅文 (Tabibumi) で記録された ${entries.length} 通の手紙*\n`;

  return md;
}

// ===== Helpers =====

function groupByDay(entries: Entry[]): Record<string, Entry[]> {
  const groups: Record<string, Entry[]> = {};
  for (const entry of entries) {
    const day = entry.createdAt.split(" ")[0] || entry.createdAt.split("T")[0];
    if (!groups[day]) groups[day] = [];
    groups[day].push(entry);
  }
  return groups;
}

function countMoods(entries: Entry[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const entry of entries) {
    if (entry.mood) {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    }
  }
  return counts;
}

function buildMoodSummary(entries: Entry[]): string {
  const counts = countMoods(entries);
  if (Object.keys(counts).length === 0) return "";

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top = sorted[0];
  const topMood = getMoodByKey(top[0]);

  if (!topMood) return "";

  let summary = `この旅で一番多く感じた気持ちは「${topMood.label}」${topMood.emoji} でした。`;

  if (sorted.length > 1) {
    const second = getMoodByKey(sorted[1][0]);
    if (second) {
      summary += `\nそして「${second.label}」${second.emoji} も、よく感じていたようです。`;
    }
  }

  return summary;
}

function formatDateJP(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}年${m}月${day}日`;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

function getDayCount(trip: Trip): number {
  const start = new Date(trip.startedAt);
  const end = trip.endedAt ? new Date(trip.endedAt) : new Date();
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}
