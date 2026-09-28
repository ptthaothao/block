import Link from "next/link";

import { ROUTES } from "@/config/routes";

import type { TagSummary } from "../types";

export function TagCloud({ tags, label }: { tags: TagSummary[]; label: string }) {
  if (tags.length === 0) return null;
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag.slug}>
          <Link
            href={ROUTES.tag(tag.slug)}
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border bg-surface px-3 font-mono text-xs text-muted transition hover:border-accent/60 hover:text-accent"
          >
            #{tag.name}
            <span className="text-faint tabular-nums">{tag.postCount}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
