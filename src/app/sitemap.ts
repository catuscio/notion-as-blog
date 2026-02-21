import type { MetadataRoute } from "next";
import type { Post } from "@/types";
import { brand, getCategorySlug } from "@/config/brand";
import { getPublicPosts, getPublishedPages } from "@/lib/notion/getPosts";
import { getAllTags } from "@/lib/notion/getAllSelectItems";
import { getAllAuthors } from "@/lib/notion/getAuthors";
import { getPostDate, latestDateAmong } from "@/lib/postDate";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = brand.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  try {
    const posts = await getPublicPosts();

    // Set homepage lastModified to latest post date
    const latestPostDate = latestDateAmong(posts);
    if (latestPostDate && latestPostDate.getTime() > 0) {
      staticRoutes[0].lastModified = latestPostDate;
    }

    // Page routes (about, etc.) from Notion — no hardcoded paths
    const pages = await getPublishedPages().catch(() => []);
    const pageRoutes: MetadataRoute.Sitemap = pages.map((p) => ({
      url: `${baseUrl}/${p.slug}`,
      lastModified: getPostDate(p),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    // Category routes with dynamic lastModified
    const categoryRoutes: MetadataRoute.Sitemap = brand.categories.map((cat) => {
      const catPosts = posts.filter(
        (p) => p.category && getCategorySlug(p.category) === cat.slug,
      );
      const lastMod = latestDateAmong(catPosts);
      return {
        url: `${baseUrl}/category/${cat.slug}`,
        ...(lastMod && { lastModified: lastMod }),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
    });

    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/${post.slug}`,
      lastModified: getPostDate(post),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    // Tag routes with dynamic lastModified
    const tags = getAllTags(posts);
    const tagRoutes: MetadataRoute.Sitemap = tags.flatMap((tag) => {
      const tagPosts = posts.filter((p) => p.tags.includes(tag.name));
      if (tagPosts.length <= 2) return [];
      const lastMod = latestDateAmong(tagPosts);
      return [{
        url: `${baseUrl}/tag/${encodeURIComponent(tag.name)}`,
        ...(lastMod && { lastModified: lastMod }),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }];
    });

    // Author routes with dynamic lastModified
    const authors = await getAllAuthors();
    const authorRoutes: MetadataRoute.Sitemap = authors.map((a) => {
      const authorPosts = posts.filter((p) => p.author === a.name);
      const lastMod = latestDateAmong(authorPosts);
      return {
        url: `${baseUrl}/author/${encodeURIComponent(a.name)}`,
        ...(lastMod && { lastModified: lastMod }),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      };
    });

    // Series routes with dynamic lastModified
    const seriesMap = new Map<string, Post[]>();
    for (const post of posts) {
      if (post.series) {
        const arr = seriesMap.get(post.series) ?? [];
        arr.push(post);
        seriesMap.set(post.series, arr);
      }
    }
    const seriesRoutes: MetadataRoute.Sitemap = Array.from(seriesMap.entries())
      .filter(([, seriesPosts]) => seriesPosts.length >= 2)
      .map(([name, seriesPosts]) => {
        const lastMod = latestDateAmong(seriesPosts);
        return {
          url: `${baseUrl}/series/${encodeURIComponent(name)}`,
          ...(lastMod && { lastModified: lastMod }),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        };
      });

    return [...staticRoutes, ...pageRoutes, ...categoryRoutes, ...postRoutes, ...seriesRoutes, ...tagRoutes, ...authorRoutes];
  } catch {
    return staticRoutes;
  }
}
