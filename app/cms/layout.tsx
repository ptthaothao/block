import type { Metadata } from "next";

import { SkipLink } from "@/components/layout/skip-link";
import { requireRole } from "@/features/auth/guards";
import { toPublicSessionUser } from "@/features/auth/mappers";
import { CmsUserProvider } from "@/features/cms/components/cms-user-provider";
import { CmsShell } from "@/features/cms/components/shell/cms-shell";

export const metadata: Metadata = { title: "Quản trị", robots: { index: false, follow: false } };

/** The only server component in /cms: nothing below renders for non-authors. */
export default async function CmsLayout({ children }: LayoutProps<"/cms">) {
  const user = toPublicSessionUser(await requireRole("author"));
  return (
    <CmsUserProvider user={user}>
      <SkipLink />
      <CmsShell user={user}>{children}</CmsShell>
    </CmsUserProvider>
  );
}
