import type { Role } from "@/features/auth/types";

import { ROUTES } from "./routes";

export type NavItem = { href: string; label: string };

export const MAIN_NAV: NavItem[] = [
  { href: ROUTES.posts, label: "Bài viết" },
  { href: ROUTES.topics, label: "Chủ đề" },
];

export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Khám phá",
    items: [
      { href: ROUTES.posts, label: "Bài viết mới" },
      { href: ROUTES.topics, label: "Chủ đề" },
    ],
  },
  {
    title: "Tài khoản",
    items: [{ href: ROUTES.login, label: "Đăng nhập" }],
  },
];

export type DashboardNavItem = NavItem & { minRole: Role };

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { href: ROUTES.dashboardPosts, label: "Bài viết", minRole: "author" },
  { href: ROUTES.dashboardNewPost, label: "Viết bài mới", minRole: "author" },
  { href: ROUTES.dashboardReview, label: "Duyệt bài", minRole: "editor" },
  { href: ROUTES.dashboardTaxonomy, label: "Phân loại", minRole: "editor" },
  { href: ROUTES.dashboardModeration, label: "Kiểm duyệt", minRole: "editor" },
];
