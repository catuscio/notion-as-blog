import Link from "next/link";
import { brand } from "@/config/brand";

export default function NotFound() {
  return (
    <div className="max-w-[1024px] mx-auto px-6 py-24 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Page not found
      </p>
      <p className="text-muted-foreground mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          Go Home
        </Link>
        {brand.categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/category/${encodeURIComponent(cat.name)}`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full text-sm hover:bg-muted transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              {cat.icon}
            </span>
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
