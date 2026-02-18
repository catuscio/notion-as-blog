import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostDetailData } from "@/lib/notion/getPost";
import { getAllPosts } from "@/lib/notion/getPosts";
import { getAuthorByName } from "@/lib/notion/getAuthors";
import { PostHeader } from "@/components/detail/PostHeader";
import { HeroImage } from "@/components/detail/HeroImage";
import { NotionRenderer } from "@/components/detail/NotionRenderer";
import { AuthorCard } from "@/components/detail/AuthorCard";
import { TableOfContents } from "@/components/detail/TableOfContents";
import { ReadNext } from "@/components/detail/ReadNext";
import { SeriesNav } from "@/components/detail/SeriesNav";
import { SeriesCollection } from "@/components/detail/SeriesCollection";
import { CommentBox } from "@/components/detail/CommentBox";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { revalidateSeconds } from "@/config/brand";
import type { Metadata } from "next";

export const revalidate = revalidateSeconds;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let result;
  try {
    result = await getPostDetailData(slug);
  } catch {
    result = null;
  }
  if (!result) return { title: "Not Found" };

  const { post } = result;
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  let result;
  try {
    result = await getPostDetailData(slug);
  } catch {
    result = null;
  }

  if (!result) notFound();

  const { post, blocks, allPosts, readingTime } = result;

  // Fetch author once, pass to both PostHeader and AuthorCard
  let author = null;
  try {
    author = await getAuthorByName(post.author);
  } catch {
    // Author DB unavailable
  }

  // Get related posts for "Read Next"
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  // Get series posts
  const seriesPosts = post.series
    ? allPosts
        .filter((p) => p.series === post.series)
        .sort((a, b) => a.date.localeCompare(b.date))
    : [];

  return (
    <div className="w-full max-w-[1024px] mx-auto flex flex-col lg:flex-row gap-12 px-6 py-8">
      <article className="w-full flex-1 min-w-0 max-w-3xl mx-auto lg:mx-0">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6 overflow-hidden">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {post.category && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={`/category/${encodeURIComponent(post.category)}`}
                    >
                      {post.category}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[200px] sm:max-w-none">{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <PostHeader post={post} author={author} readingTime={readingTime} />

        {post.thumbnail && (
          <HeroImage src={post.thumbnail} alt={post.title} />
        )}

        <NotionRenderer blocks={blocks} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <>
            <hr className="border-border my-12" />
            <div className="flex flex-wrap gap-2 mb-12">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-lg">
                  #{tag}
                </Badge>
              ))}
            </div>
          </>
        )}

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
