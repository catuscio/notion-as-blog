import { brand } from "@/config/brand";

const colorMap: Record<string, { text: string; bg: string }> = {
  blue: { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
  orange: { text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/30" },
  purple: { text: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30" },
  teal: { text: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/30" },
  green: { text: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/30" },
};

export function CategoryBadge({ category }: { category: string }) {
  const cat = brand.categories.find(
    (c) => c.name.toLowerCase() === category.toLowerCase()
  );
  const colors = colorMap[cat?.color ?? "blue"] ?? colorMap.blue;

  return (
    <span
      className={`${colors.text} ${colors.bg} px-2 py-0.5 rounded-md text-sm font-medium`}
    >
      {category}
    </span>
  );
}
