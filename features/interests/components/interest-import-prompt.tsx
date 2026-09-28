"use client";

import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSessionUser } from "@/features/auth/hooks/use-session-user";
import { useActionMutation } from "@/lib/hooks/use-action-mutation";
import { useToast } from "@/lib/hooks/use-toast";

import { importInterests } from "../actions";
import { INTEREST_COPY, INTEREST_QUERY_KEYS } from "../constants";
import { useGuestInterests } from "../hooks/use-guest-interests";
import { useImportDismissed } from "../hooks/use-import-dismissed";

/**
 * After signing in, offer to keep what the reader picked as a visitor. Shown
 * once per session, as a small card that doesn't block the page.
 */
export function InterestImportPrompt() {
  const user = useSessionUser();
  const guest = useGuestInterests();
  const [dismissed, dismiss] = useImportDismissed();
  const toast = useToast();
  const save = useActionMutation(importInterests, [INTEREST_QUERY_KEYS.mine]);

  if (!user || dismissed || guest.items.length === 0) return null;

  const onSave = async () => {
    try {
      await save.mutateAsync(guest.items);
      guest.clear();
      dismiss();
      toast.show({ message: INTEREST_COPY.importDone, tone: "success" });
    } catch {
      toast.show({ message: INTEREST_COPY.saveFailed, tone: "error" });
    }
  };

  const onDismiss = () => {
    guest.clear();
    dismiss();
  };

  return (
    <aside
      aria-labelledby="interest-import-title"
      className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-md rounded-xl border border-border-strong bg-surface p-5 shadow-popover motion-safe:animate-[sheet-in_200ms_ease-out] sm:right-6 sm:left-auto sm:mx-0"
    >
      <div className="flex items-start gap-4">
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
          <Sparkles className="size-5" />
        </span>
        <div className="min-w-0">
          <p id="interest-import-title" className="font-display font-bold">
            {INTEREST_COPY.importTitle}
          </p>
          <p className="mt-1 text-sm text-muted">{INTEREST_COPY.importBody(guest.items.length)}</p>
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={onSave} disabled={save.isPending}>
              {INTEREST_COPY.importSave}
            </Button>
            <Button variant="ghost" className="px-3 text-sm" onClick={onDismiss} disabled={save.isPending}>
              {INTEREST_COPY.importDismiss}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
