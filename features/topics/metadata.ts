import type { Metadata } from "next";

import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/site";

import type { TagSummary, TopicPage } from "./types";

export function buildTopicMetadata(topic: TopicPage): Metadata {
  const title = topic.parent ? `${topic.parent.name} › ${topic.name}` : topic.name;
  const description = topic.description ?? `Bài viết về ${topic.name} trên ${SITE.name}.`;
  return { title, description, alternates: { canonical: ROUTES.topic(topic.slug) }, openGraph: { title, description } };
}

export function buildTagMetadata(tag: TagSummary): Metadata {
  const title = `#${tag.name}`;
  const description = `Bài viết gắn tag ${tag.name} trên ${SITE.name}.`;
  return { title, description, alternates: { canonical: ROUTES.tag(tag.slug) }, openGraph: { title, description } };
}
