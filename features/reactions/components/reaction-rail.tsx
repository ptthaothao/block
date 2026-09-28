"use client";

import { MessageSquare } from "lucide-react";

import { LoginModal } from "@/features/auth/components/login-modal";
import { Skeleton } from "@/components/ui/skeleton";

import { POST_ANCHORS, REACTION_COPY, REACTIONS } from "../constants";
import { usePostReactions } from "../hooks/use-post-reactions";
import { postPeopleSource } from "../utils/people-source";
import { reactionReturnPath } from "../utils/return-path";
import { ReactionButton } from "./reaction-button";

/** Desktop (lg+): a sticky column left of the article. */
export function ReactionRail({ slug }: { slug: string }) {
  const { data, isLoading, toggle, popped, loginOpen, closeLogin } = usePostReactions(slug);

  return (
    <div role="group" aria-label={REACTION_COPY.groupLabel} className="sticky top-24 flex flex-col items-center gap-2">
      {REACTIONS.map((r) =>
        isLoading || !data ? (
          <Skeleton key={r.kind} className="size-12 rounded-xl" />
        ) : (
          <ReactionButton
            key={r.kind}
            kind={r.kind}
            count={data.counts[r.kind] ?? 0}
            mine={data.mine.includes(r.kind)}
            popped={popped === r.kind}
            onToggle={toggle}
            variant="rail"
            people={postPeopleSource(slug, r.kind)}
            tooltipSide="right"
          />
        ),
      )}
      <span aria-hidden className="my-1 h-px w-8 bg-border" />
      <a
        href={`#${POST_ANCHORS.comments}`}
        aria-label={REACTION_COPY.goToComments}
        className="grid size-12 place-items-center gap-0.5 rounded-xl border border-border bg-surface text-[11px] text-muted tabular-nums transition hover:border-border-strong hover:text-text"
      >
        <MessageSquare aria-hidden className="size-5" />
        {data?.commentCount ?? 0}
      </a>
      <LoginModal open={loginOpen} onClose={closeLogin} next={reactionReturnPath(slug)} reason={REACTION_COPY.loginReason} />
    </div>
  );
}
