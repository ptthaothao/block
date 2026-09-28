import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MAIN_CONTENT_ID, SkipLink } from "@/components/layout/skip-link";
import { QueryProvider } from "@/components/providers/query-provider";
import { fontVariables } from "@/config/fonts";
import { SITE } from "@/config/site";
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
      <body className="flex min-h-full flex-col font-sans">
        <QueryProvider>
          <SkipLink />
          <SiteHeader />
          <main id={MAIN_CONTENT_ID} className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </QueryProvider>
      </body>
    </html>
  );
}
