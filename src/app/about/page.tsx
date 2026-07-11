import { notFound } from "next/navigation";
import { getContentDetail } from "@/lib/notion/contentDetail";
import { NotionRenderer } from "@/components/detail/NotionRenderer";
import { brand } from "@/config/brand";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const result = await getContentDetail("about");

  if (!result || result.content.type !== "Page") {
    return { title: `About - ${brand.name}` };
  }

  const { content } = result;
  return {
    title: `${content.title} - ${brand.name}`,
    description: content.summary || `About ${brand.name}`,
    alternates: {
      canonical: `${brand.url}/about`,
    },
  };
}

export default async function AboutPage() {
  const result = await getContentDetail("about");

  if (!result || result.content.type !== "Page") notFound();

  const { content, blocks } = result;

  return (
    <div className="w-full max-w-[720px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">{content.title}</h1>
      <NotionRenderer blocks={blocks} />
    </div>
  );
}
