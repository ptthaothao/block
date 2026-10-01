import { describe, expect, it } from "vitest";

import { countWords } from "./word-count";

describe("countWords", () => {
  it("counts nothing in blank text", () => {
    expect(countWords("  \n ")).toBe(0);
  });

  it("splits on any whitespace", () => {
    expect(countWords("## Tiêu đề\n\nmột  hai\tba")).toBe(6);
  });
});
