import { DEFAULT_DOT_COLOR } from "@/components/ui/color-dot";
import { cn } from "@/lib/utils/cn";

import { topicTint } from "../utils/topic-tint";
import { TopicIcon } from "./topic-icon";

const SIZES = {
  md: { box: "size-11 rounded-lg", icon: "size-5" },
  lg: { box: "size-14 rounded-xl", icon: "size-7" },
} as const;

type TopicIconTileProps = { icon: string | null; color: string | null; size?: keyof typeof SIZES; className?: string };

/** A topic's icon on a square tinted with its colour. */
export function TopicIconTile({ icon, color, size = "md", className }: TopicIconTileProps) {
  return (
    <span
      className={cn("grid shrink-0 place-items-center", SIZES[size].box, className)}
      style={{ background: topicTint(color) ?? undefined, color: color ?? DEFAULT_DOT_COLOR }}
    >
      <TopicIcon icon={icon} className={SIZES[size].icon} />
    </span>
  );
}
