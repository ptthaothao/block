import type { ReactNode } from "react";

import { CardGrid } from "@/components/ui/card-grid";
import { EmptyState } from "@/components/ui/empty-state";

import { TOPIC_COPY } from "../constants";
import type { TopicSummary } from "../types";
import { TopicTile } from "./topic-tile";

type TopicGridProps = {
  topics: TopicSummary[];
  /** Per-tile action, e.g. a follow toggle. */
  renderAction?: (topic: TopicSummary) => ReactNode;
};

export function TopicGrid({ topics, renderAction }: TopicGridProps) {
  if (topics.length === 0) return <EmptyState title={TOPIC_COPY.emptyTopics} />;
  return (
    <CardGrid as="ul" columns={4}>
      {topics.map((topic) => (
        <TopicTile key={topic.slug} topic={topic} action={renderAction?.(topic)} />
      ))}
    </CardGrid>
  );
}
