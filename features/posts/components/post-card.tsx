import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { formatDate } from "@/lib/format/date";
import { isAllowedCoverUrl } from "@/lib/utils/cover-image";

import type { PostSummary } from "../types";
import { coverFallbackBackground } from "../utils/cover-fallback";
import { CategoryChip } from "./category-chip";
import { LevelBadge } from "./level-badge";

/** Rendered cover width in the 1–5 column post grid. */
const COVER_SIZES = "(min-width: 1536px) 300px, (min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw";

type PostCardProps = {
  post: PostSummary;
  /** Why the post was picked, e.g. "Vì bạn quan tâm Laravel"; shown on the cover. */
  reason?: ReactNode;
  /** A "⋯" menu on the cover's corner. Sits above the card's own link. */
  menu?: ReactNode;
};

/** Cover, category, title, a two-line excerpt, date and level — nothing else, so a dense grid stays calm. */
export function PostCard({ post, reason, menu }: PostCardProps) {
  return (
    <Card as="article" interactive className="group relative flex flex-col">
      <div className="relative aspect-video overflow-hidden rounded-t-[inherit] border-b border-border">
        {isAllowedCoverUrl(post.coverUrl) ? (
          <Image
            src={post.coverUrl}
            alt=""
            fill
            sizes={COVER_SIZES}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        ) : (
          <div
            aria-hidden
            className="flex h-full items-end p-5"
            style={{ background: coverFallbackBackground(post.category?.color ?? null) }}
          >
            <span className="line-clamp-2 font-display text-2xl leading-tight font-extrabold text-text/15">{post.title}</span>
          </div>
        )}
        {reason && (
          <p className="absolute bottom-2.5 left-2.5 flex max-w-[calc(100%-1.25rem)] items-center gap-1.5 rounded-full bg-canvas/80 px-2.5 py-1 text-[11px] font-medium text-accent ring-1 ring-white/10 backdrop-blur">
            <Sparkles aria-hidden className="size-3 shrink-0" />
            <span className="truncate">{reason}</span>
          </p>
        )}
      </div>
      {menu && <div className="absolute top-2 right-2 z-10 rounded-md bg-canvas/75 ring-1 ring-white/10 backdrop-blur">{menu}</div>}

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        {post.category && <CategoryChip category={post.category} linked withParent />}
        <h3 className="line-clamp-2 font-display text-lg leading-snug font-bold text-balance transition-colors group-hover:text-accent-hover">
          <Link href={ROUTES.post(post.slug)} className="after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="line-clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          {post.publishedAt ? (
            <time dateTime={post.publishedAt} className="font-mono text-xs text-faint">
              {formatDate(post.publishedAt)}
            </time>
          ) : (
            <span />
          )}
          <LevelBadge level={post.level} />
        </div>
      </div>
    </Card>
  );
}
