import { ROUTES } from "@/config/routes";
import { requireRole } from "@/features/auth/guards";
import { TaxonomyScreen } from "@/features/cms/components/taxonomy/taxonomy-screen";

export default async function TaxonomyPage() {
  await requireRole("editor", ROUTES.cmsTaxonomy);
  return <TaxonomyScreen />;
}
