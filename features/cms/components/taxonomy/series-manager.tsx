"use client";

import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

import { deleteSeries } from "../../actions/taxonomy";
import { CMS_QUERY_KEYS, CONFIRM_MESSAGES, EMPTY_SERIES_FORM } from "../../constants";
import { useActionMutation } from "../../hooks/use-action-mutation";
import type { SeriesInput } from "../../schemas";
import type { CmsSeries, CmsTaxonomy } from "../../types";
import { toSeriesForm } from "../../utils/taxonomy-form";
import { RowActions } from "./row-actions";
import { SeriesForm } from "./series-form";

export function SeriesManager({ series }: { series: CmsSeries[] }) {
  const [editing, setEditing] = useState<SeriesInput | null>(null);
  const remove = useActionMutation(deleteSeries, [CMS_QUERY_KEYS.taxonomy], [
    {
      queryKey: CMS_QUERY_KEYS.taxonomy,
      apply: (previous, id: number) => {
        const taxonomy = previous as CmsTaxonomy | undefined;
        return taxonomy && { ...taxonomy, series: taxonomy.series.filter((s) => s.id !== id) };
      },
    },
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-3">
        <Button size="sm" onClick={() => setEditing(EMPTY_SERIES_FORM)}>
          Thêm series
        </Button>
        {remove.error && <Alert tone="error">{remove.error.message}</Alert>}
        {series.length === 0 ? (
          <EmptyState title="Chưa có series nào" />
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {series.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="font-mono text-xs text-faint">{item.slug}</p>
                </div>
                <RowActions
                  disabled={remove.isPending}
                  onEdit={() => setEditing(toSeriesForm(item))}
                  onDelete={() => window.confirm(CONFIRM_MESSAGES.deleteSeries) && remove.mutate(item.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      {editing && <SeriesForm key={editing.id ?? "new"} initial={editing} onDone={() => setEditing(null)} />}
    </div>
  );
}
