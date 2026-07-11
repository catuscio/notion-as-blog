export function getCategoryFromPath(pathname: string): string | null {
  if (!pathname.startsWith("/category/")) return null;
  return pathname.split("/")[2] || null;
}
