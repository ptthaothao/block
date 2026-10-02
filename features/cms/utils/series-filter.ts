import type { CmsSeries } from "../types";

/** Series whose title, slug or description contains `query`. */
export function filterSeries(series: CmsSeries[], query: string): CmsSeries[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return series;
  return series.filter((s) =>
    [s.title, s.slug, s.description ?? ""].some((text) => text.toLowerCase().includes(needle)),
  );
}
