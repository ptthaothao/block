import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { DEFAULT_DOT_COLOR } from "@/components/ui/color-dot";
import { Eyebrow } from "@/components/ui/eyebrow";
import { TextLink } from "@/components/ui/text-link";
import { ROUTES } from "@/config/routes";

import { TOPIC_COPY, TOPIC_TINT_ALPHA } from "../constants";
import { topicTint } from "../utils/topic-tint";
import { TopicIcon } from "./topic-icon";

type TopicHeroProps = {
  eyebrow: string;
  title: string;
  description: string | null;
  icon?: string | null;
  color: string | null;
  postCount: number;
  parent?: { slug: string; name: string } | null;
  /** Extra stats after the post count, e.g. followers. */
  stats?: ReactNode;
  /** Primary action, e.g. the "Quan tâm" toggle. */
  action?: ReactNode;
  /** Rendered under the title block, e.g. sub-topic chips. */
  children?: ReactNode;
};

/** Header band tinted with the topic's colour, shared by topic and tag pages. */
export function TopicHero({ eyebrow, title, description, icon, color, postCount, parent, stats, action, children }: TopicHeroProps) {
  const glow = topicTint(color, TOPIC_TINT_ALPHA.glow);
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={glow ? { background: `radial-gradient(ellipse at top left, ${glow}, transparent 65%)` } : undefined}
      />
      <Container className="relative py-12 md:py-16">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex min-w-0 items-start gap-5">
            {icon !== undefined && (
              <span
                className="hidden size-14 shrink-0 place-items-center rounded-xl sm:grid"
                style={{ background: topicTint(color) ?? undefined, color: color ?? DEFAULT_DOT_COLOR }}
              >
                <TopicIcon icon={icon} className="size-7" />
              </span>
            )}
            <div className="min-w-0">
              <Eyebrow>
                {parent ? (
                  <>
                    <TextLink href={ROUTES.topic(parent.slug)} className="text-faint">
                      {parent.name}
                    </TextLink>
                    {" › "}
                    {eyebrow}
                  </>
                ) : (
                  eyebrow
                )}
              </Eyebrow>
              <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-balance md:text-5xl">{title}</h1>
              {description && <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>}
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-faint">
                <span>{TOPIC_COPY.postCount(postCount)}</span>
                {stats}
              </p>
            </div>
          </div>
          {action}
        </div>
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
