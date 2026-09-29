import { describe, expect, it } from "vitest";

import { COMMENT_EDIT_WINDOW_MS } from "../constants";
import { commentPermissions } from "./permissions";

const now = Date.parse("2026-09-28T10:00:00Z");
const base = {
  authorId: "bob",
  status: "visible" as const,
  isDeleted: false,
  createdAt: new Date(now - 60_000).toISOString(),
  viewerIsPostAuthor: false,
  now,
};

describe("commentPermissions", () => {
  it("lets writers edit within the window and delete any time", () => {
    const mine = commentPermissions({ ...base, viewer: { id: "bob", role: "reader" } });
    expect(mine).toMatchObject({ isMine: true, canEdit: true, canDelete: true, canReport: false, canPin: false });
    const late = commentPermissions({
      ...base,
      createdAt: new Date(now - COMMENT_EDIT_WINDOW_MS - 1).toISOString(),
      viewer: { id: "bob", role: "reader" },
    });
    expect(late.canEdit).toBe(false);
    expect(late.canDelete).toBe(true);
  });

  it("lets post authors and editors moderate", () => {
    expect(commentPermissions({ ...base, viewer: { id: "alice", role: "author" }, viewerIsPostAuthor: true })).toMatchObject({
      canPin: true,
      canHide: true,
      canDelete: true,
    });
    expect(commentPermissions({ ...base, viewer: { id: "dave", role: "editor" } }).canHide).toBe(true);
    expect(commentPermissions({ ...base, viewer: { id: "erin", role: "author" } }).canHide).toBe(false);
  });

  it("gives visitors nothing and deleted comments no actions", () => {
    expect(Object.values(commentPermissions({ ...base, viewer: null })).some(Boolean)).toBe(false);
    const deleted = commentPermissions({ ...base, isDeleted: true, viewer: { id: "bob", role: "admin" } });
    expect(deleted).toMatchObject({ canEdit: false, canDelete: false, canPin: false, canHide: false, canReport: false });
  });
});
