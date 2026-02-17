import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";
import { getAllPosts } from "@/lib/notion/getPosts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = brand.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...brand.categories.map((cat) => ({
      url: `${baseUrl}/category/${encodeURIComponent(cat.name)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  try {
    const posts = await getAllPosts();
    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
    return [...staticRoutes, ...postRoutes];
  } catch {
    return staticRoutes;
  }
}
