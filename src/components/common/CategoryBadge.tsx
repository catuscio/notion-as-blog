import { brand } from "@/config/brand";

const colorMap: Record<string, { text: string; bg: string }> = {
  blue: { text: "text-blue-800 dark:text-blue-200", bg: "bg-blue-50 dark:bg-blue-950/60" },
  orange: { text: "text-orange-800 dark:text-orange-200", bg: "bg-orange-50 dark:bg-orange-950/60" },
  purple: { text: "text-purple-800 dark:text-purple-200", bg: "bg-purple-50 dark:bg-purple-950/60" },
  teal: { text: "text-teal-800 dark:text-teal-200", bg: "bg-teal-50 dark:bg-teal-950/60" },
  green: { text: "text-green-800 dark:text-green-200", bg: "bg-green-50 dark:bg-green-950/60" },
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
