"use client";

import { EyeOff, Flag, Pencil, Pin, PinOff, Trash2 } from "lucide-react";
import { useState, type CSSProperties, type ReactNode } from "react";

import { Avatar, AVATAR_SIZES } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Menu, type MenuItem } from "@/components/ui/menu";
import { ROUTES } from "@/config/routes";
import { CommentReactions } from "@/features/reactions/components/comment-reactions";
import { formatDateTime } from "@/lib/format/date";
import { formatRelativeTime } from "@/lib/format/relative-time";
import { useToast } from "@/lib/hooks/use-toast";
import type { ActionResult } from "@/lib/actions/types";
import { cn } from "@/lib/utils/cn";

import { deleteComment, editComment, setCommentHidden, setCommentPinned } from "../actions";
import { COMMENT_ANCHOR_PREFIX, COMMENT_COPY, COMMENT_STATUS_TONES } from "../constants";
import type { CommentDTO } from "../types";
import { CommentBranch, CommentNode } from "./comment-branch";
import { CommentEditor } from "./comment-editor";
import { ReportDialog } from "./report-dialog";

const ICON_CLASS = "size-4";
/** The avatar size every connector is measured from (see .comment-item in globals.css). */
const AVATAR_SIZE = "md";

type CommentItemProps = {
  comment: CommentDTO;
  slug: string;
  onChanged: (comment: CommentDTO) => void;
  onReply?: (comment: CommentDTO) => void;
  highlighted?: boolean;
  /** The reply box, when this comment is the one being answered. */
  replyBox?: ReactNode;
  /** Replies, rendered under the body. */
  children?: ReactNode;
};

export function CommentItem({ comment, slug, onChanged, onReply, highlighted = false, replyBox, children }: CommentItemProps) {
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.bodyMd ?? "");
  const [reporting, setReporting] = useState(false);
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<ActionResult<CommentDTO>>, success?: string) => {
    setBusy(true);
    const result = await action();
    setBusy(false);
    if (!result.ok) {
      toast.show({ message: result.error, tone: "error" });
      return false;
    }
    onChanged(result.data);
    if (success) toast.show({ message: success });
    return true;
  };

  const name = comment.author?.displayName ?? COMMENT_COPY.deleted;
  const menu: MenuItem[] = [];
  if (comment.canEdit) {
    menu.push({ id: "edit", label: COMMENT_COPY.edit, icon: <Pencil className={ICON_CLASS} />, onSelect: () => setEditing(true) });
  }
  if (comment.canPin) {
    menu.push({
      id: "pin",
      label: comment.isPinned ? COMMENT_COPY.unpin : COMMENT_COPY.pin,
      icon: comment.isPinned ? <PinOff className={ICON_CLASS} /> : <Pin className={ICON_CLASS} />,
      onSelect: () => void run(() => setCommentPinned({ id: comment.id, pinned: !comment.isPinned })),
    });
  }
  if (comment.canHide) {
    const hidden = comment.status === "hidden";
    menu.push({
      id: "hide",
      label: hidden ? COMMENT_COPY.unhide : COMMENT_COPY.hide,
      icon: <EyeOff className={ICON_CLASS} />,
      onSelect: () => void run(() => setCommentHidden({ id: comment.id, hidden: !hidden })),
    });
  }
  if (comment.canReport) {
    menu.push({ id: "report", label: COMMENT_COPY.report, icon: <Flag className={ICON_CLASS} />, onSelect: () => setReporting(true) });
  }
  if (comment.canDelete) {
    menu.push({
      id: "delete",
      label: COMMENT_COPY.delete,
      icon: <Trash2 className={ICON_CLASS} />,
      onSelect: () => {
        if (window.confirm(COMMENT_COPY.deleteConfirm)) void run(() => deleteComment(comment.id), COMMENT_COPY.deletedToast);
      },
    });
  }

  const anchor = COMMENT_ANCHOR_PREFIX + comment.id;

  return (
    <article
      id={anchor}
      aria-label={name}
      style={{ "--avatar-size": `${AVATAR_SIZES[AVATAR_SIZE]}px` } as CSSProperties}
      className={cn(
        "comment-item scroll-mt-24 rounded-lg",
        highlighted && "motion-safe:animate-[comment-highlight_3s_ease-out]",
        comment.status === "hidden" && "opacity-60",
        busy && "opacity-60",
      )}
    >
      <div className="comment-row">
        <div className="comment-rail">
          {comment.author ? (
            <Avatar name={comment.author.displayName} src={comment.author.avatarUrl} size={AVATAR_SIZE} className="shrink-0" />
          ) : (
            <span aria-hidden className="comment-avatar-placeholder" />
          )}
          <span aria-hidden className="comment-spine" />
        </div>
        <div className="min-w-0 flex-1">
          {comment.isDeleted ? (
            <p className="py-1.5 text-sm italic text-faint">{COMMENT_COPY.deleted}</p>
          ) : (
            <>
              <header className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span className="font-semibold text-text">{name}</span>
                {comment.author?.isPostAuthor && (
                  <Badge className={COMMENT_STATUS_TONES.author}>{COMMENT_COPY.authorBadge.toUpperCase()}</Badge>
                )}
                {comment.isPinned && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
                    <Pin aria-hidden className="size-3" />
                    {COMMENT_COPY.pinned}
                  </span>
                )}
                {comment.status === "pending" && <Badge className={COMMENT_STATUS_TONES.pending}>{COMMENT_COPY.pendingLabel}</Badge>}
                {comment.status === "hidden" && <Badge className={COMMENT_STATUS_TONES.hidden}>{COMMENT_COPY.hiddenLabel}</Badge>}
                {menu.length > 0 && (
                  <Menu label={COMMENT_COPY.menuLabel(name)} items={menu} className="ml-auto" />
                )}
              </header>

              {editing ? (
                <div className="mt-2">
                  <CommentEditor
                    value={draft}
                    onChange={setDraft}
                    placeholder={COMMENT_COPY.placeholder}
                    submitLabel={COMMENT_COPY.save}
                    autoFocus
                    onCancel={() => {
                      setEditing(false);
                      setDraft(comment.bodyMd ?? "");
                    }}
                    onSubmit={async () => {
                      if (await run(() => editComment({ id: comment.id, body: draft }))) setEditing(false);
                    }}
                  />
                </div>
              ) : (
                <div className="comment-prose mt-1" dangerouslySetInnerHTML={{ __html: comment.bodyHtml }} />
              )}

              {comment.status === "pending" && comment.isMine && (
                <p className="mt-1 text-xs text-warning">{COMMENT_COPY.pendingNote}</p>
              )}

              {!editing && (
                <div className="mt-1">
                  <CommentReactions
                    commentId={comment.id}
                    initial={{ counts: comment.reactions, mine: comment.myReactions }}
                    returnPath={`${ROUTES.post(slug)}#${anchor}`}
                    disabled={comment.status !== "visible"}
                  >
                    {onReply && comment.status === "visible" && (
                      <button
                        type="button"
                        onClick={() => onReply(comment)}
                        className="min-h-9 rounded-md px-2 text-xs font-semibold text-muted transition hover:bg-surface-hover hover:text-text"
                      >
                        {COMMENT_COPY.reply}
                      </button>
                    )}
                    <a href={`#${anchor}`} className="px-1 text-xs font-medium text-faint transition hover:text-muted">
                      <time dateTime={comment.createdAt} title={formatDateTime(comment.createdAt)}>
                        {formatRelativeTime(comment.createdAt)}
                      </time>
                    </a>
                  </CommentReactions>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <CommentBranch>
        {replyBox && <CommentNode>{replyBox}</CommentNode>}
        {children}
      </CommentBranch>
      {comment.canReport && <ReportDialog commentId={comment.id} open={reporting} onClose={() => setReporting(false)} />}
    </article>
  );
}
