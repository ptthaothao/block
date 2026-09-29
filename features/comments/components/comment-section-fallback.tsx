import { COMMENT_COPY, POST_COMMENTS_ANCHOR } from "../constants";
import { CommentSkeleton } from "./comment-skeleton";

/** Server-rendered placeholder with the section's shape, until the client part takes over. */
export function CommentSectionFallback() {
  return (
    <section id={POST_COMMENTS_ANCHOR} aria-label={COMMENT_COPY.title(0)} className="mt-14 scroll-mt-24">
      <div className="mb-6 h-10" />
      <div className="h-12 rounded-lg border border-border bg-surface" />
      <div className="mt-8">
        <CommentSkeleton />
      </div>
    </section>
  );
}
