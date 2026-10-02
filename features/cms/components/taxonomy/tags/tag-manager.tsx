"use client";

import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Pagination } from "@/components/ui/pagination";
import { useActionMutation } from "@/lib/hooks/use-action-mutation";
import { slugify } from "@/lib/slug/slugify";
import { cn } from "@/lib/utils/cn";
import { paginate } from "@/lib/utils/paginate";

import { approveTags, deleteTags, mergeTagsInto, saveTag } from "../../../actions/taxonomy";
import { CMS_LIMITS, CMS_QUERY_KEYS, CONFIRM_MESSAGES, TAXONOMY_COLUMNS, TAXONOMY_COPY } from "../../../constants";
import type { TagInput } from "../../../schemas";
import type { CmsTag, CmsTaxonomy, TagSort, TagStatusFilter } from "../../../types";
import { countTagsByStatus, filterTags, sortTags } from "../../../utils/tag-list";
import { TagBulkBar } from "./tag-bulk-bar";
import { TagMergeDialog } from "./tag-merge-dialog";
import { TagRenameDialog } from "./tag-rename-dialog";
import { TagRow } from "./tag-row";
import { TagToolbar } from "./tag-toolbar";

const INVALIDATE = [CMS_QUERY_KEYS.taxonomy];

function withTags(previous: unknown, update: (tags: CmsTag[]) => CmsTag[]) {
  const taxonomy = previous as CmsTaxonomy | undefined;
  return taxonomy && { ...taxonomy, tags: update(taxonomy.tags) };
}

/** Filterable, paginated tag table with per-row and bulk approve / rename / merge / delete. */
export function TagManager({ tags }: { tags: CmsTag[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TagStatusFilter>("all");
  const [sort, setSort] = useState<TagSort>("posts");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ReadonlySet<number>>(new Set());
  const [renaming, setRenaming] = useState<CmsTag | null>(null);
  const [mergeSources, setMergeSources] = useState<CmsTag[] | null>(null);

  const save = useActionMutation(saveTag, INVALIDATE);
  const approve = useActionMutation(approveTags, INVALIDATE, [
    {
      queryKey: CMS_QUERY_KEYS.taxonomy,
      apply: (previous, ids: number[]) =>
        withTags(previous, (list) => list.map((t) => (ids.includes(t.id) ? { ...t, status: "approved" } : t))),
    },
  ]);
  const remove = useActionMutation(deleteTags, INVALIDATE, [
    {
      queryKey: CMS_QUERY_KEYS.taxonomy,
      apply: (previous, ids: number[]) => withTags(previous, (list) => list.filter((t) => !ids.includes(t.id))),
    },
  ]);
  const merge = useActionMutation(mergeTagsInto, INVALIDATE);
  const error = approve.error ?? remove.error ?? (renaming ? null : save.error);
  const busy = save.isPending || approve.isPending || remove.isPending || merge.isPending;

  const visible = sortTags(filterTags(tags, search, status), sort);
  const current = paginate(visible, page, CMS_LIMITS.tagPageSize);
  const maxPosts = Math.max(0, ...tags.map((t) => t.postCount));
  // Tags removed elsewhere (deleted, merged) drop out of the selection.
  const selectedTags = tags.filter((t) => selected.has(t.id));
  const pageIds = current.items.map((t) => t.id);
  const pageAllSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  const resetPage = <T,>(set: (value: T) => void) => (value: T) => {
    set(value);
    setPage(1);
  };
  const toggle = (ids: number[], on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (on) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  const unselect = (ids: number[]) => toggle(ids, false);

  const create = (name: string, done: () => void) =>
    save.mutate({ id: null, name, slug: slugify(name), status: "approved" }, { onSuccess: done });
  const rename = (input: TagInput) => save.mutate(input, { onSuccess: () => setRenaming(null) });
  const removeTags = (ids: number[], message: string) => {
    if (window.confirm(message)) remove.mutate(ids, { onSuccess: () => unselect(ids) });
  };
  const mergeInto = (targetId: number) => {
    const sourceIds = (mergeSources ?? []).map((t) => t.id);
    merge.mutate(
      { sourceIds, targetId },
      {
        onSuccess: () => {
          unselect(sourceIds);
          setMergeSources(null);
        },
      },
    );
  };

  return (
    <div className={cn("space-y-4", selectedTags.length > 0 && "pb-20")}>
      <TagToolbar
        search={search}
        onSearchChange={resetPage(setSearch)}
        status={status}
        onStatusChange={resetPage(setStatus)}
        counts={countTagsByStatus(tags)}
        sort={sort}
        onSortChange={resetPage(setSort)}
        creating={save.isPending && !renaming}
        onCreate={create}
      />
      {error && <Alert tone="error">{error.message}</Alert>}

      <div className="rounded-lg border border-border bg-surface">
        {/* Wide screens never need the scroller, so the row menus are not clipped there. */}
        <div className="overflow-x-auto lg:overflow-visible">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-surface-sunken/60 font-mono text-[11px] tracking-wider text-faint uppercase">
              <tr className="border-b border-border">
                <th className="w-12 border-l-2 border-transparent py-3 pl-4">
                  <input
                    type="checkbox"
                    checked={pageAllSelected}
                    onChange={(e) => toggle(pageIds, e.target.checked)}
                    aria-label={TAXONOMY_COPY.tags.selectPage}
                    className="size-4 rounded accent-accent"
                  />
                </th>
                <th className="px-3 py-3 font-medium">{TAXONOMY_COLUMNS.tags.tag}</th>
                <th className="px-3 py-3 font-medium">{TAXONOMY_COLUMNS.tags.status}</th>
                <th className="px-3 py-3 text-right font-medium">{TAXONOMY_COLUMNS.tags.posts}</th>
                <th className="py-3 pr-4 pl-3 text-right font-medium">{TAXONOMY_COLUMNS.tags.actions}</th>
              </tr>
            </thead>
            <tbody>
              {current.items.map((tag) => (
                <TagRow
                  key={tag.id}
                  tag={tag}
                  selected={selected.has(tag.id)}
                  onSelectedChange={(on) => toggle([tag.id], on)}
                  maxPosts={maxPosts}
                  disabled={busy}
                  onApprove={() => approve.mutate([tag.id])}
                  onRename={() => {
                    save.reset();
                    setRenaming(tag);
                  }}
                  onMerge={() => {
                    merge.reset();
                    setMergeSources([tag]);
                  }}
                  onDelete={() => removeTags([tag.id], CONFIRM_MESSAGES.deleteTag)}
                />
              ))}
            </tbody>
          </table>
          {current.total === 0 && <p className="px-5 py-10 text-center text-sm text-muted">{TAXONOMY_COPY.tags.empty}</p>}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
          <p className="font-mono text-xs text-faint">{TAXONOMY_COPY.tags.showing(current.from, current.to, current.total)}</p>
          <Pagination
            page={current.page}
            pageCount={current.pageCount}
            onChange={setPage}
            label={TAXONOMY_COPY.tags.pagination}
            prevLabel={TAXONOMY_COPY.tags.prev}
            nextLabel={TAXONOMY_COPY.tags.next}
          />
        </div>
      </div>

      {selectedTags.length > 0 && (
        <TagBulkBar
          count={selectedTags.length}
          disabled={busy}
          onApprove={() => approve.mutate(selectedTags.map((t) => t.id))}
          onMerge={() => {
            merge.reset();
            setMergeSources(selectedTags);
          }}
          onDelete={() => removeTags(selectedTags.map((t) => t.id), CONFIRM_MESSAGES.deleteTags(selectedTags.length))}
          onClear={() => setSelected(new Set())}
        />
      )}
      {renaming && (
        <TagRenameDialog
          key={renaming.id}
          tag={renaming}
          saving={save.isPending}
          error={save.error}
          onSave={rename}
          onClose={() => setRenaming(null)}
        />
      )}
      {mergeSources && (
        <TagMergeDialog
          sources={mergeSources}
          tags={tags}
          merging={merge.isPending}
          error={merge.error}
          onMerge={mergeInto}
          onClose={() => setMergeSources(null)}
        />
      )}
    </div>
  );
}
