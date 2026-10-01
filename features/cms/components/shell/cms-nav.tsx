import type { CmsNavEntry } from "@/config/navigation";

import { CMS_SHELL_COPY } from "../../constants";
import { isNavGroup } from "../../utils/visible-nav";
import { CmsNavGroup } from "./cms-nav-group";
import { CmsNavLink } from "./cms-nav-link";

type CmsNavProps = {
  entries: CmsNavEntry[];
  active: string | null;
  collapsed?: boolean;
  onExpand?: () => void;
  onNavigate?: () => void;
};

export function CmsNav({ entries, active, collapsed = false, onExpand, onNavigate }: CmsNavProps) {
  return (
    <nav aria-label={CMS_SHELL_COPY.navLabel} className="space-y-1">
      {entries.map((entry) =>
        isNavGroup(entry) ? (
          <CmsNavGroup
            key={entry.id}
            group={entry}
            active={active}
            collapsed={collapsed}
            onExpand={onExpand}
            onNavigate={onNavigate}
          />
        ) : (
          <CmsNavLink
            key={entry.href}
            link={entry}
            active={entry.href === active}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ),
      )}
    </nav>
  );
}
