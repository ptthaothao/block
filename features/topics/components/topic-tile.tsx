import Link from "next/link";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";

import { TOPIC_COPY } from "../constants";
import type { TopicSummary } from "../types";
import { TopicIconTile } from "./topic-icon-tile";

type TopicTileProps = {
  topic: TopicSummary;
  /** Rendered above the tile's link, e.g. a "Quan tâm" toggle. */
  action?: ReactNode;
};

export function TopicTile({ topic, action }: TopicTileProps) {
  return (
    <Card as="li" interactive className="group relative flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <TopicIconTile icon={topic.icon} color={topic.color} />
        {action && <div className="relative z-10">{action}</div>}
      </div>
      <div>
        <h3 className="font-display text-lg font-bold">
          <Link href={ROUTES.topic(topic.slug)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {topic.name}
          </Link>
        </h3>
        <p className="mt-1 font-mono text-xs text-faint">{TOPIC_COPY.postCount(topic.postCount)}</p>
      </div>
      {topic.description && <p className="line-clamp-2 text-sm leading-relaxed text-muted">{topic.description}</p>}
    </Card>
  );
}
