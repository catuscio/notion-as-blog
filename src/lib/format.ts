import { brand } from "@/config/brand";

/** URL-safe slug from arbitrary text. Generic utility usable beyond headings. */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}_-]/gu, "")
    .replace(/^-+|-+$/g, "");
}

/** Slug for a heading block — falls back to `heading-{id}` when text yields empty slug. */
export function slugifyHeading(text: string, fallbackId?: string): string {
  return slugify(text) || (fallbackId ? `heading-${fallbackId}` : "");
}

export function formatDate(
  dateString: string,
  variant: "short" | "long" = "long",
  locale: string = brand.lang,
): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions =
    variant === "short"
      ? { month: "short", day: "numeric" }
      : { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString(locale, options);
}
