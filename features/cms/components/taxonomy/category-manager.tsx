"use client";

import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ColorDot } from "@/components/ui/color-dot";
import { cn } from "@/lib/utils/cn";

import { deleteCategory } from "../../actions/taxonomy";
import { CMS_QUERY_KEYS, CONFIRM_MESSAGES, EMPTY_CATEGORY_FORM } from "../../constants";
import { useActionMutation } from "../../hooks/use-action-mutation";
import type { CategoryInput } from "../../schemas";
import type { CmsCategory, CmsTaxonomy } from "../../types";
import { sortCategoryTree, toCategoryForm } from "../../utils/taxonomy-form";
import { CategoryForm } from "./category-form";
import { RowActions } from "./row-actions";

export function CategoryManager({ categories }: { categories: CmsCategory[] }) {
  const [editing, setEditing] = useState<CategoryInput | null>(null);
  const remove = useActionMutation(deleteCategory, [CMS_QUERY_KEYS.taxonomy], [
    {
      queryKey: CMS_QUERY_KEYS.taxonomy,
      apply: (previous, id: number) => {
        const taxonomy = previous as CmsTaxonomy | undefined;
        return taxonomy && { ...taxonomy, categories: taxonomy.categories.filter((c) => c.id !== id) };
      },
    },
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-3">
        <Button size="sm" onClick={() => setEditing(EMPTY_CATEGORY_FORM)}>
          Thêm danh mục
        </Button>
        {remove.error && <Alert tone="error">{remove.error.message}</Alert>}
        <ul className="divide-y divide-border rounded-lg border border-border">
          {sortCategoryTree(categories).map(({ category, depth }) => (
            <li key={category.id} className={cn("flex items-center gap-3 px-4 py-3", depth === 1 && "pl-10")}>
              <ColorDot color={category.color} size="md" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{category.name}</p>
                <p className="font-mono text-xs text-faint">
                  {category.slug} · #{category.position}
                </p>
              </div>
              <RowActions
                disabled={remove.isPending}
                onEdit={() => setEditing(toCategoryForm(category))}
                onDelete={() => window.confirm(CONFIRM_MESSAGES.deleteCategory) && remove.mutate(category.id)}
              />
            </li>
          ))}
        </ul>
      </div>
      {editing && (
        <CategoryForm
          key={editing.id ?? "new"}
          initial={editing}
          categories={categories}
          onDone={() => setEditing(null)}
        />
      )}
    </div>
  );
}
