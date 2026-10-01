"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ROUTES } from "@/config/routes";
import { slugify } from "@/lib/slug/slugify";

import { publishPost, savePost, submitForReview, unpublishPost } from "../actions/posts";
import { CMS_QUERY_KEYS, CMS_TIMINGS, EMPTY_POST_FORM } from "../constants";
import type { ActionResult } from "@/lib/actions/types";

import type { CmsPost, PostFormValues, PostStatus, SavedPost, SaveState } from "../types";
import { toPostFormValues, toPostInput } from "../utils/post-form";

type StatusAction = (id: string) => Promise<ActionResult<SavedPost>>;

/** Form state, autosave and status changes for one post (or a new one). */
export function usePostEditor(post: CmsPost | null) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [values, setValues] = useState<PostFormValues>(() => (post ? toPostFormValues(post) : EMPTY_POST_FORM));
  const [saved, setSaved] = useState<SavedPost | null>(
    post ? { id: post.id, slug: post.slug, status: post.status, updatedAt: post.updatedAt } : null,
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  // New posts follow the title until the author edits the slug by hand.
  const [slugTouched, setSlugTouched] = useState(post !== null);

  const canEdit = post ? post.canEdit : true;
  const canPublish = post?.canPublish ?? false;

  const update = useCallback(
    <K extends keyof PostFormValues>(key: K, value: PostFormValues[K]) => {
      if (key === "slug") setSlugTouched(true);
      setValues((prev) => {
        const next = { ...prev, [key]: value };
        if (key === "title" && !slugTouched) next.slug = slugify(String(value));
        return next;
      });
      setSaveState("dirty");
    },
    [slugTouched],
  );

  /**
   * Refresh only the lists that could actually be showing stale data:
   * the post's own detail, the list for its current status, and (only when
   * the status just changed) the review queue and its previous status's
   * list. Invalidating every status tab on every autosave would refetch
   * tabs the user isn't even looking at.
   */
  const refreshLists = useCallback(
    (result: SavedPost, previousStatus?: PostStatus) => {
      const statusesToRefresh = new Set([result.status, previousStatus].filter((s) => s !== undefined));
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.post(result.id) }),
        queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.posts(null) }),
        ...[...statusesToRefresh].map((status) =>
          queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.posts(status) }),
        ),
        ...(statusesToRefresh.has("review") ? [queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.review })] : []),
      ]);
    },
    [queryClient],
  );

  const save = useCallback(async (): Promise<SavedPost | null> => {
    setSaveState("saving");
    const result = await savePost(saved?.id ?? null, toPostInput(values));
    if (!result.ok) {
      setSaveState("error");
      setError(result.error);
      return null;
    }
    setError(null);
    setSaveState("saved");
    setSaved(result.data);
    if (!saved) router.replace(ROUTES.cmsEditPost(result.data.id));
    await refreshLists(result.data);
    return result.data;
  }, [saved, values, router, refreshLists]);

  /** Save pending edits, then run a status change. */
  const runStatusAction = useCallback(
    async (action: StatusAction) => {
      const previousStatus = saved?.status;
      const current = saveState === "dirty" || !saved ? await save() : saved;
      if (!current) return;
      const result = await action(current.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setError(null);
      setSaved(result.data);
      await refreshLists(result.data, previousStatus);
    },
    [saveState, saved, save, refreshLists],
  );

  // Autosave a few seconds after the last change, for any status the author
  // can still edit (draft or review) — not just draft, so edits made while a
  // post is in review aren't silently lost if the author forgets to save.
  useEffect(() => {
    if (saveState !== "dirty" || !saved || !canEdit) return;
    const timer = setTimeout(() => void save(), CMS_TIMINGS.autosaveDelayMs);
    return () => clearTimeout(timer);
  }, [saveState, saved, canEdit, save]);

  return {
    values,
    update,
    saved,
    saveState,
    error,
    canEdit,
    canPublish,
    save,
    submitForReview: () => runStatusAction(submitForReview),
    publish: () => runStatusAction(publishPost),
    unpublish: () => runStatusAction(unpublishPost),
  };
}

export type PostEditorState = ReturnType<typeof usePostEditor>;
