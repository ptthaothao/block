"use client";

import { useCallback, useSyncExternalStore } from "react";

import { FEED_TAB_STORAGE_KEY, FEED_TABS, type FeedTab } from "../constants";

// The tab the reader picked on the home page, for this browser session.
// Storage can be blocked; then the choice lasts for this page view only.
const listeners = new Set<() => void>();
let memoryFallback: string | null = null;

function read(): string | null {
  try {
    return window.sessionStorage.getItem(FEED_TAB_STORAGE_KEY);
  } catch {
    return memoryFallback;
  }
}

function write(value: FeedTab) {
  memoryFallback = value;
  try {
    window.sessionStorage.setItem(FEED_TAB_STORAGE_KEY, value);
  } catch {
    // Storage blocked: keep the in-memory copy.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getServerSnapshot = () => null;

function isFeedTab(value: string | null): value is FeedTab {
  return FEED_TABS.some((tab) => tab.id === value);
}

/** The picked tab, or null when the reader has not picked one yet this session. */
export function useFeedTab(): [FeedTab | null, (tab: FeedTab) => void] {
  const raw = useSyncExternalStore(subscribe, read, getServerSnapshot);
  const pick = useCallback((tab: FeedTab) => write(tab), []);
  return [isFeedTab(raw) ? raw : null, pick];
}
