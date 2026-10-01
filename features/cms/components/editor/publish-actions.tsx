import { Button } from "@/components/ui/button";

import type { PostEditorState } from "../../hooks/use-post-editor";

/** Save and status buttons, pinned to the bottom of the settings sidebar. */
export function PublishActions({ editor }: { editor: PostEditorState }) {
  const { saved, saveState, canEdit, canPublish } = editor;
  const status = saved?.status ?? "draft";
  const busy = saveState === "saving";

  return (
    <div className="sticky bottom-0 mt-auto flex flex-wrap justify-end gap-2 border-t border-editor-line bg-editor-panel px-5 py-4">
      {canEdit && (
        <Button variant="outline" size="sm" disabled={busy} onClick={() => void editor.save()}>
          Lưu
        </Button>
      )}
      {canEdit && !canPublish && status === "draft" && (
        <Button size="sm" disabled={busy} onClick={() => void editor.submitForReview()}>
          Gửi duyệt
        </Button>
      )}
      {canPublish && status !== "published" && (
        <Button size="sm" disabled={busy} onClick={() => void editor.publish()}>
          Đăng bài
        </Button>
      )}
      {canPublish && status === "published" && (
        <Button variant="outline" size="sm" disabled={busy} onClick={() => void editor.unpublish()}>
          Gỡ bài
        </Button>
      )}
    </div>
  );
}
