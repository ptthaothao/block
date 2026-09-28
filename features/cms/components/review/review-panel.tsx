"use client";

import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/config/routes";

import { publishPost, returnToAuthor } from "../../actions/posts";
import { CMS_LIMITS, CMS_QUERY_KEYS } from "../../constants";
import { useActionMutation } from "@/lib/hooks/use-action-mutation";
import { useCmsPost } from "../../hooks/use-cms-queries";
import { useMarkdownPreview } from "../../hooks/use-markdown-preview";
import type { CmsPostListItem } from "../../types";
import { QueryState } from "../query-state";

const NOTE_FIELD_ID = "review-note";
const NOTE_ROWS = 3;
const INVALIDATE = [CMS_QUERY_KEYS.review, CMS_QUERY_KEYS.allPosts];

/** Drop `id` from the review queue cache right away, before the round-trip resolves. */
function removeFromReviewQueue(previous: unknown, id: string) {
  return (previous as CmsPostListItem[] | undefined)?.filter((post) => post.id !== id);
}

export function ReviewPanel({ postId }: { postId: string }) {
  const { data: post, isLoading, error } = useCmsPost(postId);
  const { html } = useMarkdownPreview(post?.contentMd ?? "", Boolean(post), { debounce: false });
  const [note, setNote] = useState("");

  const publish = useActionMutation((id: string) => publishPost(id), INVALIDATE, [
    { queryKey: CMS_QUERY_KEYS.review, apply: removeFromReviewQueue },
  ]);
  const sendBack = useActionMutation((args: { id: string; note: string }) => returnToAuthor(args.id, args.note), INVALIDATE, [
    { queryKey: CMS_QUERY_KEYS.review, apply: (previous, args: { id: string; note: string }) => removeFromReviewQueue(previous, args.id) },
  ]);
  const busy = publish.isPending || sendBack.isPending;
  const actionError = publish.error ?? sendBack.error;

  if (!post) return <QueryState isLoading={isLoading} error={error} />;

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="font-display text-2xl font-extrabold">{post.title}</h2>
          <ButtonLink href={ROUTES.dashboardEditPost(post.id)} variant="outline" size="sm">
            Mở trong editor
          </ButtonLink>
        </div>
        {post.excerpt && <p className="mt-2 text-muted">{post.excerpt}</p>}
        <div className="article-prose prose-base mt-6" dangerouslySetInnerHTML={{ __html: html }} />
      </Card>

      <Card className="space-y-4 p-5">
        {actionError && <Alert tone="error">{actionError.message}</Alert>}
        <Field id={NOTE_FIELD_ID} label="Ghi chú cho tác giả (khi trả lại)">
          <Textarea
            id={NOTE_FIELD_ID}
            rows={NOTE_ROWS}
            maxLength={CMS_LIMITS.reviewNoteMax}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Field>
        <div className="flex flex-wrap gap-2">
          <Button disabled={busy} onClick={() => publish.mutate(post.id)}>
            Đăng bài
          </Button>
          <Button
            variant="outline"
            disabled={busy || note.trim() === ""}
            onClick={() => sendBack.mutate({ id: post.id, note })}
          >
            Trả lại tác giả
          </Button>
        </div>
      </Card>
    </div>
  );
}
