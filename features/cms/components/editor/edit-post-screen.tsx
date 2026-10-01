"use client";

import { useCmsPost } from "../../hooks/use-cms-queries";
import { QueryState } from "../query-state";
import { PostEditor } from "./post-editor";

export function EditPostScreen({ id, siteUrl }: { id: string; siteUrl: string }) {
  const { data, isLoading, error } = useCmsPost(id);
  if (!data) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <QueryState isLoading={isLoading} error={error} />
      </div>
    );
  }
  // Keyed so the form resets when a different post loads.
  return <PostEditor key={data.id} post={data} siteUrl={siteUrl} />;
}
