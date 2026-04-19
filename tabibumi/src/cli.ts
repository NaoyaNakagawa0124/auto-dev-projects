#!/usr/bin/env bun
/**
 * 旅文 (Tabibumi) — CLI Interface
 */

import {
  openDb, closeDb,
  startTrip, endTrip, getActiveTrip, getAllTrips,
  addEntry, getEntriesByTrip, getEntryCount, getTripDays, getMoodCounts,
  type Trip,
} from "./db";
import { pickQuestion, MOODS, getMoodByKey, getTimeOfDay } from "./questions";
import { generateLetter, exportMarkdown } from "./letter";
import { banner, header, gentle, info, question, quote, error, divider, box, formatDate, c } from "./display";
import { writeFileSync } from "fs";

// ===== CLI Router =====
const args = process.argv.slice(2);
const command = args[0] || "help";

openDb();

try {
  switch (command) {
    case "start":
      cmdStart(args[1]);
      break;
    case "write":
    case "w":
      await cmdWrite(args[1]);
      break;
    case "read":
    case "r":
      cmdRead();
      break;
    case "letter":
    case "l":
      cmdLetter();
      break;
    case "end":
      cmdEnd();
      break;
    case "trips":
      cmdTrips();
      break;
    case "export":
      cmdExport();
      break;
    case "stats":
      cmdStats();
      break;
    case "help":
    case "--help":
    case "-h":
      cmdHelp();
      break;
    default:
      error(`不明なコマンド: ${command}`);
      cmdHelp();
  }
} finally {
  closeDb();
}

// ===== Commands =====

function cmdStart(destination?: string) {
  if (!destination) {
    banner();
    error("行き先を指定してください");
    gentle("使い方: bun run src/cli.ts start <行き先>");
    gentle("例: bun run src/cli.ts start パリ");
    console.log();
    return;
  }

  const trip = startTrip(destination);
  banner();
  header("旅の始まり", c.rose);

  const timeGreeting = {
    morning: "おはようございます。",
    afternoon: "こんにちは。",
    evening: "こんばんは。",
    night: "夜遅くに、ようこそ。",
  }[getTimeOfDay()];

  gentle(`${timeGreeting}`);
  gentle(`${destination}への旅が始まりました。`);
  console.log();
  gentle("旅の途中で感じたことを、少しずつ書き留めてみませんか。");
  gentle(`記録するには: ${c.sky}bun run src/cli.ts write${c.reset}`);
  console.log();
  divider();
  info("旅ID", `#${trip.id}`);
  info("行き先", destination);
  info("開始日", formatDate(trip.startedAt));
  console.log();
}

async function cmdWrite(quickAnswer?: string) {
  const trip = getActiveTrip();
  if (!trip) {
    banner();
    error("現在進行中の旅がありません");
    gentle(`旅を始めるには: ${c.sky}bun run src/cli.ts start <行き先>${c.reset}`);
    console.log();
    return;
  }

  const entryCount = getEntryCount(trip.id);
  const tripDays = getTripDays(trip);
  const usedQuestions = getEntriesByTrip(trip.id).map(e => e.question);
  const q = pickQuestion(entryCount, tripDays, usedQuestions);

  banner();
  header(`${trip.destination} — ${entryCount + 1}通目`, c.rose);

  question(q.text);

  let answer: string;
  if (quickAnswer) {
    answer = quickAnswer;
    gentle(`> ${answer}`);
  } else {
    // Interactive input
    process.stdout.write(`  ${c.cream}> ${c.reset}`);
    answer = await readLine();
  }

  if (!answer || answer.trim() === "") {
    gentle("何も書かなくても大丈夫です。また来てください。");
    console.log();
    return;
  }

  // Mood selection
  console.log();
  gentle("今の気持ちに近いものは？（番号を入力、スキップはEnter）");
  console.log();
  for (let i = 0; i < MOODS.length; i++) {
    const m = MOODS[i];
    console.log(`  ${c.dim}${i + 1}.${c.reset} ${m.emoji} ${c.sand}${m.label}${c.reset}`);
  }
  console.log();

  process.stdout.write(`  ${c.cream}> ${c.reset}`);
  const moodInput = await readLine();
  const moodIdx = parseInt(moodInput) - 1;
  const mood = moodIdx >= 0 && moodIdx < MOODS.length ? MOODS[moodIdx].key : "";

  // Save entry
  const entry = addEntry(trip.id, q.text, answer.trim(), mood);

  console.log();
  divider();
  const moodInfo = mood ? getMoodByKey(mood) : null;
  gentle(`記録しました。${moodInfo ? ` ${moodInfo.emoji}` : ""}`);

  // Gentle encouragement
  const total = getEntryCount(trip.id);
  if (total === 1) {
    gentle("最初の一歩です。旅の記録が始まりました。");
  } else if (total === 5) {
    gentle("5通目。あなたの旅が少しずつ形になっています。");
  } else if (total === 10) {
    gentle("10通。この旅はきっと特別なものになりますね。");
  }
  console.log();
}

function cmdRead() {
  const trip = getActiveTrip();
  if (!trip) {
    // Try to show the most recent trip
    const trips = getAllTrips();
    if (trips.length === 0) {
      banner();
      error("まだ旅の記録がありません");
      console.log();
      return;
    }
    showTripEntries(trips[0]);
    return;
  }

  showTripEntries(trip);
}

function showTripEntries(trip: Trip) {
  const entries = getEntriesByTrip(trip.id);

  banner();
  header(`${trip.destination}の記録`, c.amber);
  info("期間", `${formatDate(trip.startedAt)} 〜 ${trip.endedAt ? formatDate(trip.endedAt) : "旅の途中"}`);
  info("記録数", `${entries.length}通`);

  if (entries.length === 0) {
    console.log();
    gentle("まだ記録がありません。");
    gentle(`書き始めるには: ${c.sky}bun run src/cli.ts write${c.reset}`);
    console.log();
    return;
  }

  for (const entry of entries) {
    console.log();
    const mood = entry.mood ? getMoodByKey(entry.mood) : null;
    const moodStr = mood ? ` ${mood.emoji}` : "";
    const time = formatDate(entry.createdAt);

    console.log(`  ${c.dim}${time}${moodStr}${c.reset}`);
    console.log(`  ${c.rose}${c.italic}${entry.question}${c.reset}`);
    quote(entry.answer);
  }

  console.log();
  divider();
  console.log();
}

function cmdLetter() {
  const trip = getActiveTrip() || getAllTrips()[0];
  if (!trip) {
    banner();
    error("まだ旅の記録がありません");
    console.log();
    return;
  }

  const entries = getEntriesByTrip(trip.id);

  banner();
  console.log();
  console.log(generateLetter(trip, entries));
  console.log();
}

function cmdEnd() {
  const trip = getActiveTrip();
  if (!trip) {
    banner();
    error("現在進行中の旅がありません");
    console.log();
    return;
  }

  const entries = getEntriesByTrip(trip.id);
  const ended = endTrip();

  banner();
  header("旅の終わり", c.lavender);

  gentle(`${trip.destination}への旅が終わりました。`);
  console.log();

  const days = getTripDays(trip);
  info("行き先", trip.destination);
  info("日数", `${days}日間`);
  info("記録数", `${entries.length}通`);

  if (entries.length > 0) {
    console.log();
    gentle("旅の手紙を読むには:");
    gentle(`  ${c.sky}bun run src/cli.ts letter${c.reset}`);
    console.log();
    gentle("Markdownでエクスポートするには:");
    gentle(`  ${c.sky}bun run src/cli.ts export${c.reset}`);
  }

  console.log();
  gentle("お疲れさまでした。良い旅でしたね。");
  console.log();
}

function cmdTrips() {
  const trips = getAllTrips();

  banner();
  header("旅の一覧", c.amber);

  if (trips.length === 0) {
    gentle("まだ旅の記録がありません。");
    gentle(`旅を始めるには: ${c.sky}bun run src/cli.ts start <行き先>${c.reset}`);
    console.log();
    return;
  }

  for (const trip of trips) {
    const entries = getEntryCount(trip.id);
    const days = getTripDays(trip);
    const active = trip.isActive ? ` ${c.mint}[進行中]${c.reset}` : "";

    console.log(`  ${c.amber}#${trip.id}${c.reset} ${c.bold}${trip.destination}${c.reset}${active}`);
    console.log(`     ${c.dim}${formatDate(trip.startedAt)} 〜 ${trip.endedAt ? formatDate(trip.endedAt) : "..."} ・ ${days}日間 ・ ${entries}通${c.reset}`);
    console.log();
  }
}

function cmdStats() {
  const trip = getActiveTrip() || getAllTrips()[0];
  if (!trip) {
    banner();
    error("まだ旅の記録がありません");
    console.log();
    return;
  }

  const entries = getEntriesByTrip(trip.id);
  const days = getTripDays(trip);
  const moodCounts = getMoodCounts(trip.id);

  banner();
  header(`${trip.destination}の統計`, c.sage);

  info("日数", `${days}日間`);
  info("記録数", `${entries.length}通`);
  info("1日あたり", `${(entries.length / days).toFixed(1)}通`);

  if (Object.keys(moodCounts).length > 0) {
    console.log();
    gentle("気持ちの記録:");
    for (const [key, count] of Object.entries(moodCounts).sort((a, b) => b[1] - a[1])) {
      const mood = getMoodByKey(key);
      if (mood) {
        const bar = "█".repeat(Math.min(count, 20));
        console.log(`  ${mood.emoji} ${c.sand}${mood.label.padEnd(8)}${c.reset} ${c.amber}${bar}${c.reset} ${c.dim}${count}${c.reset}`);
      }
    }
  }

  console.log();
}

function cmdExport() {
  const trip = getActiveTrip() || getAllTrips()[0];
  if (!trip) {
    banner();
    error("まだ旅の記録がありません");
    console.log();
    return;
  }

  const entries = getEntriesByTrip(trip.id);
  const md = exportMarkdown(trip, entries);
  const filename = `tabibumi-${trip.destination}-${trip.id}.md`;

  writeFileSync(filename, md, "utf-8");

  banner();
  header("エクスポート完了", c.sage);
  info("ファイル", filename);
  info("記録数", `${entries.length}通`);
  console.log();
  gentle(`${c.sky}cat ${filename}${c.reset} で読めます。`);
  console.log();
}

function cmdHelp() {
  banner();

  const lines = [
    `${c.bold}使い方${c.reset}`,
    "",
    `${c.sky}start${c.reset} <行き先>  旅を始める`,
    `${c.sky}write${c.reset}          気持ちを記録`,
    `${c.sky}read${c.reset}           記録を読む`,
    `${c.sky}letter${c.reset}         旅の手紙を生成`,
    `${c.sky}end${c.reset}            旅を終える`,
    `${c.sky}trips${c.reset}          旅の一覧`,
    `${c.sky}stats${c.reset}          旅の統計`,
    `${c.sky}export${c.reset}         Markdownエクスポート`,
    `${c.sky}help${c.reset}           このヘルプ`,
  ];

  box("旅文 コマンド", lines, c.amber);
  console.log();
  gentle("旅の途中で感じたことを、そっと書き留める。");
  gentle("それが、未来のあなたへの贈り物になります。");
  console.log();
}

// ===== Input Helper =====
function readLine(): Promise<string> {
  return new Promise((resolve) => {
    let input = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.resume();
    process.stdin.once("data", (data: string) => {
      input = data.toString().trim();
      process.stdin.pause();
      resolve(input);
    });
  });
}
