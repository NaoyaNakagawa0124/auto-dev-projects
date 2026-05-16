import { expect, test } from "bun:test";
import { getTopic, TOPICS, TOPICS_BY_KEY } from "../src/game/topics.ts";

test("six topics defined", () => {
  expect(TOPICS.length).toBe(6);
});

test("topic keys are unique", () => {
  const keys = new Set(TOPICS.map(t => t.key));
  expect(keys.size).toBe(6);
});

test("getTopic returns expected fields", () => {
  const t = getTopic("cooking");
  expect(t.name).toBe("料理");
  expect(t.color.startsWith("#")).toBe(true);
  expect(t.base_views).toBeGreaterThan(0);
});

test("shapes are distinct", () => {
  const shapes = new Set(TOPICS.map(t => t.shape));
  expect(shapes.size).toBe(6);
});

test("TOPICS_BY_KEY index complete", () => {
  for (const t of TOPICS) {
    expect(TOPICS_BY_KEY[t.key]).toBe(t);
  }
});
