"use client";

import { ChevronsDownUp, ChevronsUpDown, Info, Plus, Search } from "lucide-react";
import { Fragment, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDragReorder } from "@/lib/hooks/use-drag-reorder";
import { moveItem } from "@/lib/utils/move-item";

import { TAXONOMY_COLUMNS, TAXONOMY_COPY } from "../../../constants";
import type { CategoryTreeNode, CmsCategory } from "../../../types";
import { filterCategoryTree } from "../../../utils/category-tree";
import { CategoryRow } from "./category-row";

const ROOT_GROUP = "root";
const SEARCH_ID = "category-search";

type CategoryTreeProps = {
  tree: CategoryTreeNode[];
  selectedId: number | null;
  disabled: boolean;
  onAdd: (parent: CmsCategory | null) => void;
  onEdit: (category: CmsCategory) => void;
  onDelete: (category: CmsCategory) => void;
  /** Siblings' ids in their new order. */
  onReorder: (ids: number[]) => void;
};

/** Searchable, collapsible, drag-to-reorder table of the two-level category tree. */
export function CategoryTree({ tree, selectedId, disabled, onAdd, onEdit, onDelete, onReorder }: CategoryTreeProps) {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<ReadonlySet<number>>(new Set());
  const searching = search.trim() !== "";
  const visible = filterCategoryTree(tree, search);

  const siblingIds = (group: string) =>
    group === ROOT_GROUP
      ? tree.map((node) => node.category.id)
      : (tree.find((node) => String(node.category.id) === group)?.children.map((c) => c.id) ?? []);

  const drag = useDragReorder<number>((group, from, to) => onReorder(moveItem(siblingIds(group), from, to)));

  const allCollapsed = tree.length > 0 && tree.every((node) => collapsed.has(node.category.id));
  const toggleAll = () => setCollapsed(allCollapsed ? new Set() : new Set(tree.map((node) => node.category.id)));
  const toggle = (id: number) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  // Reordering a filtered list would be ambiguous, so it is off while searching.
  const rowDrag = (category: CmsCategory, group: string) => ({
    rowProps: drag.itemProps(category.id, group),
    handleProps: searching || disabled ? undefined : drag.handleProps(category.id, group, siblingIds(group)),
    dragging: drag.isDragging(category.id),
    dropTarget: drag.isOver(category.id),
  });

  return (
    <Card className="flex min-w-0 flex-col p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={SEARCH_ID} className="relative min-w-48 flex-1">
          <span className="sr-only">{TAXONOMY_COPY.categories.search}</span>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
          <input
            id={SEARCH_ID}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={TAXONOMY_COPY.categories.search}
            className="w-full rounded-md border border-border bg-surface-sunken py-2.5 pr-3 pl-9 text-sm placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </label>
        <Button variant="ghost" className="px-2 text-sm" onClick={toggleAll} disabled={tree.length === 0}>
          {allCollapsed ? <ChevronsUpDown aria-hidden className="size-4" /> : <ChevronsDownUp aria-hidden className="size-4" />}
          {allCollapsed ? TAXONOMY_COPY.categories.expandAll : TAXONOMY_COPY.categories.collapseAll}
        </Button>
        <Button size="sm" onClick={() => onAdd(null)}>
          <Plus aria-hidden className="size-4" />
          {TAXONOMY_COPY.categories.add}
        </Button>
      </div>

      <div className="mt-4 -mx-4 overflow-x-auto sm:-mx-5">
        <table className="w-full min-w-[560px] text-left">
          <thead className="font-mono text-[11px] tracking-wider text-faint uppercase">
            <tr className="border-b border-border">
              <th className="py-3 pr-3 pl-4 font-medium sm:pl-5">{TAXONOMY_COLUMNS.categories.name}</th>
              <th className="px-3 py-3 font-medium">{TAXONOMY_COLUMNS.categories.slug}</th>
              <th className="px-3 py-3 text-right font-medium">{TAXONOMY_COLUMNS.categories.posts}</th>
              <th className="py-3 pr-4 pl-2 text-right font-medium sm:pr-5">{TAXONOMY_COLUMNS.categories.actions}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(({ category, children, totalPosts }) => {
              const expanded = searching || !collapsed.has(category.id);
              const group = String(category.id);
              return (
                <Fragment key={category.id}>
                  <CategoryRow
                    depth={0}
                    category={category}
                    postCount={totalPosts}
                    childCount={children.length}
                    expanded={expanded}
                    onToggle={() => toggle(category.id)}
                    onAddChild={() => onAdd(category)}
                    selected={selectedId === category.id}
                    disabled={disabled}
                    onEdit={() => onEdit(category)}
                    onDelete={() => onDelete(category)}
                    {...rowDrag(category, ROOT_GROUP)}
                  />
                  {expanded &&
                    children.map((child) => (
                      <CategoryRow
                        key={child.id}
                        depth={1}
                        category={child}
                        postCount={child.postCount}
                        selected={selectedId === child.id}
                        disabled={disabled}
                        onEdit={() => onEdit(child)}
                        onDelete={() => onDelete(child)}
                        {...rowDrag(child, group)}
                      />
                    ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {visible.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-muted">
            {tree.length === 0 ? TAXONOMY_COPY.categories.empty : TAXONOMY_COPY.categories.noMatch}
          </p>
        )}
      </div>

      <p className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-xs text-faint">
        <Info aria-hidden className="mt-px size-3.5 shrink-0" />
        {TAXONOMY_COPY.categories.hint}
      </p>
    </Card>
  );
}
