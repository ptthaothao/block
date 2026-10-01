import { ExternalLink, Menu } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { UserNav } from "@/features/auth/components/user-nav";

import { CMS_SHELL_COPY } from "../../constants";

type CmsTopbarProps = { section: string | null; onOpenMenu: () => void };

export function CmsTopbar({ section, onOpenMenu }: CmsTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-canvas/80 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label={CMS_SHELL_COPY.openMenu}
        className="-ml-2 grid size-11 place-items-center rounded-md text-muted transition hover:bg-surface-hover hover:text-text lg:hidden"
      >
        <Menu aria-hidden className="size-5" />
      </button>
      {section && <p className="truncate text-sm font-medium text-text">{section}</p>}
      <div className="ml-auto flex items-center gap-4">
        <ButtonLink href={ROUTES.home} variant="ghost" className="text-sm max-sm:hidden">
          {CMS_SHELL_COPY.viewSite}
          <ExternalLink aria-hidden className="size-3.5" />
        </ButtonLink>
        <UserNav />
      </div>
    </header>
  );
}
