import { ROUTES } from "@/config/routes";
import { requireRole } from "@/features/auth/guards";
import { ModerationScreen } from "@/features/comments/components/moderation-screen";

export default async function ModerationPage() {
  await requireRole("editor", ROUTES.dashboardModeration);
  return <ModerationScreen />;
}
