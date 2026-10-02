"use client";

import { Plus, Search } from "lucide-react";
import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { useActionMutation } from "@/lib/hooks/use-action-mutation";

import { deleteSeries } from "../../../actions/taxonomy";
import { CMS_QUERY_KEYS, CONFIRM_MESSAGES, EMPTY_SERIES_FORM, TAXONOMY_COPY } from "../../../constants";
import type { SeriesInput } from "../../../schemas";
import type { CmsSeries, CmsTaxonomy } from "../../../types";
import { filterSeries } from "../../../utils/series-filter";
import { toSeriesForm } from "../../../utils/taxonomy-form";
import { SeriesCard } from "./series-card";
import { SeriesForm } from "./series-form";

const SEARCH_ID = "series-search";

/** Card grid of series; adding or editing one opens a drawer. */
export function SeriesManager({ series }: { series: CmsSeries[] }) {
  const [editing, setEditing] = useState<SeriesInput | null>(null);
  const [search, setSearch] = useState("");
  const visible = filterSeries(series, search);

  const remove = useActionMutation(deleteSeries, [CMS_QUERY_KEYS.taxonomy], [
    {
      queryKey: CMS_QUERY_KEYS.taxonomy,
      apply: (previous, id: number) => {
        const taxonomy = previous as CmsTaxonomy | undefined;
        return taxonomy && { ...taxonomy, series: taxonomy.series.filter((s) => s.id !== id) };
      },
    },
  ]);

  const confirmDelete = (id: number) => {
    if (!window.confirm(CONFIRM_MESSAGES.deleteSeries)) return;
    remove.mutate(id, { onSuccess: () => setEditing((e) => (e?.id === id ? null : e)) });
  };

  return (
    <div className="space-y-5">
      <label htmlFor={SEARCH_ID} className="relative block max-w-xl">
        <span className="sr-only">{TAXONOMY_COPY.series.search}</span>
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-faint" />
        <input
          id={SEARCH_ID}
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={TAXONOMY_COPY.series.search}
          className="w-full rounded-lg border border-border bg-surface py-3 pr-4 pl-11 text-sm placeholder:text-faint focus:border-accent focus:outline-none"
        />
      </label>
      {remove.error && <Alert tone="error">{remove.error.message}</Alert>}

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <SeriesCard
            key={item.id}
            series={item}
            editing={editing?.id === item.id}
            disabled={remove.isPending}
            onEdit={() => setEditing(toSeriesForm(item))}
            onDelete={() => confirmDelete(item.id)}
          />
        ))}
        <li>
          <button
            type="button"
            onClick={() => setEditing(EMPTY_SERIES_FORM)}
            className="flex h-full min-h-56 w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border-strong text-muted transition hover:border-accent hover:bg-accent/5 hover:text-accent"
          >
            <span className="grid size-11 place-items-center rounded-full bg-surface ring-1 ring-border">
              <Plus aria-hidden className="size-5" />
            </span>
            <span className="font-display font-semibold">{TAXONOMY_COPY.series.add}</span>
          </button>
        </li>
      </ul>
      {visible.length === 0 && (
        <p className="text-center text-sm text-muted">{series.length === 0 ? TAXONOMY_COPY.series.empty : TAXONOMY_COPY.series.noMatch}</p>
      )}

      {editing && (
        <SeriesForm
          key={editing.id ?? "new"}
          initial={editing}
          deleting={remove.isPending}
          onClose={() => setEditing(null)}
          onDelete={() => editing.id !== null && confirmDelete(editing.id)}
        />
      )}
    </div>
  );
}
