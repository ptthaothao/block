import { describe, expect, it } from "vitest";

import type { CommentDTO, CommentPage } from "../types";
import { flattenThreads, insertComment, replaceComment } from "./comment-cache";

const comment = (id: string, parentId: string | null = null): CommentDTO => ({
  id,
  parentId,
  bodyHtml: `<p>${id}</p>`,
  bodyMd: null,
  createdAt: "2026-09-28T00:00:00Z",
  editedAt: null,
  status: "visible",
  isPinned: false,
  isDeleted: false,
  isMine: false,
  author: null,
  reactions: {},
  myReactions: [],
  replyCount: 0,
  canEdit: false,
  canDelete: false,
  canPin: false,
  canHide: false,
  canReport: false,
});

const data = () => ({
  pageParams: [0, 1],
  pages: [
    { threads: [{ ...comment("a"), replies: [] }], total: 2, commentCount: 2, nextPage: 1 },
    { threads: [{ ...comment("b"), replies: [] }], total: 2, commentCount: 2, nextPage: null },
  ] satisfies CommentPage[],
});

describe("comment cache", () => {
  it("puts new threads first and replies last in their thread", () => {
    const withThread = insertComment(data(), comment("c"));
    expect(flattenThreads(withThread).map((t) => t.id)).toEqual(["c", "a", "b"]);
    const withReply = insertComment(data(), comment("r", "b"));
    const b = flattenThreads(withReply).find((t) => t.id === "b");
    expect(b?.replies.map((r) => r.id)).toEqual(["r"]);
    expect(b?.replyCount).toBe(1);
  });

  it("replaces threads and replies in place", () => {
    const withReply = insertComment(data(), comment("r", "a"));
    const edited = replaceComment(withReply, { ...comment("r", "a"), bodyHtml: "<p>new</p>" });
    expect(flattenThreads(edited)[0].replies[0].bodyHtml).toBe("<p>new</p>");
    const pinned = replaceComment(edited, { ...comment("a"), isPinned: true });
    expect(flattenThreads(pinned)[0]).toMatchObject({ isPinned: true, replies: [{ id: "r" }] });
  });

  it("drops duplicates across pages", () => {
    const dup = data();
    dup.pages[1].threads.push({ ...comment("a"), replies: [] });
    expect(flattenThreads(dup).map((t) => t.id)).toEqual(["a", "b"]);
  });
});
