import { describe, it, expect } from "vitest";
import { memoryStorage } from "../src/storage.js";

describe("memoryStorage", () => {
  it("returns undefined for unknown keys", async () => {
    const s = memoryStorage();
    expect(await s.get("nope")).toBeUndefined();
  });

  it("round-trips a value", async () => {
    const s = memoryStorage();
    await s.set("foo", { a: 1 });
    expect(await s.get("foo")).toEqual({ a: 1 });
  });

  it("set+get returns a clone, not a reference", async () => {
    const s = memoryStorage();
    const obj = { a: 1 };
    await s.set("foo", obj);
    obj.a = 99;
    expect(await s.get("foo")).toEqual({ a: 1 });
  });

  it("remove deletes a key", async () => {
    const s = memoryStorage({ foo: 1 });
    await s.remove("foo");
    expect(await s.get("foo")).toBeUndefined();
  });

  it("getAll returns all keys", async () => {
    const s = memoryStorage({ foo: 1, bar: 2 });
    expect(await s.getAll()).toEqual({ foo: 1, bar: 2 });
  });
});
