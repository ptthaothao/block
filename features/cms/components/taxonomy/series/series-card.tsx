"use client";

import { Layers, Link2, PenLine, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { isAllowedCoverUrl } from "@/lib/utils/cover-image";
import { cn } from "@/lib/utils/cn";

import { TAXONOMY_COPY } from "../../../constants";
import type { CmsSeries } from "../../../types";
import { seriesMonogram } from "../../../utils/series-monogram";

/** Rendered width of a card cover in the 1–3 column grid. */
const COVER_SIZES = "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw";

type SeriesCardProps = {
  series: CmsSeries;
  editing: boolean;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function SeriesCard({ series, editing, disabled, onEdit, onDelete }: SeriesCardProps) {
  return (
    <Card
      as="li"
      className={cn("group flex flex-col overflow-hidden transition", editing ? "border-accent ring-1 ring-accent/40" : "hover:border-border-strong")}
    >
      <div className="relative aspect-video overflow-hidden bg-surface-sunken">
        {isAllowedCoverUrl(series.coverUrl) ? (
          <Image src={series.coverUrl} alt="" fill sizes={COVER_SIZES} className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        ) : (
          <div aria-hidden className="grid h-full place-items-center bg-[radial-gradient(circle_at_30%_20%,var(--surface-hover),transparent_60%)]">
            <span className="grid size-16 place-items-center rounded-xl bg-surface font-display text-2xl font-extrabold text-accent ring-1 ring-border">
              {seriesMonogram(series.title)}
            </span>
          </div>
        )}
        {editing && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-2.5 py-1 font-mono text-[11px] text-accent ring-1 ring-accent/40 backdrop-blur">
            <PenLine aria-hidden className="size-3" />
            {TAXONOMY_COPY.series.editing}
          </span>
        )}
        <div className="absolute top-2 right-2 flex gap-1 rounded-lg bg-canvas/70 p-1 backdrop-blur transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
          <IconButton label={TAXONOMY_COPY.series.edit(series.title)} tone="accent" disabled={disabled} onClick={onEdit}>
            <Pencil aria-hidden className="size-4" />
          </IconButton>
          <IconButton label={TAXONOMY_COPY.series.removeOne(series.title)} tone="danger" disabled={disabled} onClick={onDelete}>
            <Trash2 aria-hidden className="size-4" />
          </IconButton>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg leading-snug font-bold">
          <button type="button" onClick={onEdit} className="text-left transition hover:text-accent">
            {series.title}
          </button>
        </h3>
        <p className="flex items-center gap-1.5 truncate font-mono text-xs text-muted">
          <Link2 aria-hidden className="size-3.5 shrink-0" />
          {series.slug}
        </p>
        {series.description && <p className="line-clamp-2 text-sm text-muted">{series.description}</p>}
        <p className="mt-auto flex items-center gap-2 pt-3 font-mono text-xs text-text">
          <Layers aria-hidden className="size-4 text-accent" />
          {TAXONOMY_COPY.series.postCount(series.postCount)}
        </p>
      </div>
    </Card>
  );
}
