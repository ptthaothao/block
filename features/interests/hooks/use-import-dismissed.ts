"use client";

import { useCallback, useSyncExternalStore } from "react";

import { IMPORT_PROMPT_DISMISSED_KEY } from "../constants";

const DISMISSED = "1";
const listeners = new Set<() => void>();
let memoryFallback = false;

function read(): boolean {
  try {
    return window.sessionStorage.getItem(IMPORT_PROMPT_DISMISSED_KEY) === DISMISSED;
  } catch {
    return memoryFallback;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Until hydration we don't know; treat it as dismissed so nothing flashes.
const getServerSnapshot = () => true;

/** Whether the reader already answered "save these to your account?" in this session. */
export function useImportDismissed(): [boolean, () => void] {
  const dismissed = useSyncExternalStore(subscribe, read, getServerSnapshot);
  const dismiss = useCallback(() => {
    memoryFallback = true;
    try {
      window.sessionStorage.setItem(IMPORT_PROMPT_DISMISSED_KEY, DISMISSED);
    } catch {
      // Storage blocked: remember for this page view.
    }
    listeners.forEach((listener) => listener());
  }, []);
  return [dismissed, dismiss];
}
