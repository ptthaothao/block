"use client";

import { useRef, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slug/slugify";

import { saveSeries } from "../../actions/taxonomy";
import { CMS_LIMITS, CMS_QUERY_KEYS } from "../../constants";
import { useActionMutation } from "../../hooks/use-action-mutation";
import type { SeriesInput } from "../../schemas";

const IDS = {
  title: "series-title",
  slug: "series-slug",
  description: "series-description",
  cover: "series-cover",
} as const;

const DESCRIPTION_ROWS = 3;

export function SeriesForm({ initial, onDone }: { initial: SeriesInput; onDone: () => void }) {
  const [form, setForm] = useState(initial);
  const slugTouched = useRef(initial.id !== null);
  const save = useActionMutation(saveSeries, [CMS_QUERY_KEYS.taxonomy]);

  const set = <K extends keyof SeriesInput>(key: K, value: SeriesInput[K]) =>
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "slug") slugTouched.current = true;
      if (key === "title" && !slugTouched.current) next.slug = slugify(String(value));
      return next;
    });

  return (
    <Card className="space-y-4 p-5">
      <h2 className="font-display text-lg font-bold">{form.id ? "Sửa series" : "Thêm series"}</h2>
      {save.error && <Alert tone="error">{save.error.message}</Alert>}
      <Field id={IDS.title} label="Tên">
        <Input id={IDS.title} maxLength={CMS_LIMITS.seriesTitleMax} value={form.title} onChange={(e) => set("title", e.target.value)} />
      </Field>
      <Field id={IDS.slug} label="Slug">
        <Input id={IDS.slug} value={form.slug} onChange={(e) => set("slug", e.target.value)} className="font-mono" />
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
      <Field id={IDS.cover} label="Ảnh bìa" hint="Link ảnh đã tải lên kho lưu trữ.">
        <Input id={IDS.cover} type="url" value={form.coverUrl ?? ""} onChange={(e) => set("coverUrl", e.target.value)} />
      </Field>
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
