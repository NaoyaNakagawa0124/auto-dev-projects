// ShipWatch - Terminal renderer
// All output designed for one-hand navigation (left hand only)

const {
  DISRUPTIONS, ROUTES, PACKAGES,
  SEVERITY_COLORS, STATUS_ICONS, PKG_STATUS_ICONS,
  getRouteDelay, getGlobalRiskScore, getGlobalRiskLevel,
} = require('./data.js');

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const MAGENTA = "\x1b[35m";
const WHITE = "\x1b[37m";

function box(title, content, width = 60) {
  const lines = [];
  lines.push("┌" + "─".repeat(width - 2) + "┐");
  const titleLine = "│ " + BOLD + title + RESET + " ".repeat(Math.max(0, width - 4 - stripAnsi(title).length)) + " │";
  lines.push(titleLine);
  lines.push("├" + "─".repeat(width - 2) + "┤");
  for (const line of content.split("\n")) {
    const stripped = stripAnsi(line);
    const pad = Math.max(0, width - 4 - stripped.length);
    lines.push("│ " + line + " ".repeat(pad) + " │");
  }
  lines.push("└" + "─".repeat(width - 2) + "┘");
  return lines.join("\n");
}

function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, "");
}

function bar(value, max, width = 30) {
  const filled = Math.min(width, Math.round((value / max) * width));
  const empty = width - filled;
  let color = GREEN;
  if (value / max > 0.7) color = RED;
  else if (value / max > 0.4) color = YELLOW;
  return color + "█".repeat(filled) + DIM + "░".repeat(empty) + RESET;
}

function renderDashboard() {
  const score = getGlobalRiskScore();
  const risk = getGlobalRiskLevel(score);
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  let content = "";
  content += `${DIM}${timeStr}${RESET}  Global Risk: ${risk.icon} ${risk.color}${BOLD}${risk.level}${RESET} [${bar(score, 100, 20)}] ${score}/100\n`;
  content += "\n";
  content += `${BOLD}Active Disruptions:${RESET}\n`;

  DISRUPTIONS.forEach((d, i) => {
    const sev = SEVERITY_COLORS[d.severity] || "";
    const icon = STATUS_ICONS[d.status] || "•";
    content += `  ${DIM}${i + 1}${RESET} ${icon} ${sev}${d.region}${RESET} [${d.severity}]\n`;
    content += `    ${DIM}+${d.impact.delayDays}d delay | +${d.impact.costIncrease}% cost | ${d.impact.routesAffected} routes${RESET}\n`;
  });

  content += `\n${DIM}Keys: [1-5] Detail | [r] Routes | [t] Track | [q] Quit${RESET}`;

  return box("🚢 SHIPWATCH — Supply Chain Monitor", content, 62);
}

function renderDisruption(index) {
  if (index < 0 || index >= DISRUPTIONS.length) return "Invalid disruption index.";
  const d = DISRUPTIONS[index];
  const sev = SEVERITY_COLORS[d.severity] || "";

  let content = "";
  content += `${BOLD}${d.region}${RESET}\n`;
  content += `Status: ${STATUS_ICONS[d.status]} ${d.status} | Severity: ${sev}${d.severity}${RESET}\n`;
  content += `Since: ${d.since}\n`;
  content += "\n";
  content += `${d.summary}\n`;
  content += "\n";
  content += `${BOLD}Impact:${RESET}\n`;
  content += `  Delay:    +${d.impact.delayDays} days\n`;
  content += `  Cost:     +${d.impact.costIncrease}%\n`;
  content += `  Routes:   ${d.impact.routesAffected} affected\n`;
  content += `  Carriers: ${d.carriers.join(", ")}\n`;
  content += `  Reroute:  ${d.reroute}\n`;
  content += `\n${DIM}[d] Dashboard | [r] Routes | [q] Quit${RESET}`;

  return box(`⚠️  Disruption Detail #${index + 1}`, content, 62);
}

function renderRoutes() {
  let content = "";
  content += `${BOLD}Route Delay Estimates:${RESET}\n\n`;

  ROUTES.forEach((route, i) => {
    const delay = getRouteDelay(route.id);
    const delayStr = delay.delayDays > 0
      ? `${RED}+${delay.delayDays}d${RESET}`
      : `${GREEN}on time${RESET}`;
    const barVal = delay.currentDays;
    content += `  ${DIM}${String.fromCharCode(97 + i)}${RESET} ${route.name}\n`;
    content += `    ${delay.normalDays}d → ${BOLD}${delay.currentDays}d${RESET} ${delayStr}  [${bar(delay.currentDays, 50, 20)}]\n`;
    if (delay.affectedBy.length > 0) {
      content += `    ${DIM}Affected by: ${delay.affectedBy.join(", ")}${RESET}\n`;
    }
  });

  content += `\n${DIM}[d] Dashboard | [1-5] Disruption | [q] Quit${RESET}`;
  return box("🗺️  Route Status", content, 62);
}

function renderPackages() {
  let content = "";
  content += `${BOLD}Tracked Shipments:${RESET}\n\n`;

  PACKAGES.forEach((pkg, i) => {
    const icon = PKG_STATUS_ICONS[pkg.status] || "📦";
    const statusColor = pkg.status === "delivered" ? GREEN
      : pkg.status === "delayed" ? YELLOW
      : pkg.status === "held" ? RED : CYAN;

    content += `  ${DIM}${i + 1}${RESET} ${icon} ${BOLD}${pkg.id}${RESET}\n`;
    content += `    ${pkg.origin} → ${pkg.destination}\n`;
    content += `    Status: ${statusColor}${pkg.status}${RESET} | ETA: ${pkg.eta}\n`;
    content += `    ${DIM}${pkg.contents} (${pkg.weight})${RESET}\n`;
    if (pkg.delayReason) {
      content += `    ${YELLOW}⚠ ${pkg.delayReason}${RESET}\n`;
    }
  });

  content += `\n${DIM}[d] Dashboard | [r] Routes | [q] Quit${RESET}`;
  return box("📦 Package Tracker", content, 62);
}

function renderHelp() {
  let content = "";
  content += `${BOLD}One-Hand Navigation (Left Hand Only):${RESET}\n\n`;
  content += `  ${CYAN}d${RESET}     Dashboard (main view)\n`;
  content += `  ${CYAN}1-5${RESET}   View disruption details\n`;
  content += `  ${CYAN}r${RESET}     Route delay estimates\n`;
  content += `  ${CYAN}t${RESET}     Package tracker\n`;
  content += `  ${CYAN}q${RESET}     Quit\n`;
  content += `  ${CYAN}?${RESET}     This help screen\n`;
  content += "\n";
  content += `${DIM}All keys are left-hand reachable.${RESET}\n`;
  content += `${DIM}No Ctrl/Shift combos needed.${RESET}\n`;
  content += `${DIM}Designed for 3am one-hand use.${RESET}`;

  return box("❓ ShipWatch Help", content, 62);
}

if (typeof module !== 'undefined') {
  module.exports = {
    renderDashboard, renderDisruption, renderRoutes, renderPackages, renderHelp,
    box, stripAnsi, bar,
  };
}
