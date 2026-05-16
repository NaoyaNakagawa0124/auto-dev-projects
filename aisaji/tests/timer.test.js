import { describe, it, expect } from "vitest";
import { createRound, fakeClock } from "../src/timer.js";

describe("createRound", () => {
  it("emits onEnd exactly once after durationMs", () => {
    const clock = fakeClock();
    let ends = 0;
    const round = createRound({
      durationMs: 1000,
      tickMs: 100,
      cardSwitchMs: 500,
      handSize: 4,
      onEnd: () => { ends += 1; },
      clock,
    });
    round.start();
    clock.advance(2000);
    expect(ends).toBe(1);
  });

  it("emits onCardChange with monotonically increasing index", () => {
    const clock = fakeClock();
    const indices = [];
    const round = createRound({
      durationMs: 6000,
      tickMs: 100,
      cardSwitchMs: 1000,
      handSize: 8,
      onCardChange: (i) => indices.push(i),
      clock,
    });
    round.start();
    clock.advance(6000);
    expect(indices[0]).toBe(0);
    for (let i = 1; i < indices.length; i++) {
      expect(indices[i]).toBeGreaterThan(indices[i - 1]);
    }
  });

  it("does not advance card index past handSize - 1", () => {
    const clock = fakeClock();
    let max = -1;
    const round = createRound({
      durationMs: 6000,
      tickMs: 100,
      cardSwitchMs: 1000,
      handSize: 3,
      onCardChange: (i) => { if (i > max) max = i; },
      clock,
    });
    round.start();
    clock.advance(6000);
    expect(max).toBe(2);
  });

  it("stop() halts ticks", () => {
    const clock = fakeClock();
    let ticks = 0;
    const round = createRound({
      durationMs: 5000,
      tickMs: 100,
      cardSwitchMs: 1000,
      handSize: 4,
      onTick: () => { ticks += 1; },
      clock,
    });
    round.start();
    clock.advance(500);
    const before = ticks;
    round.stop();
    clock.advance(2000);
    expect(ticks).toBe(before);
  });
});
