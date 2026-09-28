import Link from "next/link";

import { ColorDot, DEFAULT_DOT_COLOR } from "@/components/ui/color-dot";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils/cn";

import { CATEGORY_TRAIL_SEPARATOR } from "../constants";
import type { CategoryRef } from "../types";

type CategoryChipProps = {
  category: CategoryRef;
  /** Link to the topic page. Inside a PostCard the link sits above the card's own link. */
  linked?: boolean;
  /** Show "Parent › Child" instead of just the child. */
  withParent?: boolean;
};

export function CategoryChip({ category, linked = false, withParent = false }: CategoryChipProps) {
  const className = cn(
    "inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider",
    linked && "relative z-10 rounded-sm underline-offset-4 hover:underline",
  );
  const style = { color: category.color ?? DEFAULT_DOT_COLOR };
  const label = withParent && category.parent ? `${category.parent.name}${CATEGORY_TRAIL_SEPARATOR}${category.name}` : category.name;
  const content = (
    <>
      <ColorDot color={category.color} />
      {label}
    </>
  );

  return linked ? (
    <Link href={ROUTES.topic(category.slug)} className={className} style={style}>
      {content}
    </Link>
  ) : (
    <span className={className} style={style}>
      {content}
    </span>
  );
}
