import type { Metadata } from "next";

import { OnboardingPicker } from "@/features/interests/components/onboarding-picker";
import { INTEREST_COPY, INTEREST_LIMITS } from "@/features/interests/constants";
import { getTagSummaries, getTopicTree } from "@/features/topics/queries";

export const metadata: Metadata = { title: INTEREST_COPY.onboardingTitle, robots: { index: false } };

export default async function OnboardingPage() {
  const [topics, tags] = await Promise.all([getTopicTree(), getTagSummaries()]);
  return <OnboardingPicker topics={topics} tags={tags.slice(0, INTEREST_LIMITS.onboardingTags)} />;
}
