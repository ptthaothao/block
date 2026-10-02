"use client";

import { Trash2 } from "lucide-react";
import type { FormEvent } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUrlUpload } from "@/features/storage/components/image-url-upload";
import { ZoomableImage } from "@/features/storage/components/zoomable-image";
import { useActionMutation } from "@/lib/hooks/use-action-mutation";
import { isAllowedCoverUrl } from "@/lib/utils/cover-image";

import { saveSeries } from "../../../actions/taxonomy";
import { CMS_LIMITS, CMS_QUERY_KEYS, SERIES_COVER_STORAGE, TAXONOMY_COPY, TAXONOMY_SLUG_PREFIXES } from "../../../constants";
import { useSluggedForm } from "../../../hooks/use-slugged-form";
import type { SeriesInput } from "../../../schemas";
import { CountedLabel } from "../counted-label";
import { SlugInput } from "../slug-input";

const IDS = {
  form: "series-form",
  title: "series-title",
  slug: "series-slug",
  description: "series-description",
  cover: "series-cover",
} as const;

const DESCRIPTION_ROWS = 4;
/** Rendered width of the cover preview inside the 420px drawer. */
const COVER_PREVIEW_SIZES = "372px";

type SeriesFormProps = {
  initial: SeriesInput;
  deleting: boolean;
  onClose: () => void;
  onDelete: () => void;
};

/** Right-hand drawer to create or edit a series. Mount with a key per series. */
export function SeriesForm({ initial, deleting, onClose, onDelete }: SeriesFormProps) {
  const { form, set, autoSlug } = useSluggedForm(initial, "title");
  const save = useActionMutation(saveSeries, [CMS_QUERY_KEYS.taxonomy]);
  const description = form.description ?? "";
  const coverUrl = form.coverUrl ?? "";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save.mutate(form, { onSuccess: onClose });
  };

  return (
    <Drawer
      open
      onClose={onClose}
      title={form.id ? TAXONOMY_COPY.series.editTitle : TAXONOMY_COPY.series.newTitle}
      subtitle={
        form.id !== null && (
          <>
            <span className="text-accent">ID: {form.id}</span> · {initial.title}
          </>
        )
      }
      footer={
        <div className="flex items-center gap-2">
          {form.id !== null && (
            <Button variant="ghost" className="mr-auto font-mono text-sm text-danger hover:text-danger" loading={deleting} onClick={onDelete}>
              <Trash2 aria-hidden className="size-4" />
              {TAXONOMY_COPY.series.remove}
            </Button>
          )}
          <Button variant="outline" size="sm" className="ml-auto" onClick={onClose}>
            {TAXONOMY_COPY.cancel}
          </Button>
          <Button type="submit" form={IDS.form} size="sm" loading={save.isPending} disabled={deleting}>
            {TAXONOMY_COPY.save}
          </Button>
        </div>
      }
    >
      <form id={IDS.form} onSubmit={submit} className="space-y-6">
        {save.error && <Alert tone="error">{save.error.message}</Alert>}

        <div>
          <CountedLabel htmlFor={IDS.title} count={{ length: form.title.length, max: CMS_LIMITS.seriesTitleMax }}>
            {TAXONOMY_COPY.series.title}
          </CountedLabel>
          <Input
            id={IDS.title}
            required
            autoFocus
            maxLength={CMS_LIMITS.seriesTitleMax}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        <SlugInput
          id={IDS.slug}
          label={TAXONOMY_COPY.series.slug}
          prefix={TAXONOMY_SLUG_PREFIXES.series}
          value={form.slug}
          onChange={(value) => set("slug", value)}
          onAuto={autoSlug}
        />

        <div>
          <CountedLabel htmlFor={IDS.description} count={{ length: description.length, max: CMS_LIMITS.descriptionMax }}>
            {TAXONOMY_COPY.series.description}
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

        <div className="space-y-3">
          <CountedLabel htmlFor={IDS.cover}>{TAXONOMY_COPY.series.cover}</CountedLabel>
          {isAllowedCoverUrl(coverUrl) && (
            <ZoomableImage src={coverUrl} alt={form.title} sizes={COVER_PREVIEW_SIZES} className="aspect-video w-full rounded-lg" />
          )}
          <ImageUrlUpload
            id={IDS.cover}
            bucket={SERIES_COVER_STORAGE.bucket}
            path={SERIES_COVER_STORAGE.path}
            value={coverUrl}
            onChange={(url) => set("coverUrl", url)}
            hideDropzoneWhenFull
          />
        </div>
      </form>
    </Drawer>
  );
}
