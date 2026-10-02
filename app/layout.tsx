import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";

import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { fontVariables } from "@/config/fonts";
import { SITE } from "@/config/site";
import { SessionSync } from "@/features/auth/components/session-sync";
import { siteUrl } from "@/lib/env";
import { cn } from "@/lib/utils/cn";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: SITE.title, template: `%s · ${SITE.name}` },
  description: SITE.description,
  openGraph: { siteName: SITE.name, locale: SITE.locale, type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={SITE.lang} className={cn(fontVariables, "h-full antialiased")}>
      {/* Browser extensions (e.g. ColorZilla's cz-shortcut-listen) add attributes to <body> before hydration. Only body's own attributes are exempt; children are still checked. */}
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <QueryProvider>
          <SessionSync />
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
