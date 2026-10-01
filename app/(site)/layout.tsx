import { SiteChrome } from "@/components/layout/site-chrome";
import { InterestImportPrompt } from "@/features/interests/components/interest-import-prompt";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteChrome>{children}</SiteChrome>
      <InterestImportPrompt />
    </>
  );
}
