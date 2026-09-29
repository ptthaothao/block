import Link from "next/link";

import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils/cn";

import { TOPIC_COPY } from "../constants";
import type { TopicSummary } from "../types";

const CHIP = "inline-flex min-h-9 items-center gap-2 rounded-full border px-3.5 text-sm transition";
const ACTIVE = "border-accent bg-accent/15 text-text";
const IDLE = "border-border bg-surface text-muted hover:border-accent/60 hover:text-text";

/** "Tất cả · React 22 · Vue 15": switch between a topic and its children. */
export function SubtopicChips({ root, current }: { root: TopicSummary; current: string }) {
  if (root.children.length === 0) return null;
  const items = [
    { slug: root.slug, name: TOPIC_COPY.allSubtopics, postCount: root.postCount },
    ...root.children,
  ];
  return (
    <nav aria-label={root.name}>
      <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {items.map((item) => {
          const active = item.slug === current;
          return (
            <li key={item.slug} className="shrink-0">
              <Link href={ROUTES.topic(item.slug)} aria-current={active ? "page" : undefined} className={cn(CHIP, active ? ACTIVE : IDLE)}>
                {item.name}
                <span className="font-mono text-xs text-faint tabular-nums">{item.postCount}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
