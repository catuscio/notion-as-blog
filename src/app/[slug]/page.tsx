import { notFound } from "next/navigation";
import { getPostDetailData, getPageBySlug, estimateReadingTime } from "@/lib/notion/getPost";
import { getPublishedPosts, getPublishedPages } from "@/lib/notion/getPosts";
import { getAuthorsByPeopleIds } from "@/lib/notion/getAuthors";
import { safeQuery } from "@/lib/notion/safeQuery";
import { PostHeader, PostHeaderMeta } from "@/components/detail/PostHeader";
import { TypewriterTitle } from "@/components/detail/TypewriterTitle";
import { AnimatedReveal } from "@/components/detail/AnimatedReveal";
import { HeroImage } from "@/components/detail/HeroImage";
import { NotionRenderer } from "@/components/detail/NotionRenderer";
import { AuthorCardList } from "@/components/detail/AuthorCard";
import { TableOfContents } from "@/components/detail/TableOfContents";
import { ReadNext } from "@/components/detail/ReadNext";
import { SeriesNav } from "@/components/detail/SeriesNav";
import { SeriesCollection } from "@/components/detail/SeriesCollection";
import { CommentBox } from "@/components/detail/CommentBox";
import { PostJsonLd } from "@/components/detail/PostJsonLd";
import { PostBreadcrumb } from "@/components/detail/PostBreadcrumb";
import { PostTags } from "@/components/detail/PostTags";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import type { Author } from "@/types";

async function fetchPostAuthors(authorIds: string[]): Promise<Author[]> {
  return safeQuery<Author[]>(
    () => getAuthorsByPeopleIds(authorIds),
    []
  );
}
import type { PostDetailData } from "@/lib/notion/getPost";
import type { Metadata } from "next";

async function getPostPageData(slug: string): Promise<
  (PostDetailData & { authors: Author[] }) | null
> {
  // Try Post first
  const result = await safeQuery(() => getPostDetailData(slug), null);
  if (result) {
    const authors = await fetchPostAuthors(result.post.authorIds);
    return { ...result, authors };
  }

  // Fall back to Page type (about, etc.)
  const pageResult = await safeQuery(() => getPageBySlug(slug), null);
  if (!pageResult) return null;

  const { page, blocks } = pageResult;
  const text = blocks
    .map((b) => {
      const typed = (b as Record<string, unknown>)[b.type] as Record<string, unknown> | undefined;
      if (typed && Array.isArray(typed.rich_text)) {
        return (typed.rich_text as { plain_text: string }[]).map((t) => t.plain_text).join("");
      }
      return "";
    })
    .join(" ");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const readingTime = estimateReadingTime(text);
  const authors = await fetchPostAuthors(page.authorIds);

  return { post: page, blocks, relatedPosts: [], seriesPosts: [], readingTime, wordCount, authors };
}

type Props = {
  params: Promise<{ slug: string }>;
};

async function findPostOrPage(slug: string) {
  const posts = await safeQuery(getPublishedPosts, []);
  const post = posts.find((p) => p.slug === slug);
  if (post) return post;
  const pages = await safeQuery(getPublishedPages, []);
  return pages.find((p) => p.slug === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPostOrPage(slug);
  if (!post) return { title: copy.notFound.title };

  const postUrl = `${brand.url}/${post.slug}`;
  return {
    title: post.title,
    description: post.summary,
    authors: post.author.split(", ").filter(Boolean).map((name) => ({ name })),
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
      authors: post.author.split(", ").filter(Boolean),
      url: postUrl,
      images: [{ url: `/${post.slug}/opengraph-image`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [`/${post.slug}/opengraph-image`],
    },
  };
}

export async function generateStaticParams() {
  const [posts, pages] = await Promise.all([
    safeQuery(getPublishedPosts, []),
    safeQuery(getPublishedPages, []),
  ]);
  return [...posts, ...pages].map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const data = await getPostPageData(slug);
  if (!data) notFound();

  const { post, blocks, relatedPosts, seriesPosts, readingTime, wordCount, authors } = data;
  const animate = brand.postAnimation.enabled;
  const typingDuration = animate ? post.title.length * 40 + 200 : 0;

  const bodyContent = (
    <>
      {post.thumbnail && (
        <HeroImage src={post.thumbnail} alt={post.title} blurDataURL={post.blurDataURL} />
      )}

      <NotionRenderer blocks={blocks} />
      <PostTags tags={post.tags} />

      {seriesPosts.length > 0 && (
        <SeriesCollection
          posts={seriesPosts}
          currentPostId={post.id}
          seriesName={post.series ?? ""}
        />
      )}

      <AuthorCardList authors={authors} />

      {/* Mobile: sidebar content inline */}
      <div className="lg:hidden flex flex-col gap-8 mt-12 pt-12 border-t border-border">
        {seriesPosts.length > 0 && (
          <SeriesNav
            posts={seriesPosts}
            currentPostId={post.id}
            seriesName={post.series ?? ""}
          />
        )}
        <ReadNext posts={relatedPosts} />
      </div>

      <CommentBox />
    </>
  );

  const sidebarContent = (
    <>
      <TableOfContents />
      {seriesPosts.length > 0 && (
        <SeriesNav
          posts={seriesPosts}
          currentPostId={post.id}
          seriesName={post.series ?? ""}
        />
      )}
      <ReadNext posts={relatedPosts} />
    </>
  );

  return (
    <div className="w-full max-w-[1024px] mx-auto flex flex-col lg:flex-row gap-12 px-6 py-8">
      <PostJsonLd post={post} authors={authors} wordCount={wordCount} readingTime={readingTime} seriesPosts={seriesPosts} />

      <article className="w-full flex-1 min-w-0 max-w-3xl mx-auto lg:mx-0">
        <PostBreadcrumb post={post} />
        <PostHeader
          post={post}
          authors={authors}
          readingTime={readingTime}
          titleSlot={animate ? <TypewriterTitle text={post.title} /> : undefined}
          metaSlot={animate ? <AnimatedReveal delay={typingDuration}><PostHeaderMeta post={post} authors={authors} readingTime={readingTime} /></AnimatedReveal> : undefined}
        />

        {animate ? (
          <AnimatedReveal delay={typingDuration}>{bodyContent}</AnimatedReveal>
        ) : (
          bodyContent
        )}
      </article>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className={`sticky top-20 max-h-[calc(100vh-6rem)] flex flex-col gap-12 ${animate ? "overflow-hidden" : "overflow-y-auto"}`}>
          {animate ? (
            <AnimatedReveal delay={typingDuration} unlockOverflowParent>{sidebarContent}</AnimatedReveal>
          ) : (
            sidebarContent
          )}
        </div>
      </aside>
    </div>
  );
}
