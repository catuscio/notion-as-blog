import { notFound } from "next/navigation";
import { getContentDetail } from "@/lib/notion/contentDetail";
import { getContentCatalog } from "@/lib/notion/contentCatalog";
import { getContentRobots } from "@/lib/contentMetadata";
import { getOptionalAuthorsByPeopleIds } from "@/lib/notion/getAuthors";
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
import type { ContentDetailData } from "@/lib/notion/contentDetail";
import type { Metadata } from "next";

async function getContentAuthors(authorIds: string[]): Promise<Author[]> {
  return getOptionalAuthorsByPeopleIds(authorIds);
}

async function getContentPageData(slug: string): Promise<
  (ContentDetailData & { authors: Author[] }) | null
> {
  const detail = await getContentDetail(slug);
  if (!detail) return null;
  const authors = await getContentAuthors(detail.content.authorIds);
  return { ...detail, authors };
}

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

async function findAccessibleContent(slug: string) {
  const catalog = await getContentCatalog();
  return catalog.detailAccessiblePosts.find((p) => p.slug === slug)
    ?? catalog.detailAccessiblePages.find((p) => p.slug === slug)
    ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await findAccessibleContent(slug);
  if (!post) return { title: copy.notFound.title };

  const postUrl = `${brand.url}/${post.slug}`;
  const robots = getContentRobots(post.status);
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
    ...(robots && { robots }),
  };
}

export async function generateStaticParams() {
  const catalog = await getContentCatalog();
  return [...catalog.listedPosts, ...catalog.listedPages].map((p) => ({
    slug: p.slug,
  }));
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const data = await getContentPageData(slug);
  if (!data) notFound();

  const { content: post, blocks, relatedPosts, seriesPosts, readingTime, wordCount, authors } = data;
  const animate = brand.postAnimation.enabled;
  const typingDuration = animate ? post.title.length * 40 + 200 : 0;

  const bodyContent = (
    <>
      {post.thumbnail && (
        <HeroImage src={post.thumbnail} alt={post.title} />
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

      {post.status === "Public" && <CommentBox />}
    </>
  );

  const sidebarContent = (
    <div className="sg-stack [--stack-gap:var(--space-8)]">
      <TableOfContents />
      {seriesPosts.length > 0 && (
        <SeriesNav
          posts={seriesPosts}
          currentPostId={post.id}
          seriesName={post.series ?? ""}
        />
      )}
      <ReadNext posts={relatedPosts} />
    </div>
  );

  return (
    <div className="sg-content-limiter sg-sticky-aside py-8">
      {post.status === "Public" && (
        <PostJsonLd post={post} authors={authors} wordCount={wordCount} readingTime={readingTime} seriesPosts={seriesPosts} />
      )}

      <article className="sg-sticky-aside-main sg-prose-limiter lg:mx-0">
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
      <aside className="sg-sticky-aside-side hidden lg:block">
        <div className={`flex max-h-[calc(100vh-6rem)] flex-col gap-12 ${animate ? "overflow-hidden" : "overflow-y-auto"}`}>
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
