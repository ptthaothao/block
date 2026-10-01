import { describe, expect, it } from "vitest";

import { appendNoteLine } from "./append-note";

describe("appendNoteLine", () => {
  it("uses the text as is on an empty note", () => {
    expect(appendNoteLine("  ", "Thiếu ví dụ.", 100)).toBe("Thiếu ví dụ.");
  });

  it("adds the text on a new line", () => {
    expect(appendNoteLine("Bài ổn.\n", "Thiếu ví dụ.", 100)).toBe("Bài ổn.\nThiếu ví dụ.");
  });

  it("never goes over the limit", () => {
    expect(appendNoteLine("abc", "defgh", 6)).toBe("abc\nde");
  });
});
