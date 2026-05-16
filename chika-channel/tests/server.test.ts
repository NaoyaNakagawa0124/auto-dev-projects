import { expect, test } from "bun:test";
import { handler } from "../src/server/index.ts";

async function call(method: string, path: string, body?: any): Promise<Response> {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { "Content-Type": "application/json" };
  }
  return await handler(new Request(`http://localhost${path}`, init));
}

test("GET / serves index.html", async () => {
  const res = await call("GET", "/");
  expect(res.status).toBe(200);
  const text = await res.text();
  expect(text).toContain("地下チャンネル");
});

test("GET /style.css serves css", async () => {
  const res = await call("GET", "/style.css");
  expect(res.status).toBe(200);
  expect(res.headers.get("Content-Type") ?? "").toContain("text/css");
});

test("GET /api/leaderboard returns array", async () => {
  const res = await call("GET", "/api/leaderboard");
  expect(res.status).toBe(200);
  const data = await res.json();
  expect(Array.isArray(data)).toBe(true);
});

test("POST /api/leaderboard accepts a score", async () => {
  const res = await call("POST", "/api/leaderboard", {
    name: "テスト", subscribers: 5432, days: 42,
  });
  expect(res.status).toBe(200);
  const data = await res.json();
  expect(data.ok).toBe(true);
});

test("POST /api/leaderboard rejects zero subs", async () => {
  const res = await call("POST", "/api/leaderboard", {
    name: "x", subscribers: 0, days: 1,
  });
  expect(res.status).toBe(400);
});

test("GET unknown path returns 404", async () => {
  const res = await call("GET", "/no-such-file");
  expect(res.status).toBe(404);
});

test("path traversal is rejected (URL normalization + .. guard)", async () => {
  // The URL parser normalizes /../ → / so this just hits index.html (200) or 404.
  // What matters is that we do NOT serve files outside public/.
  const res = await call("GET", "/../package.json");
  // After URL normalization the pathname becomes "/package.json", which isn't in
  // public/, so the server returns 404. That's the security guarantee we need.
  expect([400, 404]).toContain(res.status);
});
