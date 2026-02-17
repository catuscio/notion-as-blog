import { brand } from "@/config/brand";

const gradientMap: Record<string, string> = {
  blue: "from-blue-100 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
  orange: "from-orange-100 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20",
  purple: "from-purple-100 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
  teal: "from-teal-100 to-green-50 dark:from-teal-900/20 dark:to-green-900/20",
  green: "from-green-100 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
};

export function CategoryHeader({ categoryName }: { categoryName: string }) {
  const cat = brand.categories.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );

  if (!cat) return null;

  const gradient = gradientMap[cat.color] ?? gradientMap.blue;

  return (
    <section className="mb-12">
      <div className="flex items-start justify-between">
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
        <div
          className={`hidden sm:flex h-24 w-24 bg-gradient-to-br ${gradient} rounded-2xl items-center justify-center rotate-3 hover:rotate-6 transition-transform duration-500`}
        >
          <span className="material-symbols-outlined text-5xl text-primary opacity-80">
            {cat.icon}
          </span>
        </div>
      </div>
    </section>
  );
}
