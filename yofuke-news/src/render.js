// Render news items as ASCII cards. The card box uses a fixed inner width
// computed from the widest cell so the right border lines up under TUIs.

import chalk from "chalk";

import { sleepHoursTraded, breakfastsLost, commentsToTell, sleepFactor } from "./jokes.js";
import { formatStamp, tierFor } from "./clock.js";


// Width of the visual character measured naively — JIS hiragana/kanji count as 2.
function visualWidth(str) {
  let w = 0;
  for (const ch of str) {
    const code = ch.codePointAt(0);
    // Rough CJK + fullwidth check (kana, kanji, fullwidth punctuation, '✓', '─', etc).
    if (code === undefined) continue;
    if (code >= 0x3000 && code <= 0x9fff) w += 2;
    else if (code >= 0xff00 && code <= 0xffef) w += 2;
    else if (code >= 0x4e00 && code <= 0x9fff) w += 2;
    else w += 1;
  }
  return w;
}

const CARD_WIDTH = 62;   // inner width (characters between │ and │)


function padToVisualWidth(text, width) {
  const used = visualWidth(text);
  if (used === width) return text;
  if (used < width)   return text + " ".repeat(width - used);
  // Visible (printable) width too large — truncate to fit, plus ellipsis "…".
  // We strip from the end character-by-character until visual width fits.
  let out = "";
  let acc = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0) || 0;
    const cw = (code >= 0x3000 && code <= 0x9fff) || (code >= 0xff00 && code <= 0xffef) || (code >= 0x4e00 && code <= 0x9fff)
      ? 2 : 1;
    if (acc + cw > width - 1) break;
    out += ch;
    acc += cw;
  }
  return out + "…";
}


function line(content = "") {
  return `│  ${padToVisualWidth(content, CARD_WIDTH - 3)}│`;
}


export function formatHeader(date) {
  const rule = chalk.dim.gray("─".repeat(CARD_WIDTH + 2));
  const tier = tierFor(date.getHours());
  const tierJp = ({ evening: "夜の入口", deep: "深夜", predawn: "未明", day: "日中" })[tier];
  const stamp = formatStamp(date);
  return [
    rule,
    `${chalk.cyan(" ✦ ")} ${chalk.cyanBright("INDIE  RELEASES")}  ${chalk.dim(`(${stamp}, ${tierJp})`)}`,
    rule,
  ].join("\n");
}


function priceLabel(price) {
  return price === 0 ? "無料" : `¥${price.toLocaleString("ja-JP")}`;
}


function releaseTag(kind) {
  switch (kind) {
    case "released":     return "発売 中";
    case "demo":         return "デモ あり";
    case "early-access": return "アーリー アクセス";
    default:             return kind;
  }
}


export function formatCard(news, idx, date) {
  const hour = date.getHours();
  const sleepTraded = sleepHoursTraded(news.hours_to_clear, hour);
  const breakfasts  = breakfastsLost(news.hours_to_clear);
  const factor      = sleepFactor(hour);
  const comment     = commentsToTell(news);

  const numFmt = (n) => Number.isInteger(n) ? String(n) : n.toFixed(1);

  const indexLabel = chalk.dim.gray(`─ ${String(idx + 1).padStart(2, "0")} `);
  const topRule    = chalk.dim.gray("┌") + indexLabel + chalk.dim.gray("─".repeat(CARD_WIDTH - 5)) + chalk.dim.gray("┐");
  const botRule    = chalk.dim.gray("└" + "─".repeat(CARD_WIDTH) + "┘");

  // Field rows. We compose the visible string first, color/pad, then join.
  const rows = [];

  rows.push(line(`${chalk.bold.white(news.title)}`));
  rows.push(line(`${chalk.gray(news.jp)}`));
  rows.push(line(""));

  rows.push(line(
    `${chalk.dim("ジャンル ")}` +
    `${chalk.magenta(news.genre)}    ` +
    `${chalk.dim("価格 ")}${chalk.yellow(priceLabel(news.price_jpy))}    ` +
    `${chalk.dim("状態 ")}${chalk.cyan(releaseTag(news.release_kind))}`
  ));
  rows.push(line(`${chalk.dim("プレイ 時間 目安 : ")}${chalk.yellowBright(numFmt(news.hours_to_clear))}${chalk.dim(" 時間")}`));
  rows.push(line(`${chalk.dim("あなた の 睡眠 と 引き換え に : ")}${chalk.yellowBright(numFmt(sleepTraded))}${chalk.dim(" 時間")}  ${chalk.dim(`(係数 x${factor.toFixed(1)})`)}`));
  rows.push(line(`${chalk.dim("クリア まで に 失う 朝食 : ")}${chalk.yellowBright(String(breakfasts))}${chalk.dim(" 回")}`));
  rows.push(line(""));
  rows.push(line(`${chalk.dim("→ ")}${chalk.italic.gray(news.short_blurb)}`));
  rows.push(line(`${chalk.dim("○ ")}${chalk.italic.gray(comment)}`));

  return [topRule, ...rows, botRule].join("\n");
}


export function render(date, items) {
  const parts = [formatHeader(date), ""];
  items.forEach((news, i) => {
    parts.push(formatCard(news, i, date));
    parts.push("");
  });
  parts.push(chalk.dim("(おやすみなさい。 朝 同僚 と 1 杯 飲む 時 の ネタ に。)"));
  return parts.join("\n");
}


// Re-export for the CLI / tests
export { CARD_WIDTH, visualWidth, padToVisualWidth };
