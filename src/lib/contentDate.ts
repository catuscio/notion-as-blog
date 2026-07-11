import type { ContentItem } from "@/types";

/** Returns the best available date for content: lastEditedTime > date > epoch(0). */
export function getContentDate(content: ContentItem): Date {
  if (content.lastEditedTime) return new Date(content.lastEditedTime);
  if (content.date) return new Date(content.date);
  return new Date(0);
}

/** Returns the latest date among the given posts, or undefined if empty. */
export function latestDateAmong(posts: ContentItem[]): Date | undefined {
  if (posts.length === 0) return undefined;
  return posts.reduce((latest, post) => {
    const d = getContentDate(post);
    return d > latest ? d : latest;
  }, new Date(0));
}
