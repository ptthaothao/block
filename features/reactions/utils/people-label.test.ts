import { describe, expect, it } from "vitest";

import { peopleLabel } from "./people-label";

describe("peopleLabel", () => {
  it("names a few and counts the rest", () => {
    expect(peopleLabel({ names: ["Grace", "Minh", "An"], total: 12 })).toBe("Grace, Minh và 10 người khác");
    expect(peopleLabel({ names: ["Grace", "Minh"], total: 2 })).toBe("Grace và Minh");
    expect(peopleLabel({ names: ["Grace"], total: 1 })).toBe("Grace");
  });
});
