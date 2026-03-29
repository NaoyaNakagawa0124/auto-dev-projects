// ShipWatch - Supply chain data based on real 2026 events

const DISRUPTIONS = [
  {
    id: "hormuz-closure",
    region: "Strait of Hormuz",
    severity: "critical",
    status: "active",
    since: "2026-03-04",
    summary: "Near-total suspension of commercial traffic through the Strait of Hormuz following military escalation. 20-27% of global oil/LNG volumes affected.",
    impact: { delayDays: 14, costIncrease: 35, routesAffected: 12 },
    carriers: ["Maersk", "MSC", "Hapag-Lloyd", "CMA CGM"],
    reroute: "Cape of Good Hope (adds 10-14 days)",
  },
  {
    id: "suez-congestion",
    region: "Suez Canal",
    severity: "high",
    status: "active",
    since: "2026-02-15",
    summary: "Congestion from rerouted vessels. Queue times up to 48 hours. Northbound delays significant.",
    impact: { delayDays: 3, costIncrease: 15, routesAffected: 8 },
    carriers: ["All major lines"],
    reroute: "N/A — queue and wait",
  },
  {
    id: "sahathai-terminal",
    region: "Thailand (Sahathai Terminal)",
    severity: "medium",
    status: "active",
    since: "2026-03-20",
    summary: "Port congestion at Sahathai Terminal disrupting Southeast Asia logistics hub operations.",
    impact: { delayDays: 5, costIncrease: 10, routesAffected: 4 },
    carriers: ["Regional carriers"],
    reroute: "Laem Chabang alternative",
  },
  {
    id: "panama-drought",
    region: "Panama Canal",
    severity: "medium",
    status: "monitoring",
    since: "2026-01-10",
    summary: "Water levels recovering but still below normal. Daily transit slots limited to 30 (vs normal 36).",
    impact: { delayDays: 2, costIncrease: 8, routesAffected: 6 },
    carriers: ["Trans-Pacific lines"],
    reroute: "Suez alternative for some routes",
  },
  {
    id: "air-cargo-mideast",
    region: "Middle East Airspace",
    severity: "high",
    status: "active",
    since: "2026-03-01",
    summary: "Up to 20% of global airfreight routes affected by Middle East airspace restrictions.",
    impact: { delayDays: 3, costIncrease: 25, routesAffected: 15 },
    carriers: ["DHL", "FedEx", "UPS", "Emirates SkyCargo"],
    reroute: "Northern routing via Central Asia",
  },
];

const ROUTES = [
  { id: "asia-eu", name: "Asia → Europe", normalDays: 28, ports: ["Shanghai", "Singapore", "Suez", "Rotterdam"] },
  { id: "asia-useast", name: "Asia → US East Coast", normalDays: 35, ports: ["Shenzhen", "Singapore", "Suez", "New York"] },
  { id: "asia-uswest", name: "Asia → US West Coast", normalDays: 14, ports: ["Shanghai", "Busan", "Los Angeles"] },
  { id: "eu-useast", name: "Europe → US East Coast", normalDays: 12, ports: ["Rotterdam", "Antwerp", "New York"] },
  { id: "asia-mideast", name: "Asia → Middle East", normalDays: 10, ports: ["Shanghai", "Singapore", "Jebel Ali"] },
  { id: "eu-asia", name: "Europe → Asia", normalDays: 30, ports: ["Hamburg", "Suez", "Singapore", "Shanghai"] },
  { id: "latam-eu", name: "Latin America → Europe", normalDays: 18, ports: ["Santos", "Las Palmas", "Rotterdam"] },
  { id: "africa-asia", name: "Africa → Asia", normalDays: 22, ports: ["Durban", "Colombo", "Singapore"] },
];

const PACKAGES = [
  { id: "PKG-2035-A1", origin: "Shanghai", destination: "Rotterdam", route: "asia-eu", status: "in-transit", eta: "2026-04-08", departed: "2026-03-15", contents: "Electronics", weight: "450kg" },
  { id: "PKG-2035-B2", origin: "Shenzhen", destination: "New York", route: "asia-useast", status: "delayed", eta: "2026-04-20", departed: "2026-03-10", contents: "Auto Parts", weight: "1200kg", delayReason: "Hormuz reroute via Cape" },
  { id: "PKG-2035-C3", origin: "Hamburg", destination: "Singapore", route: "eu-asia", status: "in-transit", eta: "2026-04-12", departed: "2026-03-18", contents: "Machinery", weight: "3500kg" },
  { id: "PKG-2035-D4", origin: "Santos", destination: "Rotterdam", route: "latam-eu", status: "delivered", eta: "2026-03-25", departed: "2026-03-08", contents: "Coffee Beans", weight: "8000kg" },
  { id: "PKG-2035-E5", origin: "Shanghai", destination: "Los Angeles", route: "asia-uswest", status: "in-transit", eta: "2026-04-02", departed: "2026-03-22", contents: "Consumer Goods", weight: "600kg" },
  { id: "PKG-2035-F6", origin: "Singapore", destination: "Jebel Ali", route: "asia-mideast", status: "held", eta: "Unknown", departed: "2026-03-01", contents: "Textiles", weight: "200kg", delayReason: "Hormuz closure — awaiting reroute" },
];

const SEVERITY_COLORS = { critical: "\x1b[31m", high: "\x1b[33m", medium: "\x1b[36m", low: "\x1b[32m", monitoring: "\x1b[34m" };
const STATUS_ICONS = { active: "🔴", monitoring: "🟡", resolved: "🟢" };
const PKG_STATUS_ICONS = { "in-transit": "🚢", delayed: "⚠️", delivered: "✅", held: "🛑" };

function getRouteDelay(routeId) {
  const route = ROUTES.find(r => r.id === routeId);
  if (!route) return null;

  let totalDelay = 0;
  let affectedBy = [];

  for (const d of DISRUPTIONS) {
    if (d.status === "resolved") continue;
    // Check if route passes through affected region
    const routeStr = route.ports.join(" ").toLowerCase() + " " + route.name.toLowerCase();
    const regionStr = d.region.toLowerCase();

    let affected = false;
    if (regionStr.includes("hormuz") && (routeStr.includes("middle east") || routeStr.includes("jebel") || routeStr.includes("suez"))) affected = true;
    if (regionStr.includes("suez") && routeStr.includes("suez")) affected = true;
    if (regionStr.includes("panama") && routeStr.includes("panama")) affected = true;
    if (regionStr.includes("thailand") && routeStr.includes("singapore")) affected = true;
    if (regionStr.includes("airspace")) affected = false; // ocean routes only

    if (affected) {
      totalDelay += d.impact.delayDays;
      affectedBy.push(d.id);
    }
  }

  return {
    route,
    normalDays: route.normalDays,
    currentDays: route.normalDays + totalDelay,
    delayDays: totalDelay,
    affectedBy,
  };
}

function getGlobalRiskScore() {
  let score = 0;
  for (const d of DISRUPTIONS) {
    if (d.status === "resolved") continue;
    if (d.severity === "critical") score += 30;
    else if (d.severity === "high") score += 20;
    else if (d.severity === "medium") score += 10;
  }
  return Math.min(100, score);
}

function getGlobalRiskLevel(score) {
  if (score >= 70) return { level: "CRITICAL", color: "\x1b[31m", icon: "🔴" };
  if (score >= 50) return { level: "HIGH", color: "\x1b[33m", icon: "🟠" };
  if (score >= 30) return { level: "ELEVATED", color: "\x1b[36m", icon: "🟡" };
  return { level: "NORMAL", color: "\x1b[32m", icon: "🟢" };
}

if (typeof module !== 'undefined') {
  module.exports = {
    DISRUPTIONS, ROUTES, PACKAGES,
    SEVERITY_COLORS, STATUS_ICONS, PKG_STATUS_ICONS,
    getRouteDelay, getGlobalRiskScore, getGlobalRiskLevel,
  };
}
