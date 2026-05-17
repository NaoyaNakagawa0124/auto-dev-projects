import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const manifest = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "..", "manifest.json"), "utf-8")
);

describe("manifest.json", () => {
  it("uses MV3", () => {
    expect(manifest.manifest_version).toBe(3);
  });

  it("declares storage + activeTab permissions, nothing more", () => {
    expect(new Set(manifest.permissions)).toEqual(new Set(["storage", "activeTab"]));
  });

  it("has no host_permissions (activeTab is sufficient)", () => {
    expect(manifest.host_permissions || []).toEqual([]);
  });

  it("declares popup and options pages", () => {
    expect(manifest.action.default_popup).toBe("src/popup.html");
    expect(manifest.options_page).toBe("src/options.html");
  });

  it("name and description are in Japanese", () => {
    const cjk = /[぀-ヿ一-龯]/;
    expect(cjk.test(manifest.name)).toBe(true);
    expect(cjk.test(manifest.description)).toBe(true);
  });

  it("declares all three icon sizes", () => {
    expect(manifest.icons["16"]).toBe("icons/icon-16.png");
    expect(manifest.icons["48"]).toBe("icons/icon-48.png");
    expect(manifest.icons["128"]).toBe("icons/icon-128.png");
  });
});
