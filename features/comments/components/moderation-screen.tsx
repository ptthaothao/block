"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { TextLink } from "@/components/ui/text-link";
import { ROUTES } from "@/config/routes";
import { PageHeader } from "@/features/cms/components/page-header";
import { QueryState } from "@/features/cms/components/query-state";
import { formatDateTime } from "@/lib/format/date";
import type { ActionResult } from "@/lib/actions/types";
import { useToast } from "@/lib/hooks/use-toast";

import { approveComment, dismissReports, hideReportedComment } from "../actions";
import { commentsApi } from "../api";
import { COMMENT_ANCHOR_PREFIX, COMMENT_QUERY_KEYS, COMMENT_STATUS_TONES, MODERATION_COPY, REPORT_REASONS } from "../constants";
import type { ModerationItem } from "../types";

/** Editors: pending comments and reported ones, each with Duyệt / Ẩn / Bỏ qua. */
export function ModerationScreen() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);
  const { data, isLoading, error } = useQuery({ queryKey: COMMENT_QUERY_KEYS.moderation, queryFn: commentsApi.moderation });

  const act = async (item: ModerationItem, action: (id: string) => Promise<ActionResult<null>>) => {
    setBusyId(item.commentId);
    const result = await action(item.commentId);
    setBusyId(null);
    if (!result.ok) {
      toast.show({ message: result.error, tone: "error" });
      return;
    }
    queryClient.setQueryData<{ items: ModerationItem[] }>(COMMENT_QUERY_KEYS.moderation, (current) =>
      current ? { items: current.items.filter((i) => i.commentId !== item.commentId) } : current,
    );
    toast.show({ message: MODERATION_COPY.done, tone: "success" });
  };

  return (
    <>
      <PageHeader title={MODERATION_COPY.title} description={MODERATION_COPY.description} />
      <QueryState isLoading={isLoading} error={error} />
      {data && data.items.length === 0 && <EmptyState title={MODERATION_COPY.empty} />}
      {data && data.items.length > 0 && (
        <ul className="space-y-3">
          {data.items.map((item) => (
            <li key={item.commentId}>
              <Card className="space-y-3 p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="font-semibold text-text">{item.author?.displayName}</span>
                  <span>{formatDateTime(item.createdAt)}</span>
                  {item.status === "pending" && <Badge className={COMMENT_STATUS_TONES.pending}>{MODERATION_COPY.pending}</Badge>}
                  {item.openReports > 0 && (
                    <Badge className={COMMENT_STATUS_TONES.reported}>{MODERATION_COPY.reports(item.openReports)}</Badge>
                  )}
                  {item.reasons.map((reason) => (
                    <span key={reason}>{REPORT_REASONS.find((r) => r.id === reason)?.label}</span>
                  ))}
                  {item.post && (
                    <TextLink
                      href={`${ROUTES.post(item.post.slug)}#${COMMENT_ANCHOR_PREFIX}${item.commentId}`}
                      tone="accent"
                      className="ml-auto"
                    >
                      {MODERATION_COPY.openPost}: {item.post.title}
                    </TextLink>
                  )}
                </div>
                <p className="whitespace-pre-wrap break-words text-sm">{item.body}</p>
                <div className="flex flex-wrap gap-2">
                  {item.status === "pending" && (
                    <Button size="sm" disabled={busyId === item.commentId} onClick={() => act(item, approveComment)}>
                      {MODERATION_COPY.approve}
                    </Button>
                  )}
                  <Button size="sm" variant="outline" disabled={busyId === item.commentId} onClick={() => act(item, hideReportedComment)}>
                    {MODERATION_COPY.hide}
                  </Button>
                  {item.openReports > 0 && (
                    <Button variant="ghost" className="px-3 text-sm" disabled={busyId === item.commentId} onClick={() => act(item, dismissReports)}>
                      {MODERATION_COPY.dismiss}
                    </Button>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
