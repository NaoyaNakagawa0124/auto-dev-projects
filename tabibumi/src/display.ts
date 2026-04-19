/**
 * Display helpers — warm, emotional terminal output
 */

// ANSI color codes — warm palette
export const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",

  // Warm palette
  cream: "\x1b[38;5;223m",
  amber: "\x1b[38;5;214m",
  rose: "\x1b[38;5;174m",
  sage: "\x1b[38;5;108m",
  sky: "\x1b[38;5;110m",
  lavender: "\x1b[38;5;183m",
  sand: "\x1b[38;5;180m",
  coral: "\x1b[38;5;209m",
  mint: "\x1b[38;5;115m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  red: "\x1b[31m",
};

/**
 * Print the app banner
 */
export function banner(): void {
  console.log();
  console.log(`${c.amber}  ┌─────────────────────┐${c.reset}`);
  console.log(`${c.amber}  │${c.reset} ${c.bold}${c.cream}旅  文${c.reset}  ${c.dim}tabibumi${c.reset}   ${c.amber}│${c.reset}`);
  console.log(`${c.amber}  │${c.reset} ${c.dim}${c.sand}エモい旅日記${c.reset}         ${c.amber}│${c.reset}`);
  console.log(`${c.amber}  └─────────────────────┘${c.reset}`);
  console.log();
}

/**
 * Print a section header
 */
export function header(text: string, color = c.amber): void {
  console.log();
  console.log(`${color}── ${c.bold}${text}${c.reset}${color} ──${c.reset}`);
  console.log();
}

/**
 * Print a gentle message
 */
export function gentle(text: string): void {
  console.log(`  ${c.cream}${text}${c.reset}`);
}

/**
 * Print an info line
 */
export function info(label: string, value: string): void {
  console.log(`  ${c.dim}${label}:${c.reset} ${c.sand}${value}${c.reset}`);
}

/**
 * Print a question
 */
export function question(text: string): void {
  console.log();
  console.log(`  ${c.rose}${c.italic}${text}${c.reset}`);
  console.log();
}

/**
 * Print a quoted entry
 */
export function quote(text: string): void {
  const lines = text.split("\n");
  for (const line of lines) {
    console.log(`  ${c.gray}│${c.reset} ${c.cream}${line}${c.reset}`);
  }
}

/**
 * Print an error
 */
export function error(text: string): void {
  console.log(`  ${c.red}${text}${c.reset}`);
}

/**
 * Print a divider
 */
export function divider(): void {
  console.log(`  ${c.dim}${"─".repeat(30)}${c.reset}`);
}

/**
 * Print a box with content
 */
export function box(title: string, lines: string[], color = c.amber): void {
  const maxLen = Math.max(title.length * 2, ...lines.map(l => l.replace(/\x1b\[[0-9;]*m/g, "").length));
  const w = Math.min(maxLen + 4, 50);

  console.log(`  ${color}┌${"─".repeat(w)}┐${c.reset}`);
  console.log(`  ${color}│${c.reset} ${c.bold}${title}${c.reset}${" ".repeat(Math.max(0, w - title.replace(/\x1b\[[0-9;]*m/g, "").length - 1))}${color}│${c.reset}`);
  console.log(`  ${color}├${"─".repeat(w)}┤${c.reset}`);
  for (const line of lines) {
    const clean = line.replace(/\x1b\[[0-9;]*m/g, "");
    const pad = Math.max(0, w - clean.length - 1);
    console.log(`  ${color}│${c.reset} ${line}${" ".repeat(pad)}${color}│${c.reset}`);
  }
  console.log(`  ${color}└${"─".repeat(w)}┘${c.reset}`);
}

/**
 * Format a date for display
 */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const h = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  return `${m}/${day} ${h}:${min}`;
}
