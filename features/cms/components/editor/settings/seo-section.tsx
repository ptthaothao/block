"use client";

import { useState } from "react";

import { ROUTES } from "@/config/routes";

import { CMS_LIMITS } from "../../../constants";
import type { PostEditorState } from "../../../hooks/use-post-editor";
import { EditorIcon } from "../editor-icon";
import { SettingsInput, SettingsLabel, SettingsSection, SettingsTextarea } from "./settings-controls";

const FIELD_IDS = { title: "post-seo-title", description: "post-seo-description" } as const;
const SEO_DESCRIPTION_ROWS = 3;
/** Breadcrumb Google shows under the domain, e.g. "posts › my-slug". */
const BREADCRUMB_SEPARATOR = " › ";

type SeoSectionProps = { editor: PostEditorState; siteUrl: string };

/** A Google result preview; "Tùy biến SEO" reveals the fields that override title and excerpt. */
export function SeoSection({ editor, siteUrl }: SeoSectionProps) {
  const { values, update, canEdit } = editor;
  const [customizing, setCustomizing] = useState(Boolean(values.seoTitle || values.seoDescription));
  const breadcrumb = ROUTES.post(values.slug || "slug").split("/").filter(Boolean).join(BREADCRUMB_SEPARATOR);

  return (
    <SettingsSection>
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-1.5 text-xs leading-4 font-semibold text-text">
          <EditorIcon name="search" />
          Google Search Preview
        </h3>
        <button
          type="button"
          onClick={() => setCustomizing((open) => !open)}
          aria-expanded={customizing}
          className="text-[11px] leading-[16.5px] text-accent transition hover:text-accent-hover"
        >
          {customizing ? "Thu gọn" : "Tùy biến SEO"}
        </button>
      </div>

      <div className="flex flex-col gap-1 rounded-xl border border-editor-line bg-editor-base p-[13px]">
        <p className="truncate text-[11px] leading-[16.5px]">
          <span className="font-medium text-editor-ink">{new URL(siteUrl).host}</span>
          <span className="text-muted">
            {BREADCRUMB_SEPARATOR}
            {breadcrumb}
          </span>
        </p>
        <p className="truncate text-xs leading-4 font-semibold text-accent">
          {values.seoTitle || values.title || "Tiêu đề bài viết"}
        </p>
        <p className="line-clamp-2 text-[11px] leading-[17.88px] text-muted">
          {values.seoDescription || values.excerpt || "Thêm tóm tắt hoặc mô tả SEO để hiện ở đây."}
        </p>
      </div>

      {customizing && (
        <>
          <SettingsLabel htmlFor={FIELD_IDS.title} meta={`${values.seoTitle.length} / ${CMS_LIMITS.seoTitleMax}`} metaClassName="font-mono">
            Tiêu đề SEO
          </SettingsLabel>
          <SettingsInput
            id={FIELD_IDS.title}
            maxLength={CMS_LIMITS.seoTitleMax}
            value={values.seoTitle}
            disabled={!canEdit}
            onChange={(event) => update("seoTitle", event.target.value)}
            placeholder="Mặc định dùng tiêu đề bài"
          />
          <SettingsLabel
            htmlFor={FIELD_IDS.description}
            meta={`${values.seoDescription.length} / ${CMS_LIMITS.seoDescriptionMax}`}
            metaClassName="font-mono"
          >
            Mô tả SEO
          </SettingsLabel>
          <SettingsTextarea
            id={FIELD_IDS.description}
            rows={SEO_DESCRIPTION_ROWS}
            maxLength={CMS_LIMITS.seoDescriptionMax}
            value={values.seoDescription}
            disabled={!canEdit}
            onChange={(event) => update("seoDescription", event.target.value)}
            placeholder="Mặc định dùng tóm tắt"
          />
        </>
      )}
    </SettingsSection>
  );
}
