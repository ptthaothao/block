"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

import { usePendingNavigation } from "../../hooks/use-pending-navigation";

type FilterLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * A real link (works without JS, crawlable) that, with JS, navigates inside a
 * transition so the page keeps its scroll position and the grid dims while
 * the filtered results load.
 */
export function FilterLink({ href, onClick, ...props }: FilterLinkProps) {
  const pending = usePendingNavigation();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    if (!pending || event.defaultPrevented || modified) return;
    event.preventDefault();
    pending.navigate(href);
  }

  return <Link href={href} scroll={false} onClick={handleClick} {...props} />;
}
