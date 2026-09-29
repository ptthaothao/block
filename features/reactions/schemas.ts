import { z } from "zod";

import { URL_SLUG_PATTERN } from "@/features/posts/constants";

import { REACTION_KINDS } from "./constants";

export const reactionKindSchema = z.enum(REACTION_KINDS);

export const reactionTargetSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("post"), slug: z.string().regex(URL_SLUG_PATTERN) }),
  z.object({ type: z.literal("comment"), id: z.uuid() }),
]);

export const reactionToggleSchema = z.object({ target: reactionTargetSchema, emoji: reactionKindSchema });
