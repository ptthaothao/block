"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ROUTES } from "@/config/routes";
import { TopicIconTile } from "@/features/topics/components/topic-icon-tile";
import type { TagSummary, TopicSummary } from "@/features/topics/types";
import { cn } from "@/lib/utils/cn";

import { INTEREST_COPY, INTEREST_LIMITS } from "../constants";
import { useFeedTab } from "../hooks/use-feed-tab";
import { useInterests } from "../hooks/use-interests";
import type { InterestChange } from "../types";
import { weightOf } from "../utils/interest-state";

type OnboardingPickerProps = { topics: TopicSummary[]; tags: TagSummary[] };

/**
 * Pick topics and tags to follow. Every tap is saved right away (to the
 * account, or this browser), so leaving halfway loses nothing.
 */
export function OnboardingPicker({ topics, tags }: OnboardingPickerProps) {
  const router = useRouter();
  const { ready, items, change } = useInterests();
  const [, pickTab] = useFeedTab();
  const picked = items.filter((item) => item.weight === 1 && item.type !== "author").length;
  const missing = Math.max(0, INTEREST_LIMITS.onboardingMin - picked);

  const isOn = (type: InterestChange["type"], slug: string) => weightOf(items, type, slug) === 1;
  const toggle = (target: Omit<InterestChange, "weight">) =>
    void change({ ...target, weight: isOn(target.type, target.slug) ? 0 : 1 });

  const finish = () => {
    pickTab("for-you");
    router.push(ROUTES.home);
  };

  return (
    <>
      <Container className="space-y-12 pt-12 pb-32 md:pt-16">
        <header className="max-w-2xl">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
            {INTEREST_COPY.onboardingTitle}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">{INTEREST_COPY.onboardingSubtitle}</p>
        </header>

        <section className="space-y-4">
          <Eyebrow as="h2">{INTEREST_COPY.onboardingTopics}</Eyebrow>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map((topic) => {
              const on = isOn("category", topic.slug);
              return (
                <li key={topic.slug}>
                  <button
                    type="button"
                    disabled={!ready}
                    aria-pressed={on}
                    onClick={() => toggle({ type: "category", slug: topic.slug, name: topic.name, color: topic.color })}
                    className={cn(
                      "relative flex w-full items-center gap-4 rounded-lg border p-4 text-left transition disabled:cursor-wait",
                      on
                        ? "border-accent bg-accent/10 shadow-glow"
                        : "border-border bg-surface hover:border-accent/60 hover:bg-surface-hover",
                    )}
                  >
                    <TopicIconTile icon={topic.icon} color={topic.color} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display font-bold">{topic.name}</span>
                      {topic.children.length > 0 && (
                        <span className="mt-0.5 block truncate text-xs text-faint">
                          {topic.children.map((child) => child.name).join(" · ")}
                        </span>
                      )}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-full border transition",
                        on ? "border-accent bg-accent text-canvas" : "border-border-strong",
                      )}
                    >
                      {on && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {tags.length > 0 && (
          <section className="space-y-4">
            <Eyebrow as="h2">{INTEREST_COPY.onboardingTags}</Eyebrow>
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const on = isOn("tag", tag.slug);
                return (
                  <li key={tag.slug}>
                    <button
                      type="button"
                      disabled={!ready}
                      aria-pressed={on}
                      onClick={() => toggle({ type: "tag", slug: tag.slug, name: tag.name })}
                      className={cn(
                        "inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 font-mono text-sm transition disabled:cursor-wait",
                        on
                          ? "border-accent bg-accent/15 text-accent"
                          : "border-border bg-surface text-muted hover:border-accent/60 hover:text-text",
                      )}
                    >
                      {on && <Check aria-hidden className="size-3.5" strokeWidth={3} />}#{tag.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </Container>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-canvas/90 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <Container className="flex items-center justify-between gap-4 py-3">
          <p aria-live="polite" className="font-mono text-sm text-muted">
            {missing > 0 ? INTEREST_COPY.onboardingNeedMore(missing) : INTEREST_COPY.onboardingPicked(picked)}
          </p>
          <div className="flex items-center gap-2">
            <ButtonLink href={ROUTES.home} variant="ghost" className="px-3 py-2 text-sm">
              {INTEREST_COPY.onboardingSkip}
            </ButtonLink>
            <Button size="sm" disabled={missing > 0} onClick={finish}>
              {INTEREST_COPY.onboardingDone}
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
}
