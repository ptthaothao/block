import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { isAllowedCoverUrl } from "@/lib/utils/cover-image";

import { POST_LIMITS } from "../constants";
import type { PostSummary } from "../types";
import { CategoryChip } from "./category-chip";
import { LevelBadge } from "./level-badge";
import { PostMeta } from "./post-meta";

const COVER_ASPECT_RATIO = "16 / 9";

type PostCardProps = {
  post: PostSummary;
  /** A short line above the card, e.g. "Vì bạn quan tâm Laravel". */
  reason?: ReactNode;
  /** A "⋯" menu next to the level badge. Sits above the card's own link. */
  menu?: ReactNode;
};

export function PostCard({ post, reason, menu }: PostCardProps) {
  return (
    <Card as="article" interactive className="group relative flex flex-col gap-4 p-6">
      {isAllowedCoverUrl(post.coverUrl) && (
        <div className="-mx-6 -mt-6 overflow-hidden rounded-t-[inherit]" style={{ aspectRatio: COVER_ASPECT_RATIO }}>
          <Image
            src={post.coverUrl}
            alt=""
            width={640}
            height={360}
            className="h-full w-full object-cover"
            sizes="(min-width: 1024px) 360px, 100vw"
          />
        </div>
      )}
      {reason && <p className="-mb-1 truncate text-xs font-medium text-accent">{reason}</p>}
      <div className="flex items-center justify-between gap-3">
        {post.category && <CategoryChip category={post.category} linked withParent />}
        <div className="ml-auto flex items-center gap-1">
          <LevelBadge level={post.level} />
          {menu && <div className="relative z-10 -mr-2">{menu}</div>}
        </div>
      </div>

      <h3 className="font-display text-xl font-bold leading-snug text-balance">
        <Link href={ROUTES.post(post.slug)} className="after:absolute after:inset-0 focus-visible:outline-none">
          {post.title}
        </Link>
      </h3>

      {post.excerpt && <p className="line-clamp-3 text-[15px] leading-relaxed text-muted">{post.excerpt}</p>}

      {post.tags.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {post.tags.slice(0, POST_LIMITS.tagsOnCard).map((tag) => (
            <li key={tag.slug}>
              <Link
                href={ROUTES.tag(tag.slug)}
                className="relative z-10 font-mono text-xs text-faint transition hover:text-accent"
              >
                #{tag.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto border-t border-border pt-4">
        <PostMeta authors={post.authors} publishedAt={post.publishedAt} readingMinutes={post.readingMinutes} />
      </div>
    </Card>
  );
}
