import { ClipboardCheck, FileText, MessageSquareWarning, Tags, type LucideIcon } from "lucide-react";

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

export type CmsNavLink = NavItem & { minRole: Role; icon?: LucideIcon };

/** A collapsible section of the CMS sidebar; hidden when none of its links are visible. */
export type CmsNavGroup = { id: string; label: string; icon: LucideIcon; children: CmsNavLink[] };

export type CmsNavEntry = CmsNavLink | CmsNavGroup;

/** The CMS sidebar. Each link declares the lowest role that may see it; the pages enforce the same role. */
export const CMS_NAV: CmsNavEntry[] = [
  {
    id: "posts",
    label: "Bài viết",
    icon: FileText,
    children: [
      { href: ROUTES.cmsPosts, label: "Bài của tôi", minRole: "author" },
      { href: ROUTES.cmsNewPost, label: "Viết bài mới", minRole: "author" },
    ],
  },
  { href: ROUTES.cmsReview, label: "Duyệt bài", icon: ClipboardCheck, minRole: "editor" },
  { href: ROUTES.cmsTaxonomy, label: "Phân loại", icon: Tags, minRole: "editor" },
  { href: ROUTES.cmsModeration, label: "Kiểm duyệt bình luận", icon: MessageSquareWarning, minRole: "editor" },
];
