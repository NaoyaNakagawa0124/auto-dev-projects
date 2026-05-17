// Export entries to JSON or Markdown. Pure — no DOM.

import { groupByMonth, groupByDay } from "./dates.js";

export function toJson(entries) {
  return JSON.stringify({ version: 1, entries }, null, 2);
}

export function toMarkdown(entries) {
  if (!entries || entries.length === 0) {
    return "# 足跡日記\n\n(まだ 足跡 が ありません)\n";
  }
  const lines = ["# 足跡日記", ""];
  const months = groupByMonth(entries);
  for (const [month, monthEntries] of months) {
    lines.push(`## ${month}`);
    lines.push("");
    const days = groupByDay(monthEntries);
    for (const [day, dayEntries] of days) {
      lines.push(`### ${day}`);
      lines.push("");
      for (const e of dayEntries) {
        const time = e.at.slice(11, 16);                  // HH:MM
        const title = e.title || "(無題)";
        const url = e.url;
        const note = e.note ? `  \n${e.note}` : "";
        lines.push(`- ${time}  [${escapeMarkdown(title)}](${url})${note}`);
      }
      lines.push("");
    }
  }
  return lines.join("\n");
}

function escapeMarkdown(s) {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/\n/g, " ");
}

export const BANNED_WORDS = Object.freeze([
  "がんばれ", "努力", "連勝", "達成", "神", "最強",
  "失敗", "ダメ", "続けて ない", "続かない 人",
]);
