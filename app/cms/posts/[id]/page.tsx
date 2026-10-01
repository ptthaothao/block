import { EditPostScreen } from "@/features/cms/components/editor/edit-post-screen";
import { siteUrl } from "@/lib/env";

export default async function EditPostPage({ params }: PageProps<"/cms/posts/[id]">) {
  const { id } = await params;
  return <EditPostScreen id={id} siteUrl={siteUrl} />;
}
