#!/usr/bin/env node
// tests/run.js — Test suite for Netamemo (no Chrome APIs required)

// --- Mock chrome.storage.local ---
const storage = {};
const chromeStorageMock = {
  get(keys, cb) {
    const result = {};
    for (const key of keys) {
      if (storage[key] !== undefined) result[key] = JSON.parse(JSON.stringify(storage[key]));
    }
    cb(result);
  },
  set(data, cb) {
    for (const [key, val] of Object.entries(data)) {
      storage[key] = JSON.parse(JSON.stringify(val));
    }
    if (cb) cb();
  },
  clear() {
    for (const key of Object.keys(storage)) delete storage[key];
  },
};

globalThis.chrome = {
  storage: { local: chromeStorageMock },
  runtime: { lastError: null },
};

// Polyfill crypto.randomUUID for Node < 19
if (!globalThis.crypto) {
  globalThis.crypto = require("crypto");
}

// --- Test framework ---
let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, message) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message || "assertEqual"}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertDeepEqual(actual, expected, message) {
  const a = JSON.stringify(actual);
  const b = JSON.stringify(expected);
  if (a !== b) throw new Error(`${message || "assertDeepEqual"}: expected ${b}, got ${a}`);
}

async function test(name, fn) {
  chromeStorageMock.clear();
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, error: err.message });
    console.log(`  ✗ ${name}`);
    console.log(`    ${err.message}`);
  }
}

// --- Import modules ---
// We need to use dynamic import for ES modules
async function runAll() {
  const { CATEGORIES, CATEGORY_KEYS, SORT_OPTIONS, RATING_LABELS, DEFAULT_SETTINGS, generateId, createIdea } = await import("../shared/data.js");
  const { getIdeas, saveIdea, updateIdea, deleteIdea, getSettings, saveSettings, setIdeas } = await import("../shared/storage.js");
  const { exportBoard, importBoard, mergeBoards } = await import("../shared/sharing.js");

  console.log("\n=== ネタメモ テストスイート ===\n");

  // --- Category Tests ---
  console.log("カテゴリデータ:");

  await test("全カテゴリが定義されている", () => {
    assertEqual(CATEGORY_KEYS.length, 6, "カテゴリ数");
    assert(CATEGORY_KEYS.includes("tutorial"), "tutorial");
    assert(CATEGORY_KEYS.includes("review"), "review");
    assert(CATEGORY_KEYS.includes("vlog"), "vlog");
    assert(CATEGORY_KEYS.includes("short"), "short");
    assert(CATEGORY_KEYS.includes("collab"), "collab");
    assert(CATEGORY_KEYS.includes("other"), "other");
  });

  await test("各カテゴリにlabel, emoji, colorがある", () => {
    for (const key of CATEGORY_KEYS) {
      const cat = CATEGORIES[key];
      assert(cat.label, `${key} label`);
      assert(cat.emoji, `${key} emoji`);
      assert(cat.color && cat.color.startsWith("#"), `${key} color`);
    }
  });

  await test("カテゴリラベルが日本語", () => {
    assert(CATEGORIES.tutorial.label === "チュートリアル", "tutorial label");
    assert(CATEGORIES.review.label === "レビュー", "review label");
    assert(CATEGORIES.other.label === "その他", "other label");
  });

  await test("ソートオプションが日本語", () => {
    assert(SORT_OPTIONS.newest === "新しい順", "newest");
    assert(SORT_OPTIONS.potential === "ポテンシャル高い順", "potential");
    assert(SORT_OPTIONS.votes === "投票多い順", "votes");
    assert(SORT_OPTIONS.trend === "トレンド順", "trend");
  });

  await test("レーティングラベルが日本語", () => {
    assert(RATING_LABELS.potential.label === "ポテンシャル", "potential label");
    assert(RATING_LABELS.effort.label === "工数", "effort label");
    assert(RATING_LABELS.trend.label === "トレンド度", "trend label");
  });

  // --- ID Generation ---
  console.log("\nID生成:");

  await test("generateIdがユニークなIDを生成", () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) ids.add(generateId());
    assertEqual(ids.size, 100, "100 unique IDs");
  });

  // --- Idea Creation ---
  console.log("\nアイデア作成:");

  await test("createIdeaがデフォルト値で作成", () => {
    const idea = createIdea();
    assert(idea.id, "has id");
    assertEqual(idea.title, "", "empty title");
    assertEqual(idea.category, "other", "default category");
    assertEqual(idea.source, "manual", "default source");
    assertEqual(idea.ratings.potential, 3, "default potential");
    assertEqual(idea.ratings.effort, 3, "default effort");
    assertEqual(idea.ratings.trend, 3, "default trend");
    assertDeepEqual(idea.votes, { up: [], down: [] }, "empty votes");
    assert(idea.createdAt, "has createdAt");
  });

  await test("createIdeaがオーバーライドを適用", () => {
    const idea = createIdea({ title: "テスト", category: "tutorial", source: "clip" });
    assertEqual(idea.title, "テスト", "title override");
    assertEqual(idea.category, "tutorial", "category override");
    assertEqual(idea.source, "clip", "source override");
  });

  // --- Storage CRUD ---
  console.log("\nストレージCRUD:");

  await test("空のアイデアリストを取得", async () => {
    const ideas = await getIdeas();
    assertDeepEqual(ideas, [], "empty list");
  });

  await test("アイデアを保存", async () => {
    const idea = createIdea({ title: "テストアイデア1" });
    await saveIdea(idea);
    const ideas = await getIdeas();
    assertEqual(ideas.length, 1, "1 idea");
    assertEqual(ideas[0].title, "テストアイデア1", "title");
  });

  await test("複数アイデアを保存", async () => {
    await saveIdea(createIdea({ title: "A" }));
    await saveIdea(createIdea({ title: "B" }));
    await saveIdea(createIdea({ title: "C" }));
    const ideas = await getIdeas();
    assertEqual(ideas.length, 3, "3 ideas");
  });

  await test("アイデアを更新", async () => {
    const idea = createIdea({ title: "元のタイトル" });
    await saveIdea(idea);
    await updateIdea(idea.id, { title: "更新後のタイトル" });
    const ideas = await getIdeas();
    assertEqual(ideas[0].title, "更新後のタイトル", "updated title");
  });

  await test("存在しないアイデアの更新でエラー", async () => {
    try {
      await updateIdea("nonexistent-id", { title: "test" });
      assert(false, "should have thrown");
    } catch (e) {
      assert(e.message.includes("見つかりません"), "Japanese error message");
    }
  });

  await test("アイデアを削除", async () => {
    const idea = createIdea({ title: "削除対象" });
    await saveIdea(idea);
    const before = await getIdeas();
    assertEqual(before.length, 1, "1 before");
    await deleteIdea(idea.id);
    const after = await getIdeas();
    assertEqual(after.length, 0, "0 after");
  });

  await test("存在しないアイデアの削除でエラー", async () => {
    try {
      await deleteIdea("nonexistent-id");
      assert(false, "should have thrown");
    } catch (e) {
      assert(e.message.includes("見つかりません"), "Japanese error message");
    }
  });

  await test("setIdeasで一括設定", async () => {
    const ideas = [createIdea({ title: "X" }), createIdea({ title: "Y" })];
    await setIdeas(ideas);
    const result = await getIdeas();
    assertEqual(result.length, 2, "2 ideas");
  });

  // --- Settings ---
  console.log("\n設定:");

  await test("デフォルト設定を取得", async () => {
    const settings = await getSettings();
    assertEqual(settings.username, "", "empty username");
  });

  await test("設定を保存", async () => {
    await saveSettings({ username: "テストユーザー" });
    const settings = await getSettings();
    assertEqual(settings.username, "テストユーザー", "saved username");
  });

  await test("設定を部分更新", async () => {
    await saveSettings({ username: "ユーザーA" });
    await saveSettings({ username: "ユーザーB" });
    const settings = await getSettings();
    assertEqual(settings.username, "ユーザーB", "updated username");
  });

  // --- Sharing: Export ---
  console.log("\n共有（エクスポート）:");

  await test("空のボードをエクスポート", () => {
    const code = exportBoard([], "testuser");
    assert(typeof code === "string", "is string");
    assert(code.length > 0, "non-empty");
  });

  await test("エクスポートコードが有効なBase64", () => {
    const ideas = [createIdea({ title: "テスト" })];
    const code = exportBoard(ideas, "testuser");
    // Should be valid base64
    const decoded = atob(code);
    assert(decoded.length > 0, "decodes");
  });

  await test("エクスポート時に投票がリセットされる", () => {
    const idea = createIdea({ title: "テスト", votes: { up: ["a", "b"], down: ["c"] } });
    const code = exportBoard([idea], "testuser");
    const result = importBoard(code);
    assert(result.success, "import success");
    assertDeepEqual(result.ideas[0].votes, { up: [], down: [] }, "votes reset");
  });

  await test("エクスポートにユーザー名が含まれる", () => {
    const code = exportBoard([], "マイユーザー");
    const result = importBoard(code);
    assertEqual(result.exportedBy, "マイユーザー", "username in export");
  });

  // --- Sharing: Import ---
  console.log("\n共有（インポート）:");

  await test("エクスポート→インポートのラウンドトリップ", () => {
    const original = [
      createIdea({ title: "アイデア1", category: "tutorial" }),
      createIdea({ title: "アイデア2", category: "vlog" }),
    ];
    const code = exportBoard(original, "testuser");
    const result = importBoard(code);
    assert(result.success, "success");
    assertEqual(result.count, 2, "count");
    assertEqual(result.ideas[0].title, "アイデア1", "idea 1 title");
    assertEqual(result.ideas[1].title, "アイデア2", "idea 2 title");
  });

  await test("空の共有コードでエラー", () => {
    const result = importBoard("");
    assert(!result.success, "not success");
    assert(result.error.includes("空"), "Japanese error");
  });

  await test("nullの共有コードでエラー", () => {
    const result = importBoard(null);
    assert(!result.success, "not success");
  });

  await test("無効なBase64でエラー", () => {
    const result = importBoard("!!!invalid!!!");
    assert(!result.success, "not success");
    assert(result.error.includes("無効"), "Japanese error");
  });

  await test("無効なJSONでエラー", () => {
    const result = importBoard(btoa("not json"));
    assert(!result.success, "not success");
  });

  await test("不正なバージョンでエラー", () => {
    const code = btoa(encodeURIComponent(JSON.stringify({ version: 99, ideas: [] })));
    const result = importBoard(code);
    assert(!result.success, "not success");
    assert(result.error.includes("サポートされていない"), "version error in Japanese");
  });

  await test("ideasが配列でない場合エラー", () => {
    const code = btoa(encodeURIComponent(JSON.stringify({ version: 1, ideas: "not array" })));
    const result = importBoard(code);
    assert(!result.success, "not success");
  });

  // --- Sharing: Merge ---
  console.log("\n共有（マージ）:");

  await test("空のボードにマージ", () => {
    const imported = [createIdea({ title: "新しいネタ", url: "https://example.com" })];
    const result = mergeBoards([], imported);
    assertEqual(result.added, 1, "1 added");
    assertEqual(result.skipped, 0, "0 skipped");
    assertEqual(result.ideas.length, 1, "1 total");
  });

  await test("重複URLをスキップ", () => {
    const existing = [createIdea({ title: "既存", url: "https://example.com" })];
    const imported = [createIdea({ title: "重複", url: "https://example.com" })];
    const result = mergeBoards(existing, imported, true);
    assertEqual(result.added, 0, "0 added");
    assertEqual(result.skipped, 1, "1 skipped");
    assertEqual(result.ideas.length, 1, "1 total (existing only)");
  });

  await test("重複を許可してマージ", () => {
    const existing = [createIdea({ title: "既存", url: "https://example.com" })];
    const imported = [createIdea({ title: "重複", url: "https://example.com" })];
    const result = mergeBoards(existing, imported, false);
    assertEqual(result.added, 1, "1 added");
    assertEqual(result.skipped, 0, "0 skipped");
    assertEqual(result.ideas.length, 2, "2 total");
  });

  await test("URL無しのアイデアは重複チェックしない", () => {
    const existing = [createIdea({ title: "既存", url: "" })];
    const imported = [createIdea({ title: "新規", url: "" })];
    const result = mergeBoards(existing, imported, true);
    assertEqual(result.added, 1, "1 added (no URL = no dup check)");
  });

  await test("マージ後のアイデアにsource: importが設定される", () => {
    const imported = [createIdea({ title: "共有ネタ" })];
    const result = mergeBoards([], imported);
    assertEqual(result.ideas[0].source, "import", "source is import");
  });

  await test("マージ後の投票がリセットされる", () => {
    const imported = [createIdea({ title: "test", votes: { up: ["a"], down: ["b"] } })];
    const result = mergeBoards([], imported);
    assertDeepEqual(result.ideas[0].votes, { up: [], down: [] }, "votes reset");
  });

  // --- Rating Validation ---
  console.log("\nレーティング:");

  await test("デフォルトレーティングは1-5の範囲", () => {
    const idea = createIdea();
    assert(idea.ratings.potential >= 1 && idea.ratings.potential <= 5, "potential in range");
    assert(idea.ratings.effort >= 1 && idea.ratings.effort <= 5, "effort in range");
    assert(idea.ratings.trend >= 1 && idea.ratings.trend <= 5, "trend in range");
  });

  await test("カスタムレーティングを設定可能", () => {
    const idea = createIdea({ ratings: { potential: 5, effort: 1, trend: 4 } });
    assertEqual(idea.ratings.potential, 5, "potential");
    assertEqual(idea.ratings.effort, 1, "effort");
    assertEqual(idea.ratings.trend, 4, "trend");
  });

  // --- Vote Counting ---
  console.log("\n投票:");

  await test("投票カウントが正しい", () => {
    const idea = createIdea({ votes: { up: ["a", "b", "c"], down: ["d"] } });
    assertEqual(idea.votes.up.length, 3, "3 up votes");
    assertEqual(idea.votes.down.length, 1, "1 down vote");
  });

  await test("空の投票", () => {
    const idea = createIdea();
    assertEqual(idea.votes.up.length, 0, "0 up");
    assertEqual(idea.votes.down.length, 0, "0 down");
  });

  await test("ネットスコア計算", () => {
    const idea = createIdea({ votes: { up: ["a", "b"], down: ["c", "d", "e"] } });
    const score = idea.votes.up.length - idea.votes.down.length;
    assertEqual(score, -1, "net score is -1");
  });

  // --- Search/Filter Logic ---
  console.log("\n検索・フィルタ:");

  await test("タイトルで検索", () => {
    const ideas = [
      createIdea({ title: "料理動画の作り方" }),
      createIdea({ title: "ゲーム実況のコツ" }),
      createIdea({ title: "料理レシピ紹介" }),
    ];
    const results = ideas.filter((i) => i.title.toLowerCase().includes("料理"));
    assertEqual(results.length, 2, "2 results for 料理");
  });

  await test("説明で検索", () => {
    const ideas = [
      createIdea({ title: "A", description: "トレンドに乗る方法" }),
      createIdea({ title: "B", description: "静かな動画" }),
    ];
    const results = ideas.filter((i) => i.description.includes("トレンド"));
    assertEqual(results.length, 1, "1 result for トレンド");
  });

  await test("カテゴリでフィルタ", () => {
    const ideas = [
      createIdea({ category: "tutorial" }),
      createIdea({ category: "vlog" }),
      createIdea({ category: "tutorial" }),
    ];
    const results = ideas.filter((i) => i.category === "tutorial");
    assertEqual(results.length, 2, "2 tutorials");
  });

  // --- Sorting ---
  console.log("\nソート:");

  await test("新しい順でソート", () => {
    const ideas = [
      createIdea({ title: "Old", createdAt: "2026-01-01T00:00:00Z" }),
      createIdea({ title: "New", createdAt: "2026-03-30T00:00:00Z" }),
    ];
    ideas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    assertEqual(ideas[0].title, "New", "newest first");
  });

  await test("ポテンシャル順でソート", () => {
    const ideas = [
      createIdea({ title: "Low", ratings: { potential: 1, effort: 3, trend: 3 } }),
      createIdea({ title: "High", ratings: { potential: 5, effort: 3, trend: 3 } }),
    ];
    ideas.sort((a, b) => b.ratings.potential - a.ratings.potential);
    assertEqual(ideas[0].title, "High", "highest potential first");
  });

  await test("投票数順でソート", () => {
    const ideas = [
      createIdea({ title: "Low", votes: { up: ["a"], down: ["b", "c"] } }),
      createIdea({ title: "High", votes: { up: ["a", "b", "c"], down: [] } }),
    ];
    ideas.sort((a, b) => {
      const sA = a.votes.up.length - a.votes.down.length;
      const sB = b.votes.up.length - b.votes.down.length;
      return sB - sA;
    });
    assertEqual(ideas[0].title, "High", "most votes first");
  });

  await test("トレンド順でソート", () => {
    const ideas = [
      createIdea({ title: "Low", ratings: { potential: 3, effort: 3, trend: 1 } }),
      createIdea({ title: "High", ratings: { potential: 3, effort: 3, trend: 5 } }),
    ];
    ideas.sort((a, b) => b.ratings.trend - a.ratings.trend);
    assertEqual(ideas[0].title, "High", "highest trend first");
  });

  // --- Edge Cases ---
  console.log("\nエッジケース:");

  await test("空のボードでエクスポート・インポート", () => {
    const code = exportBoard([], "user");
    const result = importBoard(code);
    assert(result.success, "success");
    assertEqual(result.count, 0, "0 ideas");
  });

  await test("大量のアイデア（100件）を保存・取得", async () => {
    const ideas = [];
    for (let i = 0; i < 100; i++) {
      ideas.push(createIdea({ title: `アイデア${i}` }));
    }
    await setIdeas(ideas);
    const result = await getIdeas();
    assertEqual(result.length, 100, "100 ideas stored");
  });

  await test("日本語テキストのエクスポート・インポート", () => {
    const idea = createIdea({
      title: "日本語のタイトル🎉",
      description: "絵文字を含む説明文：✨🔥💯",
      url: "https://example.com/日本語パス",
    });
    const code = exportBoard([idea], "日本語ユーザー");
    const result = importBoard(code);
    assert(result.success, "success");
    assertEqual(result.ideas[0].title, "日本語のタイトル🎉", "Japanese title preserved");
    assertEqual(result.ideas[0].description, "絵文字を含む説明文：✨🔥💯", "emoji preserved");
    assertEqual(result.exportedBy, "日本語ユーザー", "Japanese username preserved");
  });

  await test("特殊文字を含むアイデア", () => {
    const idea = createIdea({
      title: '<script>alert("xss")</script>',
      description: "引用符\"と'を含む",
    });
    const code = exportBoard([idea], "user");
    const result = importBoard(code);
    assert(result.success, "success");
    assertEqual(result.ideas[0].title, '<script>alert("xss")</script>', "special chars preserved");
  });

  await test("ホワイトスペースのみの共有コードでエラー", () => {
    const result = importBoard("   ");
    assert(!result.success, "not success");
  });

  await test("createIdeaのcreatedAtがISO形式", () => {
    const idea = createIdea();
    assert(idea.createdAt.includes("T"), "contains T separator");
    assert(!isNaN(Date.parse(idea.createdAt)), "valid date");
  });

  await test("マージで既存アイデアが変更されない", () => {
    const existing = [createIdea({ title: "既存", url: "https://a.com", votes: { up: ["x"], down: [] } })];
    const imported = [createIdea({ title: "新規", url: "https://b.com" })];
    const result = mergeBoards(existing, imported);
    assertEqual(result.ideas[0].title, "既存", "existing preserved");
    assertEqual(result.ideas[0].votes.up.length, 1, "existing votes preserved");
    assertEqual(result.ideas.length, 2, "both present");
  });

  // --- Summary ---
  console.log(`\n=== テスト結果 ===`);
  console.log(`合格: ${passed}`);
  console.log(`不合格: ${failed}`);

  if (failures.length > 0) {
    console.log("\n不合格テスト:");
    for (const f of failures) {
      console.log(`  - ${f.name}: ${f.error}`);
    }
  }

  console.log(`\n合計: ${passed + failed} テスト\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runAll().catch((err) => {
  console.error("テスト実行エラー:", err);
  process.exit(1);
});
