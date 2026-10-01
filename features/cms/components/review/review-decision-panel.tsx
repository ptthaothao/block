"use client";

import { useState } from "react";
import { CircleCheck, SquareX } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/features/auth/constants";

import { CMS_LIMITS, REVIEW_NOTE_TEMPLATES } from "../../constants";
import { useCmsTaxonomy } from "../../hooks/use-cms-queries";
import { useCmsUser } from "../../hooks/use-cms-user";
import { useReviewActions } from "../../hooks/use-review-actions";
import type { CmsPost } from "../../types";
import { appendNoteLine } from "../../utils/append-note";
import { CategorySelect } from "../editor/category-select";
import { SettingsLabel, SettingsTextarea } from "../editor/settings/settings-controls";

const NOTE_FIELD_ID = "review-note";
const NOTE_HINT_ID = "review-note-hint";
const CATEGORY_FIELD_ID = "review-category";
const NOTE_ROWS = 6;

/** Right column: the reviewer's note, publish category and the two decisions. */
export function ReviewDecisionPanel({ post }: { post: CmsPost }) {
  const user = useCmsUser();
  const taxonomy = useCmsTaxonomy();
  const { publish, sendBack, busy, error } = useReviewActions();
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(post.categoryId);

  const addTemplate = (text: string) => setNote((current) => appendNoteLine(current, text, CMS_LIMITS.reviewNoteMax));
  const onPublish = () =>
    publish({ id: post.id, categoryId: categoryId !== null && categoryId !== post.categoryId ? categoryId : undefined });

  return (
    <section aria-label="Đánh giá và phê duyệt" className="flex flex-col gap-5 rounded-xl border border-editor-line bg-editor-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg leading-6 font-extrabold text-white">Đánh giá &amp; Phê duyệt</h2>
          <p className="mt-0.5 truncate font-mono text-[11px] text-accent">
            Mục tiêu: <span className="text-text">{post.title}</span>
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-editor-chip px-2 py-1 font-mono text-[10px] text-muted">{ROLE_LABELS[user.role]}</span>
      </div>

      {error && <Alert tone="error">{error.message}</Alert>}

      <div className="flex flex-col gap-2">
        <SettingsLabel htmlFor={NOTE_FIELD_ID} meta="Bắt buộc khi trả lại">
          Ghi chú cho tác giả
        </SettingsLabel>
        <p id={NOTE_HINT_ID} className="text-[11px] leading-4 text-muted">
          Tác giả thấy ghi chú này trong editor khi bài bị trả lại.
        </p>
        <SettingsTextarea
          id={NOTE_FIELD_ID}
          aria-describedby={NOTE_HINT_ID}
          rows={NOTE_ROWS}
          maxLength={CMS_LIMITS.reviewNoteMax}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Nhập lý do từ chối hoặc góp ý chỉnh sửa cho tác giả (vd: cần bổ sung giải thích đoạn code, định dạng lại tiêu đề…)"
          className="placeholder:text-faint"
        />
        <p className="text-right font-mono text-[10px] text-faint" aria-live="polite">
          {note.length} / {CMS_LIMITS.reviewNoteMax} ký tự
        </p>
        <div className="flex flex-col items-start gap-1.5">
          <span className="font-mono text-[10px] text-faint">Mẫu nhanh:</span>
          {REVIEW_NOTE_TEMPLATES.map((template) => (
            <button
              key={template.label}
              type="button"
              onClick={() => addTemplate(template.text)}
              className="rounded-md border border-editor-line bg-editor-chip px-2 py-1 font-mono text-[10px] text-editor-ink transition hover:border-accent hover:text-accent"
            >
              + {template.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <SettingsLabel htmlFor={CATEGORY_FIELD_ID}>Chuyên mục xuất bản</SettingsLabel>
        {taxonomy.data ? (
          <CategorySelect id={CATEGORY_FIELD_ID} categories={taxonomy.data.categories} value={categoryId} onChange={setCategoryId} disabled={busy} />
        ) : (
          <p className="text-xs text-muted">{taxonomy.error ? taxonomy.error.message : "Đang tải danh mục…"}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Button fullWidth disabled={busy || categoryId === null} onClick={onPublish}>
          <CircleCheck aria-hidden className="size-4" />
          Đăng bài
        </Button>
        <Button
          variant="outline"
          fullWidth
          disabled={busy || note.trim() === ""}
          onClick={() => sendBack({ id: post.id, note })}
          className="border-editor-line bg-editor-chip"
        >
          <SquareX aria-hidden className="size-4 text-danger" />
          Trả lại tác giả
        </Button>
        <p className="text-center font-mono text-[10px] leading-4 text-faint">
          Duyệt với tài khoản <span className="text-muted">{user.displayName}</span>
        </p>
      </div>
    </section>
  );
}
