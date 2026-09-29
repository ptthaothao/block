"use client";

import { createContext, useContext } from "react";

export type ToastOptions = {
  message: string;
  tone?: "neutral" | "error" | "success";
  /** One inline action, e.g. "Hoàn tác". */
  action?: { label: string; onClick: () => void };
  durationMs?: number;
};

export type ToastApi = { show: (toast: ToastOptions) => void };

export const ToastContext = createContext<ToastApi | null>(null);

const NOOP: ToastApi = { show: () => {} };

/** Show a short, non-blocking message. Outside a ToastProvider it does nothing. */
export function useToast(): ToastApi {
  return useContext(ToastContext) ?? NOOP;
}
