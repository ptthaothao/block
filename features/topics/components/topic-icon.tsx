import { FALLBACK_TOPIC_ICON, TOPIC_ICONS } from "../constants";

export function TopicIcon({ icon, className }: { icon: string | null; className?: string }) {
  const Icon = (icon && TOPIC_ICONS[icon]) || FALLBACK_TOPIC_ICON;
  return <Icon aria-hidden className={className} />;
}
