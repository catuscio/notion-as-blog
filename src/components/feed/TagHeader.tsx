import { copy } from "@/config/copy";
import { FeedPageHeader } from "./FeedPageHeader";

export function TagHeader({ tagName }: { tagName: string }) {
  return (
    <FeedPageHeader
      badge={copy.tag.badge}
      title={`#${tagName}`}
      subtitle={copy.tag.subtitle(tagName)}
    />
  );
}
