"use client";

import { useRef, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slug/slugify";

import { saveCategory } from "../../actions/taxonomy";
import { CMS_LIMITS, CMS_QUERY_KEYS } from "../../constants";
import { useActionMutation } from "@/lib/hooks/use-action-mutation";
import type { CategoryInput } from "../../schemas";
import type { CmsCategory } from "../../types";
import { toOptionalNumber } from "../../utils/post-form";

const IDS = {
  name: "category-name",
  slug: "category-slug",
  parent: "category-parent",
  description: "category-description",
  color: "category-color",
  icon: "category-icon",
  position: "category-position",
} as const;

const DESCRIPTION_ROWS = 2;

type CategoryFormProps = { initial: CategoryInput; categories: CmsCategory[]; onDone: () => void };

export function CategoryForm({ initial, categories, onDone }: CategoryFormProps) {
  const [form, setForm] = useState(initial);
  const slugTouched = useRef(initial.id !== null);
  const save = useActionMutation(saveCategory, [CMS_QUERY_KEYS.taxonomy]);

  const set = <K extends keyof CategoryInput>(key: K, value: CategoryInput[K]) =>
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "slug") slugTouched.current = true;
      if (key === "name" && !slugTouched.current) next.slug = slugify(String(value));
      return next;
    });

  // Only top-level categories can be parents, and a category can't be its own parent.
  const parentOptions = categories.filter((c) => c.parentId === null && c.id !== form.id);

  return (
    <Card className="space-y-4 p-5">
      <h2 className="font-display text-lg font-bold">{form.id ? "Sửa danh mục" : "Thêm danh mục"}</h2>
      {save.error && <Alert tone="error">{save.error.message}</Alert>}

      <Field id={IDS.name} label="Tên">
        <Input id={IDS.name} maxLength={CMS_LIMITS.categoryNameMax} value={form.name} onChange={(e) => set("name", e.target.value)} />
      </Field>
      <Field id={IDS.slug} label="Slug">
        <Input id={IDS.slug} value={form.slug} onChange={(e) => set("slug", e.target.value)} className="font-mono" />
      </Field>
      <Field id={IDS.parent} label="Danh mục cha">
        <Select id={IDS.parent} value={form.parentId ?? ""} onChange={(e) => set("parentId", toOptionalNumber(e.target.value))}>
          <option value="">Không (cấp 1)</option>
          {parentOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field id={IDS.description} label="Mô tả">
        <Textarea
          id={IDS.description}
          rows={DESCRIPTION_ROWS}
          maxLength={CMS_LIMITS.descriptionMax}
          value={form.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field id={IDS.color} label="Màu">
          <Input id={IDS.color} value={form.color ?? ""} placeholder="#38bdf8" onChange={(e) => set("color", e.target.value)} className="px-3 font-mono" />
        </Field>
        <Field id={IDS.icon} label="Icon">
          <Input id={IDS.icon} maxLength={CMS_LIMITS.iconMax} value={form.icon ?? ""} onChange={(e) => set("icon", e.target.value)} className="px-3" />
        </Field>
        <Field id={IDS.position} label="Thứ tự">
          <Input
            id={IDS.position}
            type="number"
            min={0}
            max={CMS_LIMITS.positionMax}
            value={form.position}
            onChange={(e) => set("position", toOptionalNumber(e.target.value) ?? 0)}
            className="px-3"
          />
        </Field>
      </div>

      <div className="flex gap-2">
        <Button disabled={save.isPending} onClick={() => save.mutate(form, { onSuccess: onDone })}>
          Lưu
        </Button>
        <Button variant="outline" onClick={onDone}>
          Huỷ
        </Button>
      </div>
    </Card>
  );
}
