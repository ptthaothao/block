"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { GUEST_INTERESTS_STORAGE } from "../constants";
import type { InterestItem } from "../types";
import { parseGuestInterests, serializeGuestInterests } from "../utils/guest-interests";

// Interests of a visitor who is not signed in live in localStorage. Every
// read and write is guarded: storage can be blocked (private mode, disabled
// site data), in which case choices just last for this page view.
const listeners = new Set<() => void>();
let memoryFallback: string | null = null;

function read(): string | null {
  try {
    return window.localStorage.getItem(GUEST_INTERESTS_STORAGE.key);
  } catch {
    return memoryFallback;
  }
}

function write(value: string | null) {
  memoryFallback = value;
  try {
    if (value === null) window.localStorage.removeItem(GUEST_INTERESTS_STORAGE.key);
    else window.localStorage.setItem(GUEST_INTERESTS_STORAGE.key, value);
  } catch {
    // Storage blocked: keep the in-memory copy.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changed them.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

const getServerSnapshot = () => null;

export function useGuestInterests() {
  const raw = useSyncExternalStore(subscribe, read, getServerSnapshot);
  const items = useMemo(() => parseGuestInterests(raw), [raw]);
  const save = useCallback((next: InterestItem[]) => write(next.length > 0 ? serializeGuestInterests(next) : null), []);
  const clear = useCallback(() => write(null), []);
  return { items, save, clear };
}
