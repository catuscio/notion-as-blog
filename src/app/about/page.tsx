import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/notion/getPost";
import { NotionRenderer } from "@/components/detail/NotionRenderer";
import { brand, revalidateSeconds } from "@/config/brand";
import type { Metadata } from "next";

export const revalidate = revalidateSeconds;

export async function generateMetadata(): Promise<Metadata> {
  let result;
  try {
    result = await getPageBySlug("about");
  } catch {
    result = null;
  }

  if (!result) {
    return { title: `About - ${brand.name}` };
  }

  const { page } = result;
  return {
    title: `${page.title} - ${brand.name}`,
    description: page.summary || `About ${brand.name}`,
  };
}

export default async function AboutPage() {
  let result;
  try {
    result = await getPageBySlug("about");
  } catch {
    result = null;
  }

  if (!result) notFound();

  const { page, blocks } = result;

  return (
    <div className="w-full max-w-[720px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">{page.title}</h1>
      <NotionRenderer blocks={blocks} />
    </div>
  );
}
