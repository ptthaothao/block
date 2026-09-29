import { Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

import { INTEREST_COPY } from "../constants";

/** Shown on the home page to readers who follow nothing yet. */
export function InterestInvite() {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-lg border border-accent/30 bg-accent/5 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
          <Sparkles className="size-5" />
        </span>
        <div>
          <p className="font-display font-bold">{INTEREST_COPY.inviteTitle}</p>
          <p className="mt-1 text-sm text-muted">{INTEREST_COPY.inviteBody}</p>
        </div>
      </div>
      <ButtonLink href={ROUTES.onboarding} size="sm" className="shrink-0">
        {INTEREST_COPY.inviteAction}
      </ButtonLink>
    </div>
  );
}
