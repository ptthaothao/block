import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MAIN_CONTENT_ID, SkipLink } from "@/components/layout/skip-link";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { fontVariables } from "@/config/fonts";
import { SITE } from "@/config/site";
import { InterestImportPrompt } from "@/features/interests/components/interest-import-prompt";
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
          <ToastProvider>
            <SkipLink />
            <SiteHeader />
            <main id={MAIN_CONTENT_ID} className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <InterestImportPrompt />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
