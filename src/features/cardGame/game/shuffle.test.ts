import { describe, it, expect } from "vitest";
import { shuffle } from "./shuffle";

describe("shuffle", () => {
  const items = [1, 2, 3, 4, 5];

  it("keeps every item exactly once", () => {
    const result = shuffle(items);

    expect(result).toHaveLength(items.length);
    expect([...result].sort()).toEqual([...items].sort());
  });

  it("returns a new array and leaves the original alone", () => {
    const original = [...items];
    const result = shuffle(items);

    expect(result).not.toBe(items);
    expect(items).toEqual(original);
  });

  it("handles empty and single-item arrays", () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle([1])).toEqual([1]);
  });
});
