"use client";

import { X } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button, ButtonLink } from "@/components/ui/button";
import { ColorDot } from "@/components/ui/color-dot";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/config/routes";
import { useActionMutation } from "@/lib/hooks/use-action-mutation";
import { useToast } from "@/lib/hooks/use-toast";

import { resetInterests } from "../actions";
import { INTEREST_COPY, INTEREST_QUERY_KEYS, INTEREST_TIMINGS } from "../constants";
import { useInterests } from "../hooks/use-interests";
import type { InterestItem } from "../types";
import { interestLabel } from "../utils/feed-card";
import { groupInterests } from "../utils/group-interests";

const MANAGER_SKELETON_GROUPS = 3;

/** "Quan tâm của tôi": everything followed or muted, removable in one tap with undo. */
export function InterestManager() {
  const { ready, items, change } = useInterests();
  const toast = useToast();
  const reset = useActionMutation(resetInterests, [INTEREST_QUERY_KEYS.mine]);

  if (!ready) {
    return (
      <div className="space-y-10">
        {Array.from({ length: MANAGER_SKELETON_GROUPS }, (_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-3 w-24" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-36 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const remove = async (item: InterestItem) => {
    const restore = { ...item };
    if (!(await change({ ...item, weight: 0 }))) return;
    const label = interestLabel(item.type, item.name);
    toast.show({
      message: item.weight === 1 ? INTEREST_COPY.unfollowedToast(label) : INTEREST_COPY.unmutedToast(label),
      action: { label: INTEREST_COPY.undo, onClick: () => void change(restore) },
      durationMs: INTEREST_TIMINGS.undoMs,
    });
  };

  const groups = groupInterests(items);
  const sections = [
    { id: "topics", title: INTEREST_COPY.groupTopics, items: groups.categories, empty: INTEREST_COPY.groupEmpty },
    { id: "tags", title: INTEREST_COPY.groupTags, items: groups.tags, empty: INTEREST_COPY.groupEmpty },
    { id: "authors", title: INTEREST_COPY.groupAuthors, items: groups.authors, empty: INTEREST_COPY.groupEmpty },
    { id: "muted", title: INTEREST_COPY.groupMuted, items: groups.muted, empty: INTEREST_COPY.mutedEmpty },
  ];

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.id} aria-labelledby={`interests-${section.id}`} className="space-y-3">
          <Eyebrow as="h2" id={`interests-${section.id}`}>
            {section.title} <span className="tabular-nums">({section.items.length})</span>
          </Eyebrow>
          {section.items.length === 0 ? (
            <p className="text-sm text-faint">{section.empty}</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {section.items.map((item) => (
                <li key={`${item.type}:${item.slug}`}>
                  <InterestPill item={item} onRemove={() => remove(item)} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <ButtonLink href={ROUTES.onboarding} variant="outline" size="sm">
          {INTEREST_COPY.addMore}
        </ButtonLink>
        {items.length > 0 && (
          <Button
            variant="ghost"
            className="text-sm text-danger hover:text-danger"
            disabled={reset.isPending}
            onClick={async () => {
              if (!window.confirm(INTEREST_COPY.resetConfirm)) return;
              try {
                await reset.mutateAsync(undefined);
                toast.show({ message: INTEREST_COPY.resetDone, tone: "success" });
              } catch {
                toast.show({ message: INTEREST_COPY.saveFailed, tone: "error" });
              }
            }}
          >
            {INTEREST_COPY.reset}
          </Button>
        )}
      </div>
    </div>
  );
}

function InterestPill({ item, onRemove }: { item: InterestItem; onRemove: () => void }) {
  const label = interestLabel(item.type, item.name);
  const muted = item.weight === -1;
  return (
    <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-surface py-1 pr-1 pl-3 text-sm">
      {item.type === "author" ? (
        <Avatar name={item.name} src={item.avatarUrl} className="-ml-1.5" />
      ) : item.type === "category" ? (
        <ColorDot color={item.color} />
      ) : null}
      <span className={muted ? "text-faint line-through decoration-faint/50" : "text-text"}>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`${muted ? INTEREST_COPY.unmute : INTEREST_COPY.remove} ${label}`}
        className="grid size-8 place-items-center rounded-full text-faint transition hover:bg-surface-hover hover:text-text"
      >
        <X aria-hidden className="size-4" />
      </button>
    </span>
  );
}
