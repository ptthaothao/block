"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

import type { ActionResult } from "@/lib/actions/types";

/**
 * One cache entry to optimistically update while a mutation for `args` is
 * pending: `apply` returns the new value for `queryKey` from the previous
 * one, and is rolled back automatically if the Server Action fails.
 */
type OptimisticEntry<TArgs> = {
  queryKey: QueryKey;
  apply: (previous: unknown, args: TArgs) => unknown;
};

/**
 * Wrap a Server Action that returns ActionResult: failures become thrown
 * errors (so `mutation.error` works) and the given queries are refetched.
 *
 * Pass `optimistic` to update those queries' cached data immediately (before
 * the round-trip resolves) so the UI reacts right away; on failure the
 * previous values are restored, and on success the normal `invalidate` list
 * still refetches to reconcile with the server.
 */
export function useActionMutation<TArgs, TData>(
  action: (args: TArgs) => Promise<ActionResult<TData>>,
  invalidate: QueryKey[] = [],
  optimistic: OptimisticEntry<TArgs>[] = [],
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: TArgs) => {
      const result = await action(args);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onMutate: async (args: TArgs) => {
      await Promise.all(optimistic.map((entry) => queryClient.cancelQueries({ queryKey: entry.queryKey })));
      const previousValues = optimistic.map((entry) => queryClient.getQueryData(entry.queryKey));
      for (const entry of optimistic) {
        queryClient.setQueryData(entry.queryKey, (previous: unknown) => entry.apply(previous, args));
      }
      return { previousValues };
    },
    onError: (_err, _args, context) => {
      context?.previousValues.forEach((value, i) => queryClient.setQueryData(optimistic[i].queryKey, value));
    },
    onSuccess: () => Promise.all(invalidate.map((queryKey) => queryClient.invalidateQueries({ queryKey }))),
  });
}
