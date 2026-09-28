import type { ReactNode } from "react";

/** Sticky filter column from lg up; below that the filters live in MobileFilters' sheet. */
export function PostsSidebar({ children }: { children: ReactNode }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain pr-2">{children}</div>
    </aside>
  );
}
