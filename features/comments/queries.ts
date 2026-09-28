import "server-only";

import { authorize } from "@/features/auth/guards";
import { PUBLISHED_STATUS } from "@/features/posts/constants";
import { REACTION_KINDS } from "@/features/reactions/constants";
import type { ReactionKind } from "@/features/reactions/types";
import { renderCommentMarkdown } from "@/lib/markdown/render-comment";
import { createClient } from "@/lib/supabase/server";
import { pickKnown } from "@/lib/utils/count-map";

import { COMMENT_LIMITS } from "./constants";
import { toCommentDTO } from "./mappers";
import type { CommentRow, ModerationRow } from "./rows";
import { COMMENT_SELECT, MODERATION_SELECT } from "./selects";
import type { CommentDTO, CommentPage, CommentSort, CommentThread, ModerationItem } from "./types";
import { commentPermissions, type Viewer } from "./utils/permissions";

type Client = Awaited<ReturnType<typeof createClient>>;

export type PostContext = { postId: string; authorIds: ReadonlySet<string> };

/** A published post's id and its authors (who moderate its comments). */
export async function getPostContext(supabase: Client, slug: string): Promise<PostContext | null> {
  const { data } = await supabase
    .from("posts")
    .select("id, post_authors(profile_id)")
    .eq("slug", slug)
    .eq("status", PUBLISHED_STATUS)
    .maybeSingle();
  if (!data) return null;
  return { postId: data.id, authorIds: new Set(data.post_authors.map((a) => a.profile_id)) };
}

async function getPostContextById(supabase: Client, postId: string): Promise<PostContext | null> {
  const { data } = await supabase.from("post_authors").select("profile_id").eq("post_id", postId);
  return data ? { postId, authorIds: new Set(data.map((a) => a.profile_id)) } : null;
}

async function currentViewer(): Promise<Viewer | null> {
  const user = await authorize("reader");
  return user ? { id: user.id, role: user.role } : null;
}

async function myReactionsFor(supabase: Client, ids: string[]): Promise<Map<string, ReactionKind[]>> {
  const mine = new Map<string, ReactionKind[]>();
  if (ids.length === 0) return mine;
  const { data } = await supabase.rpc("my_reactions", { p_target_type: "comment", p_target_ids: ids });
  for (const row of data ?? []) {
    mine.set(row.target_id, [...(mine.get(row.target_id) ?? []), ...pickKnown([row.emoji], REACTION_KINDS)]);
  }
  return mine;
}

/** Render and map rows for this viewer. */
async function toDTOs(supabase: Client, rows: CommentRow[], context: PostContext, viewer: Viewer | null): Promise<CommentDTO[]> {
  const now = Date.now();
  const mine = await myReactionsFor(supabase, viewer ? rows.map((r) => r.id) : []);
  const viewerIsPostAuthor = viewer !== null && context.authorIds.has(viewer.id);
  return Promise.all(
    rows.map(async (row) =>
      toCommentDTO(row, {
        bodyHtml: row.deleted_at ? "" : await renderCommentMarkdown(row.body_md),
        permissions: commentPermissions({
          viewer,
          authorId: row.author_id,
          status: row.status,
          isDeleted: row.deleted_at !== null,
          createdAt: row.created_at,
          viewerIsPostAuthor,
          now,
        }),
        myReactions: mine.get(row.id) ?? [],
        postAuthorIds: context.authorIds,
      }),
    ),
  );
}

function selectComments(supabase: Client) {
  return supabase.from("comments").select(COMMENT_SELECT);
}

function rowsOrThrow(result: { data: unknown; error: { message: string } | null }, where: string): CommentRow[] {
  if (result.error) throw new Error(`${where}: ${result.error.message}`);
  return (result.data as CommentRow[] | null) ?? [];
}

async function getCommentCount(supabase: Client, postId: string): Promise<number> {
  const { data } = await supabase.from("post_stats").select("comment_count").eq("post_id", postId).maybeSingle();
  return data?.comment_count ?? 0;
}

/** One page of threads, each with its first few replies. Read through the viewer's session (RLS decides). */
export async function getCommentPage(slug: string, sort: CommentSort, page: number): Promise<CommentPage | null> {
  const supabase = await createClient();
  const [context, viewer] = await Promise.all([getPostContext(supabase, slug), currentViewer()]);
  if (!context) return null;

  const { data: ranked, error } = await supabase.rpc("list_comment_threads", {
    p_post_id: context.postId,
    p_sort: sort,
    p_limit: COMMENT_LIMITS.pageSize,
    p_offset: page * COMMENT_LIMITS.pageSize,
  });
  if (error) throw new Error(`getCommentPage: ${error.message}`);
  const commentCount = await getCommentCount(supabase, context.postId);
  if (ranked.length === 0) return { threads: [], total: 0, commentCount, nextPage: null };

  const rootIds = ranked.map((r) => r.id);
  const [rootResult, replyResult] = await Promise.all([
    selectComments(supabase).in("id", rootIds),
    selectComments(supabase).in("parent_id", rootIds).order("created_at"),
  ]);
  const roots = rowsOrThrow(rootResult, "getCommentPage");
  const replies = rowsOrThrow(replyResult, "getCommentPage");

  // Only the first few replies per thread travel with the page.
  const perRoot = new Map<string, CommentRow[]>();
  for (const reply of replies) {
    if (!reply.parent_id) continue;
    const list = perRoot.get(reply.parent_id) ?? [];
    if (list.length < COMMENT_LIMITS.repliesPreview) perRoot.set(reply.parent_id, [...list, reply]);
  }
  const shownReplies = [...perRoot.values()].flat();

  const [rootDTOs, replyDTOs] = await Promise.all([
    toDTOs(supabase, roots, context, viewer),
    toDTOs(supabase, shownReplies, context, viewer),
  ]);
  const byId = new Map(rootDTOs.map((c) => [c.id, c]));
  const threads: CommentThread[] = rootIds.flatMap((id) => {
    const root = byId.get(id);
    return root ? [{ ...root, replies: replyDTOs.filter((r) => r.parentId === id) }] : [];
  });

  const total = ranked[0].total_count;
  return { threads, total, commentCount, nextPage: (page + 1) * COMMENT_LIMITS.pageSize < total ? page + 1 : null };
}

/** All replies of a thread ("Xem thêm n trả lời"). */
export async function getCommentReplies(rootId: string): Promise<CommentDTO[] | null> {
  const supabase = await createClient();
  const { data: root } = await supabase.from("comments").select("post_id").eq("id", rootId).is("parent_id", null).maybeSingle();
  if (!root) return null;
  const [context, viewer, result] = await Promise.all([
    getPostContextById(supabase, root.post_id),
    currentViewer(),
    selectComments(supabase).eq("parent_id", rootId).order("created_at"),
  ]);
  const rows = rowsOrThrow(result, "getCommentReplies");
  if (!context) return null;
  return toDTOs(supabase, rows, context, viewer);
}

/** One comment for the viewer, e.g. right after they wrote or edited it. */
export async function getCommentForViewer(id: string): Promise<CommentDTO | null> {
  const supabase = await createClient();
  const [result, viewer] = await Promise.all([selectComments(supabase).eq("id", id), currentViewer()]);
  const row = rowsOrThrow(result, "getCommentForViewer")[0];
  if (!row) return null;
  const context = await getPostContextById(supabase, row.post_id);
  if (!context) return null;
  const [dto] = await toDTOs(supabase, [row], context, viewer);
  return dto;
}

/** Pending comments and open reports (editors). */
export async function getModerationQueue(): Promise<ModerationItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("moderation_queue")
    .select(MODERATION_SELECT)
    .order("created_at", { ascending: false })
    .overrideTypes<ModerationRow[], { merge: false }>();
  if (error) throw new Error(`getModerationQueue: ${error.message}`);
  if (data.length === 0) return [];

  const [posts, authors] = await Promise.all([
    supabase.from("posts").select("id, slug, title").in("id", [...new Set(data.map((r) => r.post_id))]),
    supabase.from("profiles").select("id, username, display_name").in("id", [...new Set(data.map((r) => r.author_id))]),
  ]);
  const postById = new Map((posts.data ?? []).map((p) => [p.id, { slug: p.slug, title: p.title }]));
  const authorById = new Map(
    (authors.data ?? []).map((a) => [a.id, { username: String(a.username), displayName: a.display_name }]),
  );

  return data.map((row) => ({
    commentId: row.comment_id,
    status: row.status,
    body: row.body_md,
    createdAt: row.created_at,
    openReports: row.open_reports,
    reasons: row.reasons ?? [],
    author: authorById.get(row.author_id) ?? null,
    post: postById.get(row.post_id) ?? null,
  }));
}

