export function getCategoryFromPath(pathname: string): string | null {
  if (!pathname.startsWith("/category/")) return null;
  return decodeURIComponent(pathname.split("/category/")[1]);
}
