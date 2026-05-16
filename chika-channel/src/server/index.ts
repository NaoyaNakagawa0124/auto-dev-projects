/** Bun HTTP server: serves the static client + tiny in-memory leaderboard. */

import { serve } from "bun";
import { join } from "node:path";

const PUBLIC_DIR = join(import.meta.dir, "..", "..", "public");
const PORT = Number(process.env.PORT) || 5173;

interface LeaderboardEntry {
  name: string;
  subscribers: number;
  days: number;
  when: string;
}

const board: LeaderboardEntry[] = [];

function mime(ext: string): string {
  switch (ext) {
    case ".html": return "text/html; charset=utf-8";
    case ".js":   return "application/javascript; charset=utf-8";
    case ".ts":   return "application/javascript; charset=utf-8";
    case ".css":  return "text/css; charset=utf-8";
    case ".svg":  return "image/svg+xml";
    case ".json": return "application/json";
    case ".ico":  return "image/x-icon";
    default:      return "application/octet-stream";
  }
}

async function serveStatic(path: string): Promise<Response> {
  const file = Bun.file(path);
  if (!(await file.exists())) {
    return new Response("not found", { status: 404 });
  }
  const ext = path.slice(path.lastIndexOf("."));
  return new Response(file, { headers: { "Content-Type": mime(ext) } });
}

export const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  // API: leaderboard
  if (url.pathname === "/api/leaderboard") {
    if (req.method === "GET") {
      return new Response(JSON.stringify(board.slice(0, 10)), {
        headers: { "Content-Type": "application/json" },
      });
    }
    if (req.method === "POST") {
      try {
        const body = await req.json() as Partial<LeaderboardEntry>;
        const name = (body.name ?? "").toString().slice(0, 20).trim() || "名無し";
        const subscribers = Math.max(0, Math.floor(Number(body.subscribers) || 0));
        const days = Math.max(0, Math.floor(Number(body.days) || 0));
        if (subscribers === 0) {
          return new Response(JSON.stringify({ error: "no subscribers" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const entry: LeaderboardEntry = {
          name, subscribers, days, when: new Date().toISOString(),
        };
        board.push(entry);
        board.sort((a, b) => b.subscribers - a.subscribers);
        if (board.length > 100) board.length = 100;
        return new Response(JSON.stringify({ ok: true, rank: board.indexOf(entry) + 1 }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch {
        return new Response(JSON.stringify({ error: "bad json" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
    return new Response("method not allowed", { status: 405 });
  }

  // Static files
  let p = url.pathname === "/" ? "/index.html" : url.pathname;
  // Prevent path escapes
  if (p.includes("..")) return new Response("nope", { status: 400 });
  return serveStatic(join(PUBLIC_DIR, p));
};

if (import.meta.main) {
  const server = serve({ port: PORT, fetch: handler });
  console.log(`地下チャンネル: http://localhost:${server.port}`);
}
