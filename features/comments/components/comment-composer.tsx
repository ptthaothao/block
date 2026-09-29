"use client";

import { useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Sheet } from "@/components/ui/sheet";
import { MEDIA_QUERIES } from "@/config/breakpoints";
import { useSessionUser } from "@/features/auth/hooks/use-session-user";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

import { COMMENT_COPY } from "../constants";
import { CommentEditor } from "./comment-editor";

type CommentComposerProps = {
  value: string;
  onChange: (value: string) => void;
  /** Return true when the text was taken, so the composer clears and closes. */
  onSubmit: (body: string) => boolean;
  placeholder?: string;
  /** Top-level composer: a one-line "Viết bình luận…" until tapped. Replies open expanded. */
  collapsible?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
};

/**
 * Collapsed to one line until the reader taps it. On phones the editor opens
 * as a full-screen sheet so the keyboard doesn't squeeze it.
 */
export function CommentComposer({
  value,
  onChange,
  onSubmit,
  placeholder = COMMENT_COPY.placeholder,
  collapsible = false,
  onCancel,
  submitLabel,
}: CommentComposerProps) {
  const user = useSessionUser();
  const wide = useMediaQuery(MEDIA_QUERIES.sm);
  const [open, setOpen] = useState(!collapsible);

  const close = () => {
    if (collapsible) setOpen(false);
    onCancel?.();
  };
  const submit = () => {
    if (onSubmit(value.trim())) close();
  };

  const editor = (fill: boolean) => (
    <CommentEditor
      value={value}
      onChange={onChange}
      onSubmit={submit}
      onCancel={collapsible || onCancel ? close : undefined}
      placeholder={placeholder}
      submitLabel={submitLabel}
      autoFocus
      fill={fill}
    />
  );

  const collapsed = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex w-full items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5 text-left text-sm text-faint transition hover:border-border-strong"
    >
      {user ? <Avatar name={user.displayName} src={user.avatarUrl} size="md" /> : <span aria-hidden className="size-8 rounded-full bg-surface-hover" />}
      <span className="truncate">{value.trim() ? value : placeholder}</span>
    </button>
  );

  if (wide) return open ? editor(false) : collapsed;

  // Phones: the one-line trigger stays in the page; the editor opens full screen.
  return (
    <>
      {collapsible || !open ? collapsed : null}
      <Sheet open={open} onClose={close} title={placeholder} variant="full" closeLabel={COMMENT_COPY.close}>
        <div className="flex h-full flex-col">{editor(true)}</div>
      </Sheet>
    </>
  );
}
