import { z } from "zod";

import { URL_SLUG_PATTERN } from "@/features/posts/constants";

import { COMMENT_COPY, COMMENT_LIMITS, REPORT_REASON_IDS } from "./constants";

const body = z
  .string()
  .trim()
  .min(1, COMMENT_COPY.bodyRequired)
  .max(COMMENT_LIMITS.bodyMax, COMMENT_COPY.tooLong(COMMENT_LIMITS.bodyMax));

export const newCommentSchema = z.object({
  postSlug: z.string().regex(URL_SLUG_PATTERN),
  parentId: z.uuid().nullable(),
  body,
});

export const commentEditSchema = z.object({ id: z.uuid(), body });

export const commentIdSchema = z.uuid();

export const commentReportSchema = z.object({
  id: z.uuid(),
  reason: z.enum(REPORT_REASON_IDS),
  note: z.string().trim().max(COMMENT_LIMITS.reportNoteMax).optional(),
});

export const previewSchema = z.string().max(COMMENT_LIMITS.bodyMax);
