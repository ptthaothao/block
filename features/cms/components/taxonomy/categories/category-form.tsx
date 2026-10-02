"use client";

import { Trash2, X } from "lucide-react";
import type { FormEvent } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TopicIcon } from "@/features/topics/components/topic-icon";
import { useActionMutation } from "@/lib/hooks/use-action-mutation";

import { saveCategory } from "../../../actions/taxonomy";
import { CATEGORY_FIELD_LABELS, CMS_LIMITS, CMS_QUERY_KEYS, TAXONOMY_COPY, TAXONOMY_SLUG_PREFIXES } from "../../../constants";
import { useSluggedForm } from "../../../hooks/use-slugged-form";
import type { CategoryInput } from "../../../schemas";
import type { CmsCategory } from "../../../types";
import { toOptionalNumber } from "../../../utils/post-form";
import { CountedLabel } from "../counted-label";
import { SlugInput } from "../slug-input";
import { ColorSwatchPicker } from "./color-swatch-picker";
import { IconPicker } from "./icon-picker";
import { PositionStepper } from "./position-stepper";

const IDS = {
  name: "category-name",
  slug: "category-slug",
  parent: "category-parent",
  description: "category-description",
  color: "category-color",
  icon: "category-icon",
  position: "category-position",
} as const;

const DESCRIPTION_ROWS = 4;

type CategoryFormProps = {
  initial: CategoryInput;
  categories: CmsCategory[];
  deleting: boolean;
  onDone: () => void;
  onDelete: () => void;
};

/** Side panel to create or edit a category, with a preview of its public chip. */
export function CategoryForm({ initial, categories, deleting, onDone, onDelete }: CategoryFormProps) {
  const { form, set, autoSlug } = useSluggedForm(initial, "name");
  const save = useActionMutation(saveCategory, [CMS_QUERY_KEYS.taxonomy]);

  // Only top-level categories can be parents; a category with children must stay top-level.
  const hasChildren = form.id !== null && categories.some((c) => c.parentId === form.id);
  const parentOptions = categories.filter((c) => c.parentId === null && c.id !== form.id);
  const color = form.color ?? "";
  const description = form.description ?? "";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save.mutate(form, { onSuccess: onDone });
  };

  return (
    <Card as="div" className="p-5 lg:sticky lg:top-20">
      <form onSubmit={submit} className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <span aria-hidden className="size-2 rounded-full bg-accent" />
            {form.id ? TAXONOMY_COPY.categories.editTitle : TAXONOMY_COPY.categories.newTitle}
          </h2>
          <button
            type="button"
            onClick={onDone}
            aria-label={TAXONOMY_COPY.close}
            className="grid size-8 place-items-center rounded-md text-muted transition hover:bg-surface-hover hover:text-text"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>

        <div className="rounded-md border border-border bg-surface-sunken p-3">
          <p className="font-mono text-[11px] tracking-wider text-faint uppercase">{TAXONOMY_COPY.categories.preview}</p>
          <span
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium"
            style={{ color: color || undefined, borderColor: color || undefined }}
          >
            <TopicIcon icon={form.icon || null} className="size-3.5" />
            {form.name || CATEGORY_FIELD_LABELS.name}
          </span>
        </div>

        {save.error && <Alert tone="error">{save.error.message}</Alert>}

        <div>
          <CountedLabel htmlFor={IDS.name} count={{ length: form.name.length, max: CMS_LIMITS.categoryNameMax }}>
            {CATEGORY_FIELD_LABELS.name}
          </CountedLabel>
          <Input
            id={IDS.name}
            required
            maxLength={CMS_LIMITS.categoryNameMax}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="py-2.5"
          />
        </div>

        <SlugInput
          id={IDS.slug}
          label={CATEGORY_FIELD_LABELS.slug}
          prefix={TAXONOMY_SLUG_PREFIXES.category}
          value={form.slug}
          onChange={(value) => set("slug", value)}
          onAuto={autoSlug}
        />

        <div>
          <CountedLabel htmlFor={IDS.parent}>{CATEGORY_FIELD_LABELS.parent}</CountedLabel>
          <Select
            id={IDS.parent}
            value={form.parentId ?? ""}
            disabled={hasChildren}
            onChange={(e) => set("parentId", toOptionalNumber(e.target.value))}
          >
            <option value="">{TAXONOMY_COPY.categories.noParent}</option>
            {parentOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          {hasChildren && <p className="mt-1.5 text-xs text-faint">{TAXONOMY_COPY.categories.hasChildren}</p>}
        </div>

        <div>
          <CountedLabel htmlFor={IDS.description} count={{ length: description.length, max: CMS_LIMITS.descriptionMax }}>
            {CATEGORY_FIELD_LABELS.description}
          </CountedLabel>
          <Textarea
            id={IDS.description}
            rows={DESCRIPTION_ROWS}
            maxLength={CMS_LIMITS.descriptionMax}
            value={description}
            onChange={(e) => set("description", e.target.value)}
            className="resize-y"
          />
        </div>

        <div>
          <CountedLabel htmlFor={IDS.color}>{CATEGORY_FIELD_LABELS.color}</CountedLabel>
          <ColorSwatchPicker id={IDS.color} label={CATEGORY_FIELD_LABELS.color} value={color} onChange={(v) => set("color", v)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <CountedLabel htmlFor={IDS.icon}>{CATEGORY_FIELD_LABELS.icon}</CountedLabel>
            <IconPicker
              id={IDS.icon}
              label={CATEGORY_FIELD_LABELS.icon}
              value={form.icon ?? ""}
              color={color}
              onChange={(v) => set("icon", v)}
            />
          </div>
          <div>
            <CountedLabel htmlFor={IDS.position}>{CATEGORY_FIELD_LABELS.position}</CountedLabel>
            <PositionStepper
              id={IDS.position}
              value={form.position}
              min={0}
              max={CMS_LIMITS.positionMax}
              onChange={(v) => set("position", v)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border pt-5">
          <Button type="submit" size="sm" loading={save.isPending} disabled={deleting}>
            {TAXONOMY_COPY.save}
          </Button>
          <Button variant="outline" size="sm" onClick={onDone}>
            {TAXONOMY_COPY.cancel}
          </Button>
          {form.id !== null && (
            <Button variant="ghost" className="ml-auto text-sm text-danger hover:text-danger" loading={deleting} onClick={onDelete}>
              <Trash2 aria-hidden className="size-4" />
              {TAXONOMY_COPY.delete}
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
