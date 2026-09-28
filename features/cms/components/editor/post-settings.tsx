import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { CMS_LIMITS, POST_LEVEL_OPTIONS } from "../../constants";
import type { PostEditorState } from "../../hooks/use-post-editor";
import type { CmsTaxonomy, PostLevel } from "../../types";
import { toOptionalNumber } from "../../utils/post-form";
import { CategorySelect } from "./category-select";

const FIELD_IDS = {
  category: "post-category",
  level: "post-level",
  tags: "post-tags",
  series: "post-series",
  seriesPosition: "post-series-position",
  excerpt: "post-excerpt",
  cover: "post-cover",
  seoTitle: "post-seo-title",
  seoDescription: "post-seo-description",
} as const;

const EXCERPT_ROWS = 3;

type PostSettingsProps = { editor: PostEditorState; taxonomy: CmsTaxonomy };

export function PostSettings({ editor, taxonomy }: PostSettingsProps) {
  const { values, update, canEdit } = editor;
  const disabled = !canEdit;

  return (
    <Card className="space-y-5 p-5">
      <Field id={FIELD_IDS.category} label="Danh mục">
        <CategorySelect
          id={FIELD_IDS.category}
          categories={taxonomy.categories}
          value={values.categoryId}
          onChange={(v) => update("categoryId", v)}
          disabled={disabled}
        />
      </Field>

      <Field id={FIELD_IDS.level} label="Cấp độ">
        <Select
          id={FIELD_IDS.level}
          value={values.level}
          disabled={disabled}
          onChange={(e) => update("level", e.target.value as PostLevel)}
        >
          {POST_LEVEL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        id={FIELD_IDS.tags}
        label="Tag"
        hint={`Cách nhau bằng dấu phẩy, tối đa ${CMS_LIMITS.tagsPerPost}. Tag mới sẽ chờ biên tập viên duyệt.`}
      >
        <Input
          id={FIELD_IDS.tags}
          value={values.tagsText}
          disabled={disabled}
          onChange={(e) => update("tagsText", e.target.value)}
          placeholder="nextjs, react"
        />
      </Field>

      <div className="grid grid-cols-[1fr_5rem] gap-3">
        <Field id={FIELD_IDS.series} label="Series">
          <Select
            id={FIELD_IDS.series}
            value={values.seriesId ?? ""}
            disabled={disabled}
            onChange={(e) => update("seriesId", toOptionalNumber(e.target.value))}
          >
            <option value="">Không thuộc series</option>
            {taxonomy.series.map((series) => (
              <option key={series.id} value={series.id}>
                {series.title}
              </option>
            ))}
          </Select>
        </Field>
        <Field id={FIELD_IDS.seriesPosition} label="Phần">
          <Input
            id={FIELD_IDS.seriesPosition}
            type="number"
            min={1}
            value={values.seriesPosition ?? ""}
            disabled={disabled || !values.seriesId}
            onChange={(e) => update("seriesPosition", toOptionalNumber(e.target.value))}
            className="px-3 py-2.5"
          />
        </Field>
      </div>

      <Field id={FIELD_IDS.excerpt} label="Tóm tắt" hint={`Tối đa ${CMS_LIMITS.excerptMax} ký tự.`}>
        <Textarea
          id={FIELD_IDS.excerpt}
          rows={EXCERPT_ROWS}
          maxLength={CMS_LIMITS.excerptMax}
          value={values.excerpt}
          disabled={disabled}
          onChange={(e) => update("excerpt", e.target.value)}
        />
      </Field>

      <Field id={FIELD_IDS.cover} label="Ảnh bìa" hint="Link ảnh đã tải lên kho lưu trữ.">
        <Input
          id={FIELD_IDS.cover}
          type="url"
          value={values.coverUrl}
          disabled={disabled}
          onChange={(e) => update("coverUrl", e.target.value)}
          placeholder="https://…supabase.co/storage/v1/object/public/…"
        />
      </Field>

      <Field id={FIELD_IDS.seoTitle} label="Tiêu đề SEO" hint={`Tối đa ${CMS_LIMITS.seoTitleMax} ký tự.`}>
        <Input
          id={FIELD_IDS.seoTitle}
          maxLength={CMS_LIMITS.seoTitleMax}
          value={values.seoTitle}
          disabled={disabled}
          onChange={(e) => update("seoTitle", e.target.value)}
        />
      </Field>

      <Field id={FIELD_IDS.seoDescription} label="Mô tả SEO" hint={`Tối đa ${CMS_LIMITS.seoDescriptionMax} ký tự.`}>
        <Textarea
          id={FIELD_IDS.seoDescription}
          rows={EXCERPT_ROWS}
          maxLength={CMS_LIMITS.seoDescriptionMax}
          value={values.seoDescription}
          disabled={disabled}
          onChange={(e) => update("seoDescription", e.target.value)}
        />
      </Field>
    </Card>
  );
}
