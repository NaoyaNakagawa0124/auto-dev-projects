#!/usr/bin/env node
// 夜更けニュース — CLI entry point.

import { argv, exit, stdout } from "node:process";

const args = argv.slice(2);

const HELP = `
夜更けニュース  (yofuke-news)
深夜 の ターミナル で 5 件 の indie ゲーム ニュース を カード で 出します。

USAGE:
  yofuke-news [options]

OPTIONS:
  -a, --all            全 12 件 を 出します (デフォルト は 5 件)
      --no-color       色 を 無効化 します
  -h, --help           この メッセージ を 表示 します
  -v, --version        バージョン を 表示 します
`.trim();

function parseArgs(input) {
  const opts = { count: 5, color: true, help: false, version: false };
  for (const a of input) {
    if (a === "-a" || a === "--all")      opts.count = 12;
    else if (a === "--no-color")          opts.color = false;
    else if (a === "-h" || a === "--help") opts.help = true;
    else if (a === "-v" || a === "--version") opts.version = true;
    else {
      stdout.write(`不明 な 引数: ${a}\n\n${HELP}\n`);
      exit(2);
    }
  }
  return opts;
}

async function main() {
  const opts = parseArgs(args);
  if (opts.help) {
    stdout.write(HELP + "\n");
    return;
  }
  if (opts.version) {
    // Read package.json once to print version.
    const { readFileSync } = await import("node:fs");
    const { fileURLToPath } = await import("node:url");
    const { dirname, resolve } = await import("node:path");
    const here = dirname(fileURLToPath(import.meta.url));
    const pkg = JSON.parse(readFileSync(resolve(here, "..", "package.json"), "utf-8"));
    stdout.write(pkg.version + "\n");
    return;
  }

  if (!opts.color) process.env.FORCE_COLOR = "0";

  // Dynamically import after FORCE_COLOR so chalk picks it up.
  const { render } = await import("./render.js");
  const { pickNewsForNow } = await import("./clock.js");

  const now = new Date();
  const items = pickNewsForNow(now, opts.count);
  stdout.write(render(now, items) + "\n");
}

main().catch((err) => {
  stdout.write(`エラー: ${err && err.message || err}\n`);
  exit(1);
});
