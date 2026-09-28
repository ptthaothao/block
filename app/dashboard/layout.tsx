import type { Metadata } from "next";

import { requireRole } from "@/features/auth/guards";
import { toPublicSessionUser } from "@/features/auth/mappers";
import { DashboardShell } from "@/features/cms/components/dashboard-shell";
import { DashboardUserProvider } from "@/features/cms/components/dashboard-user-provider";

export const metadata: Metadata = { title: "Quản trị", robots: { index: false, follow: false } };

/** The only server component in /dashboard: nothing below renders for non-authors. */
export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const user = toPublicSessionUser(await requireRole("author"));
  return (
    <DashboardUserProvider user={user}>
      <DashboardShell user={user}>{children}</DashboardShell>
    </DashboardUserProvider>
  );
}
