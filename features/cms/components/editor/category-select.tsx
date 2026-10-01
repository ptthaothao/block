import { CATEGORY_PATH_SEPARATOR } from "../../constants";
import type { CmsCategory } from "../../types";
import { SettingsSelect } from "./settings/settings-controls";

type CategorySelectProps = {
  id: string;
  categories: CmsCategory[];
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
};

/** Parent categories as option groups; a post goes into a child (or a parent without children). */
export function CategorySelect({ id, categories, value, onChange, disabled }: CategorySelectProps) {
  const parents = categories.filter((c) => c.parentId === null);
  return (
    <SettingsSelect
      id={id}
      value={value ?? ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
    >
      <option value="">Chọn danh mục</option>
      {parents.map((parent) => {
        const children = categories.filter((c) => c.parentId === parent.id);
        if (children.length === 0) {
          return (
            <option key={parent.id} value={parent.id}>
              {parent.name}
            </option>
          );
        }
        return (
          <optgroup key={parent.id} label={parent.name}>
            <option value={parent.id}>{parent.name} (chung)</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {`${parent.name}${CATEGORY_PATH_SEPARATOR}${child.name}`}
              </option>
            ))}
          </optgroup>
        );
      })}
    </SettingsSelect>
  );
}
