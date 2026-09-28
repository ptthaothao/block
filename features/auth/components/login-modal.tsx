"use client";

import { Sheet } from "@/components/ui/sheet";
import { SITE } from "@/config/site";

import { LOGIN_MODAL_COPY } from "../constants";
import { LoginForm } from "./login-form";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  /** Where to come back to after signing in, e.g. the post and its #reactions anchor. */
  next: string;
  /** Why we're asking, e.g. "Đăng nhập để thả reaction". */
  reason?: string;
};

/** Sign in without leaving the page first: GitHub or an emailed code. */
export function LoginModal({ open, onClose, next, reason }: LoginModalProps) {
  return (
    <Sheet open={open} onClose={onClose} title={LOGIN_MODAL_COPY.title(SITE.name)} variant="dialog">
      <p className="text-sm text-muted">{reason ?? LOGIN_MODAL_COPY.defaultReason}</p>
      <LoginForm next={next} />
      <p className="mt-4 text-xs text-faint">{LOGIN_MODAL_COPY.resumeHint}</p>
    </Sheet>
  );
}
