"use client";

import { Avatar } from "@/components/ui/avatar";
import { TOPIC_LIMITS } from "@/features/topics/constants";
import type { AuthorOption, TagSummary, TopicSummary } from "@/features/topics/types";

import { FILTER_COPY, POST_LEVEL_VALUES, POST_LEVELS } from "../../constants";
import type { PostFilters } from "../../types";
import { buildFilterHref, filterChanges } from "../../utils/post-filters";
import { FilterGroup } from "./filter-group";
import { FilterOption } from "./filter-option";

export type PostFilterPanelProps = {
  basePath: string;
  filters: PostFilters;
  topics: TopicSummary[];
  tags: TagSummary[];
  authors: AuthorOption[];
  /** Called after an option is picked (the mobile sheet closes itself). */
  onSelect?: () => void;
};

export function PostFilterPanel({ basePath, filters, topics, tags, authors, onSelect }: PostFilterPanelProps) {
  const href = (next: PostFilters) => buildFilterHref(basePath, next);

  return (
    <nav aria-label={FILTER_COPY.panelLabel} className="space-y-5">
      <FilterGroup
        title={FILTER_COPY.topics}
        items={topics}
        itemKey={(topic) => topic.slug}
        renderItem={(topic) => {
          const childSelected = topic.children.some((child) => child.slug === filters.topic);
          return (
            <>
              <FilterOption
                href={href(filterChanges.topic(filters, topic.slug))}
                label={topic.name}
                count={topic.postCount}
                checked={filters.topic === topic.slug}
                round
                onSelect={onSelect}
              />
              {(filters.topic === topic.slug || childSelected) && topic.children.length > 0 && (
                <ul className="space-y-0.5">
                  {topic.children.map((child) => (
                    <li key={child.slug}>
                      <FilterOption
                        href={href(filterChanges.topic(filters, child.slug))}
                        label={child.name}
                        count={child.postCount}
                        checked={filters.topic === child.slug}
                        round
                        indent
                        onSelect={onSelect}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </>
          );
        }}
      />

      <FilterGroup
        title={FILTER_COPY.tags}
        items={tags}
        collapsedCount={TOPIC_LIMITS.filterTagsCollapsed}
        itemKey={(tag) => tag.slug}
        isSelected={(tag) => filters.tags.includes(tag.slug)}
        searchText={(tag) => tag.name}
        renderItem={(tag) => (
          <FilterOption
            href={href(filterChanges.tag(filters, tag.slug))}
            label={`#${tag.name}`}
            count={tag.postCount}
            checked={filters.tags.includes(tag.slug)}
            onSelect={onSelect}
          />
        )}
      />

      <FilterGroup
        title={FILTER_COPY.authors}
        items={authors}
        collapsedCount={TOPIC_LIMITS.filterAuthorsCollapsed}
        itemKey={(author) => author.username}
        isSelected={(author) => filters.author === author.username}
        renderItem={(author) => (
          <FilterOption
            href={href(filterChanges.author(filters, author.username))}
            label={author.displayName}
            count={author.postCount}
            checked={filters.author === author.username}
            round
            leading={<Avatar name={author.displayName} src={author.avatarUrl} />}
            onSelect={onSelect}
          />
        )}
      />

      <FilterGroup
        title={FILTER_COPY.levels}
        items={[...POST_LEVEL_VALUES]}
        itemKey={(level) => level}
        renderItem={(level) => (
          <FilterOption
            href={href(filterChanges.level(filters, level))}
            label={POST_LEVELS[level].label}
            checked={filters.levels.includes(level)}
            onSelect={onSelect}
          />
        )}
      />
    </nav>
  );
}
