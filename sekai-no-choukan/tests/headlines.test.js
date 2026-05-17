import { describe, it, expect } from "vitest";
import {
  HEADLINES, REGIONS, CATEGORIES, REGION_JP, CATEGORY_JP, BANNED_WORDS,
  byId, byRegion, byCategory, leadStory,
} from "../src/headlines.js";

describe("headlines", () => {
  it("has exactly 12 stories", () => {
    expect(HEADLINES.length).toBe(12);
  });

  it("all ids are unique", () => {
    const ids = HEADLINES.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all headlines are unique", () => {
    const t = HEADLINES.map((h) => h.headline);
    expect(new Set(t).size).toBe(t.length);
  });

  it("exactly one lead story (priority 1)", () => {
    const leads = HEADLINES.filter((h) => h.priority === 1);
    expect(leads.length).toBe(1);
    expect(leadStory().id).toBe(leads[0].id);
  });

  it("every region is represented at least once", () => {
    for (const region of REGIONS) {
      expect(byRegion(region).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every category is represented at least once", () => {
    for (const category of CATEGORIES) {
      expect(byCategory(category).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("priorities are 1, 2, or 3", () => {
    for (const h of HEADLINES) {
      expect([1, 2, 3]).toContain(h.priority);
    }
  });

  it("region and category use the documented vocabularies", () => {
    for (const h of HEADLINES) {
      expect(REGIONS).toContain(h.region);
      expect(CATEGORIES).toContain(h.category);
      expect(typeof REGION_JP[h.region]).toBe("string");
      expect(typeof CATEGORY_JP[h.category]).toBe("string");
    }
  });

  it("body length is reasonable (60-400 chars)", () => {
    for (const h of HEADLINES) {
      expect(h.body.length).toBeGreaterThanOrEqual(60);
      expect(h.body.length).toBeLessThanOrEqual(400);
    }
  });

  it("headline length is bounded (10-80 chars)", () => {
    for (const h of HEADLINES) {
      expect(h.headline.length).toBeGreaterThanOrEqual(10);
      expect(h.headline.length).toBeLessThanOrEqual(80);
    }
  });

  it("subhead length is bounded (10-80 chars)", () => {
    for (const h of HEADLINES) {
      expect(h.subhead.length).toBeGreaterThanOrEqual(10);
      expect(h.subhead.length).toBeLessThanOrEqual(80);
    }
  });

  it("no story contains any banned word in headline / subhead / body", () => {
    for (const h of HEADLINES) {
      for (const w of BANNED_WORDS) {
        expect(h.headline.includes(w)).toBe(false);
        expect(h.subhead.includes(w)).toBe(false);
        expect(h.body.includes(w)).toBe(false);
      }
    }
  });

  it("byId returns null for unknown ids", () => {
    expect(byId("not-a-real-id")).toBe(null);
    expect(byId("us-fed-rate").region).toBe("north-america");
  });
});
