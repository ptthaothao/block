import { z } from "zod";

import { URL_SLUG_PATTERN } from "@/features/posts/constants";

import { INTEREST_LIMITS, INTEREST_TYPES } from "./constants";

const slug = z.string().regex(URL_SLUG_PATTERN);
const NAME_MAX = 120;

export const interestChangeSchema = z.object({
  type: z.enum(INTEREST_TYPES),
  slug,
  name: z.string().trim().min(1).max(NAME_MAX),
  weight: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
});

export const interestItemSchema = z.object({
  type: z.enum(INTEREST_TYPES),
  slug,
  name: z.string().trim().min(1).max(NAME_MAX),
  weight: z.union([z.literal(1), z.literal(-1)]),
  color: z.string().nullable().catch(null),
  avatarUrl: z.string().nullable().catch(null),
});

export const interestItemsSchema = z.array(interestItemSchema).max(INTEREST_LIMITS.guestItems);

const slugList = z.array(slug).max(INTEREST_LIMITS.guestItems);

export const feedInterestsSchema = z.object({
  categories: slugList,
  tags: slugList,
  authors: slugList,
  mutedCategories: slugList,
  mutedTags: slugList,
});
