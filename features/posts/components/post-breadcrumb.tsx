import { Fragment } from "react";

import { TextLink } from "@/components/ui/text-link";
import { ROUTES } from "@/config/routes";

import type { CategoryRef } from "../types";

const SEPARATOR = "/";

export function PostBreadcrumb({ category }: { category: CategoryRef | null }) {
  const trail = [category?.parent, category].filter((c): c is { slug: string; name: string } => Boolean(c));
  return (
    <nav aria-label="Breadcrumb" className="mb-8 font-mono text-xs text-faint">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <TextLink href={ROUTES.home} className="text-faint">
            Trang chủ
          </TextLink>
        </li>
        {trail.map((item) => (
          <Fragment key={item.slug}>
            <li aria-hidden>{SEPARATOR}</li>
            <li>
              <TextLink href={ROUTES.topic(item.slug)} className="text-faint">
                {item.name}
              </TextLink>
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
