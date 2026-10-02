"use client";

import { useState, type FormEvent } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { slugify } from "@/lib/slug/slugify";

import { deleteTag, mergeTags, saveTag } from "../../actions/taxonomy";
import { CMS_LIMITS, CMS_QUERY_KEYS, CONFIRM_MESSAGES } from "../../constants";
import { useActionMutation } from "@/lib/hooks/use-action-mutation";
import type { CmsTag, CmsTaxonomy } from "../../types";
import type { TagInput } from "../../schemas";
import { toOptionalNumber } from "../../utils/post-form";
import { TagStatusBadge } from "../status-badge";

const INVALIDATE = [CMS_QUERY_KEYS.taxonomy];
const NEW_TAG_INPUT_ID = "new-tag-name";

function withTags(previous: unknown, updateTags: (tags: CmsTag[]) => CmsTag[]) {
  const taxonomy = previous as CmsTaxonomy | undefined;
  return taxonomy && { ...taxonomy, tags: updateTags(taxonomy.tags) };
}

export function TagManager({ tags }: { tags: CmsTag[] }) {
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");
  const [mergeTarget, setMergeTarget] = useState<Record<number, number | null>>({});

  const save = useActionMutation(saveTag, INVALIDATE, [
    {
      queryKey: CMS_QUERY_KEYS.taxonomy,
      apply: (previous, input: TagInput) =>
        withTags(previous, (tags) =>
          input.id === null ? tags : tags.map((t) => (t.id === input.id ? { ...t, status: input.status } : t)),
        ),
    },
  ]);
  const remove = useActionMutation(deleteTag, INVALIDATE, [
    {
      queryKey: CMS_QUERY_KEYS.taxonomy,
      apply: (previous, id: number) => withTags(previous, (tags) => tags.filter((t) => t.id !== id)),
    },
  ]);
  const merge = useActionMutation((args: { sourceId: number; targetId: number }) => mergeTags(args.sourceId, args.targetId), INVALIDATE);
  const error = save.error ?? remove.error ?? merge.error;
  const busy = save.isPending || remove.isPending || merge.isPending;

  const query = search.trim().toLowerCase();
  const visible = query ? tags.filter((t) => t.name.toLowerCase().includes(query) || t.slug.includes(query)) : tags;

  const create = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newName.trim()) return;
    save.mutate(
      { id: null, name: newName, slug: slugify(newName), status: "approved" },
      { onSuccess: () => setNewName("") },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <form onSubmit={create} className="contents">
          <Input
            id={NEW_TAG_INPUT_ID}
            aria-label="Tên tag mới"
            placeholder="Tên tag mới"
            maxLength={CMS_LIMITS.tagNameMax}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="max-w-xs py-2"
          />
          <Button type="submit" size="sm" disabled={busy || !newName.trim()} loading={save.isPending}>
            Thêm tag
          </Button>
        </form>
        <Input
          aria-label="Tìm tag"
          placeholder="Tìm tag…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto max-w-xs py-2"
        />
      </div>
      {error && <Alert tone="error">{error.message}</Alert>}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface font-mono text-xs uppercase tracking-wider text-faint">
            <tr>
              <th className="px-4 py-3 font-medium">Tag</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium">Số bài</th>
              <th className="px-4 py-3 font-medium">Gộp vào</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visible.map((tag) => {
              const target = mergeTarget[tag.id] ?? null;
              return (
                <tr key={tag.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">#{tag.name}</p>
                    <p className="font-mono text-xs text-faint">{tag.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <TagStatusBadge status={tag.status} />
                  </td>
                  <td className="px-4 py-3 text-muted">{tag.postCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Select
                        aria-label={`Gộp ${tag.name} vào`}
                        value={target ?? ""}
                        onChange={(e) => setMergeTarget((prev) => ({ ...prev, [tag.id]: toOptionalNumber(e.target.value) }))}
                        className="py-1.5"
                      >
                        <option value="">Chọn tag</option>
                        {tags
                          .filter((t) => t.id !== tag.id)
                          .map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busy || target === null}
                        onClick={() =>
                          target !== null &&
                          window.confirm(CONFIRM_MESSAGES.mergeTag) &&
                          merge.mutate({ sourceId: tag.id, targetId: target })
                        }
                      >
                        Gộp
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      {tag.status === "pending" && (
                        <Button
                          variant="ghost"
                          className="text-sm text-emerald hover:text-emerald"
                          disabled={busy}
                          onClick={() => save.mutate({ id: tag.id, name: tag.name, slug: tag.slug, status: "approved" })}
                        >
                          Duyệt
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="text-sm hover:text-danger"
                        disabled={busy}
                        onClick={() => window.confirm(CONFIRM_MESSAGES.deleteTag) && remove.mutate(tag.id)}
                      >
                        Xoá
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
