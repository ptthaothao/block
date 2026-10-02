import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

const COLUMNS = {
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  /** Post cards: at least 4 per row on desktop, 5 on wide screens. */
  posts: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
  /** Next to a sidebar: the sidebar takes a column's worth of space from lg up. */
  withSidebar: "sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
} as const;

type CardGridProps = {
  columns?: keyof typeof COLUMNS;
  /** Use "ul" when the children are <li> cards. */
  as?: "div" | "ul";
  className?: string;
  children: ReactNode;
};

export function CardGrid({ columns = 3, as: Tag = "div", className, children }: CardGridProps) {
  return <Tag className={cn("grid gap-6", COLUMNS[columns], className)}>{children}</Tag>;
}
