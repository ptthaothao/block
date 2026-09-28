"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginModal } from "@/features/auth/components/login-modal";

import { POST_ANCHORS, REACTION_COPY, REACTIONS } from "../constants";
import { usePostReactions } from "../hooks/use-post-reactions";
import { postPeopleSource } from "../utils/people-source";
import { reactionReturnPath } from "../utils/return-path";
import { ReactionButton } from "./reaction-button";

/** End of the article: the full bar, big and labelled. The moment readers are most likely to react. */
export function ReactionBar({ slug }: { slug: string }) {
  const { data, isLoading, isError, retry, toggle, popped, loginOpen, closeLogin } = usePostReactions(slug);

  return (
    <section
      id={POST_ANCHORS.reactions}
      aria-labelledby="reaction-bar-title"
      className="mt-12 scroll-mt-24 rounded-xl border border-border bg-surface-sunken p-6 text-center"
    >
      <h2 id="reaction-bar-title" className="font-display text-lg font-bold">
        {REACTION_COPY.endTitle}
      </h2>
      <p className="mt-1 text-sm text-muted">{REACTION_COPY.endHint}</p>
      <div role="group" aria-label={REACTION_COPY.groupLabel} className="mt-5 flex min-h-12 flex-wrap justify-center gap-2">
        {isError ? (
          <p className="flex items-center gap-3 text-sm text-muted">
            {REACTION_COPY.loadFailed}
            <Button variant="outline" size="sm" onClick={retry}>
              {REACTION_COPY.retry}
            </Button>
          </p>
        ) : (
          REACTIONS.map((r) =>
            isLoading || !data ? (
              <Skeleton key={r.kind} className="h-12 w-32 rounded-full" />
            ) : (
              <ReactionButton
                key={r.kind}
                kind={r.kind}
                count={data.counts[r.kind] ?? 0}
                mine={data.mine.includes(r.kind)}
                popped={popped === r.kind}
                onToggle={toggle}
                variant="bar"
                showLabel
                people={postPeopleSource(slug, r.kind)}
              />
            ),
          )
        )}
      </div>
      <p aria-live="polite" className="sr-only">
        {data ? REACTIONS.map((r) => `${r.label} ${data.counts[r.kind] ?? 0}`).join(", ") : ""}
      </p>
      <LoginModal open={loginOpen} onClose={closeLogin} next={reactionReturnPath(slug)} reason={REACTION_COPY.loginReason} />
    </section>
  );
}
