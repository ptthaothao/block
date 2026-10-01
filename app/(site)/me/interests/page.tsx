import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { InterestManager } from "@/features/interests/components/interest-manager";
import { INTEREST_COPY } from "@/features/interests/constants";

export const metadata: Metadata = { title: INTEREST_COPY.manageTitle, robots: { index: false } };

export default function MyInterestsPage() {
  return (
    <Container width="narrow" className="py-12 md:py-16">
      <header className="mb-10">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">{INTEREST_COPY.manageTitle}</h1>
        <p className="mt-3 text-muted">{INTEREST_COPY.manageDescription}</p>
      </header>
      <InterestManager />
    </Container>
  );
}
