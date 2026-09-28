import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { FollowButton } from "@/features/interests/components/follow-button";
import { AuthorCard } from "@/features/posts/components/author-card";
import { PostBreadcrumb } from "@/features/posts/components/post-breadcrumb";
import { PostHeader } from "@/features/posts/components/post-header";
import { PostTagList } from "@/features/posts/components/post-tag-list";
import { PostToc } from "@/features/posts/components/post-toc";
import { buildPostMetadata } from "@/features/posts/metadata";
import { getPostBySlug, getPublishedSlugs } from "@/features/posts/queries";

// Slugs not built ahead of time are rendered on first request, then cached.
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return post ? buildPostMetadata(post) : {};
}

export default async function PostPage({ params }: PageProps<"/posts/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <Container as="article" className="py-12">
      <PostBreadcrumb category={post.category} />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0 max-w-3xl">
          <PostHeader post={post} />
          {/* Sanitized when rendered (lib/markdown/render.ts). */}
          <div className="article-prose mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />
          <PostTagList tags={post.tags} />
          <section aria-label="Tác giả" className="mt-10 space-y-4">
            {post.authors.map((author) => (
              <AuthorCard
                key={author.username}
                author={author}
                action={
                  <FollowButton
                    type="author"
                    slug={author.username}
                    name={author.displayName}
                    avatarUrl={author.avatarUrl}
                    size="sm"
                  />
                }
              />
            ))}
          </section>
        </div>

        <aside className="hidden lg:block">
          <PostToc items={post.toc} />
        </aside>
      </div>
    </Container>
  );
}
