import type { CategoryInput, SeriesInput } from "../schemas";
import type { CmsCategory, CmsSeries } from "../types";

export function toCategoryForm(category: CmsCategory): CategoryInput {
  return {
    id: category.id,
    parentId: category.parentId,
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    icon: category.icon ?? "",
    color: category.color ?? "",
    position: category.position,
  };
}

export function toSeriesForm(series: CmsSeries): SeriesInput {
  return {
    id: series.id,
    title: series.title,
    slug: series.slug,
    description: series.description ?? "",
    coverUrl: series.coverUrl ?? "",
  };
}
