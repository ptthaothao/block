import { describe, expect, it } from "vitest";

import type { CommentDTO } from "../types";
import { buildReplyTree, shownChildren, withAncestors } from "./comment-tree";

const reply = (id: string, parentId: string): CommentDTO =>
  ({ id, parentId, rootId: "root" }) as CommentDTO;

describe("buildReplyTree", () => {
  it("nests replies under the comment they answer, at any depth", () => {
    const tree = buildReplyTree("root", [reply("a", "root"), reply("b", "a"), reply("c", "b"), reply("d", "root")]);
    expect(tree.map((n) => n.comment.id)).toEqual(["a", "d"]);
    expect(tree[0].children[0].comment.id).toBe("b");
    expect(tree[0].children[0].children[0].comment.id).toBe("c");
  });

  it("moves a reply with a missing parent up to the thread", () => {
    const tree = buildReplyTree("root", [reply("a", "root"), reply("b", "gone")]);
    expect(tree.map((n) => n.comment.id)).toEqual(["a", "b"]);
  });

  it("shows the first replies plus any that must stay visible", () => {
    const tree = buildReplyTree("root", [reply("a", "root"), reply("b", "root"), reply("c", "root"), reply("d", "root")]);
    expect(shownChildren(tree, 1, new Set()).map((n) => n.comment.id)).toEqual(["a"]);
    expect(shownChildren(tree, 1, new Set(["c"])).map((n) => n.comment.id)).toEqual(["a", "c"]);
  });

  it("keeps the path to a comment", () => {
    const replies = [reply("a", "root"), reply("b", "a"), reply("c", "b")];
    expect([...withAncestors(new Set(["c"]), replies)].sort()).toEqual(["a", "b", "c", "root"]);
  });
});
