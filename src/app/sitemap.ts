import type { MetadataRoute } from "next";
import type { ContentItem } from "@/types";
import { brand, getCategorySlug } from "@/config/brand";
import { getContentCatalog } from "@/lib/notion/contentCatalog";
import { getVisibleTagCounts } from "@/lib/notion/getTagCounts";
import { getOptionalAllAuthors } from "@/lib/notion/getAuthors";
import { filterPostsByAuthor } from "@/lib/notion/contentQueries";
import { getContentDate, latestDateAmong } from "@/lib/contentDate";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = brand.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  const { listedPosts: posts, listedPages: pages } = await getContentCatalog();

  // Set homepage lastModified to latest post date
  const latestPostDate = latestDateAmong(posts);
  if (latestPostDate && latestPostDate.getTime() > 0) {
    staticRoutes[0].lastModified = latestPostDate;
  }

  // Page routes (about, etc.) from Notion — no hardcoded paths
  const pageRoutes: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${baseUrl}/${p.slug}`,
    lastModified: getContentDate(p),
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
    lastModified: getContentDate(post),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Tag routes with dynamic lastModified
  const tags = getVisibleTagCounts(posts);
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

  // Author routes with dynamic lastModified (exclude authors with ≤2 posts)
  const authors = await getOptionalAllAuthors();
  const authorRoutes: MetadataRoute.Sitemap = authors.flatMap((a) => {
    const authorPosts = filterPostsByAuthor(posts, a.peopleIds);
    if (authorPosts.length <= 2) return [];
    const lastMod = latestDateAmong(authorPosts);
    return [{
      url: `${baseUrl}/author/${encodeURIComponent(a.name)}`,
      ...(lastMod && { lastModified: lastMod }),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }];
  });

  // Series routes with dynamic lastModified
  const seriesMap = new Map<string, ContentItem[]>();
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
}
