import { describe, expect, it } from "vitest";

import { PENDING_ACTION_TTL_MS } from "./constants";
import { matchesPendingAction, parsePendingAction, serializePendingAction } from "./pending-action";

const now = 1_000_000_000;
const action = { type: "reaction", postSlug: "queue", payload: { emoji: "helpful" }, createdAt: now - 1_000 };

describe("pending action", () => {
  it("round-trips", () => {
    expect(parsePendingAction(serializePendingAction(action), now)).toEqual(action);
  });

  it("drops expired, future and malformed values", () => {
    expect(parsePendingAction(serializePendingAction({ ...action, createdAt: now - PENDING_ACTION_TTL_MS - 1 }), now)).toBeNull();
    expect(parsePendingAction(serializePendingAction({ ...action, createdAt: now + 1 }), now)).toBeNull();
    expect(parsePendingAction("{oops", now)).toBeNull();
    expect(parsePendingAction(JSON.stringify({ type: 1 }), now)).toBeNull();
    expect(parsePendingAction(null, now)).toBeNull();
  });

  it("matches by type and post", () => {
    expect(matchesPendingAction(action, "reaction", "queue")).toBe(true);
    expect(matchesPendingAction(action, "comment", "queue")).toBe(false);
    expect(matchesPendingAction(action, "reaction", "other")).toBe(false);
    expect(matchesPendingAction(null, "reaction", "queue")).toBe(false);
  });
});
