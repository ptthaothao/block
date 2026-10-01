"use client";

import { Clock, ExternalLink, FileText, SquarePen } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { DATE_LOCALE } from "@/lib/format/constants";
import { formatDateTime } from "@/lib/format/date";
import { formatRelativeTime } from "@/lib/format/relative-time";
import { estimateReadingMinutes } from "@/lib/markdown/reading-time";
import { countWords } from "@/lib/markdown/word-count";

import { REVIEW_SHORT_ID_LENGTH } from "../../constants";
import { useMarkdownPreview } from "../../hooks/use-markdown-preview";
import type { CmsPost, CmsPostListItem } from "../../types";
import { reviewChecks } from "../../utils/review-checks";
import { PostStatusBadge } from "../status-badge";
import { ReviewChecks } from "./review-checks";

type ReviewArticleProps = { post: CmsPost; item: CmsPostListItem };

/** Middle column: the post as readers will see it, plus the automatic checks. */
export function ReviewArticle({ post, item }: ReviewArticleProps) {
  const { html, error } = useMarkdownPreview(post.contentMd, true, { debounce: false });
  const words = countWords(post.contentMd);
  const authorName = item.authorName ?? "Không rõ tác giả";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <header className="flex flex-col gap-4 rounded-xl border border-editor-line bg-editor-panel p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <PostStatusBadge status={post.status} />
          <span className="rounded-md border border-editor-line bg-editor-chip px-2 py-0.5 font-mono text-[10px] leading-4 text-muted">
            ID: {post.id.slice(0, REVIEW_SHORT_ID_LENGTH)}
          </span>
          <ButtonLink href={ROUTES.cmsEditPost(post.id)} variant="outline" size="sm" className="ml-auto text-xs">
            <SquarePen aria-hidden className="size-3.5" />
            Mở trong editor
            <ExternalLink aria-hidden className="size-3" />
          </ButtonLink>
        </div>

        <div>
          <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl">{post.title}</h2>
          <p className="mt-1 font-mono text-xs text-accent">{ROUTES.post(post.slug)}</p>
          {post.excerpt && <p className="mt-3 text-sm leading-6 text-muted">{post.excerpt}</p>}
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-editor-line bg-editor-base/60 p-3">
          <Avatar name={authorName} src={null} size="md" className="bg-accent-strong text-white ring-accent/40" />
          <div className="min-w-0 text-xs leading-5">
            <p className="font-bold text-text">{authorName}</p>
            <p className="font-mono text-[11px] text-faint">
              Cập nhật lúc {formatDateTime(post.updatedAt)} ({formatRelativeTime(post.updatedAt)})
            </p>
          </div>
        </div>

        <p className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-muted">
          <span className="flex items-center gap-1">
            <Clock aria-hidden className="size-3.5" />
            {estimateReadingMinutes(post.contentMd)} phút đọc
          </span>
          <span className="flex items-center gap-1">
            <FileText aria-hidden className="size-3.5" />
            {words.toLocaleString(DATE_LOCALE)} từ
          </span>
        </p>
      </header>

      <article className="rounded-xl border border-editor-line bg-editor-panel p-5 sm:p-8">
        {error && <Alert tone="error">{error}</Alert>}
        {post.contentMd.trim() ? (
          // Rendered and sanitized on the server by the same pipeline as the public page.
          <div className="article-prose prose-base" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p className="text-sm text-faint">Bài viết chưa có nội dung.</p>
        )}
      </article>

      <ReviewChecks checks={reviewChecks(post)} words={words} />
    </div>
  );
}
