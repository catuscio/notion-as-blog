import { Feed } from "feed";
import { brand } from "@/config/brand";
import { getPublishedPosts } from "@/lib/notion/getPosts";

export async function GET() {
  const feed = new Feed({
    title: brand.name,
    description: brand.description,
    id: brand.url,
    link: brand.url,
    language: brand.lang,
    copyright: `© ${brand.since} ${brand.name}`,
    updated: new Date(),
  });

  try {
    const posts = await getPublishedPosts();
    posts.forEach((post) => {
      feed.addItem({
        title: post.title,
        id: `${brand.url}/${post.slug}`,
        link: `${brand.url}/${post.slug}`,
        description: post.summary,
        date: post.date ? new Date(post.date) : new Date(),
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
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
