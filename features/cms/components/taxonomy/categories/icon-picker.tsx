"use client";

import { Menu, type MenuItem } from "@/components/ui/menu";
import { TOPIC_ICONS } from "@/features/topics/constants";
import { TopicIcon } from "@/features/topics/components/topic-icon";

import { TAXONOMY_COPY } from "../../../constants";

type IconPickerProps = {
  id: string;
  label: string;
  value: string;
  color: string;
  onChange: (value: string) => void;
};

/** Picks one of the icons the public topic pages know how to draw. */
export function IconPicker({ id, label, value, color, onChange }: IconPickerProps) {
  const items: MenuItem[] = Object.keys(TOPIC_ICONS).map((name) => ({
    id: name,
    label: name,
    icon: <TopicIcon icon={name} className="size-4" />,
    onSelect: () => onChange(name),
  }));

  return (
    <Menu
      label={`${label}: ${value || TAXONOMY_COPY.categories.defaultIcon}`}
      items={items}
      className="w-full"
      triggerClassName="flex h-[42px] w-full items-center justify-center rounded-md border border-border bg-surface-sunken transition hover:border-border-strong aria-expanded:border-accent"
      trigger={
        <span id={id} className="grid size-7 place-items-center rounded-md" style={{ color: color || undefined }}>
          <TopicIcon icon={value || null} className="size-5" />
        </span>
      }
    />
  );
}
