import Image from "next/image";

import { isAllowedCoverUrl } from "@/lib/utils/cover-image";

import type { PostDetail } from "../types";
import { CategoryChip } from "./category-chip";
import { LevelBadge } from "./level-badge";
import { PostMeta } from "./post-meta";
import { SeriesNote } from "./series-note";

const COVER_WIDTH = 1200;
const COVER_HEIGHT = 630;

export function PostHeader({ post }: { post: PostDetail }) {
  return (
    <header className="border-b border-border pb-8">
      {isAllowedCoverUrl(post.coverUrl) && (
        <div className="mb-6 overflow-hidden rounded-xl">
          <Image
            src={post.coverUrl}
            alt=""
            width={COVER_WIDTH}
            height={COVER_HEIGHT}
            className="h-auto w-full object-cover"
            sizes="(min-width: 768px) 768px, 100vw"
            priority
          />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {post.category && <CategoryChip category={post.category} />}
        <LevelBadge level={post.level} />
      </div>
      <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-balance md:text-5xl">
        {post.title}
      </h1>
      {post.excerpt && <p className="mt-4 text-lg leading-relaxed text-muted">{post.excerpt}</p>}
      <div className="mt-6">
        <PostMeta authors={post.authors} publishedAt={post.publishedAt} readingMinutes={post.readingMinutes} />
      </div>
      {post.series && <SeriesNote series={post.series} />}
    </header>
  );
}
