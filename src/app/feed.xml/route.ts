import { Feed } from "feed";
import { brand } from "@/config/brand";
import { getPublicPosts } from "@/lib/notion/getPosts";
import { getPostDate } from "@/lib/postDate";

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

  try {
    const posts = await getPublicPosts();
    posts.forEach((post) => {
      feed.addItem({
        title: post.title,
        id: `${brand.url}/${post.slug}`,
        link: `${brand.url}/${post.slug}`,
        description: post.summary,
        content: post.summary,
        date: getPostDate(post),
        category: post.category
          ? [{ name: post.category }]
          : [],
        author: post.author
          ? [{ name: post.author }]
          : [],
        image: post.thumbnail || undefined,
      });
    });
  } catch {
    // Return empty feed if Notion is unavailable
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": `public, max-age=${brand.cache.feedTtl}, s-maxage=${brand.cache.feedTtl}`,
    },
  });
}
