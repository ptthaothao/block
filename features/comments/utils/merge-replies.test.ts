import { describe, expect, it } from "vitest";

import type { CommentDTO } from "../types";
import { mergeReplies } from "./merge-replies";

const reply = (id: string, bodyHtml = id) => ({ id, bodyHtml }) as CommentDTO;

describe("mergeReplies", () => {
  it("keeps server order, prefers fresh copies and appends new replies", () => {
    const merged = mergeReplies([reply("a"), reply("b")], [reply("b", "edited"), reply("c")]);
    expect(merged.map((r) => [r.id, r.bodyHtml])).toEqual([
      ["a", "a"],
      ["b", "edited"],
      ["c", "c"],
    ]);
  });
});
