import type { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";

const WIDTHS = {
  page: "max-w-[100rem]",
  narrow: "max-w-md",
  prose: "max-w-3xl",
} as const;

type ContainerProps = ComponentProps<"div"> & {
  as?: "div" | "section" | "article";
  width?: keyof typeof WIDTHS;
};

/** Centered page column with the site's horizontal gutter. */
export function Container({ as: Tag = "div", width = "page", className, ...props }: ContainerProps) {
  return <Tag className={cn("mx-auto px-4 sm:px-6", WIDTHS[width], className)} {...props} />;
}
