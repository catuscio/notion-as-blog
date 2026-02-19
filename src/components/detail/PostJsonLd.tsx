import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { brand } from "@/config/brand";
import type { TPost, TAuthor } from "@/types";

export function PostJsonLd({
  post,
  author,
  wordCount,
  readingTime,
}: {
  post: TPost;
  author: TAuthor | null;
  wordCount?: number;
  readingTime?: number;
}) {
  const postUrl = `${brand.url}/${post.slug}`;
  const breadcrumbItems = [
    { name: "Home", url: brand.url },
    ...(post.category
      ? [
          {
            name: post.category,
            url: `${brand.url}/category/${encodeURIComponent(post.category)}`,
          },
        ]
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
        image={post.thumbnail || undefined}
        tags={post.tags}
        wordCount={wordCount}
        timeRequired={readingTime ? `PT${readingTime}M` : undefined}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
    </>
  );
}
