import { describe, expect, it } from "vitest";

import type { InterestItem } from "../types";
import { groupInterests } from "./group-interests";

const item = (type: InterestItem["type"], slug: string, weight: InterestItem["weight"]): InterestItem => ({
  type,
  slug,
  name: slug,
  weight,
  color: null,
  avatarUrl: null,
});

describe("groupInterests", () => {
  it("groups follows by type and collects every mute", () => {
    const groups = groupInterests([
      item("category", "laravel", 1),
      item("tag", "php", 1),
      item("author", "an", 1),
      item("category", "devops", -1),
      item("tag", "java", -1),
    ]);
    expect(groups.categories.map((i) => i.slug)).toEqual(["laravel"]);
    expect(groups.tags.map((i) => i.slug)).toEqual(["php"]);
    expect(groups.authors.map((i) => i.slug)).toEqual(["an"]);
    expect(groups.muted.map((i) => i.slug)).toEqual(["devops", "java"]);
  });
});
