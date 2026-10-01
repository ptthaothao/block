import type { CmsNavEntry, CmsNavGroup, CmsNavLink } from "@/config/navigation";
import type { Role } from "@/features/auth/types";
import { hasRole } from "@/features/auth/utils/roles";

export function isNavGroup(entry: CmsNavEntry): entry is CmsNavGroup {
  return "children" in entry;
}

/** The sidebar as `role` sees it: links above the role are dropped, and so are groups left empty. */
export function visibleNav(entries: readonly CmsNavEntry[], role: Role): CmsNavEntry[] {
  return entries.flatMap((entry): CmsNavEntry[] => {
    if (!isNavGroup(entry)) return hasRole(role, entry.minRole) ? [entry] : [];
    const children = entry.children.filter((child) => hasRole(role, child.minRole));
    return children.length > 0 ? [{ ...entry, children }] : [];
  });
}

/** Every link in the tree, groups flattened. */
export function navLinks(entries: readonly CmsNavEntry[]): CmsNavLink[] {
  return entries.flatMap((entry) => (isNavGroup(entry) ? entry.children : [entry]));
}
