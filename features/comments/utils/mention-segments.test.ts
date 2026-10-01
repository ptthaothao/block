import { describe, expect, it } from "vitest";

import { splitMentions } from "./mention-segments";

describe("splitMentions", () => {
  it("marks @mentions and keeps the rest", () => {
    expect(splitMentions("@bob thật, cảm ơn @a.b")).toEqual([
      { text: "@bob", mention: true },
      { text: " thật, cảm ơn ", mention: false },
      { text: "@a.b", mention: true },
    ]);
  });

  it("returns nothing for empty text", () => {
    expect(splitMentions("")).toEqual([]);
  });
});
