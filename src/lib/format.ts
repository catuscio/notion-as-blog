import { brand } from "@/config/brand";

export function slugifyHeading(text: string, fallbackId?: string): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}_-]/gu, "")
    .replace(/^-+|-+$/g, "");
  return slug || (fallbackId ? `heading-${fallbackId}` : "");
}

export function formatDate(
  dateString: string,
  variant: "short" | "long" = "long"
): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions =
    variant === "short"
      ? { month: "short", day: "numeric" }
      : { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString(brand.lang, options);
}
