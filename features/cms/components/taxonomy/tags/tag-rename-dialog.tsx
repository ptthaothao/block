"use client";

import { useState, type FormEvent } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Sheet } from "@/components/ui/sheet";
import { slugify } from "@/lib/slug/slugify";

import { CMS_LIMITS, TAXONOMY_COPY } from "../../../constants";
import type { TagInput } from "../../../schemas";
import type { CmsTag } from "../../../types";

const IDS = { name: "tag-rename-name", slug: "tag-rename-slug" } as const;
const FORM_ID = "tag-rename-form";

type TagRenameDialogProps = {
  tag: CmsTag;
  saving: boolean;
  error: Error | null;
  onSave: (input: TagInput) => void;
  onClose: () => void;
};

/** Rename a tag; the slug follows the name unless edited. Mount with a key per tag. */
export function TagRenameDialog({ tag, saving, error, onSave, onClose }: TagRenameDialogProps) {
  const [name, setName] = useState(tag.name);
  const [slug, setSlug] = useState(tag.slug);
  const [slugTouched, setSlugTouched] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({ id: tag.id, name, slug, status: tag.status });
  };

  return (
    <Sheet
      open
      onClose={onClose}
      title={TAXONOMY_COPY.tags.renameTitle}
      variant="dialog"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            {TAXONOMY_COPY.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} size="sm" loading={saving}>
            {TAXONOMY_COPY.save}
          </Button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={submit} className="space-y-4">
        {error && <Alert tone="error">{error.message}</Alert>}
        <Field id={IDS.name} label={TAXONOMY_COPY.tags.nameLabel}>
          <Input
            id={IDS.name}
            required
            autoFocus
            maxLength={CMS_LIMITS.tagNameMax}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
        </Field>
        <Field id={IDS.slug} label={TAXONOMY_COPY.tags.slugLabel}>
          <Input
            id={IDS.slug}
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className="font-mono"
          />
        </Field>
      </form>
    </Sheet>
  );
}
