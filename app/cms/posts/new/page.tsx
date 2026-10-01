import { PostEditor } from "@/features/cms/components/editor/post-editor";
import { siteUrl } from "@/lib/env";

export default function NewPostPage() {
  return <PostEditor post={null} siteUrl={siteUrl} />;
}
