"use client";

import { useState } from "react";

import { TAXONOMY_COPY, TAXONOMY_TABS, type TaxonomyTab } from "../../constants";
import { useCmsTaxonomy } from "../../hooks/use-cms-queries";
import { QueryState } from "../query-state";
import { CacheSyncBadge } from "./cache-sync-badge";
import { CategoryManager } from "./categories/category-manager";
import { SeriesManager } from "./series/series-manager";
import { TagManager } from "./tags/tag-manager";
import { TaxonomyTabs } from "./taxonomy-tabs";

export function TaxonomyScreen() {
  const [tab, setTab] = useState<TaxonomyTab>(TAXONOMY_TABS[0].id);
  const { data, isLoading, error, dataUpdatedAt } = useCmsTaxonomy();
  const counts = data && { categories: data.categories.length, tags: data.tags.length, series: data.series.length };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{TAXONOMY_COPY.title}</h1>
          <p className="mt-2 text-sm text-muted sm:text-base">{TAXONOMY_COPY.description}</p>
        </div>
        {data && <CacheSyncBadge updatedAt={dataUpdatedAt} />}
      </div>
      <TaxonomyTabs value={tab} onChange={setTab} counts={counts ?? null} />
      <div role="tabpanel" id={`taxonomy-panel-${tab}`} aria-labelledby={`taxonomy-tab-${tab}`} className="mt-6">
        <QueryState isLoading={isLoading} error={error} />
        {data && tab === "categories" && <CategoryManager categories={data.categories} />}
        {data && tab === "tags" && <TagManager tags={data.tags} />}
        {data && tab === "series" && <SeriesManager series={data.series} />}
      </div>
    </>
  );
}
