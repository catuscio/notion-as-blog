import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { FeedPageHeader } from "./FeedPageHeader";

export function CategoryHeader({ categoryName }: { categoryName: string }) {
  const cat = brand.categories.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );

  if (!cat) return null;

  return (
    <FeedPageHeader
      badge={copy.category.badge}
      title={cat.name}
      subtitle={cat.description}
    />
  );
}
