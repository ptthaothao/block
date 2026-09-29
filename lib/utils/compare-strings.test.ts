import { describe, expect, it } from "vitest";

import { compareStrings } from "./compare-strings";

describe("compareStrings", () => {
  it("sorts by code point, independent of locale", () => {
    expect(["b", "a", "B", "c-1", "c"].sort(compareStrings)).toEqual(["B", "a", "b", "c", "c-1"]);
  });

  it("treats equal strings as equal", () => {
    expect(compareStrings("x", "x")).toBe(0);
  });
});
