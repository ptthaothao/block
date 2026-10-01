"use client";

import { Avatar } from "@/components/ui/avatar";
import { useSessionUser } from "@/features/auth/hooks/use-session-user";

import { COMMENT_COPY } from "../constants";
import { CommentEditor } from "./comment-editor";

type CommentComposerProps = {
  value: string;
  onChange: (value: string) => void;
  /** Return true when the text was taken, so the composer clears and closes. */
  onSubmit: (body: string) => boolean;
  placeholder?: string;
  onCancel?: () => void;
  autoFocus?: boolean;
};

/** The compact comment field with the signed-in reader's avatar. */
export function CommentComposer({
  value,
  onChange,
  onSubmit,
  placeholder = COMMENT_COPY.placeholder,
  onCancel,
  autoFocus,
}: CommentComposerProps) {
  const user = useSessionUser();
  const avatar = user ? (
    <Avatar name={user.displayName} src={user.avatarUrl} size="md" className="shrink-0" />
  ) : (
    <span aria-hidden className="size-8 shrink-0 rounded-full bg-surface-hover" />
  );

  return (
    <CommentEditor
      value={value}
      onChange={onChange}
      onSubmit={() => void onSubmit(value.trim())}
      onCancel={onCancel}
      placeholder={placeholder}
      autoFocus={autoFocus}
      leading={avatar}
      hint={onCancel ? COMMENT_COPY.replyHint : undefined}
    />
  );
}
