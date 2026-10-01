import type { ReactNode } from "react";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { MAIN_CONTENT_ID, SkipLink } from "./skip-link";

/** Header, main landmark and footer of the public site (the CMS has its own shell). */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id={MAIN_CONTENT_ID} className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
