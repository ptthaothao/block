import { z } from "zod";

import { isAllowedCoverUrl } from "@/lib/utils/cover-image";
import { SLUG_MAX_LENGTH, SLUG_PATTERN } from "@/lib/slug/constants";

import { CMS_LIMITS, POST_STATUSES } from "./constants";

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

const slug = z
  .string()
  .trim()
  .min(1, "Cần có slug")
  .max(SLUG_MAX_LENGTH)
  .regex(SLUG_PATTERN, "Slug chỉ gồm chữ thường, số và dấu gạch ngang");

/** Empty strings from inputs become null. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .transform((v) => (v ? v : null));

const optionalCoverUrl = z
  .string()
  .trim()
  .nullable()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || isAllowedCoverUrl(v), "Ảnh bìa phải được tải lên từ kho lưu trữ");

const id = z.number().int().positive();

export const postIdSchema = z.uuid();

export const postStatusFilterSchema = z.enum(POST_STATUSES).nullable();

export const postOffsetSchema = z.number().int().min(0);

export const postInputSchema = z.object({
  title: z.string().trim().min(1, "Cần có tiêu đề").max(CMS_LIMITS.titleMax),
  slug,
  excerpt: optionalText(CMS_LIMITS.excerptMax),
  contentMd: z.string().max(CMS_LIMITS.contentMax),
  categoryId: id.nullable().refine((v) => v !== null, "Chọn một danh mục"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  seriesId: id.nullable(),
  seriesPosition: id.nullable(),
  coverUrl: optionalCoverUrl,
  seoTitle: optionalText(CMS_LIMITS.seoTitleMax),
  seoDescription: optionalText(CMS_LIMITS.seoDescriptionMax),
  tags: z
    .array(z.string().trim().min(1).max(CMS_LIMITS.tagNameMax))
    .max(CMS_LIMITS.tagsPerPost, `Tối đa ${CMS_LIMITS.tagsPerPost} tag`),
});
export type PostInput = z.input<typeof postInputSchema>;
export type PostValues = z.output<typeof postInputSchema>;

export const reviewNoteSchema = z.string().trim().min(1, "Ghi chú cho tác giả").max(CMS_LIMITS.reviewNoteMax);

export const categoryInputSchema = z.object({
  id: id.nullable(),
  parentId: id.nullable(),
  name: z.string().trim().min(1, "Cần có tên").max(CMS_LIMITS.categoryNameMax),
  slug,
  description: optionalText(CMS_LIMITS.descriptionMax),
  icon: optionalText(CMS_LIMITS.iconMax),
  color: z
    .string()
    .trim()
    .nullable()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || HEX_COLOR_PATTERN.test(v), "Màu dạng #RRGGBB"),
  position: z.number().int().min(0).max(CMS_LIMITS.positionMax),
});
export type CategoryInput = z.input<typeof categoryInputSchema>;

export const tagInputSchema = z.object({
  id: id.nullable(),
  name: z.string().trim().min(1, "Cần có tên").max(CMS_LIMITS.tagNameMax),
  slug,
  status: z.enum(["pending", "approved"]),
});
export type TagInput = z.input<typeof tagInputSchema>;

export const mergeTagsSchema = z.object({ sourceId: id, targetId: id });

export const seriesInputSchema = z.object({
  id: id.nullable(),
  title: z.string().trim().min(1, "Cần có tên").max(CMS_LIMITS.seriesTitleMax),
  slug,
  description: optionalText(CMS_LIMITS.descriptionMax),
  coverUrl: optionalCoverUrl,
});
export type SeriesInput = z.input<typeof seriesInputSchema>;

export const entityIdSchema = id;
