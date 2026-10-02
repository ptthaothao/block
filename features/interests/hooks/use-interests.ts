"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useSessionUser } from "@/features/auth/hooks/use-session-user";
import { useActionMutation } from "@/lib/hooks/use-action-mutation";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useToast } from "@/lib/hooks/use-toast";

import { setInterest } from "../actions";
import { interestsApi } from "../api";
import { INTEREST_COPY, INTEREST_QUERY_KEYS } from "../constants";
import type { InterestChange, InterestItem, InterestsResponse } from "../types";
import { applyInterestChange } from "../utils/interest-state";
import { useGuestInterests } from "./use-guest-interests";

const NO_ITEMS: InterestItem[] = [];

export type InterestsState = {
  /** False until we know who is here and what they follow; render skeletons or neutral buttons meanwhile. */
  ready: boolean;
  signedIn: boolean;
  items: InterestItem[];
  /** Applies optimistically; resolves false (and shows a toast) if saving failed and it was rolled back. */
  change: (change: InterestChange) => Promise<boolean>;
};

/**
 * One source of truth for follows and mutes. Signed-in readers go through
 * /api/interests and the setInterest action (optimistic, rolled back on
 * error); everyone else keeps them in this browser.
 */
export function useInterests(): InterestsState {
  const user = useSessionUser();
  const signedIn = Boolean(user);
  const guest = useGuestInterests();
  const toast = useToast();
  const hydrated = useHydrated();

  const mineKey = INTEREST_QUERY_KEYS.mineOf(user?.username ?? "");
  // Fetched once per account and kept: this tab's own writes update the cache
  // directly, so there is nothing newer on the server to go back for.
  const mine = useQuery({
    queryKey: mineKey,
    queryFn: interestsApi.mine,
    enabled: signedIn,
    staleTime: Infinity,
    gcTime: Infinity,
  });
  const mutation = useActionMutation(
    setInterest,
    // No refetch on success: setInterest stores exactly the optimistic change.
    // The feed is keyed by the interests it was built from (see HomeFeed), so a
    // muted card stays put with its undo.
    [],
    [
      {
        queryKey: mineKey,
        apply: (previous, change) => {
          const current = previous as InterestsResponse | undefined;
          return current ? { items: applyInterestChange(current.items, change) } : current;
        },
      },
    ],
  );

  const { save: saveGuest, items: guestItems } = guest;
  const { mutateAsync } = mutation;
  const change = useCallback(
    async (next: InterestChange) => {
      if (!signedIn) {
        saveGuest(applyInterestChange(guestItems, next));
        return true;
      }
      try {
        await mutateAsync(next);
        return true;
      } catch {
        toast.show({ message: INTEREST_COPY.saveFailed, tone: "error" });
        return false;
      }
    },
    [signedIn, saveGuest, guestItems, mutateAsync, toast],
  );

  const ready = hydrated && user !== undefined && (!signedIn || mine.data !== undefined || mine.isError);
  return {
    ready,
    signedIn: ready && signedIn,
    items: !ready ? NO_ITEMS : signedIn ? (mine.data?.items ?? NO_ITEMS) : guestItems,
    change,
  };
}
