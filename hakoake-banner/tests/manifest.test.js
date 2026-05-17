import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const manifest = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "..", "manifest.json"), "utf-8")
);

describe("manifest.json", () => {
  it("uses manifest_version 3", () => {
    expect(manifest.manifest_version).toBe(3);
  });

  it("targets only Hacker News", () => {
    expect(manifest.host_permissions).toEqual(["https://news.ycombinator.com/*"]);
    for (const cs of manifest.content_scripts) {
      expect(cs.matches).toEqual(["https://news.ycombinator.com/*"]);
    }
  });

  it("declares storage permission", () => {
    expect(manifest.permissions).toContain("storage");
  });

  it("declares a popup", () => {
    expect(manifest.action.default_popup).toBe("src/popup.html");
  });

  it("name and description are in Japanese", () => {
    // Should contain at least one CJK character.
    expect(/[぀-ヿ一-龯]/.test(manifest.name)).toBe(true);
    expect(/[぀-ヿ一-龯]/.test(manifest.description)).toBe(true);
  });

  it("uses only the minimum permissions (no broad host access)", () => {
    expect(manifest.host_permissions.length).toBe(1);
    expect(manifest.permissions.length).toBeLessThanOrEqual(2);
  });
});
