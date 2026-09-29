import { describe, expect, it } from "vitest";

import { GUEST_INTERESTS_STORAGE } from "../constants";
import type { InterestItem } from "../types";
import { parseGuestInterests, serializeGuestInterests } from "./guest-interests";

const item: InterestItem = { type: "tag", slug: "react", name: "react", weight: 1, color: null, avatarUrl: null };

describe("guest interests", () => {
  it("round-trips", () => {
    expect(parseGuestInterests(serializeGuestInterests([item]))).toEqual([item]);
  });

  it("treats junk, old versions and bad items as empty", () => {
    expect(parseGuestInterests(null)).toEqual([]);
    expect(parseGuestInterests("{not json")).toEqual([]);
    expect(parseGuestInterests(JSON.stringify({ v: GUEST_INTERESTS_STORAGE.version + 1, items: [item] }))).toEqual([]);
    expect(parseGuestInterests(JSON.stringify({ v: GUEST_INTERESTS_STORAGE.version, items: [{ ...item, slug: "../x" }] }))).toEqual([]);
  });
});
