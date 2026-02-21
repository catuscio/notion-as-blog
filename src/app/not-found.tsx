import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";

export const metadata: Metadata = {
  title: copy.notFound.title,
  description: copy.notFound.description,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="max-w-[1024px] mx-auto px-6 py-24 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        {copy.notFound.heading}
      </p>
      <nav className="flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-colors hover:bg-primary/90"
        >
          {copy.notFound.cta}
        </Link>
        {brand.categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="px-6 py-3 rounded-lg border border-border text-foreground font-medium transition-colors hover:bg-muted"
          >
            {cat.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
