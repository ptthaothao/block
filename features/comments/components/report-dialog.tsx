"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { CheckboxMark } from "@/components/ui/checkbox-mark";
import { Label } from "@/components/ui/input";
import { Sheet } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/lib/hooks/use-toast";

import { reportComment } from "../actions";
import { COMMENT_COPY, COMMENT_LIMITS, REPORT_REASONS } from "../constants";
import type { ReportReason } from "../types";

type ReportDialogProps = { commentId: string; open: boolean; onClose: () => void };

export function ReportDialog({ commentId, open, onClose }: ReportDialogProps) {
  const toast = useToast();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  const formId = `report-form-${commentId}`;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reason) return;
    setSending(true);
    const result = await reportComment({ id: commentId, reason, note: note || undefined });
    setSending(false);
    if (!result.ok) {
      toast.show({ message: result.error, tone: "error" });
      return;
    }
    toast.show({ message: COMMENT_COPY.reported, tone: "success" });
    setReason(null);
    setNote("");
    onClose();
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={COMMENT_COPY.reportTitle}
      variant="dialog"
      closeLabel={COMMENT_COPY.close}
      footer={
        <Button type="submit" form={formId} fullWidth disabled={!reason} loading={sending}>
          {COMMENT_COPY.reportSend}
        </Button>
      }
    >
      <form id={formId} onSubmit={submit}>
        <fieldset className="space-y-1">
          <legend className="sr-only">{COMMENT_COPY.reportTitle}</legend>
          {REPORT_REASONS.map((r) => (
            <label
              key={r.id}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 text-sm transition hover:bg-surface-hover has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent"
            >
              <input
                type="radio"
                name="report-reason"
                value={r.id}
                checked={reason === r.id}
                onChange={() => setReason(r.id)}
                className="sr-only"
              />
              <CheckboxMark checked={reason === r.id} round />
              {r.label}
            </label>
          ))}
        </fieldset>
        <div className="mt-4 space-y-2">
          <Label htmlFor={`report-note-${commentId}`}>{COMMENT_COPY.reportNote}</Label>
          <Textarea
            id={`report-note-${commentId}`}
            value={note}
            maxLength={COMMENT_LIMITS.reportNoteMax}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
          />
        </div>
      </form>
    </Sheet>
  );
}
