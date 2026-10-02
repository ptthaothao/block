"use client";

import { useState, type FormEvent } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";

import { TAXONOMY_COPY } from "../../../constants";
import type { CmsTag } from "../../../types";
import { toOptionalNumber } from "../../../utils/post-form";

const TARGET_ID = "tag-merge-target";
const FORM_ID = "tag-merge-form";

type TagMergeDialogProps = {
  sources: CmsTag[];
  tags: CmsTag[];
  merging: boolean;
  error: Error | null;
  onMerge: (targetId: number) => void;
  onClose: () => void;
};

/** Pick the tag that `sources` are merged into. */
export function TagMergeDialog({ sources, tags, merging, error, onMerge, onClose }: TagMergeDialogProps) {
  const [targetId, setTargetId] = useState<number | null>(null);
  const sourceIds = new Set(sources.map((t) => t.id));
  const targets = tags.filter((t) => !sourceIds.has(t.id));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (targetId !== null) onMerge(targetId);
  };

  return (
    <Sheet
      open
      onClose={onClose}
      title={TAXONOMY_COPY.tags.mergeTitle}
      variant="dialog"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            {TAXONOMY_COPY.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} size="sm" loading={merging} disabled={targetId === null}>
            {TAXONOMY_COPY.tags.mergeConfirm}
          </Button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={submit} className="space-y-4">
        {error && <Alert tone="error">{error.message}</Alert>}
        <p className="text-sm text-muted">
          {TAXONOMY_COPY.tags.mergeSources(sources.map((t) => `#${t.name}`).join(", "))}
        </p>
        <Field id={TARGET_ID} label={TAXONOMY_COPY.tags.mergeTarget}>
          <Select id={TARGET_ID} required value={targetId ?? ""} onChange={(e) => setTargetId(toOptionalNumber(e.target.value))}>
            <option value="">{TAXONOMY_COPY.tags.pickTarget}</option>
            {targets.map((t) => (
              <option key={t.id} value={t.id}>
                #{t.name} ({t.postCount})
              </option>
            ))}
          </Select>
        </Field>
      </form>
    </Sheet>
  );
}
