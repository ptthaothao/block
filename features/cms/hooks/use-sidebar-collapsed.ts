"use client";

import { useCallback, useSyncExternalStore } from "react";

import { CMS_SIDEBAR_COLLAPSED_KEY } from "../constants";

// Whether the desktop sidebar is collapsed, remembered in this browser.
// Storage can be blocked; then the choice lasts for this page view only.
const COLLAPSED = "1";
const listeners = new Set<() => void>();
let memoryFallback: string | null = null;

function read(): string | null {
  try {
    return window.localStorage.getItem(CMS_SIDEBAR_COLLAPSED_KEY);
  } catch {
    return memoryFallback;
  }
}

function write(collapsed: boolean) {
  memoryFallback = collapsed ? COLLAPSED : null;
  try {
    if (collapsed) window.localStorage.setItem(CMS_SIDEBAR_COLLAPSED_KEY, COLLAPSED);
    else window.localStorage.removeItem(CMS_SIDEBAR_COLLAPSED_KEY);
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

export function useSidebarCollapsed(): [boolean, (collapsed: boolean) => void] {
  const collapsed = useSyncExternalStore(subscribe, read, getServerSnapshot) === COLLAPSED;
  const setCollapsed = useCallback((value: boolean) => write(value), []);
  return [collapsed, setCollapsed];
}
