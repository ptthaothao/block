"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { useSessionUser } from "@/features/auth/hooks/use-session-user";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useToast } from "@/lib/hooks/use-toast";
import { savePendingAction, takePendingAction } from "@/lib/pending-action/storage";

import { toggleReaction } from "../actions";
import { reactionsApi } from "../api";
import { REACTION_COPY, REACTION_PENDING_ACTION, REACTION_QUERY_KEYS, REACTION_TIMINGS } from "../constants";
import type { PostReactions, ReactionKind } from "../types";
import { applyToggle, reactionMeta } from "../utils/reaction-state";

type PendingReaction = { emoji: ReactionKind };

export type PostReactionsState = {
  data: PostReactions | undefined;
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
  /** Toggle an emoji; visitors get the login prompt and the reaction is replayed after they sign in. */
  toggle: (emoji: ReactionKind) => void;
  /** The emoji that was just picked, for the "pop" animation. */
  popped: ReactionKind | null;
  loginOpen: boolean;
  closeLogin: () => void;
};

/**
 * Reactions on one post. Every widget on the page (summary, rail, end bar,
 * mobile bar) shares this query, so a tap anywhere updates all of them in the
 * same frame.
 */
export function usePostReactions(slug: string): PostReactionsState {
  const hydrated = useHydrated();
  const user = useSessionUser();
  const toast = useToast();
  const queryClient = useQueryClient();
  const queryKey = REACTION_QUERY_KEYS.post(slug);
  const [loginOpen, setLoginOpen] = useState(false);
  const [popped, setPopped] = useState<ReactionKind | null>(null);
  const popTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const query = useQuery({
    queryKey,
    queryFn: () => reactionsApi.post(slug),
    staleTime: REACTION_TIMINGS.countsStaleMs,
    refetchOnWindowFocus: true,
  });

  const mutation = useMutation({
    mutationFn: async (emoji: ReactionKind) => {
      const result = await toggleReaction({ target: { type: "post", slug }, emoji });
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onMutate: async (emoji) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<PostReactions>(queryKey);
      if (previous) queryClient.setQueryData<PostReactions>(queryKey, { ...previous, ...applyToggle(previous, emoji) });
      return { previous };
    },
    onError: (error, _emoji, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast.show({ message: error.message || REACTION_COPY.failed, tone: "error" });
    },
    onSuccess: (state) => {
      queryClient.setQueryData<PostReactions>(queryKey, (current) => (current ? { ...current, ...state } : current));
    },
  });

  const { mutate } = mutation;
  const pop = useCallback((emoji: ReactionKind) => {
    if (popTimer.current) clearTimeout(popTimer.current);
    setPopped(emoji);
    popTimer.current = setTimeout(() => setPopped(null), REACTION_TIMINGS.bounceMs);
  }, []);
  useEffect(() => () => {
    if (popTimer.current) clearTimeout(popTimer.current);
  }, []);

  const mine = query.data?.mine;
  const toggle = useCallback(
    (emoji: ReactionKind) => {
      if (user === undefined) return;
      if (user === null) {
        savePendingAction<PendingReaction>({ type: REACTION_PENDING_ACTION, postSlug: slug, payload: { emoji } });
        setLoginOpen(true);
        return;
      }
      if (!mine?.includes(emoji)) pop(emoji);
      mutate(emoji);
    },
    [user, slug, mine, pop, mutate],
  );

  // Back from signing in: finish the reaction they started.
  const loaded = query.data !== undefined;
  useEffect(() => {
    if (!user || !loaded) return;
    const pending = takePendingAction<PendingReaction>(REACTION_PENDING_ACTION, slug);
    if (!pending) return;
    const { emoji } = pending.payload;
    if (!mine?.includes(emoji)) mutate(emoji);
    toast.show({ message: REACTION_COPY.resumed(reactionMeta(emoji).emoji), tone: "success" });
  }, [user, loaded, slug, mine, mutate, toast]);

  return {
    // Until hydrated, render exactly what the server did (the skeleton).
    data: hydrated ? query.data : undefined,
    isLoading: !hydrated || query.isPending,
    isError: hydrated && query.isError,
    retry: () => void query.refetch(),
    toggle,
    popped,
    loginOpen,
    closeLogin: () => setLoginOpen(false),
  };
}
