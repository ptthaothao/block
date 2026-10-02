"use client";

import { MousePointerClick } from "lucide-react";
import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { useActionMutation } from "@/lib/hooks/use-action-mutation";

import { deleteCategory, reorderCategories } from "../../../actions/taxonomy";
import { CMS_QUERY_KEYS, CONFIRM_MESSAGES, EMPTY_CATEGORY_FORM, TAXONOMY_COPY } from "../../../constants";
import type { CategoryInput } from "../../../schemas";
import type { CmsCategory, CmsTaxonomy } from "../../../types";
import { buildCategoryTree } from "../../../utils/category-tree";
import { toCategoryForm } from "../../../utils/taxonomy-form";
import { CategoryForm } from "./category-form";
import { CategoryTree } from "./category-tree";

function withCategories(previous: unknown, update: (categories: CmsCategory[]) => CmsCategory[]) {
  const taxonomy = previous as CmsTaxonomy | undefined;
  return taxonomy && { ...taxonomy, categories: update(taxonomy.categories) };
}

/** Category tree on the left, the add/edit panel on the right. */
export function CategoryManager({ categories }: { categories: CmsCategory[] }) {
  const [editing, setEditing] = useState<CategoryInput | null>(null);
  const tree = buildCategoryTree(categories);

  const remove = useActionMutation(deleteCategory, [CMS_QUERY_KEYS.taxonomy], [
    {
      queryKey: CMS_QUERY_KEYS.taxonomy,
      apply: (previous, id: number) => withCategories(previous, (list) => list.filter((c) => c.id !== id)),
    },
  ]);
  const reorder = useActionMutation(reorderCategories, [CMS_QUERY_KEYS.taxonomy], [
    {
      queryKey: CMS_QUERY_KEYS.taxonomy,
      apply: (previous, ids: number[]) =>
        withCategories(previous, (list) =>
          list.map((c) => (ids.includes(c.id) ? { ...c, position: ids.indexOf(c.id) } : c)),
        ),
    },
  ]);
  const error = remove.error ?? reorder.error;

  const startAdd = (parent: CmsCategory | null) => {
    const siblings = parent ? (tree.find((n) => n.category.id === parent.id)?.children ?? []) : tree;
    setEditing({ ...EMPTY_CATEGORY_FORM, parentId: parent?.id ?? null, position: siblings.length });
  };

  const confirmDelete = (category: CmsCategory) => {
    if (!window.confirm(CONFIRM_MESSAGES.deleteCategory)) return;
    remove.mutate(category.id, { onSuccess: () => setEditing((e) => (e?.id === category.id ? null : e)) });
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
      <div className="min-w-0 space-y-3">
        {error && <Alert tone="error">{error.message}</Alert>}
        <CategoryTree
          tree={tree}
          selectedId={editing?.id ?? null}
          disabled={remove.isPending || reorder.isPending}
          onAdd={startAdd}
          onEdit={(category) => setEditing(toCategoryForm(category))}
          onDelete={confirmDelete}
          onReorder={(ids) => reorder.mutate(ids)}
        />
      </div>
      {editing ? (
        <CategoryForm
          key={editing.id ?? `new-${editing.parentId ?? "root"}`}
          initial={editing}
          categories={categories}
          deleting={remove.isPending}
          onDone={() => setEditing(null)}
          onDelete={() => {
            const category = categories.find((c) => c.id === editing.id);
            if (category) confirmDelete(category);
          }}
        />
      ) : (
        <div className="hidden flex-col items-center gap-3 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted lg:flex">
          <MousePointerClick aria-hidden className="size-6 text-faint" />
          {TAXONOMY_COPY.categories.pickHint}
        </div>
      )}
    </div>
  );
}
