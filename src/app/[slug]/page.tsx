import { notFound } from "next/navigation";
import { getPostDetailData, getRelatedPosts, getSeriesPosts } from "@/lib/notion/getPost";
import { getPublishedPosts } from "@/lib/notion/getPosts";
import { getAuthorByName } from "@/lib/notion/getAuthors";
import { safeQuery } from "@/lib/notion/safeQuery";
import { PostHeader } from "@/components/detail/PostHeader";
import { PostBreadcrumb } from "@/components/detail/PostBreadcrumb";
import { PostTags } from "@/components/detail/PostTags";
import { PostJsonLd } from "@/components/detail/PostJsonLd";
import { HeroImage } from "@/components/detail/HeroImage";
import { NotionRenderer } from "@/components/detail/NotionRenderer";
import { AuthorCard } from "@/components/detail/AuthorCard";
import { TableOfContents } from "@/components/detail/TableOfContents";
import { ReadNext } from "@/components/detail/ReadNext";
import { SeriesNav } from "@/components/detail/SeriesNav";
import { SeriesCollection } from "@/components/detail/SeriesCollection";
import { CommentBox } from "@/components/detail/CommentBox";
import { brand } from "@/config/brand";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await safeQuery(() => getPostDetailData(slug), null);
  if (!result) return { title: "Not Found" };

  const { post } = result;
  const postUrl = `${brand.url}/${post.slug}`;
  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags.length > 0 ? post.tags : undefined,
    authors: [{ name: post.author }],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.lastEditedTime,
      section: post.category || undefined,
      authors: [post.author],
      url: postUrl,
    },
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const result = await safeQuery(() => getPostDetailData(slug), null);

  if (!result) notFound();

  const { post, blocks, allPosts, readingTime, wordCount } = result;

  const author = await safeQuery(() => getAuthorByName(post.author), null);

  const relatedPosts = getRelatedPosts(post, allPosts);
  const seriesPosts = getSeriesPosts(post, allPosts);

  return (
    <div className="w-full max-w-[1024px] mx-auto flex flex-col lg:flex-row gap-12 px-6 py-8">
      <PostJsonLd
        post={post}
        author={author}
        wordCount={wordCount}
        readingTime={readingTime}
      />
      <article className="w-full flex-1 min-w-0 max-w-3xl mx-auto lg:mx-0">
        <PostBreadcrumb post={post} />

        <PostHeader post={post} author={author} readingTime={readingTime} />

        {post.thumbnail && (
          <HeroImage src={post.thumbnail} alt={post.title} />
        )}

        <NotionRenderer blocks={blocks} />

        <PostTags tags={post.tags} />

        {seriesPosts.length > 0 && (
          <SeriesCollection
            posts={seriesPosts}
            currentPostId={post.id}
            seriesName={post.series}
          />
        )}

        <AuthorCard author={author} authorName={post.author} />

        {/* Mobile: sidebar content inline */}
        <div className="lg:hidden flex flex-col gap-8 mt-12 pt-12 border-t border-border">
          {seriesPosts.length > 0 && (
            <SeriesNav
              posts={seriesPosts}
              currentPostId={post.id}
              seriesName={post.series}
            />
          )}
          <ReadNext posts={relatedPosts} />
        </div>

        <CommentBox />
      </article>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-[9.5rem] flex flex-col gap-8">
          <TableOfContents />
          {seriesPosts.length > 0 && (
            <SeriesNav
              posts={seriesPosts}
              currentPostId={post.id}
              seriesName={post.series}
            />
          )}
          <ReadNext posts={relatedPosts} />
        </div>
      </aside>
    </div>
  );
}
