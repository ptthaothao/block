import { describe, expect, it } from "vitest";

import { storedImageFromUrl } from "./stored-image";

describe("storedImageFromUrl", () => {
  it("reads bucket and path from a public object URL", () => {
    const url = "https://abc.supabase.co/storage/v1/object/public/post/content/p1/x.webp";
    expect(storedImageFromUrl(url)).toEqual({
      id: "content/p1/x.webp",
      bucket: "post",
      path: "content/p1/x.webp",
      url,
      name: "x.webp",
      size: null,
    });
  });

  it("returns null for other URLs", () => {
    expect(storedImageFromUrl("https://example.com/a.png")).toBeNull();
    expect(storedImageFromUrl("not a url")).toBeNull();
    expect(storedImageFromUrl("https://abc.supabase.co/storage/v1/object/public/post")).toBeNull();
  });
});
