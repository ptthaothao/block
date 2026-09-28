import Link from "next/link";

import { Chip } from "@/components/ui/chip";
import { ROUTES } from "@/config/routes";

import type { TagRef } from "../types";

export function PostTagList({ tags }: { tags: TagRef[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="mt-12 flex flex-wrap gap-2 border-t border-border pt-6">
      {tags.map((tag) => (
        <li key={tag.slug}>
          <Link href={ROUTES.tag(tag.slug)} className="group rounded-full">
            <Chip className="transition group-hover:border-accent/60 group-hover:text-accent">#{tag.name}</Chip>
          </Link>
        </li>
      ))}
    </ul>
  );
}
