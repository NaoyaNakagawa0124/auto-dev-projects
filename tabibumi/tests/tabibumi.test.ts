/**
 * 旅文 テストスイート
 * Run: bun test
 */
import { describe, test, expect, beforeEach, afterAll } from "bun:test";
import { Database } from "bun:sqlite";
import { join } from "path";
import { tmpdir } from "os";
import { unlinkSync, existsSync } from "fs";

import {
  openDb, closeDb,
  startTrip, endTrip, getActiveTrip, getAllTrips,
  addEntry, getEntriesByTrip, getEntryCount, getTripDays, getMoodCounts,
  type Trip, type Entry,
} from "../src/db";

import {
  QUESTIONS, MOODS, pickQuestion, getMoodByKey, getTimeOfDay, getTripPhase,
} from "../src/questions";

import {
  generateLetter, exportMarkdown,
} from "../src/letter";

// Use temp database for tests — unique per test to avoid WAL conflicts
let testDbCounter = 0;

beforeEach(() => {
  closeDb();
  testDbCounter++;
  const dbPath = join(tmpdir(), `tabibumi-test-${Date.now()}-${testDbCounter}.db`);
  openDb(dbPath);
});

afterAll(() => {
  closeDb();
});

// ===== Database Tests =====
describe("データベース", () => {
  test("旅の開始", () => {
    const trip = startTrip("パリ");
    expect(trip.id).toBeGreaterThan(0);
    expect(trip.destination).toBe("パリ");
    expect(trip.isActive).toBe(1);
    expect(trip.endedAt).toBeNull();
  });

  test("アクティブな旅の取得", () => {
    startTrip("ロンドン");
    const active = getActiveTrip();
    expect(active).not.toBeNull();
    expect(active!.destination).toBe("ロンドン");
  });

  test("旅の終了", () => {
    startTrip("東京");
    const ended = endTrip();
    expect(ended).not.toBeNull();
    expect(ended!.isActive).toBe(0);
    expect(ended!.endedAt).not.toBeNull();
    expect(getActiveTrip()).toBeNull();
  });

  test("新しい旅を始めると前の旅が終了", () => {
    startTrip("京都");
    startTrip("大阪");
    const trips = getAllTrips();
    const active = trips.filter(t => t.isActive === 1);
    expect(active.length).toBe(1);
    expect(active[0].destination).toBe("大阪");
  });

  test("全旅一覧", () => {
    startTrip("札幌");
    endTrip();
    startTrip("福岡");
    const trips = getAllTrips();
    expect(trips.length).toBe(2);
  });

  test("記録の追加", () => {
    const trip = startTrip("バルセロナ");
    const entry = addEntry(trip.id, "気持ちは？", "最高です", "joyful", "市場");
    expect(entry.id).toBeGreaterThan(0);
    expect(entry.tripId).toBe(trip.id);
    expect(entry.question).toBe("気持ちは？");
    expect(entry.answer).toBe("最高です");
    expect(entry.mood).toBe("joyful");
    expect(entry.location).toBe("市場");
  });

  test("旅の記録を取得", () => {
    const trip = startTrip("ベルリン");
    addEntry(trip.id, "Q1", "A1", "peaceful");
    addEntry(trip.id, "Q2", "A2", "excited");
    const entries = getEntriesByTrip(trip.id);
    expect(entries.length).toBe(2);
    expect(entries[0].answer).toBe("A1");
    expect(entries[1].answer).toBe("A2");
  });

  test("記録数", () => {
    const trip = startTrip("ウィーン");
    expect(getEntryCount(trip.id)).toBe(0);
    addEntry(trip.id, "Q", "A");
    addEntry(trip.id, "Q", "A");
    expect(getEntryCount(trip.id)).toBe(2);
  });

  test("旅の日数", () => {
    const trip = startTrip("プラハ");
    const days = getTripDays(trip);
    expect(days).toBeGreaterThanOrEqual(1);
  });

  test("気分の集計", () => {
    const trip = startTrip("リスボン");
    addEntry(trip.id, "Q1", "A1", "joyful");
    addEntry(trip.id, "Q2", "A2", "joyful");
    addEntry(trip.id, "Q3", "A3", "peaceful");
    const moods = getMoodCounts(trip.id);
    expect(moods["joyful"]).toBe(2);
    expect(moods["peaceful"]).toBe(1);
  });

  test("空の気分集計", () => {
    const trip = startTrip("ローマ");
    addEntry(trip.id, "Q", "A", "");
    const moods = getMoodCounts(trip.id);
    expect(Object.keys(moods).length).toBe(0);
  });

  test("旅がない時のendTrip", () => {
    const result = endTrip();
    expect(result).toBeNull();
  });

  test("旅がない時のgetActiveTrip", () => {
    expect(getActiveTrip()).toBeNull();
  });
});

// ===== Question Engine Tests =====
describe("質問エンジン", () => {
  test("質問が42個以上ある", () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(42);
  });

  test("全質問に必須フィールドあり", () => {
    for (const q of QUESTIONS) {
      expect(q.text.length).toBeGreaterThan(0);
      expect(["sensory", "emotion", "social", "meaning", "nostalgia", "discovery"]).toContain(q.category);
      expect(["start", "middle", "end", "any"]).toContain(q.phase);
    }
  });

  test("各フェーズに質問がある", () => {
    expect(QUESTIONS.filter(q => q.phase === "start").length).toBeGreaterThan(0);
    expect(QUESTIONS.filter(q => q.phase === "middle").length).toBeGreaterThan(0);
    expect(QUESTIONS.filter(q => q.phase === "end").length).toBeGreaterThan(0);
    expect(QUESTIONS.filter(q => q.phase === "any").length).toBeGreaterThan(0);
  });

  test("各カテゴリに質問がある", () => {
    for (const cat of ["sensory", "emotion", "social", "meaning", "nostalgia", "discovery"]) {
      expect(QUESTIONS.filter(q => q.category === cat).length).toBeGreaterThan(0);
    }
  });

  test("時間帯つき質問がある", () => {
    expect(QUESTIONS.filter(q => q.timeOfDay === "morning").length).toBeGreaterThan(0);
    expect(QUESTIONS.filter(q => q.timeOfDay === "night").length).toBeGreaterThan(0);
  });

  test("気分が10個ある", () => {
    expect(MOODS.length).toBe(10);
  });

  test("気分に必須フィールドあり", () => {
    for (const m of MOODS) {
      expect(m.key.length).toBeGreaterThan(0);
      expect(m.label.length).toBeGreaterThan(0);
      expect(m.emoji.length).toBeGreaterThan(0);
    }
  });

  test("getMoodByKey: 存在するキー", () => {
    const mood = getMoodByKey("joyful");
    expect(mood).not.toBeNull();
    expect(mood!.label).toBe("嬉しい");
  });

  test("getMoodByKey: 存在しないキー", () => {
    expect(getMoodByKey("xxx")).toBeNull();
  });

  test("getTimeOfDay: 有効な値を返す", () => {
    const tod = getTimeOfDay();
    expect(["morning", "afternoon", "evening", "night"]).toContain(tod);
  });

  test("getTripPhase: 開始", () => {
    expect(getTripPhase(0, 1)).toBe("start");
    expect(getTripPhase(1, 1)).toBe("start");
    expect(getTripPhase(2, 1)).toBe("start");
  });

  test("getTripPhase: 途中", () => {
    expect(getTripPhase(3, 2)).toBe("middle");
  });

  test("getTripPhase: 終わり", () => {
    expect(getTripPhase(10, 3)).toBe("end");
  });

  test("pickQuestion: 質問を返す", () => {
    const q = pickQuestion(0, 1);
    expect(q.text.length).toBeGreaterThan(0);
  });

  test("pickQuestion: 使用済みを除外", () => {
    const usedAll = QUESTIONS.filter(q => q.phase === "start" || q.phase === "any").map(q => q.text);
    const q = pickQuestion(0, 1, usedAll);
    // Should still return something (fallback)
    expect(q.text.length).toBeGreaterThan(0);
  });

  test("pickQuestion: 異なるフェーズで異なる候補", () => {
    const startQ = pickQuestion(0, 1);
    // Start phase should include start or any
    expect(["start", "any"]).toContain(startQ.phase);
  });
});

// ===== Letter Generator Tests =====
describe("手紙生成", () => {
  test("空のエントリーでメッセージを返す", () => {
    const trip: Trip = { id: 1, destination: "テスト", startedAt: "2026-04-19 10:00:00", endedAt: null, isActive: 1 };
    const letter = generateLetter(trip, []);
    expect(letter).toContain("まだ記録がありません");
  });

  test("エントリーありで手紙を生成", () => {
    const trip: Trip = { id: 1, destination: "パリ", startedAt: "2026-04-19 10:00:00", endedAt: null, isActive: 1 };
    const entries: Entry[] = [
      { id: 1, tripId: 1, question: "気持ちは？", answer: "嬉しいです", mood: "joyful", location: "", createdAt: "2026-04-19 12:00:00" },
    ];
    const letter = generateLetter(trip, entries);
    expect(letter).toContain("パリ");
    expect(letter).toContain("未来の私へ");
    expect(letter).toContain("嬉しいです");
    expect(letter).toContain("旅文");
  });

  test("複数エントリーで手紙を生成", () => {
    const trip: Trip = { id: 1, destination: "京都", startedAt: "2026-04-19 10:00:00", endedAt: "2026-04-21 18:00:00", isActive: 0 };
    const entries: Entry[] = [
      { id: 1, tripId: 1, question: "Q1", answer: "A1", mood: "peaceful", location: "", createdAt: "2026-04-19 12:00:00" },
      { id: 2, tripId: 1, question: "Q2", answer: "A2", mood: "nostalgic", location: "", createdAt: "2026-04-20 14:00:00" },
      { id: 3, tripId: 1, question: "Q3", answer: "A3", mood: "peaceful", location: "", createdAt: "2026-04-21 10:00:00" },
    ];
    const letter = generateLetter(trip, entries);
    expect(letter).toContain("京都");
    expect(letter).toContain("A1");
    expect(letter).toContain("A2");
    expect(letter).toContain("A3");
    expect(letter).toContain("穏やか");
  });

  test("Markdownエクスポート", () => {
    const trip: Trip = { id: 1, destination: "ロンドン", startedAt: "2026-04-19 10:00:00", endedAt: null, isActive: 1 };
    const entries: Entry[] = [
      { id: 1, tripId: 1, question: "何を見た？", answer: "ビッグベン", mood: "excited", location: "", createdAt: "2026-04-19 15:00:00" },
    ];
    const md = exportMarkdown(trip, entries);
    expect(md).toContain("# ロンドンの旅文");
    expect(md).toContain("ビッグベン");
    expect(md).toContain("何を見た？");
    expect(md).toContain("わくわく");
  });

  test("気分サマリー", () => {
    const trip: Trip = { id: 1, destination: "テスト", startedAt: "2026-04-19 10:00:00", endedAt: null, isActive: 1 };
    const entries: Entry[] = [
      { id: 1, tripId: 1, question: "Q", answer: "A", mood: "joyful", location: "", createdAt: "2026-04-19 10:00:00" },
      { id: 2, tripId: 1, question: "Q", answer: "A", mood: "joyful", location: "", createdAt: "2026-04-19 11:00:00" },
      { id: 3, tripId: 1, question: "Q", answer: "A", mood: "peaceful", location: "", createdAt: "2026-04-19 12:00:00" },
    ];
    const letter = generateLetter(trip, entries);
    expect(letter).toContain("嬉しい");
  });
});

// ===== Data Integrity =====
describe("データ整合性", () => {
  test("全質問がユニーク", () => {
    const texts = QUESTIONS.map(q => q.text);
    const unique = new Set(texts);
    expect(unique.size).toBe(texts.length);
  });

  test("全気分キーがユニーク", () => {
    const keys = MOODS.map(m => m.key);
    const unique = new Set(keys);
    expect(unique.size).toBe(keys.length);
  });

  test("全質問が日本語", () => {
    for (const q of QUESTIONS) {
      // Check for at least one Japanese character
      expect(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(q.text)).toBe(true);
    }
  });

  test("全気分ラベルが日本語", () => {
    for (const m of MOODS) {
      expect(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(m.label)).toBe(true);
    }
  });
});
