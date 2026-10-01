import { CMS_LIMITS } from "../../constants";
import type { PostEditorState } from "../../hooks/use-post-editor";
import type { CmsTaxonomy } from "../../types";
import { CategorySelect } from "./category-select";
import { CoverField } from "./settings/cover-field";
import { LevelField } from "./settings/level-field";
import { SeoSection } from "./settings/seo-section";
import { SeriesField } from "./settings/series-field";
import { SettingsLabel, SettingsSection, SettingsTextarea } from "./settings/settings-controls";
import { TagField } from "./settings/tag-field";

const FIELD_IDS = { category: "post-category", excerpt: "post-excerpt" } as const;

const EXCERPT_ROWS = 3;

type PostSettingsProps = { editor: PostEditorState; taxonomy: CmsTaxonomy; siteUrl: string };

/** The settings sidebar's sections, from cover image down to the search preview. */
export function PostSettings({ editor, taxonomy, siteUrl }: PostSettingsProps) {
  const { values, update, canEdit } = editor;
  const disabled = !canEdit;

  return (
    <>
      <CoverField value={values.coverUrl} onChange={(v) => update("coverUrl", v)} disabled={disabled} />

      <SettingsSection className="gap-4">
        <div className="flex flex-col gap-1.5">
          <SettingsLabel htmlFor={FIELD_IDS.category}>Danh mục chuyên môn</SettingsLabel>
          <CategorySelect
            id={FIELD_IDS.category}
            categories={taxonomy.categories}
            value={values.categoryId}
            onChange={(v) => update("categoryId", v)}
            disabled={disabled}
          />
        </div>
        <LevelField value={values.level} onChange={(v) => update("level", v)} disabled={disabled} />
        <TagField value={values.tagsText} onChange={(v) => update("tagsText", v)} disabled={disabled} />
      </SettingsSection>

      <SettingsSection>
        <SeriesField
          series={taxonomy.series}
          seriesId={values.seriesId}
          position={values.seriesPosition}
          onSeriesChange={(v) => update("seriesId", v)}
          onPositionChange={(v) => update("seriesPosition", v)}
          disabled={disabled}
        />
      </SettingsSection>

      <SettingsSection className="gap-2 pb-[25px]">
        <SettingsLabel
          htmlFor={FIELD_IDS.excerpt}
          meta={`${values.excerpt.length} / ${CMS_LIMITS.excerptMax}`}
          metaClassName="font-mono text-accent"
        >
          Tóm tắt bài viết (Excerpt)
        </SettingsLabel>
        <SettingsTextarea
          id={FIELD_IDS.excerpt}
          rows={EXCERPT_ROWS}
          maxLength={CMS_LIMITS.excerptMax}
          value={values.excerpt}
          disabled={disabled}
          onChange={(e) => update("excerpt", e.target.value)}
        />
      </SettingsSection>

      <SeoSection editor={editor} siteUrl={siteUrl} />
    </>
  );
}
