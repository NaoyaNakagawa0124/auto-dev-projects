import type { TopicKey } from "./topics.ts";

export interface Station {
  id: string;
  topic: TopicKey;
  vibe: number;        // 1..5
  x: number;           // 0..1 grid coord
  y: number;           // 0..1 grid coord
  age_days: number;
  line_ids: string[];  // lines this station belongs to
}

export interface Line {
  id: string;
  topic: TopicKey;
  station_ids: string[];   // ordered along the line
}

export interface Network {
  stations: Station[];
  lines: Line[];
}

export function emptyNetwork(): Network {
  return { stations: [], lines: [] };
}

let _idCounter = 0;
export function nextId(prefix: string = ""): string {
  _idCounter += 1;
  return `${prefix}${_idCounter.toString(36)}`;
}
export function resetIdCounter() { _idCounter = 0; }

export function addStation(net: Network, s: Omit<Station, "id" | "line_ids" | "age_days">,
                            opts: { id?: string; age_days?: number } = {}): Station {
  const station: Station = {
    id: opts.id ?? nextId("s"),
    topic: s.topic,
    vibe: clampVibe(s.vibe),
    x: s.x,
    y: s.y,
    age_days: opts.age_days ?? 0,
    line_ids: [],
  };
  net.stations.push(station);
  return station;
}

export function removeStation(net: Network, id: string): boolean {
  const before = net.stations.length;
  net.stations = net.stations.filter(s => s.id !== id);
  if (net.stations.length === before) return false;
  // remove from any line
  for (const line of net.lines) {
    line.station_ids = line.station_ids.filter(sid => sid !== id);
  }
  // prune lines that no longer have >=2 stations and clean back-references
  const pruned_line_ids = new Set<string>();
  net.lines = net.lines.filter(l => {
    if (l.station_ids.length < 2) {
      pruned_line_ids.add(l.id);
      return false;
    }
    return true;
  });
  if (pruned_line_ids.size) {
    for (const s of net.stations) {
      s.line_ids = s.line_ids.filter(lid => !pruned_line_ids.has(lid));
    }
  }
  return true;
}

export function createLine(net: Network, topic: TopicKey, station_ids: string[],
                            opts: { id?: string } = {}): Line {
  if (station_ids.length < 2) {
    throw new Error("a line needs at least 2 stations");
  }
  const stations = net.stations.filter(s => station_ids.includes(s.id));
  if (stations.length !== station_ids.length) {
    throw new Error("some station id(s) not in network");
  }
  const line: Line = {
    id: opts.id ?? nextId("L"),
    topic,
    station_ids: [...station_ids],
  };
  net.lines.push(line);
  for (const s of stations) {
    if (!s.line_ids.includes(line.id)) s.line_ids.push(line.id);
  }
  return line;
}

export function extendLine(net: Network, line_id: string, station_id: string): boolean {
  const line = net.lines.find(l => l.id === line_id);
  const station = net.stations.find(s => s.id === station_id);
  if (!line || !station) return false;
  if (line.station_ids.includes(station_id)) return false;
  line.station_ids.push(station_id);
  if (!station.line_ids.includes(line.id)) station.line_ids.push(line.id);
  return true;
}

export function removeLine(net: Network, line_id: string): boolean {
  const line = net.lines.find(l => l.id === line_id);
  if (!line) return false;
  net.lines = net.lines.filter(l => l.id !== line_id);
  for (const s of net.stations) {
    s.line_ids = s.line_ids.filter(id => id !== line_id);
  }
  return true;
}

export function isTransferStation(s: Station): boolean {
  return s.line_ids.length >= 2;
}

export function clampVibe(v: number): number {
  v = Math.floor(v);
  if (v < 1) return 1;
  if (v > 5) return 5;
  return v;
}

/** Sum of station counts per topic — helps weather / event bias decisions. */
export function topicCounts(net: Network): Record<TopicKey, number> {
  const out: Partial<Record<TopicKey, number>> = {};
  for (const s of net.stations) {
    out[s.topic] = (out[s.topic] ?? 0) + 1;
  }
  return out as Record<TopicKey, number>;
}
