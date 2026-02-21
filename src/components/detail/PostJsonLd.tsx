import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { brand, getCategorySlug } from "@/config/brand";
import { copy } from "@/config/copy";
import type { Post, Author } from "@/types";

export function PostJsonLd({
  post,
  author,
  wordCount,
  readingTime,
  seriesPosts,
}: {
  post: Post;
  author: Author | null;
  wordCount?: number;
  readingTime?: number;
  seriesPosts?: Post[];
}) {
  const postUrl = `${brand.url}/${post.slug}`;
  const categorySlug = post.category ? getCategorySlug(post.category) : undefined;

  const seriesName = post.series ?? undefined;
  const seriesUrl = seriesName
    ? `${brand.url}/series/${encodeURIComponent(seriesName)}`
    : undefined;
  const positionInSeries =
    seriesName && seriesPosts && seriesPosts.length > 0
      ? seriesPosts.findIndex((p) => p.id === post.id) + 1
      : undefined;

  const breadcrumbItems = [
    { name: copy.footer.home, url: brand.url },
    ...(post.category && categorySlug
      ? [{ name: post.category, url: `${brand.url}/category/${categorySlug}` }]
      : []),
    { name: post.title, url: postUrl },
  ];

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.summary}
        url={postUrl}
        datePublished={post.date}
        dateModified={post.lastEditedTime}
        authorName={post.author}
        authorUrl={author?.socials.website || author?.socials.github || undefined}
        authorImage={author?.avatar || undefined}
        authorJobTitle={author?.role || undefined}
        image={post.thumbnail || `${brand.url}${brand.assets.ogImage}`}
        tags={post.tags}
        wordCount={wordCount}
        readingTimeMinutes={readingTime}
        seriesName={seriesName}
        seriesUrl={seriesUrl}
        positionInSeries={positionInSeries}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
    </>
  );
}
