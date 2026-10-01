"use client";

import { useActionMutation } from "@/lib/hooks/use-action-mutation";

import { publishPost, returnToAuthor } from "../actions/posts";
import { CMS_QUERY_KEYS } from "../constants";
import type { CmsPostListItem } from "../types";

const INVALIDATE = [CMS_QUERY_KEYS.review, CMS_QUERY_KEYS.allPosts];

type PublishArgs = { id: string; categoryId?: number };
type SendBackArgs = { id: string; note: string };

/** Drop `id` from the review queue cache right away, before the round-trip resolves. */
function removeFromReviewQueue(previous: unknown, id: string) {
  return (previous as CmsPostListItem[] | undefined)?.filter((post) => post.id !== id);
}

/** Publish or return a post under review; either way it leaves the queue at once. */
export function useReviewActions() {
  const publish = useActionMutation((args: PublishArgs) => publishPost(args.id, args.categoryId), INVALIDATE, [
    { queryKey: CMS_QUERY_KEYS.review, apply: (previous, args: PublishArgs) => removeFromReviewQueue(previous, args.id) },
  ]);
  const sendBack = useActionMutation((args: SendBackArgs) => returnToAuthor(args.id, args.note), INVALIDATE, [
    { queryKey: CMS_QUERY_KEYS.review, apply: (previous, args: SendBackArgs) => removeFromReviewQueue(previous, args.id) },
  ]);

  return {
    publish: publish.mutate,
    sendBack: sendBack.mutate,
    busy: publish.isPending || sendBack.isPending,
    error: publish.error ?? sendBack.error,
  };
}
