import { FileText } from "lucide-react";
import { describe, expect, it } from "vitest";

import type { CmsNavEntry } from "@/config/navigation";

import { navLinks, visibleNav } from "./visible-nav";

const NAV: CmsNavEntry[] = [
  {
    id: "posts",
    label: "Bài viết",
    icon: FileText,
    children: [
      { href: "/cms/posts", label: "Bài của tôi", minRole: "author" },
      { href: "/cms/all", label: "Tất cả", minRole: "editor" },
    ],
  },
  { id: "admin", label: "Hệ thống", icon: FileText, children: [{ href: "/cms/users", label: "Người dùng", minRole: "admin" }] },
  { href: "/cms/review", label: "Duyệt bài", minRole: "editor" },
];

describe("visibleNav", () => {
  it("drops links above the role and groups left empty", () => {
    const nav = visibleNav(NAV, "author");
    expect(navLinks(nav).map((link) => link.href)).toEqual(["/cms/posts"]);
    expect(nav).toHaveLength(1);
  });

  it("keeps everything up to the role", () => {
    expect(navLinks(visibleNav(NAV, "editor")).map((link) => link.href)).toEqual(["/cms/posts", "/cms/all", "/cms/review"]);
  });

  it("shows the whole tree to admins", () => {
    expect(navLinks(visibleNav(NAV, "admin"))).toHaveLength(4);
  });

  it("shows nothing to readers", () => {
    expect(visibleNav(NAV, "reader")).toEqual([]);
  });
});
