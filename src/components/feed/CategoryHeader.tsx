import { brand } from "@/config/brand";

export function CategoryHeader({ categoryName }: { categoryName: string }) {
  const cat = brand.categories.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );

  if (!cat) return null;

  return (
    <section className="mb-12">
      <div>
        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          Category
        </span>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          {cat.name}
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
          {cat.description}
        </p>
      </div>
    </section>
  );
}
