import { describe, expect, it } from "vitest";

import { seriesMonogram } from "./series-monogram";

describe("seriesMonogram", () => {
  it("takes the first two letters of the first word", () => {
    expect(seriesMonogram("Laravel từ A-Z")).toBe("LA");
    expect(seriesMonogram("  vue ")).toBe("VU");
    expect(seriesMonogram("")).toBe("");
  });
});
