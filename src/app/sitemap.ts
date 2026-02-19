import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";
import { getPublishedPosts } from "@/lib/notion/getPosts";
import { getAllTags } from "@/lib/notion/getAllSelectItems";
import { getAllAuthors } from "@/lib/notion/getAuthors";

function latestDateAmong(dates: (string | undefined)[]): Date {
  const valid = dates.filter(Boolean).map((d) => new Date(d!).getTime());
  return valid.length > 0 ? new Date(Math.max(...valid)) : new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = brand.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...brand.categories.map((cat) => ({
      url: `${baseUrl}/category/${encodeURIComponent(cat.name)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  try {
    const posts = await getPublishedPosts();

    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    // Tag routes (only tags with more than 2 posts)
    const tags = getAllTags(posts);
    const tagRoutes: MetadataRoute.Sitemap = tags
      .filter((t) => t.count > 2)
      .map((tag) => {
        const tagPosts = posts.filter((p) => p.tags.includes(tag.name));
        return {
          url: `${baseUrl}/tag/${encodeURIComponent(tag.name)}`,
          lastModified: latestDateAmong(tagPosts.map((p) => p.date)),
          changeFrequency: "weekly" as const,
          priority: 0.6,
        };
      });

    // Author routes
    let authorRoutes: MetadataRoute.Sitemap = [];
    try {
      const authors = await getAllAuthors();
      authorRoutes = authors.map((author) => {
        const authorPosts = posts.filter((p) => p.author === author.name);
        return {
          url: `${baseUrl}/author/${encodeURIComponent(author.name)}`,
          lastModified: latestDateAmong(authorPosts.map((p) => p.date)),
          changeFrequency: "weekly" as const,
          priority: 0.6,
        };
      });
    } catch {
      // Authors DB unavailable
    }

    return [...staticRoutes, ...postRoutes, ...tagRoutes, ...authorRoutes];
  } catch {
    return staticRoutes;
  }
}
