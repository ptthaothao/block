import type { PostSummary } from "@/features/posts/types";

import type { FeedReason, InterestChange, InterestType } from "../types";

/** How a followed or muted target reads in the UI: tags keep their "#". */
export function interestLabel(type: InterestType, name: string): string {
  return type === "tag" ? `#${name}` : name;
}

export function reasonLabel(reason: FeedReason): string {
  return interestLabel(reason.type, reason.label);
}

/**
 * What "Ít nội dung như thế này hơn" mutes for a post: its topic, or its first
 * tag when it has no topic. Null when there is nothing to mute.
 */
export function muteTargetOf(post: PostSummary): Omit<InterestChange, "weight"> | null {
  if (post.category) {
    return { type: "category", slug: post.category.slug, name: post.category.name, color: post.category.color };
  }
  const tag = post.tags[0];
  return tag ? { type: "tag", slug: tag.slug, name: tag.name } : null;
}
