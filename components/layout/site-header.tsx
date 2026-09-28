import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { MAIN_NAV } from "@/config/navigation";
import { UserNav } from "@/features/auth/components/user-nav";

import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-canvas/80 backdrop-blur-md">
      <Container className="flex h-16 items-center gap-3 sm:gap-8">
        <Logo />
        <nav aria-label="Chính" className="flex items-center gap-3 whitespace-nowrap sm:gap-6">
          {MAIN_NAV.map((item) => (
            <TextLink key={item.href} href={item.href} className="text-sm font-medium">
              {item.label}
            </TextLink>
          ))}
        </nav>
        <div className="ml-auto">
          <UserNav />
        </div>
      </Container>
    </header>
  );
}
