import { ROUTES } from "@/config/routes";
import { requireRole } from "@/features/auth/guards";
import { ReviewScreen } from "@/features/cms/components/review/review-screen";

export default async function ReviewPage() {
  await requireRole("editor", ROUTES.cmsReview);
  return <ReviewScreen />;
}
