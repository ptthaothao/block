import { formatTime } from "@/lib/format/date";

import { TAXONOMY_COPY } from "../../constants";

/** When the taxonomy was last fetched from the server. */
export function CacheSyncBadge({ updatedAt }: { updatedAt: number }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-sunken px-3 py-1.5 font-mono text-xs text-muted">
      <span aria-hidden className="size-2 rounded-full bg-emerald" />
      {TAXONOMY_COPY.cacheSynced}:
      <time dateTime={new Date(updatedAt).toISOString()} className="text-text">
        {formatTime(updatedAt)}
      </time>
    </p>
  );
}
