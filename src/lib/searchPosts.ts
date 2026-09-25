import type { ContentItem } from "@/types";

function normalizeSearchText(value: string | null | undefined): string {
  return (value ?? "").normalize("NFKC").toLowerCase().trim();
}

function searchableFields(item: ContentItem): string[] {
  return [
    item.title,
    item.summary,
    item.category,
    item.series,
    item.author,
    item.slug,
    ...(item.tags ?? []),
  ]
    .map(normalizeSearchText)
    .filter(Boolean);
}

export function searchPosts(
  items: ContentItem[],
  query: string
): ContentItem[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return items;

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return items.filter((item) => {
    const fields = searchableFields(item);

    if (fields.some((field) => field.includes(normalizedQuery))) {
      return true;
    }

    return tokens.every((token) =>
      fields.some((field) => field.includes(token))
    );
  });
}
