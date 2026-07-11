import { Feed } from "feed";
import { brand } from "@/config/brand";
import { getListedPosts } from "@/lib/notion/contentCatalog";
import { getContentDate } from "@/lib/contentDate";

export async function GET() {
  const feed = new Feed({
    title: brand.name,
    description: brand.description,
    id: brand.url,
    link: brand.url,
    language: brand.lang,
    copyright: `© ${brand.since} ${brand.name}`,
    updated: new Date(),
    image: `${brand.url}${brand.logo.png}`,
    favicon: `${brand.url}/favicon.ico`,
  });

  const posts = await getListedPosts();
  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${brand.url}/${post.slug}`,
      link: `${brand.url}/${post.slug}`,
      description: post.summary,
      content: post.summary,
      date: getContentDate(post),
      category: post.category
        ? [{ name: post.category }]
        : [],
      author: post.author
        ? [{ name: post.author }]
        : [],
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": `public, max-age=${brand.cache.feedTtl}, s-maxage=${brand.cache.feedTtl}`,
    },
  });
}
