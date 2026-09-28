import { describe, expect, it } from "vitest";

import { orderByIds } from "./order-by-ids";

describe("orderByIds", () => {
  it("restores the requested order and drops missing rows", () => {
    const rows = [{ id: "b" }, { id: "a" }];
    expect(orderByIds(rows, ["a", "c", "b"])).toEqual([{ id: "a" }, { id: "b" }]);
  });
});
